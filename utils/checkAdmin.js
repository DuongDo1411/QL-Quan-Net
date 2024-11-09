// utils/checkAdmin.js
import { parse } from 'cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkAdmin(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const session = cookies.session ? JSON.parse(cookies.session) : null;

  if (!session || !session.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }

  const user = await prisma.staff.findUnique({
    where: { id: session.userId },
  });

  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
    return null;
  }

  return user;
}
