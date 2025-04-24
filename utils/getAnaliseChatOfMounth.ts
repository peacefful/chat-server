import { type IAnaliseChatOfMounth } from '../types/iAnaliseChatOfMounth'
import { IAnaliseUserMessage } from '../types/iAnaliseUserMessage'
import { IMessage } from '../types/iMessage'

export type IGetAnaliseChatOfMounth = {
  message: IMessage
  analiseOfMounth: IAnaliseChatOfMounth[]
  userMessagesSum: number
  userId: number
  userFileLength: number
  userTextLength: number
}

export type IIsEmptyUserAnaliseMessage = {
  index: number
} & Pick<
  IGetAnaliseChatOfMounth,
  'userId' | 'analiseOfMounth' | 'message' | 'userMessagesSum' | 'userFileLength' | 'userTextLength'
>

const isEmptyUserAnaliseMessage = (data: IIsEmptyUserAnaliseMessage) => {
  const {
    analiseOfMounth,
    index,
    message,
    userMessagesSum,
    userId,
    userFileLength,
    userTextLength
  } = data

  if (!analiseOfMounth || !analiseOfMounth[index]) return

  if (!analiseOfMounth[index].userAnaliseMessage) {
    analiseOfMounth[index].userAnaliseMessage = []
  }

  const userAnaliseMessage = analiseOfMounth[index].userAnaliseMessage
  if (!userAnaliseMessage) return // <-- гарантируем, что объект не `undefined`

  const user = userAnaliseMessage.find((analiseMessage) => analiseMessage.userId === userId)

  if (!user?.userId) {
    userAnaliseMessage.push({
      username: message.username,
      userFileLength,
      userTextLength,
      userMessagesSum,
      userId
    })
  }

  analiseOfMounth[index].userAnaliseMessage = userAnaliseMessage
}

export const getAnaliseChatOfMounth = (data: IGetAnaliseChatOfMounth) => {
  const { message } = data

  switch (message.sendDate) {
    case 'Jan':
      isEmptyUserAnaliseMessage({ ...data, index: 0 })
      break
    case 'Feb':
      isEmptyUserAnaliseMessage({ ...data, index: 1 })
      break
    case 'Mar':
      isEmptyUserAnaliseMessage({ ...data, index: 2 })
      break
    case 'Apr':
      isEmptyUserAnaliseMessage({ ...data, index: 3 })
      break
    case 'May':
      isEmptyUserAnaliseMessage({ ...data, index: 4 })
      break
    case 'Jun':
      isEmptyUserAnaliseMessage({ ...data, index: 5 })
      break
    case 'Jul':
      isEmptyUserAnaliseMessage({ ...data, index: 6 })
      break
    case 'Aug':
      isEmptyUserAnaliseMessage({ ...data, index: 7 })
      break
    case 'Sep':
      isEmptyUserAnaliseMessage({ ...data, index: 8 })
      break
    case 'Oct':
      isEmptyUserAnaliseMessage({ ...data, index: 9 })
      break
    case 'Nov':
      isEmptyUserAnaliseMessage({ ...data, index: 10 })
      break
    default:
      isEmptyUserAnaliseMessage({ ...data, index: 11 })
  }
}
