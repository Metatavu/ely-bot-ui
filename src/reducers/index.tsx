import { BotAction } from '../actions';
import { StoreState } from '../types/index';
import { BOT_CONNECTED, BOT_RESPONSE, CONVERSATION_START, BOT_RESET } from '../constants/index';

export function processAction(state: StoreState, action: BotAction): StoreState {

  switch (action.type) {
    case BOT_CONNECTED:
      return { ...state, session: action.session};
    case BOT_RESPONSE:
      return { ...state, messages: state.messages.concat([action.message])};
    case CONVERSATION_START:
      return { ...state, conversationStarted: true};
    case BOT_RESET:
      return {...state, session: undefined, messages: [], conversationStarted: false}
  }
  return state;
}