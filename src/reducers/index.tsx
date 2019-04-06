import { BotAction } from '../actions';
import { StoreState } from '../types/index';
import { BOT_CONNECTED, BOT_RESPONSE, CONVERSATION_START, BOT_RESET } from '../constants/index';

export function processAction(state: StoreState, action: BotAction): StoreState {

  switch (action.type) {
    case BOT_CONNECTED:
      return { ...state, session: action.session};
    case BOT_RESPONSE:
      return { ...state, messageDatas: state.messageDatas.filter((messageData) => !messageData.id.startsWith("temp")).concat([action.messageData])};
    case CONVERSATION_START:
      return { ...state, conversationStarted: true};
    case BOT_RESET:
      return {...state, session: undefined, messageDatas: [], conversationStarted: false}
  }
  return state;
}