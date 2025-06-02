import type { NextApiRequest, NextApiResponse } from 'next';

import { getPrice } from '@/utils/payments';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const price = getPrice();

    return res.send({
      price,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
