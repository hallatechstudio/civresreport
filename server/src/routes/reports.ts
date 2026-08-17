import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendReportConfirmationEmail } from "../utils/email.js";

const router = Router();
const prisma = new PrismaClient();

function generateTrackingId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.get("/", async (_req: Request, res: Response) => {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ reports });
});

router.get("/track/:trackingId", async (req: Request, res: Response) => {
  const report = await prisma.report.findUnique({
    where: { trackingId: req.params.trackingId },
  });
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }
  res.json({ report });
});

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  let trackingId = generateTrackingId();
  let exists = true;
  while (exists) {
    const existing = await prisma.report.findUnique({ where: { trackingId } });
    if (!existing) exists = false;
    else trackingId = generateTrackingId();
  }
  const report = await prisma.report.create({
    data: {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      subcategories: JSON.stringify(data.subcategories || []),
      description: data.description,
      area: data.area,
      state: data.state,
      severity: data.severity,
      contactMethod: data.contactMethod || "anonymous",
      contactValue: data.contactValue || null,
      photos: data.photos ? JSON.stringify(data.photos) : null,
      audio: data.audio || null,
      video: data.video || null,
      trackingId,
    },
  });

  if (report.contactMethod === "email" && report.contactValue) {
    sendReportConfirmationEmail(report.contactValue, {
      id: report.trackingId!,
      categoryName: report.categoryName,
      area: report.area,
      state: report.state,
      description: report.description,
    }).catch((err) => console.error("Failed to send confirmation email:", err));
  }

  res.status(201).json(report);
});

router.post("/:id/assign", async (req: Request, res: Response) => {
  const { authorityIds } = req.body;
  const ids = Array.isArray(authorityIds) ? authorityIds : authorityIds ? [authorityIds] : [];
  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { assignedTo: JSON.stringify(ids), status: "assigned" },
  });
  res.json(report);
});

router.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  const allowed = ["pending", "under_review", "assigned", "resolved"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(report);
});

router.post("/:id/message", async (req: Request, res: Response) => {
  const { message } = req.body;
  const report = await prisma.report.update({
    where: { id: req.params.id },
    data: { notes: message, messageStatus: "sent" },
  });
  res.json(report);
});

export default router;
