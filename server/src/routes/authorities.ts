import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req: Request, res: Response) => {
  const authorities = await prisma.authority.findMany({
    orderBy: { name: "asc" },
  });
  res.json({ authorities });
});

router.post("/", async (req: Request, res: Response) => {
  const { name, type, contact } = req.body;
  const authority = await prisma.authority.create({
    data: { name, type, contact: contact || null },
  });
  res.status(201).json(authority);
});

export default router;
