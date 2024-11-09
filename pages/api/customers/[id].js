// pages/api/customers/[id].js
import { PrismaClient } from "@prisma/client";
import { checkAdmin } from "@/utils/checkAdmin";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const admin = await checkAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;

  if (req.method === "PATCH") {
    const { balance, username, password } = req.body;

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        ...(balance !== undefined && { balance: parseFloat(balance) }), // Ensure balance is a Float
        ...(username && { username }),
        ...(password && { password }),
      },
    });

    return res.status(200).json(updatedCustomer);
  }

  if (req.method === "DELETE") {
    await prisma.customer.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
