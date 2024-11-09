// pages/api/staff/[id].js
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/utils/checkAdmin';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const admin = await checkAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { username, password, role } = req.body;
    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: { username, password, role },
    });
    return res.status(200).json(updatedStaff);
  }

  if (req.method === 'DELETE') {
    await prisma.staff.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
