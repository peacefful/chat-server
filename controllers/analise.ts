import { PrismaClient } from '@prisma/client'
import e, { Request, Response } from 'express'
import { type IAnaliseChatOfMounth } from "../types/iAnaliseChatOfMounth"
import { getAnaliseChatOfMounth } from "../utils/getAnaliseChatOfMounth"

const prisma = new PrismaClient()

export const getAnaliseChat = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id)
  const chat = await prisma.chats.findUnique({
    where: {
      id
    },
    include: {
      messages: true
    }
  })

  const analiseOfMounth: IAnaliseChatOfMounth[] = [
    { mounthName: 'January' },
    { mounthName: 'February' },
    { mounthName: 'March' },
    { mounthName: 'April' },
    { mounthName: 'May' },
    { mounthName: 'June' },
    { mounthName: 'July' },
    { mounthName: 'August' },
    { mounthName: 'September' },
    { mounthName: 'October' },
    { mounthName: 'November' },
    { mounthName: 'December' }
  ];

  if (chat) {

    let fileLength = 0;
    let textLength = 0;


    for (const element of chat.messages) {
      if (element.text?.length) textLength += 1;
      if (element.file?.length) fileLength += 1;

      getAnaliseChatOfMounth({
        message: element,
        analiseOfMounth
      })
    }

    const analise = {
      textLength,
      fileLength,
      analiseOfMounth
    }
    res.send(analise)
  }
}
