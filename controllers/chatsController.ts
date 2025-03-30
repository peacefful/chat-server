import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import type { IChats } from '../types/iChats'

const prisma = new PrismaClient()

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const chats = await prisma.chats.findMany({
      include: {
        messages: true
      }
    })
    res.send(chats)
  } catch (error) {
    console.log(error)
  }
}

export const getChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id)
    const chat = await prisma.chats.findFirst({
      where: {
        id
      },
      include: {
        messages: true
      }
    })

    const chatWithMessages = await prisma.chats.findFirst({
      where: {
        uuid: chat?.uuid
      },
      include: {
        messages: true
      }
    })

    res.send(chatWithMessages)
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
    // const adminId: number = req.params.adminId
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
