// pages/api/transactions/start.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { computerId, customerId, ratePerHour } = req.body;

    if (!computerId || !customerId || !ratePerHour) {
      return res.status(400).json({ error: "Thiếu tham số cần thiết" });
    }

    const startTime = new Date();

    try {
      const transaction = await prisma.transaction.create({
        data: {
          computerId,
          customerId,
          startTime,
          endTime: null,
          cost: ratePerHour,
        },
      });
      return res.status(201).json(transaction);
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch:", error);
      return res.status(500).json({ error: "Không thể tạo giao dịch" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
