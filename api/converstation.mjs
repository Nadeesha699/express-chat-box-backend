import { Router } from "express";

import { PrismaClient } from "@prisma/client";

const converstationRouter = Router();

const prisma = new PrismaClient();

converstationRouter.get("/get-all/by-user-id", async (req, res) => {
  try {
    const id = req.query;
    const resp = await prisma.conversation.findMany({
      where: { OR: [{ createrId: id }, { senderId: id }] },
    });
    resp !== null
      ? res
          .status(200)
          .json({ data: resp, message: "data founded", success: true })
      : res
          .status(200)
          .json({ data: [], message: "no data found", success: true });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false, data: [] });
  }
});

converstationRouter.post("/set", async (req, res) => {
  try {
    const { createrId, senderId } = req.body();
    const conversation = await prisma.conversation.create({
      data: { createrId: createrId, senderId: senderId },
    });
    res.status(200).json({
      success: true,
      message: "converstaion create succuess",
      data: conversation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
});

export default converstationRouter;
