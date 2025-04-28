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

userRouter.get("/login", async (req, res) => {
  try {
    const { username, password } = req.query;
    const resp = await prisma.users.findUnique({
      where: { username: username },
    });
    if (resp.id !== undefined) {
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

userRouter.get('/get-all',async (_,res)=>{
  try {
    const users =  await prisma.users.findMany()
  res.status(200).json({success:true,message:"success", data: users})
  } catch (error) {
    res
    .status(500)
    .json({ success: false, message: error.message, data: null });
  }

})

export default userRouter;
