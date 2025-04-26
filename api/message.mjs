import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roueterMessage = Router();

roueterMessage.get("/get-all/by-conversation-id", async (req, res) => {
  try {
    const { id } = req.query;
    const data = await prisma.message.findMany({
      where: { conversationId: parseInt(id) },
      include: { user: true },
    });

    res.status(200).json({ data: data, success: true, message: "success" });
  } catch (error) {
    res.status(500).json({ data: [], success: false, message: error.message });
  }
});

roueterMessage.post("/set", async (req, res) => {
  try {
    const { message, conversationId, userid } = req.body;
    const messages = await prisma.message.create({
      data: {
        message: message,
        conversationId: conversationId,
        userid: userid,
      },
    });

    res
      .status(200)
      .json({
        data: messages,
        success: true,
        message: "message create success",
      });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, success: false, message: error.message });
  }
});
