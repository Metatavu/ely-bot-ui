import { Session } from "metamind-client";

export interface StoreState {
  messageDatas: MessageData[],
  session: Session | undefined,
  conversationStarted: boolean
}

export interface MessageData {
  id: string,
  isBot: boolean,
  content: string
}