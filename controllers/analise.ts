import { PrismaClient } from '@prisma/client'
import e, { Request, Response } from 'express'
import { type IAnaliseChatOfMounth } from '../types/iAnaliseChatOfMounth'
import { getAnaliseChatOfMounth } from '../utils/getAnaliseChatOfMounth'

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
    { mounthName: 'january' },
    { mounthName: 'february' },
    { mounthName: 'march' },
    { mounthName: 'april' },
    { mounthName: 'may' },
    { mounthName: 'june' },
    { mounthName: 'july' },
    { mounthName: 'august' },
    { mounthName: 'september' },
    { mounthName: 'october' },
    { mounthName: 'november' },
    { mounthName: 'december' }
  ]

  if (chat) {
    let chatFileLength = 0
    let chatTextLength = 0

    for (const element of chat.messages) {
      if (element.text?.length) chatTextLength += 1
      if (element.file?.length) chatFileLength += 1

      const userMessages = chat.messages.filter((message) => {
        return message.userId === element.userId && message.sendDate === element.sendDate
      })

      let userFileLength = 0
      let userTextLength = 0

      userMessages.forEach((message) => {
        if (message.text.length) userTextLength += 1
        if (message.file.length) userFileLength += 1
      })

      getAnaliseChatOfMounth({
        message: element,
        analiseOfMounth,
        userMessagesSum: userMessages.length,
        userId: element.userId,
        userFileLength,
        userTextLength
      })
    }

    const analise = {
      chatTextLength,
      chatFileLength,
      analiseOfMounth
    }
    res.send(analise)
  }
}
