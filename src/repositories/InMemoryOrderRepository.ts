import { injectable } from 'inversify';
import { Order, OrderLine } from '../domain/Order';
import { IOrderRepository } from './IOrderRepository';

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];
  private nextId = 1;

  async findById(id: number): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async create(
    customer: string,
    items: OrderLine[],
    total: number
  ): Promise<Order> {
    const order: Order = {
      id: this.nextId++,
      customer,
      items: items.map((item) => ({ ...item })),
      total,
      status: 'confirmed'
    };

    this.orders.push(order);

    return order;
  }
}