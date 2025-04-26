import express from "express";
import userRouter from "./api/user.mjs";


const server = express();
server.use(express.json());
server.use('/api/users',userRouter)

// server.get("/api/users/get-all", async (_, res) => {
//   const users = await prisma.users.findMany();
//   res.json({ data: users });
// });



server.listen(4000, () => {
  console.log("server is running...");
});
