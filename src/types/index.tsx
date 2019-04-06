import { Message, Session } from "metamind-client";

export interface StoreState {
  messages: Message[],
  session: Session | undefined,
  conversationStarted: boolean
}