// pages/api/pricing/[type].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { type } = req.query;

  if (req.method === 'GET') {
    const pricing = await prisma.pricing.findUnique({ where: { type } });
    return res.status(200).json(pricing);
  }

  if (req.method === 'PATCH') {
    const { ratePerHour } = req.body;
    const updatedPricing = await prisma.pricing.update({
      where: { type },
      data: { ratePerHour },
    });
    return res.status(200).json(updatedPricing);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
