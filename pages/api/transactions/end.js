// pages/api/transactions/end.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { transactionId, customerId, ratePerHour } = req.body;
    const endTime = new Date();

    try {
      const transaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { endTime },
      });

      const durationInHours = (endTime - new Date(transaction.startTime)) / (1000 * 60 * 60);
      const totalCost = durationInHours * ratePerHour;

      await prisma.transaction.update({
        where: { id: transactionId },
        data: { cost: totalCost },
      });

      await prisma.customer.update({
        where: { id: customerId },
        data: { balance: { decrement: totalCost } },
      });

      return res.status(200).json({ transaction: { ...transaction, cost: totalCost }, totalCost });
    } catch (error) {
      console.error("Error ending transaction:", error);
      return res.status(500).json({ message: 'An error occurred while ending the transaction.' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
