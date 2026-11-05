import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from './types';

import { IProductRepository } from '../repositories/IProductRepository';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IMailProvider } from '../providers/IMailProvider';
import { IPaymentMethod } from '../payments/IPaymentMethod';

import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';

import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';

import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';

import { NotificationService } from '../services/NotificationService';
import { OrderService } from '../services/OrderService';
import { OrderController } from '../controllers/OrderController';

export const container = new Container();

const appEnv = process.env.APP_ENV ?? 'dev';

if (appEnv !== 'dev' && appEnv !== 'test') {
  throw new Error('APP_ENV deve ser dev ou test');
}

container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toDynamicValue(() => new PrismaClient())
  .inSingletonScope();

container
  .bind<IProductRepository>(TYPES.ProductRepository)
  .to(PrismaProductRepository)
  .inSingletonScope();

if (appEnv === 'test') {
  container
    .bind<IOrderRepository>(TYPES.OrderRepository)
    .to(InMemoryOrderRepository)
    .inSingletonScope();

  container
    .bind<IMailProvider>(TYPES.MailProvider)
    .to(ConsoleMailProvider)
    .inSingletonScope();
} else {
  container
    .bind<IOrderRepository>(TYPES.OrderRepository)
    .to(PrismaOrderRepository)
    .inSingletonScope();

  container
    .bind<IMailProvider>(TYPES.MailProvider)
    .to(EtherealMailProvider)
    .inSingletonScope();
}

container
  .bind<IPaymentMethod>(TYPES.PaymentMethod)
  .to(CreditCardPayment);

container
  .bind<IPaymentMethod>(TYPES.PaymentMethod)
  .to(DebitCardPayment);

container
  .bind<IPaymentMethod>(TYPES.PaymentMethod)
  .to(PixPayment);

container
  .bind<PaymentMethodRegistry>(TYPES.PaymentMethodRegistry)
  .to(PaymentMethodRegistry);

container
  .bind<NotificationService>(TYPES.NotificationService)
  .to(NotificationService);

container
  .bind<OrderService>(TYPES.OrderService)
  .to(OrderService);

container
  .bind<OrderController>(TYPES.OrderController)
  .to(OrderController);