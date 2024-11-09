// pages/api/staff/index.js
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/utils/checkAdmin';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const admin = await checkAdmin(req, res);
  if (!admin) return;

  if (req.method === 'GET') {
    const staff = await prisma.staff.findMany();
    return res.status(200).json(staff);
  }

  if (req.method === 'POST') {
    const { username, password, role } = req.body;
    const newStaff = await prisma.staff.create({
      data: { username, password, role },
    });
    return res.status(201).json(newStaff);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
