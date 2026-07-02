export class CreateOrderItemDto {
  productId!: string;
  productName!: string;
  price!: number;       
  quantity!: number;
}

export class CreateOrderDto {
  items!: CreateOrderItemDto[];
  total!: number;       
}