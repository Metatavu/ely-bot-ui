import * as React from "react";
import * as _ from "lodash";
import Typing from "./Typing";
import Lightbox from 'react-image-lightbox';
import {
  Button,
  Grid,
  Segment,
  Input,
  InputOnChangeData,
  Container,
  Icon,
  Popup,
} from "semantic-ui-react";

import 'react-image-lightbox/style.css';
import { Message } from "metamind-client";

export interface Props {
  messages: Message[],
  conversationStarted: boolean
  startConversation: () => void
  onSendMessage: (messageContent: string) => void
  onReset: () => void
}

export interface MessageData {
  id: string,
  isBot: boolean,
  content: string
}

export interface State {
  pendingMessage: string,
  triggerButtonAnimation: boolean,
  messageDatas: MessageData[]
  waitingForBot: boolean
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
      waitingForBot: false,
      imageOpen: false
    };
  }

  addNewMessage = (content: string) => {
    if (this.state.waitingForBot) {
      return;
    }

    const messageDatas = this.state.messageDatas;
    messageDatas.push({
      id: "temp-message",
      content: content,
      isBot: false
    });
    this.setState({
      waitingForBot: true,
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

  getLatestMessage = (): Message | undefined => {
    if (this.props.messages.length < 1) {
      return undefined;
    }

    return this.props.messages[this.props.messages.length - 1];
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

  private updateMessageDatas = async () => {
    const messageDatas: MessageData[] = [];

    this.props.messages.forEach((message) => {
      messageDatas.push({
        id: `${message.id}-message`,
        isBot: false,
        content: message.content || ""
      });

      if (message.response) {
        message.response.forEach((response, index) => {
          messageDatas.push({
            id: `${message.id}-response-${index}`,
            isBot: true,
            content: response
          });    
        });
      }
    });

    this.setState({
      messageDatas: messageDatas
    });
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

    if (prevProps.messages.length < this.props.messages.length) {
      this.updateMessageDatas();
      this.setState({
        waitingForBot: false
      });
    }

    this.scrollToBottom();
  }

  onPendingMessageChange = (e: any, data: InputOnChangeData) => {
    this.setState({
      pendingMessage: data.value as string
    });
  }

  render() {

    const messageItems = this.state.messageDatas.map((messageData) => {
      if (messageData.isBot) {
        return (
          <Grid.Row key={messageData.id} verticalAlign="middle" textAlign="left" columns="equal">
            <Grid.Column className="bot-response-container" onClick={this.handleResponseClick} floated="left" style={{paddingLeft: "0", color: "#fff"}}>
              { messageData.content ? 
              <div 
                style={{
                  marginLeft: "10px",
                  borderRadius: "10px",
                  background: "#6eca09",
                  display: "inline-block", 
                  fontSize: "16px", 
                  padding: "18px"
                }}
                dangerouslySetInnerHTML={{__html: messageData.content}}
              /> : <div 
                style={{
                  marginLeft: "10px",
                  borderRadius: "10px",
                  background: "#6eca09",
                  display: "inline-block", 
                  fontSize: "16px", 
                  padding: "18px"
                }}> 
                  <Typing/>
                </div>
              }
            </Grid.Column>
            <Grid.Column mobile={2} width={4} floated="right" />
          </Grid.Row>
        );
      } else {
        return(
          <Grid.Row key={messageData.id} verticalAlign="middle" textAlign="right" columns="equal">
            <Grid.Column mobile={2} width={4} floated="left" />
            <Grid.Column style={{paddingRight: "45px", color: "#fff"}} floated="right">
            { messageData.content !== "INIT" ? (
              <div 
                style={{
                  borderRadius: "10px", 
                  background: "#e0e1e2",
                  color: "rgba(0,0,0,.6)",
                  display: "inline-block", 
                  fontSize: "16px", 
                  padding: "18px"
                }} 
                dangerouslySetInnerHTML={{__html: messageData.content}}
                />

            ) : ""}
            </Grid.Column>
          </Grid.Row>
        )
      }
    });

    const latestMessage = this.getLatestMessage();
    const quickReplies = latestMessage && latestMessage.quickResponses ? latestMessage.quickResponses : [];
    const quickReplyItems = quickReplies.map((quickReply: string) => {
      return (
        <Button disabled={this.state.waitingForBot} style={{marginTop: "5px"}} key={quickReply} size="mini" floated="left" compact onClick={() => {this.sendQuickReply(quickReply)}} >{quickReply}</Button>
      )
    });

    return (
      <div>
        {this.state.imageOpen && <Lightbox mainSrc={this.state.clickedImageUrl || ""} onCloseRequest={() => this.setState({ imageOpen: false })} />}
          <div style={{paddingTop: "100px"}}>
            <div style={{maxWidth: "600px", paddingBottom: "0"}}>
              <Grid>
                {messageItems}
              </Grid>
            </div>
            { quickReplies.length > 0 && !this.state.waitingForBot &&
              <div style={{paddingBottom: "5px", position: "fixed", left: "10px", bottom: "79px"}}>
                {quickReplyItems}
              </div>
            }
            <Segment loading={!this.props.conversationStarted} inverted style={{position: "fixed", bottom: "0", left: "0", right: "0"}}>
              <Container>
                <Grid>
                  <Grid.Row verticalAlign="middle" columns="equal">
                    <Grid.Column style={{paddingLeft: "0"}} width={1}>
                      <Popup
                        trigger={<Icon style={{color: "#fff"}} name="ellipsis vertical" />}
                        content={<Button style={{background: "#6eca09", color: "#fff"}} onClick={this.props.onReset}>Aloita alusta</Button>}
                        on='click'
                        position='top center'
                      />
                    </Grid.Column>
                    <Grid.Column style={{paddingRight: "15px"}}>
                      <Input
                        placeholder={latestMessage && latestMessage.hint || "Say something..."}
                        value={this.state.pendingMessage}
                        onChange={this.onPendingMessageChange}
                        onKeyPress={this.handleInputKeyPress}
                        onFocus={() => {setTimeout(this.scrollToBottom, 300)}}
                        fluid 
                        inverted />
                    </Grid.Column>
                    <Grid.Column style={{paddingLeft: "0"}} textAlign="left" mobile={3} computer={2} width={2}>
                      <Button style={{background: "#6eca09", color: "#fff"}} disabled={this.state.waitingForBot} onClick={this.onSendButtonClick} size="huge" icon="send" circular></Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Segment>
          </div>
        <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }
}

export default MessageList;