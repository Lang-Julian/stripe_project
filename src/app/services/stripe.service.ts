import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Promise<Stripe | null>;
  private elements: StripeElements | null = null;

  constructor() {
    this.stripe = loadStripe(environment.stripePublishableKey);
  }

  async getStripe(): Promise<Stripe | null> {
    return this.stripe;
  }

  async createCardElement(): Promise<StripeCardElement | null> {
    const stripe = await this.getStripe();
    if (!stripe) {
      return null;
    }

    this.elements = stripe.elements();
    const cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    return cardElement;
  }

  async createPaymentMethod(cardElement: StripeCardElement): Promise<any> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      throw error;
    }

    return paymentMethod;
  }

  async confirmPayment(clientSecret: string, paymentMethodId: string): Promise<any> {
    const stripe = await this.getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      throw error;
    }
  }
}
