import express from "express";
import userRouter from "./api/user.mjs";
import converstationRouter from "./api/converstation.mjs";

const server = express();
server.use(express.json());

server.use("/api/users", userRouter);
server.use("/api/conversation", converstationRouter);

server.listen(4000, () => {
  console.log("server is running...");
});
