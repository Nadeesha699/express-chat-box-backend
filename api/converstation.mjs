import { Router } from "express";
import prisma from "../database/db.mjs";

const converstationRouter = Router();

converstationRouter.get("/get-all/by-user-id", async (req, res) => {
  try {
    const { id } = req.query;
    const resp = await prisma.conversation.findMany({
      where: { OR: [{ createrId: parseInt(id) }, { senderId: parseInt(id) }] },
      include: { createruser: true, senderuser: true },
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

converstationRouter.get("/get-all/by-user-id/for-verfiy", (req, res) => {
  try {
    const { uid, fid } = req.query;
    prisma.conversation
      .findMany({
        where: {
          OR: [
            { createrId: parseInt(uid), senderId: parseInt(fid) },
            { createrId: parseInt(fid), senderId: parseInt(uid) },
          ],
        },
        include: { createruser: true, senderuser: true },
      })
      .then((e) => {
        e !== null
          ? res
              .status(200)
              .json({ data: e, message: "data founded", success: true })
          : res
              .status(200)
              .json({ data: [], message: "no data found", success: true });
      });
  } catch (e) {
    res.status(500).json({ message: e.message, success: false, data: [] });
  }
});

converstationRouter.post("/set", async (req, res) => {
  try {
    const { createrId, senderId } = req.body;
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

converstationRouter.delete("/delete/by-id", async (req, res) => {
  const { id } = req.query;
  await prisma.conversation.delete({ where: { id: id } });
  res
    .status(200)
    .json({ message: "delete success", success: true, error: null });
});

export default converstationRouter;
