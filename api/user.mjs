import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../database/db.mjs";

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
    res
      .status(200)
      .json({ data: resp, message: "register success", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const resp = await prisma.users.findUnique({
      where: { username: username },
    });
    if (resp !== null) {
      const result = await bcrypt.compare(password, resp.password);
      result === true
        ? res
            .status(200)
            .json({ success: true, message: "login success", data: resp })
        : res
            .status(401)
            .json({ data: null, success: false, message: "wrong candidate" });
    } else {
      res
        .status(401)
        .json({ data: null, success: false, message: "wrong candidate" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
});

userRouter.get("/get-all", async (_, res) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json({ success: true, message: "success", data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
});

userRouter.get("/get-user/by-id", async (req, res) => {
  try {
    const { id } = req.query;
    const users = await prisma.users.findUnique({ where: { id: Number(id) } });
    res.status(200).json({ success: true, message: "success", data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
});

userRouter.post("/password-verify/by-id", async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.query;
    const result = await prisma.users.findUnique({ where: { id: Number(id) } });
    const valid = await bcrypt.compare(password, result.password);
    if (valid) {
      res
        .status(200)
        .json({ success: true, message: "password verify", data: valid });
    } else {
      res
        .status(200)
        .json({ success: false, message: "password not verify", data: valid });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

userRouter.put("/update/by-id", async (req, res) => {
  try {
    const { password, email, username } = req.body;
    const { id } = req.query;

    let hashedPassword = password;

    if (
      !(
        typeof password === "string" &&
        password.length === 60 &&
        /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(password)
      )
    ) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await prisma.users.update({
      where: { id: Number(id) },
      data: { email: email, password: hashedPassword, username: username },
    });

    res
      .status(200)
      .json({ data: result, success: true, message: "update success" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
});

export default userRouter;
