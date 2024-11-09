// pages/api/customers/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const customers = await prisma.customer.findMany();
    return res.status(200).json(customers);
  }

  if (req.method === 'POST') {
    const { username, password, balance } = req.body;
    const customer = await prisma.customer.create({
      data: { username, password, balance },
    });
    return res.status(201).json(customer);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
