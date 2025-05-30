import type { NextApiRequest, NextApiResponse } from 'next';

import { YooCheckout, ICapturePayment } from '@a2seven/yoo-checkout';

import { capturePayment, createPayment } from '@/utils/payments';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Kassa event received:', req.method, req.body);

  const event = req.body.event;
  const eventData = req.body.object;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await processEvent(event, eventData);
  } catch (error) {
    console.error('Error processing event:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.status(200).json({ status: 'ok' });
}

async function processEvent(event: string, data: any) {
  switch (event) {
    case 'payment.succeeded':
      console.log('Payment succeeded:', data);
      console.log('hooray! Payment succeeded!');
      break;
    case 'payment.canceled':
      console.log('Payment canceled:', data);
      // Handle canceled payment
      break;
    case 'payment.waiting_for_capture':
      console.log('Payment waiting for capture:', data);
      await capturePayment(data.id);
      break;
    default:
      console.warn('Unhandled event type:', event);
  }
}
