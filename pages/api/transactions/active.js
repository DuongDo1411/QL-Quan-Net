// pages/api/transactions/active.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { computerId } = req.query;

    try {
      const activeTransaction = await prisma.transaction.findFirst({
        where: {
          computerId: parseInt(computerId),
          endTime: null,
        },
      });

      if (activeTransaction) {
        return res.status(200).json({ active: true, transaction: activeTransaction });
      } else {
        return res.status(200).json({ active: false });
      }
    } catch (error) {
      console.error("Error fetching active transaction:", error);
      return res.status(500).json({ message: 'Error fetching active transaction' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
