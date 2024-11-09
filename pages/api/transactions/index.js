// pages/api/transactions/index.js
import { PrismaClient } from "@prisma/client";
import { checkAdmin } from "@/utils/checkAdmin";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const admin = await checkAdmin(req, res);
  if (!admin) return;

  if (req.method === "GET") {
    // Lấy danh sách giao dịch cùng với thông tin khách hàng và máy tính
    const transactions = await prisma.transaction.findMany({
      include: {
        customer: { select: { id: true, username: true } },
        computer: { select: { id: true, name: true } },
      },
    });
    return res.status(200).json(transactions);
  }

  if (req.method === "POST") {
    const { customerId, computerId, amount } = req.body; // Giả sử bạn có các trường này
    const newTransaction = await prisma.transaction.create({
      data: {
        customerId,
        computerId,
        amount,
      },
    });
    return res.status(201).json(newTransaction);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
