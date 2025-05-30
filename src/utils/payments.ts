import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';

if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
  throw new Error('YOOKASSA_SHOP_ID and YOOKASSA_SECRET_KEY are not set');
}

if (!process.env.NEXT_PUBLIC_PRICE) {
  throw new Error('NEXT_PUBLIC_PRICE is not set in environment variables');
}

if (!process.env.HOST) {
  throw new Error('HOST is not set in environment variables');
}

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
    return_url: process.env.HOST + '/?from=kassa',
  },
  description: 'Создание памятки',
  capture: true,
};

const capturePayload: ICreatePayment = {
  amount: {
    value: process.env.NEXT_PUBLIC_PRICE || '0.00',
    currency: 'RUB',
  },
};

export async function createPayment(
  payload: ICreatePayment = createPayload
): Promise<any> {
  try {
    const idempotenceKey = generateIdempotenceKey();

    const payment = await checkout.createPayment(payload, idempotenceKey);

    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

export async function capturePayment(paymentId: string): Promise<any> {
  try {
    const idempotenceKey = generateIdempotenceKey();

    const payment = await checkout.capturePayment(
      paymentId,
      capturePayload,
      idempotenceKey
    );

    if (!payment) {
      throw new Error('Payment not found or already captured');
    }

    return payment;
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw error;
  }
}

export async function checkPaymentStatus(paymentId: string): Promise<any> {
  try {
    const payments = await checkout.getPaymentList();

    console.log('payments:', payments);

    if (!payments || !payments.items || !Array.isArray(payments.items)) {
      throw new Error('Failed to retrieve payments list');
    }

    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    const payment = payments.items.find(
      (p: { id: string }) => p.id === paymentId
    );

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'succeeded') {
      throw new Error(`Payment status is not succeeded: ${payment.status}`);
    }
    console.log('Payment found:', payment);
    // Return the payment details if found

    return payment;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
}
