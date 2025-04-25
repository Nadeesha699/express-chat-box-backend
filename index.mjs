import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const server = express();

server.get("/api/users/get-all", async (_, res) => {
  const users = await prisma.users.findMany();
  res.json({ data: users });
});

server.listen(4000, () => {
  console.log("server is running...");
});
