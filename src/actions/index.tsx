import * as constants from '../constants'
import { Session, Message } from 'metamind-client';

export interface BotConnected {
  type: constants.BOT_CONNECTED
  session: Session
}

export interface BotResponse {
  type: constants.BOT_RESPONSE
  message: Message
}

export interface BotReset {
  type: constants.BOT_RESET
}

export interface ConversationStart {
  type: constants.CONVERSATION_START
}

export type BotAction = BotConnected | BotResponse | ConversationStart | BotReset

export function BotReset (): BotReset {
  return {
    type: constants.BOT_RESET
  }
}

export function conversationStart (): ConversationStart {
  return {
    type: constants.CONVERSATION_START
  }
}

export function botConnected(session: Session): BotConnected {
  return {
    type: constants.BOT_CONNECTED,
    session: session 
  }
}

export function botResponse(message: Message): BotResponse {
  return {
    type: constants.BOT_RESPONSE,
    message: message
  }
}