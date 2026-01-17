# Angular Stripe Integration Demo

This is a simple Angular application demonstrating Stripe payment integration using Stripe Elements.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Angular CLI (v13 or higher)
- A Stripe account ([Sign up for free](https://dashboard.stripe.com/register))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Stripe API Keys:**
   
   Open `src/environments/environment.ts` and replace `YOUR_PUBLISHABLE_KEY_HERE` with your Stripe publishable key:
   ```typescript
   stripePublishableKey: 'pk_test_your_actual_publishable_key_here'
   ```
   
   You can find your test keys in the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).

3. **Run the development server:**
   ```bash
   ng serve
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4200/checkout`

## 📋 Stripe Integration Steps

### Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test mode** (toggle in the top right)
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Keep your **Secret key** (starts with `sk_test_`) safe - you'll need it for your backend

### Step 2: Configure Environment Variables

Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  stripePublishableKey: 'pk_test_your_actual_key_here'
};
```

For production, update `src/environments/environment.prod.ts` with your live key (`pk_live_...`).

### Step 3: Set Up Backend (Required for Production)

⚠️ **Important:** This demo frontend only creates payment methods. To complete payments, you need a backend server.

#### Backend Requirements:

1. **Create Payment Intent Endpoint**
   
   Your backend should expose an endpoint like:
   ```
   POST /api/create-payment-intent
   Body: { amount: 2000, paymentMethodId: "pm_..." }
   ```

2. **Backend Implementation Example (Node.js/Express):**
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   app.post('/api/create-payment-intent', async (req, res) => {
     const { amount, paymentMethodId } = req.body;
     
     try {
       const paymentIntent = await stripe.paymentIntents.create({
         amount: amount,
         currency: 'usd',
         payment_method: paymentMethodId,
         confirm: true,
         return_url: 'https://your-website.com/checkout/return'
       });
       
       res.json({ success: true, paymentIntent });
     } catch (error) {
       res.status(400).json({ success: false, error: error.message });
     }
   });
   ```

3. **Update Frontend**
   
   In `src/app/checkout/checkout.component.ts`, replace the `createPaymentIntent` method:
   ```typescript
   private async createPaymentIntent(paymentMethodId: string): Promise<any> {
     const response = await this.http.post('/api/create-payment-intent', {
       amount: this.amount,
       paymentMethodId: paymentMethodId
     }).toPromise();
     return response;
   }
   ```

### Step 4: Test the Integration

1. **Use Stripe Test Cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0027 6000 3184`
   
   Use any future expiry date, any 3-digit CVC, and any postal code.

2. **Test the Payment Flow:**
   - Fill in the card details
   - Click "Pay"
   - Check the browser console for any errors
   - Verify in Stripe Dashboard → **Payments** that the payment was created

## 📁 Project Structure

```
src/
├── app/
│   ├── checkout/              # Checkout component
│   │   ├── checkout.component.ts
│   │   ├── checkout.component.html
│   │   └── checkout.component.css
│   ├── services/
│   │   └── stripe.service.ts  # Stripe service for payment handling
│   ├── app.component.*
│   └── app.module.ts
├── environments/
│   ├── environment.ts         # Development environment config
│   └── environment.prod.ts    # Production environment config
```

## 🔑 Key Components

### StripeService (`src/app/services/stripe.service.ts`)
- Initializes Stripe.js
- Creates Stripe Elements (card input)
- Handles payment method creation
- Manages payment confirmation

### CheckoutComponent (`src/app/checkout/`)
- Renders the payment form
- Integrates Stripe Elements
- Handles form submission
- Manages payment flow

## 🧪 Testing

### Test Cards

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Visa (Success) |
| 4000 0000 0000 0002 | Card declined |
| 4000 0027 6000 3184 | 3D Secure authentication |
| 4000 0025 0000 3155 | Requires authentication |

Use any future expiry date (e.g., 12/25), any 3-digit CVC, and any postal code.

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
   - Use environment variables
   - Add `.env` files to `.gitignore`

2. **Use HTTPS in production**
   - Stripe requires HTTPS for live payments

3. **Validate on the backend**
   - Always validate payment amounts on your server
   - Never trust client-side data for critical operations

4. **Store secret keys securely**
   - Use environment variables or secret management services
   - Never expose secret keys in frontend code

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js/elements)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Angular HTTP Client](https://angular.io/guide/http)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## 🐛 Troubleshooting

### Issue: "Stripe failed to initialize"
- Check that your publishable key is correct
- Ensure the key starts with `pk_test_` or `pk_live_`
- Verify there are no extra spaces in the key

### Issue: "Payment method creation failed"
- Check browser console for detailed error messages
- Verify card details are valid
- Ensure Stripe Elements is properly mounted

### Issue: CORS errors when calling backend
- Configure CORS on your backend server
- Ensure your backend endpoint is accessible
- Check that the API URL is correct

## 📝 Next Steps

1. ✅ Set up your Stripe account and get API keys
2. ✅ Configure environment variables
3. ⚠️ Set up backend server (required for production)
4. ⚠️ Update `createPaymentIntent` method to call your backend
5. ✅ Test with Stripe test cards
6. ✅ Customize the UI to match your brand
7. ✅ Add error handling and loading states
8. ✅ Set up webhook handlers for payment events

## 🤝 Support

For Stripe-related questions:
- [Stripe Support](https://support.stripe.com/)
- [Stripe Discord](https://stripe.com/go/developer-chat)

For Angular-related questions:
- [Angular Documentation](https://angular.io/docs)
- [Angular Community](https://angular.io/community)

---

**Note:** This is a demonstration project. Always follow security best practices and comply with PCI DSS requirements when handling payment information in production.
