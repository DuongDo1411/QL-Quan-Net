// pages/api/revenue/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { timeframe } = req.query;

  let revenueData;
  if (timeframe === 'daily') {
    revenueData = await prisma.$queryRaw`SELECT DATE(startTime) as date, SUM(cost) as revenue FROM Transaction WHERE endTime IS NOT NULL GROUP BY DATE(startTime) ORDER BY DATE(startTime) DESC LIMIT 30`;
  } else if (timeframe === 'monthly') {
    revenueData = await prisma.$queryRaw`SELECT DATE_FORMAT(startTime, "%Y-%m") as month, SUM(cost) as revenue FROM Transaction WHERE endTime IS NOT NULL GROUP BY month ORDER BY month DESC LIMIT 12`;
  } else if (timeframe === 'yearly') {
    revenueData = await prisma.$queryRaw`SELECT YEAR(startTime) as year, SUM(cost) as revenue FROM Transaction WHERE endTime IS NOT NULL GROUP BY year ORDER BY year DESC`;
  }

  return res.status(200).json(revenueData);
}
