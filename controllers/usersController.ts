import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { IUser } from '../interfaces/iUsers'
import { hashPassword } from '../utils/hashPasword'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { keyJwt } from '../config/key'

const prisma = new PrismaClient()

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany()
    res.send(users)
  } catch (error) {
    console.log(error)
  }
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: IUser = req.body
    const hashedPassword = await hashPassword(password)
    const createUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })
    res.send(createUser)
  } catch (error) {
    console.log(error)
  }
}

export const authUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: IUser = req.body
    const user = await prisma.user.findFirst({
      where: { username }
    })

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (passwordMatch) {
        const token = jwt.sign(
          {
            username,
            password
          },
          keyJwt,
          { expiresIn: '5h' }
        )
        res.status(200).json({
          token: `Bearer ${token}`,
          id: user.id,
          role: user.username
        })
      } else {
        throw new Error('Пароли не совпадают')
      }
    } else {
      throw new Error('Пользователь не найден')
    }
  } catch (error) {
    console.log(error)
  }
}
