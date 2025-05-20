import { Router } from "express";
import prisma from "../database/db.mjs";

const messageRouter = Router();

messageRouter.get("/get-all/by-conversation-id", async (req, res) => {
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

messageRouter.get(
  "/get-all/unread-messages/by-conversation-id",
  async (req, res) => {
    try {
      const { id } = req.query;
      const data = await prisma.message.findMany({
        where: { conversationId: parseInt(id), read: false },
        include: { user: true },
      });

      res
        .status(200)
        .json({ data: data.length, success: true, message: "success" });
    } catch (error) {
      res
        .status(500)
        .json({ data: [], success: false, message: error.message });
    }
  }
);

messageRouter.post("/set", async (req, res) => {
  try {
    const { message, conversationId, userid } = req.body;
    const messages = await prisma.message.create({
      data: {
        message: message,
        conversationId: conversationId,
        userid: userid,
      },
    });

    res.status(200).json({
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

messageRouter.put("/update/by-conversation-id", async (req, res) => {
  const { id } = req.query;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing 'id' query parameter",
    });
  }

  try {
    const result = await prisma.message.updateMany({
      data: { read: true },
      where: { conversationId: parseInt(id) },
    });

    res.json({ data: result, success: true, message: "update success" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

messageRouter.put("/update/by-id", async (req, res) => {
  try {
    const { id } = req.query;
    const { message } = req.body;
    const response = await prisma.message.update({
      data: { message: message,createAt:new Date() },
      where: { id: Number(id) },
    });
    res.status(200).json({ data: response, success: true, error: null });
  } catch (error) {
    res
      .status(500)
      .json({ data: null, success: false, message: error.message });
  }
});

messageRouter.delete("/delete/by-id", async (req, res) => {
  try {
    const { id } = req.query;
    await prisma.message.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "delete success", error: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default messageRouter;
