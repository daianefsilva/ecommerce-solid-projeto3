import { Order, OrderLine } from '../domain/Order';

export interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  create(customer: string, items: OrderLine[], total: number): Promise<Order>;
}
