import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID || '',
  secretKey: process.env.YOOKASSA_SECRET_KEY || '',
});

function generateIdempotenceKey(): string {
  return (
    'idempotence-key-' +
    new Date().getTime() +
    '-' +
    Math.random().toString(36).substring(2, 15)
  );
}

const createPayload: ICreatePayment = {
  amount: {
    value: process.env.NEXT_PUBLIC_PRICE || '0.00',
    currency: 'RUB',
  },
  payment_method_data: {
    type: 'bank_card',
  },
  confirmation: {
    type: 'redirect',
    return_url: process.env.HOST + '/success',
  },
};

export async function createPayment(
  payload: ICreatePayment = createPayload
): Promise<any> {
  try {
    if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
      throw new Error('YOOKASSA_SHOP_ID and YOOKASSA_SECRET_KEY are not set');
    }

    if (!process.env.NEXT_PUBLIC_PRICE) {
      throw new Error('NEXT_PUBLIC_PRICE is not set in environment variables');
    }

    if (!process.env.HOST) {
      throw new Error('HOST is not set in environment variables');
    }

    const idempotenceKey = generateIdempotenceKey();
    console.log('Idempotence Key:', idempotenceKey);

    const payment = await checkout.createPayment(payload, idempotenceKey);
    console.log('Payment created:', payment);

    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}
