import { checkPaymentStatus } from '@/utils/payments';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get the payment ID from the query parameters
  const paymentId = req.query.id as string;

  if (!paymentId) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const paymentData = await checkPaymentStatus(paymentId);
    // Call the utility function to check the payment status

    if (!paymentData) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Return the payment status
    return res.status(200).json(paymentData);
  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
