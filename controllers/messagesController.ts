import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getMessages = async (req: Request, res: Response): Promise<void> => {
	try {
		const messages = await prisma.message.findMany()
		res.send(messages)
	} catch (error) {
		console.log(error);
	}
}