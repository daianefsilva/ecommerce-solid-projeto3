import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Request, Response } from 'express';
import logger from '../lib/logger';
import { NotFoundError, PaymentError, ValidationError } from '../domain/errors';
import { OrderService } from '../services/OrderService';

@injectable()
export class OrderController {
  constructor(
    @inject(TYPES.OrderService)
    private orderService: OrderService
  ) {}

  findById = async (req: Request, res: Response) => {
    try {
      const id = /^\d+$/.test(req.params.id) ? Number(req.params.id) : NaN;
      const order = await this.orderService.findById(id);
      return res.status(200).json(order);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      logger.error('Erro ao consultar pedido', { error });
      return res.status(500).json({ error: 'Erro interno' });
    }
  };

  processOrder = async (req: Request, res: Response) => {
    try {
      const {
        customer,
        items,
        paymentMethod,
        paymentDetails
      } = req.body;

      const result = await this.orderService.placeOrder(
        customer,
        items,
        paymentMethod,
        paymentDetails
      );

      return res.json({
        message: 'Pedido processado com sucesso',
        ...result
      });
    } catch (error: any) {
      if (
        error instanceof ValidationError ||
        error instanceof PaymentError
      ) {
        return res.status(400).json({
          error: error.message
        });
      }

      logger.error(`Erro ao processar pedido: ${error.message}`);

      return res.status(500).json({
        error: 'Erro interno'
      });
    }
  };
}