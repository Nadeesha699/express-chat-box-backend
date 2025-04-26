import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma  = new PrismaClient()

const roueterMessage = Router()

roueterMessage.get('/get-all/by-conversation-id',(req,res)=>{
    prisma.message.findMany({where:{}})
    res.status(200).json()
})