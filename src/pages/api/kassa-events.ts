import type { NextApiRequest, NextApiResponse } from 'next';

import { createPayment } from '@/utils/payments';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Kassa event received:', req.method, req.body);

  const data = req.body;
  console.log('Kassa data received:', data);
  res.status(200).json({ status: 'ok' });
}
