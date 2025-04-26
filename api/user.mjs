import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userRouter = Router();

userRouter.post("/set", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const resp = await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: hashpassword,
      },
    });
    res.status(200).json({ data: resp, error: false, message: "success" });
  } catch (error) {
    res.status(500).json({ data: null, error: true, message: error });
  }
});

userRouter.get("/login", async (req, res) => {
  const { username, password } = req.query;
  const resp = await prisma.users.findUnique({
    where: { username: username },
  });
  if (resp.id !== undefined) {
    const result = await bcrypt.compare(password, resp.password);
    result === true
      ? res.status(200).json({ message: "success", data: resp })
      : res.status(200).json({ message: "unsuccess", data: null });
  }
});

export default userRouter;
