// pages/api/computers/[id].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    const { status, type, name, pricing } = req.body;
    const updatedComputer = await prisma.computer.update({
      where: { id: parseInt(id) },
      data: { status, type, name, pricing },
    });
    return res.status(200).json(updatedComputer);
  }

  if (req.method === "DELETE") {
    await prisma.computer.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
