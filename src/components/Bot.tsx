import * as React from "react";
import { Grid, Loader } from "semantic-ui-react";
import MessageList from "./MessageList";
import Api, { Session, Message } from "metamind-client";
import linkifyHtml from 'linkifyjs/html';
import * as actions from "../actions/";
import { StoreState, MessageData } from "../types/index";
import { connect } from "react-redux";
import { Dispatch } from "redux";

/**
 * Component props
 */
interface Props {
  storyId: string,
  locale: string,
  timeZone: string,
  visitor: string,
  messageDatas?: MessageData[],
  conversationStarted: boolean,
  onBotConnected?: (session: Session) => void
  onBotResponse?: (message: MessageData) => void
  onBotReset?: () => void,
  onBotInterrupt?: () => void,
  startConversation?: () => void
}

/**
 * Component state
 */
interface State {
  session?: Session,
  quickResponses: string[],
  hint?: string,
  pendingMessages: MessageData[]

}

class Bot extends React.Component<Props, State> {
  
  private pendingMessageTimer: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      quickResponses: [],
      pendingMessages: []
    };
  }

  public componentDidMount() {
    this.getSession();
  }

  public componentDidUpdate(prevProps: Props) {
    this.getSession();
  }

  public render = () => {
    return (
      <Grid centered>
        { !this.state.session ? (
          <div>
            <Loader active size="medium" />
          </div>
        ) : (
          <MessageList 
            conversationStarted={ this.props.conversationStarted } 
            messageDatas={ this.props.messageDatas || [] }
            hint={ this.state.hint || "Say something..." }
            quickResponses={ this.state.quickResponses }
            startConversation={ this.beginConversation }
            onSendMessage={ this.sendMessage }
            onReset={ this.resetBot }
          />
        )}
      </Grid>
    );
  }

  /**
   * Progresses thru pending message queue
   */
  private messageQueueProgress = async () => {
    if (this.pendingMessageTimer) {
      clearTimeout(this.pendingMessageTimer);
    }

    const { pendingMessages } = this.state;
    const message = pendingMessages.shift();
    if (!message) {
      return;
    }

    this.props.onBotResponse && this.props.onBotResponse(message);
    if (pendingMessages.length > 0) {
      await this.waitAsync(700);

      this.props.onBotResponse && this.props.onBotResponse({
        id: `temp-${message.id}`,
        isBot: true,
        content: ""
      });
    }

    this.pendingMessageTimer = setTimeout(() => {
      this.messageQueueProgress();
    }, 500 + (Math.random() * 1000));
  }
  
  private sendMessage = async (messageContent: string) => {
    if (!this.state.session) {
      return;
    }

    const session = await this.getSession();

    const message = await Api.getMessagesService("").createMessage({
      content: messageContent,
      sessionId: session.id!,
      sourceKnotId: ""
    }, this.props.storyId);

    await this.processBotResponse(message);
  }

  private async getSession(): Promise<Session> {
    if (this.state.session) {
      return this.state.session;
    }

    
    const session = await Api.getSessionsService("").createSession({
      locale: this.props.locale,
      timeZone: this.props.timeZone,
      visitor: this.props.visitor
    }, this.props.storyId);

    const initMessage = await Api.getMessagesService("").createMessage({
      content: "INIT",
      sessionId: session.id!
    }, this.props.storyId);

    this.setState({
      session: session
    });

    await this.processBotResponse(initMessage);
    return session;
  }

  /**
   * Builds response messages
   * 
   * @param responses Bot response array
   */
  private buildResponseMessages(responses: string[]) {
    let allResponses: string[] = [];
    responses.forEach((response) => {
      allResponses = allResponses.concat(response.split(/\n\s*\n/));
    });

    return allResponses.map((responseText: string) => {
      return linkifyHtml(responseText, {
        defaultProtocol: "https",
        nl2br: true,
        target: {
          url: '_blank'
        }
      });
    });
  }

  /**
   * Processes bot response
   * 
   * @param message Message with bot response
   */
  private async processBotResponse(message: Message) {
    this.props.onBotResponse && this.props.onBotResponse({
      id: `${message.id}-message`,
      isBot: false,
      content: message.content || ""
    });

    this.setState({
      quickResponses: message.quickResponses || [],
      hint: message.hint,
      pendingMessages: []
    });

    const responses = this.buildResponseMessages(message.response || []);
    if (responses) {
      const pendingMessages = [];
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        pendingMessages.push({
          id: `${message.id}-response-${i}`,
          isBot: true,
          content: response
        });
      }
      this.setState({
        pendingMessages: pendingMessages
      });

      this.props.onBotInterrupt && this.props.onBotInterrupt();
      this.messageQueueProgress();
    }
  }

  private waitAsync(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  private beginConversation = () => {
    this.props.startConversation && this.props.startConversation();
  }

  private resetBot = () => {
    this.props.onBotReset && this.props.onBotReset();
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    session: state.session,
    messageDatas: state.messageDatas,
    conversationStarted: state.conversationStarted
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BotAction>) {
  return {
    onBotConnected: (session: Session) => dispatch(actions.botConnected(session)),
    onBotResponse: (messageData: MessageData) => dispatch(actions.botResponse(messageData)),
    startConversation: () => dispatch(actions.conversationStart()),
    onBotReset: () => dispatch(actions.BotReset()),
    onBotInterrupt: () => dispatch(actions.BotInterrupted())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bot);