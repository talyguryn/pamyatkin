import type { NextApiRequest, NextApiResponse } from 'next';

import { createPayment } from '@/utils/payments';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email = req.query.email as string;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const payment = await createPayment({
      email
    });

    return res.send(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
