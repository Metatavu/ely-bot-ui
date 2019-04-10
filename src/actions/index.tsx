import * as constants from '../constants'
import { Session } from 'metamind-client';
import { MessageData } from 'src/types';

export interface BotConnected {
  type: constants.BOT_CONNECTED
  session: Session
}

export interface BotResponse {
  type: constants.BOT_RESPONSE
  messageData: MessageData
}

export interface BotReset {
  type: constants.BOT_RESET
}

export interface BotInterrupted {
  type: constants.BOT_INTERRUPTED
}

export interface ConversationStart {
  type: constants.CONVERSATION_START
}

export type BotAction = BotConnected | BotResponse | ConversationStart | BotReset | BotInterrupted

export function BotReset (): BotReset {
  return {
    type: constants.BOT_RESET
  }
}

export function BotInterrupted (): BotInterrupted {
  return {
    type: constants.BOT_INTERRUPTED
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

export function botResponse(messageData: MessageData): BotResponse {
  return {
    type: constants.BOT_RESPONSE,
    messageData: messageData
  }
}