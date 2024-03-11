import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { IUser } from '../interfaces/iUsers'
import { hashPassword } from '../utils/hashPasword'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { keyJwt } from '../config/key'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'

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
    res.send(user)
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
      const { name, surname, password, appointment, rank, login, phone, role }: IUser = req.body
      const hashedPassword = await hashPassword(password)
      const createUser = await prisma.user.create({
        data: {
          name,
          surname,
          appointment,
          rank,
          login,
          phone,
          role,
          uuid: uuidv4(),
          password: hashedPassword
        }
      })
      res.send(createUser)
    }
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
        const token = jwt.sign(
          {
            id: user.id,
            login,
            password
          },
          keyJwt,
          { expiresIn: '2h' }
        )
        res.status(200).json({
          token: `Bearer ${token}`,
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          surname: user.surname
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
