import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: any = null;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      const Stripe = require('stripe');
      this.stripe = new Stripe(secretKey, { apiVersion: '2026-05-27.dahlia' });
    }
  }

  private getClient(): any {
    if (!this.stripe) {
      throw new Error(
        'Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env file.',
      );
    }
    return this.stripe;
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ) {
    const client = this.getClient();
    return client.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    });
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    const client = this.getClient();
    return client.paymentIntents.retrieve(paymentIntentId);
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ) {
    const client = this.getClient();
    const params: Record<string, unknown> = {
      payment_intent: paymentIntentId,
    };
    if (amount) params.amount = Math.round(amount * 100);
    if (reason) params.reason = reason;
    return client.refunds.create(params);
  }

  constructWebhookEvent(payload: Buffer, signature: string) {
    const client = this.getClient();
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new Error(
        'Stripe webhook secret is not configured. Please set STRIPE_WEBHOOK_SECRET in your .env file.',
      );
    }
    return client.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
