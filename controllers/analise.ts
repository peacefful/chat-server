import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

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

  if (chat) {
    let fileLength = 0
    let textLength = 0

    for (const element of chat.messages) {
      if (element.text.length) {
        textLength += 1
      }

      if (element.file.length) {
        fileLength += 1
      }
    }

    console.log('fileLength', fileLength);
    

    const analise = {
      fileLength,
      textLength
    }
    res.send(analise)
  }
}
