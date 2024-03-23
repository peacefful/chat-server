import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import type { IChats } from '../types/iChats'

const prisma = new PrismaClient()

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const chats = await prisma.chats.findMany()
    res.send(chats)
  } catch (error) {
    console.log(error)
  }
}

export const addChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const chatData: IChats = req.body
    const chats = await prisma.chats.create({
      data: {
        ...chatData
      }
    })
    res.send(chats)
  } catch (error) {
    console.log(error)
  }
}

export const updateChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id)
    const chatData: IChats = req.body
    const chats = await prisma.chats.update({
      where: {
        id
      },
      data: {
        ...chatData
      }
    })
    res.send(chats)
  } catch (error) {
    console.log(error)
  }
}

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id)
    const chats = await prisma.chats.delete({
      where: {
        id
      }
    })
    res.send(chats)
  } catch (error) {
    console.log(error)
  }
}