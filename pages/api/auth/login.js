// pages/api/auth/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = await prisma.customer.findUnique({ where: { username } }) ||
                 await prisma.staff.findUnique({ where: { username } });

    if (user && bcrypt.compareSync(password, user.password)) {
      const sessionToken = JSON.stringify({ userId: user.id, role: user.role || "customer" });
      const cookie = serialize('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);
      return res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role || "customer" } });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
