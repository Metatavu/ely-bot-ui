import * as React from "react";
import { Grid, Loader } from "semantic-ui-react";
import MessageList from "./MessageList";
import Api, { Session, Message } from "metamind-client";

import * as actions from "../actions/";
import { StoreState } from "../types/index";
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
  messages?: Message[],
  conversationStarted: boolean,
  onBotConnected?: (session: Session) => void
  onBotResponse?: (message: Message) => void
  onBotReset?: () => void,
  startConversation?: () => void
}

/**
 * Component state
 */
interface State {
  session?: Session
}

class Bot extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.getSession();
    /**
    if (!this.props.session) {
      this.metamindClient.getSession().then((session: Session) => {
        this.props.onBotConnected && this.props.onBotConnected(session);
      }).catch((err) => {
      });
    } */
  }

  public componentDidUpdate(prevProps: Props) {
    this.getSession();
    /**
    if (!this.props.session) {
      this.metamindClient.getSession().then((session: Session) => {
        this.props.onBotConnected && this.props.onBotConnected(session);
      });
    }

    if (!prevProps.session && this.props.session) {
      this.sendMessage("INIT");
    }*/
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
            conversationStarted={this.props.conversationStarted} 
            messages={this.props.messages || []}
            startConversation={this.beginConversation}
            onSendMessage={this.sendMessage}
            onReset={this.resetBot}
          />
        )}
      </Grid>
    );
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

    this.props.onBotResponse && this.props.onBotResponse(message);
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

    this.props.onBotResponse && this.props.onBotResponse(initMessage);

    return session;
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
    messages: state.messages,
    conversationStarted: state.conversationStarted
  }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.BotAction>) {
  return {
    onBotConnected: (session: Session) => dispatch(actions.botConnected(session)),
    onBotResponse: (message: Message) => dispatch(actions.botResponse(message)),
    startConversation: () => dispatch(actions.conversationStart()),
    onBotReset: () => dispatch(actions.BotReset())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bot);