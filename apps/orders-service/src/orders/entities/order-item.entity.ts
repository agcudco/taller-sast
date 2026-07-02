import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string; // id del producto del product-service

  @Column()
  productName!: string; // nombre al momento del pedido (opcional)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number; // precio unitario (vulnerable a manipulación)

  @Column()
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}