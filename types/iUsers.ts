import { IChats } from "./iChats"

export interface IUser {
  id: number
  name: string
  surname: string
  login: string
  password: string
  uuid: string
  chats: IChats[]
}
