import * as React from "react";
import * as _ from "lodash";
import Typing from "./Typing";
import Lightbox from 'react-image-lightbox';
import { Button, Grid, InputOnChangeData, Transition } from "semantic-ui-react";
import { emojify } from "node-emoji"; 
import 'react-image-lightbox/style.css';
import { MessageData } from "../types";
import '../styles/message-list.css'

export interface Props {
  messageDatas: MessageData[],
  quickResponses: string[],
  conversationStarted: boolean,
  waitingForBot: boolean,
  startConversation: () => void
  onSendMessage: (messageContent: string) => void
  onReset: () => void
  onWaitingForBotChange: (waitingForBot: boolean) => void
}

export interface State {
  pendingMessage: string,
  triggerButtonAnimation: boolean,
  messageDatas: MessageData[]
  imageOpen: boolean,
  clickedImageUrl?: string
}

class MessageList extends React.Component<Props, State> {

  private messagesEnd: any;

  constructor(props: Props) {
    super(props);
    this.state = { 
      pendingMessage: "",
      triggerButtonAnimation: true,
      messageDatas: [],
      imageOpen: false
    };
  }

  addNewMessage = (content: string) => {
    if (this.props.waitingForBot) {
      return;
    }

    const messageDatas = this.state.messageDatas;
    messageDatas.push({
      id: "temp-message",
      content: content,
      isBot: false
    });

    this.props.onWaitingForBotChange(true);

    this.setState({
      pendingMessage: "",
      messageDatas: messageDatas
    });

    setTimeout(() => {
      messageDatas.push({
        id: "temp-response",
        content: "",
        isBot: true
      });
  
      this.setState({
        messageDatas: messageDatas
      });
  
      this.props.onSendMessage(content);
    }, 200);

  }

  onSendButtonClick = () => {
    if (!this.state.pendingMessage) {
      return;
    }

    this.addNewMessage(this.state.pendingMessage);
  }

  sendQuickReply = (reply: string) => {
    this.addNewMessage(reply);
  }
  
  scrollToBottom = () => {
    if (!this.messagesEnd) {
      return;
    }

    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.onSendButtonClick();
    }
  }

  handleResponseClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.nodeName == "IMG") {
      const src = target.getAttribute("src");
      if (src) {
        this.setState({
          clickedImageUrl: src,
          imageOpen: true
        })
      }
    }
  }

  componentDidMount = () => {
    if (!this.props.conversationStarted) {
      this.props.startConversation();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.messageDatas) !== JSON.stringify(this.props.messageDatas)) {
      this.setState({
        messageDatas: this.props.messageDatas
      });
    }

    this.scrollToBottom();
  }

  onPendingMessageChange = (e: any, data: InputOnChangeData) => {
    this.setState({
      pendingMessage: data.value as string
    });
  }

  public render() {

    const messageItems = this.state.messageDatas.map((messageData, index) => {
      if (messageData.isBot) {
        return (
          <Grid.Row style={{paddingTop: "3px", paddingBottom: "3px"}} key={messageData.id} verticalAlign="middle" textAlign="left" columns="equal">
            <Grid.Column className="bot-response-container" onClick={this.handleResponseClick} style={{paddingLeft: "0", color: "#fff"}}>
              { messageData.content ? 
              <Transition transitionOnMount={true} visible={true} animation="pulse" duration={200}>
                <div className="bot-response" dangerouslySetInnerHTML={{__html: emojify(messageData.content) }} />
              </Transition> : <Transition transitionOnMount={true} visible={true} animation="pulse" duration={100}>
                <div className="bot-typing">
                  <Typing/>
                </div>
                </Transition>
              }
            </Grid.Column>
            <Grid.Column mobile={2} width={4} floated="right" />
          </Grid.Row>
        );
      } else {
        return(
          <Grid.Row style={{paddingTop: "25px", paddingBottom: "25px"}} key={messageData.id} verticalAlign="middle" textAlign="right" columns="equal">
            <Grid.Column mobile={2} width={4} floated="left" />
            <Grid.Column className="user-message-container" floated="right">
            { messageData.content !== "INIT" ? (<div className="user-message" dangerouslySetInnerHTML={{__html: messageData.content}} />) : ""}
            </Grid.Column>
          </Grid.Row>
        )
      }
    });

    const quickReplyItems = this.props.quickResponses.map((quickReply: string) => {
      return (
        <Button disabled={this.props.waitingForBot} className="quick-reply-item" key={quickReply} onClick={() => {this.sendQuickReply(quickReply)}} >{quickReply}</Button>
      )
    });

    return (
      <div className="message-list-container">
        {this.state.imageOpen && <Lightbox mainSrc={this.state.clickedImageUrl || ""} onCloseRequest={() => this.setState({ imageOpen: false })} />}
          <div className="message-list">
            <div>
              <Grid style={{width: "100%"}}>
                {messageItems}
              </Grid>
            </div>
            { this.props.quickResponses.length > 0 && !this.props.waitingForBot &&
              <div className="quick-reply-items">
                { quickReplyItems }
              </div>
            }
          </div>
        <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }
}

export default MessageList;