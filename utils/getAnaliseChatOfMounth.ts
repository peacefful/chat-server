import { type IAnaliseChatOfMounth } from "../types/iAnaliseChatOfMounth";
import { IAnaliseUserMessage } from "../types/iAnaliseUserMessage";
import { IMessage } from "../types/iMessage";

export type IGetAnaliseChatOfMounth = {
  message: IMessage 
  analiseOfMounth: IAnaliseChatOfMounth[]
}

export type IIsEmptyUserAnaliseMessage = {
  index: number
} & Pick<IGetAnaliseChatOfMounth, 'analiseOfMounth' | 'message'>

const isEmptyUserAnaliseMessage = (data: IIsEmptyUserAnaliseMessage) => {
  const { analiseOfMounth, index, message } = data;

  console.log('analiseOfMounth[index]', analiseOfMounth[index]);

  if (!analiseOfMounth || !analiseOfMounth[index]) return;

  if (!analiseOfMounth[index].userAnaliseMessage) {
    analiseOfMounth[index].userAnaliseMessage = []
  }

  const userAnaliseMessage = analiseOfMounth[index].userAnaliseMessage;
  if (!userAnaliseMessage) return; // <-- гарантируем, что объект не `undefined`

  let fileLength = 0;
  let textLength = 0;

  if (message.text?.length) textLength += 1;
  if (message.file?.length) fileLength += 1;

  userAnaliseMessage.push({username: message.username, textLength, fileLength})

  analiseOfMounth[index].userAnaliseMessage = userAnaliseMessage
};



export const getAnaliseChatOfMounth = (data: IGetAnaliseChatOfMounth) => {
  const {message, analiseOfMounth} = data

  console.log('message.sendDate', message.sendDate);

  switch(message.sendDate) {
    case 'Jan':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 0})
      break;
    case 'Feb':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 1})
      break;
    case 'Mar':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 2})
      break;
    case 'Apr':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 3})
      break;
    case 'May':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 4})
      break;
    case 'Jun':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 5})
      break;
    case 'Jul':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 6})
      break;
    case 'Aug':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 7})
      break;
    case 'Sep':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 8})
      break;
    case 'Oct':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 9})
      break;
    case 'Nov':
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 10})
      break;
    default:
      isEmptyUserAnaliseMessage({analiseOfMounth, message, index: 11})
  }
}