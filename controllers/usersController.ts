import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { IUser } from '../types/iUsers'
import { hashPassword } from '../utils/hashPasword'
import { keyJwt, refreshKeyJwt } from '../config/key'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { log } from 'console'

const prisma = new PrismaClient()

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findMany({
      include: {
        chats: true
      }
    })
    res.send(user)
  } catch (error) {
    console.log(error)
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id)
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        chats: true
      }
    })

    if (user?.chats) {
      for (const chat of user?.chats) {
        let otherAdminId = 0
        let otherAdminUuid = ''
        let chatId = 0

        if (chat.adminId !== user.id) {
          chatId = chat.id
          otherAdminId = chat.adminId
          otherAdminUuid = chat.uuid

          const otherAdmin = await prisma.user.findUnique({
            where: {
              id: otherAdminId
            },
            include: {
              chats: true
            }
          })

          const otherAdminChat = otherAdmin?.chats.find((chat) => {
            return chat.uuid === otherAdminUuid
          })

          if (!otherAdminChat) {
            await prisma.chats.delete({
              where: {
                id: chatId,
                uuid: otherAdminUuid
              }
            })
          }
        }
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: user?.id
      },
      include: {
        chats: true
      }
    })

    res.send(updatedUser)
  } catch (error) {
    console.log(error)
  }
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const { name, surname, password, login }: IUser = req.body
      const hashedPassword = await hashPassword(password)
      const createUser = await prisma.user.create({
        data: {
          name,
          surname,
          login,
          password: hashedPassword,
          uuid: uuidv4()
        }
      })
      res.send(createUser)
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id)
    const user = await prisma.user.delete({
      where: {
        id
      }
    })
    res.send(user)
  } catch (error) {
    console.log(error)
  }
}

export const authUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password }: IUser = req.body
    const user = await prisma.user.findFirst({
      where: { login }
    })
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (passwordMatch) {
        const accessToken = jwt.sign(
          {
            id: user.id,
            login,
            password
          },
          keyJwt,
          { expiresIn: '30m' }
        )
        const refreshToken = jwt.sign(
          {
            id: user.id,
            login,
            password
          },
          keyJwt,
          { expiresIn: '2d' }
        )
        res.status(200).json({
          refreshToken,
          accessToken,
          id: user.id,
          uuid: user.uuid
        })
      } else {
        res.status(401).json({
          message: 'Пароли не совпадают'
        })
      }
    } else {
      res.status(404).json({
        message: 'Пользователь не найден'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const refreshToken = async (
  req: Request,
  res: Response<any, Record<string, any>>
): Promise<void> => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400).json({
        message: 'Отсутствует refreshToken'
      })
    }

    jwt.verify(refreshToken, keyJwt, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          message: 'Неверный или истекший refreshToken'
        })
      }
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      })
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден'
        })
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          login: user.login
        },
        keyJwt,
        { expiresIn: '2m' }
      )

      const newRefreshToken = jwt.sign(
        {
          id: user.id,
          login: user.login
        },
        keyJwt,
        { expiresIn: '7d' }
      )
      res.status(200).json({
        accessToken,
        refreshToken: newRefreshToken
      })
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Ошибка сервера'
    })
  }
}
