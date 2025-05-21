import express from "express";
import userRouter from "./api/user.mjs";
import converstationRouter from "./api/converstation.mjs";
import messageRouter from "./api/message.mjs";
import cors from 'cors'

const server = express();
server.use(express.json());
server.use(cors())

server.use("/api/users", userRouter);
server.use("/api/conversation", converstationRouter);
server.use("/api/message", messageRouter);

server.listen(4000, () => {
  console.log("server is running...");
});
