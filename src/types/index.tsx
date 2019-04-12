import { Session } from "metamind-client";

export interface StoreState {
  messageDatas: MessageData[],
  session: Session | undefined,
  conversationStarted: boolean,
  accessToken?: AccessToken
}

export interface MessageData {
  id: string,
  isBot: boolean,
  content: string
}

export interface AccessToken {
  created: Date
  access_token: string
  expires_in: number
  refresh_token: number
  refresh_expires_in: number
  url: string
  client_id: string
  realmId: string,
  firstName: string,
  lastName: string,
  userId: string
}

export interface AuthConfig {
  url: string
  realmId: string
  clientId: string
  username: string
  password: string
}