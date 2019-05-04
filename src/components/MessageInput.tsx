import * as React from "react";
import * as _ from "lodash";
import { Button, Grid, Input, InputOnChangeData, Container } from "semantic-ui-react";

import 'react-image-lightbox/style.css';
import '../styles/message-input.css'

export interface Props {
  conversationStarted: boolean,
  waitingForBot: boolean,
  hint: string,
  globalQuickResponses: string[],
  onSendMessage: (messageContent: string) => void,
  onReset: () => void,
  onRestartConversation: () => void
}

export interface State {
  pendingMessage: string
}

class MessageInput extends React.Component<Props, State> {

  private messagesEnd: any;

  constructor(props: Props) {
    super(props);
    this.state = { 
      pendingMessage: ""
    };
  }

  public render() {
    return (
      <div className="message-input-container">
        <div>
          <Container>
            <Grid>
              <Grid.Row verticalAlign="middle" columns="equal">
                <Grid.Column style={{paddingRight: "15px"}}>
                  <Input
                    className="message-input"
                    placeholder={ this.props.hint }
                    value={this.state.pendingMessage}
                    onChange={this.onPendingMessageChange}
                    onKeyPress={this.handleInputKeyPress}
                    onFocus={() => {setTimeout(this.scrollToBottom, 300)}}
                    fluid  />
                  <Button className="message-send" disabled={this.props.waitingForBot} onClick={this.onSendButtonClick}></Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingBottom: 0 }}>
                <Grid.Column>
                  { this.renderGlobalQuickResponses() }
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column>
                  <a className="powered-by" target="_blank" href="https://www.metamind.fi">
                    Powered by Metamind - a chatbot from Metatavu Oy
                  </a>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }

  /**
   * Renders global quick responses
   */
  private renderGlobalQuickResponses = () => {
    if (!this.props.globalQuickResponses.length) {
      return null;
    }

    return (
      <div className="global-quick-responses">
        { this.props.globalQuickResponses.map((globalQuickResponse) => {
          return <Button className="global-quick-response" onClick={() => this.props.onSendMessage(globalQuickResponse)}>{ globalQuickResponse }</Button>  
        }) }
      </div>
    );
  }
  
  private scrollToBottom = () => {
    if (!this.messagesEnd) {
      return;
    }

    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  private onPendingMessageChange = (e: any, data: InputOnChangeData) => {
    this.setState({
      pendingMessage: data.value as string
    });
  }

  private handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.onSendButtonClick();
    }
  }

  private onSendButtonClick = () => {
    if (!this.state.pendingMessage) {
      return;
    }

    this.props.onSendMessage(this.state.pendingMessage);

    this.setState({
      pendingMessage: ""
    });
  }
}

export default MessageInput;