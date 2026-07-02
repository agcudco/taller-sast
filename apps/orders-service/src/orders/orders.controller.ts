import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
// Bug: no importa RolesGuard, cualquier autenticado puede acceder
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../common/user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@User() user, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyOrders(@User() user) {
    return this.ordersService.findByUser(user.id);
  }

  @Get()
  async findAll(@Req() req) {
    const status = req.query.status;
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @User() user) {
    return this.ordersService.cancel(id, user.id);
  }
}