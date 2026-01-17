import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StripeService } from '../services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

interface ProductDetails {
  id: string;
  name: string;
  description: string | null;
  default_price: string | any;
  images: string[];
  metadata: any;
}

interface PriceDetails {
  id: string;
  unit_amount: number;
  currency: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElementRef!: ElementRef;
  cardElement: StripeCardElement | null = null;
  
  loading = false;
  loadingProduct = true;
  errorMessage = '';
  successMessage = '';
  amount = 0; // Will be set from product price
  productId = environment.stripeProductId;
  productDetails: ProductDetails | null = null;
  priceDetails: PriceDetails | null = null;

  constructor(
    private stripeService: StripeService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    // Fetch product details first
    await this.fetchProductDetails();
    
    // Then initialize Stripe Elements
    try {
      this.cardElement = await this.stripeService.createCardElement();
      if (this.cardElement) {
        this.cardElement.mount(this.cardElementRef.nativeElement);
        this.cardElement.on('change', (event) => {
          if (event.error) {
            this.errorMessage = event.error.message;
          } else {
            this.errorMessage = '';
          }
        });
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to initialize Stripe. Please check your API keys.';
      console.error('Stripe initialization error:', error);
    }
  }

  async fetchProductDetails() {
    this.loadingProduct = true;
    try {
      // This should call your backend API to fetch product details
      // Since Stripe product retrieval requires secret key, it must be done on the backend
      const product = await this.getProductFromBackend(this.productId);
      
      if (product) {
        this.productDetails = product;
        
        // Get price details
        if (product.default_price) {
          const priceId = typeof product.default_price === 'string' 
            ? product.default_price 
            : product.default_price.id;
          
          const price = await this.getPriceFromBackend(priceId);
          if (price) {
            this.priceDetails = price;
            this.amount = price.unit_amount;
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      this.errorMessage = 'Failed to load product details. Please check your backend configuration.';
      // Fallback: Allow manual amount entry if product fetch fails
      if (this.amount === 0) {
        this.amount = 2000; // Default to $20.00
      }
    } finally {
      this.loadingProduct = false;
    }
  }

  // Call your backend API to get product details
  private async getProductFromBackend(productId: string): Promise<ProductDetails | null> {
    try {
      // TODO: Replace with your actual backend endpoint
      // Example: return this.http.get(`/api/products/${productId}`).toPromise();
      
      // For demo: This should be implemented on your backend
      console.warn('⚠️ Backend integration required! Implement getProductFromBackend endpoint.');
      console.log('Product ID:', productId);
      
      // Mock response structure - replace with actual API call
      return null;
    } catch (error) {
      console.error('Backend API error:', error);
      return null;
    }
  }

  // Call your backend API to get price details
  private async getPriceFromBackend(priceId: string): Promise<PriceDetails | null> {
    try {
      // TODO: Replace with your actual backend endpoint
      // Example: return this.http.get(`/api/prices/${priceId}`).toPromise();
      
      // For demo: This should be implemented on your backend
      console.warn('⚠️ Backend integration required! Implement getPriceFromBackend endpoint.');
      console.log('Price ID:', priceId);
      
      // Mock response structure - replace with actual API call
      return null;
    } catch (error) {
      console.error('Backend API error:', error);
      return null;
    }
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.unmount();
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.cardElement) {
      this.errorMessage = 'Card element is not initialized';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Step 1: Create payment method
      const paymentMethod = await this.stripeService.createPaymentMethod(this.cardElement);
      
      // Step 2: Send payment method to your backend to create payment intent
      // For demo purposes, we'll simulate this. In production, call your backend API
      const response = await this.createPaymentIntent(paymentMethod.id);
      
      if (response.success) {
        this.successMessage = 'Payment successful!';
        // Reset form
        this.cardElement.clear();
      } else {
        this.errorMessage = response.error || 'Payment failed';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred processing your payment';
      console.error('Payment error:', error);
    } finally {
      this.loading = false;
    }
  }

  // This should be replaced with a call to your backend API
  private async createPaymentIntent(paymentMethodId: string): Promise<any> {
    // TODO: Replace this with a real API call to your backend
    // Example:
    // return this.http.post('/api/create-payment-intent', {
    //   amount: this.amount,
    //   paymentMethodId: paymentMethodId,
    //   productId: this.productId
    // }).toPromise();
    
    // For demo purposes, return a mock response
    console.warn('⚠️ Backend integration required! Replace createPaymentIntent with your API call.');
    console.log('Payment details:', {
      amount: this.amount,
      productId: this.productId,
      paymentMethodId: paymentMethodId
    });
    
    return {
      success: false,
      error: 'Backend integration required. See checkout.component.ts for details.'
    };
  }
}