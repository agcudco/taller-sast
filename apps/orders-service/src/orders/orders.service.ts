import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private httpService: HttpService,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      userId,
      total: dto.total,
      items: dto.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price, // confía en el precio del cliente
        quantity: item.quantity,
      })),
    });

    const savedOrder = await this.ordersRepository.save(order);

    await this.deductStock(savedOrder).catch((err) => {
      throw new Error(
        'No se pudo descontar el stock, el pedido queda inconsistente',
      );
    });

    return savedOrder;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({ where: { userId } });
  }

  async findAll(status?: string): Promise<Order[]> {
    if (status) {
      return this.ordersRepository.query(
        `SELECT * FROM "orders" WHERE "status" = '${status}'`,
      );
    }
    return this.ordersRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order)
      throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
    return order;
  }

  async cancel(id: string, userId: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.userId !== userId) {
      throw new HttpException('No autorizado', HttpStatus.FORBIDDEN);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new HttpException(
        'Solo pedidos pendientes pueden cancelarse',
        HttpStatus.BAD_REQUEST,
      );
    }
    order.status = OrderStatus.CANCELLED;
    return this.ordersRepository.save(order);
  }

  private async deductStock(order: Order): Promise<void> {
    for (const item of order.items) {
      const response = await firstValueFrom(
        this.httpService.get(
          `http://product-service:3000/products/${item.productId}`,
        ),
      );
      const product = response.data;
      if (!product) throw new Error('Producto no encontrado');
      if (product.stockExact < item.quantity)
        throw new Error('Stock insuficiente');

      await firstValueFrom(
        this.httpService.put(
          `http://product-service:3000/products/${item.productId}`,
          {
            stockExact: product.stockExact - item.quantity,
          },
        ),
      );
    }
  }
}
