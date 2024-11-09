// pages/api/computers/index.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const computers = await prisma.computer.findMany();
    return res.status(200).json(computers);
  }

  if (req.method === "POST") {
    const { name, type, status, pricing } = req.body;
    const computer = await prisma.computer.create({
      data: { name, type, status, pricing },
    });
    return res.status(201).json(computer);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
