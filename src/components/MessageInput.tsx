import * as React from "react";
import * as _ from "lodash";
import { Button, Grid, Input, InputOnChangeData, Container, Popup, ButtonProps } from "semantic-ui-react";

import 'react-image-lightbox/style.css';
import '../styles/message-input.css'

/**
 * Component props
 */
interface Props {
  conversationStarted: boolean,
  waitingForBot: boolean,
  hint: string,
  globalQuickResponses: string[],
  onSendMessage: (messageContent: string) => void,
  onReset: () => void,
  onRestartConversation: () => void
}

/**
 * Component state
 */
interface State {
  pendingMessage: string
  globalQuickResponsesMenuOpen: boolean
}

/**
 * MessageInput component
 */
class MessageInput extends React.Component<Props, State> {

  private windownMousedownListener: () => void;
  private messagesEnd: any;

  /**
   * Constructor
   * 
   * @param props component props 
   */
  constructor(props: Props) {
    super(props);
    this.state = { 
      pendingMessage: "",
      globalQuickResponsesMenuOpen: false
    };

    this.windownMousedownListener = this.onWindowMousedown.bind(this);
  }

  /**
   * Component did mount life-cycle event
   */
  public componentDidMount() {
    window.addEventListener('mousedown', this.windownMousedownListener);
  }
  
  /**
   * Component will unmount life-cycle event
   */
  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.windownMousedownListener);
  }

  /**
   * Component render method
   */
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
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column>
                  { this.renderGlobalQuickResponses() }
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column>
                  <a className="powered-by" target="_blank" href="https://www.metamind.fi">
                    Powered by Metamind - a chatbot from Metatavu&nbsp;Oy
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
    
    if (window.innerWidth > 768) {
      return this.renderGlobalQuickResponseButtons();
    }

    return (
      <Popup trigger={<Button className="global-quick-responses-open" content="Pikavalinnat" onClick={ this.onGlobalQuickResponsePopupLinkClick }/> }
        content={ this.renderGlobalQuickResponseButtons() }
        on='click'        
        position='top right'
        open={ this.state.globalQuickResponsesMenuOpen }
      />
    );
  }

  /**
   * Renders global quick reponse buttons
   */
  private renderGlobalQuickResponseButtons() {
    return (
      <div className="global-quick-responses">
        { this.props.globalQuickResponses.map((globalQuickResponse) => {
          return <Button className="global-quick-response" onClick={() => this.onGlobalQuickResponseClick(globalQuickResponse)}>{ globalQuickResponse }</Button>  
      }) }
    </div>)
  }
  
  private scrollToBottom = () => {
    if (!this.messagesEnd) {
      return;
    }

    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  /**
   * Event handler for window mouse down event
   */
  private onWindowMousedown = () => {
    this.setState({
      globalQuickResponsesMenuOpen: false
    });
  }

  /**
   * Event handler for global quick response popup open button click
   */
  private onGlobalQuickResponsePopupLinkClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
    event.preventDefault();
    this.setState({ globalQuickResponsesMenuOpen: true });    
  }

  /**
   * Event handler for global quick response button click
   */
  private onGlobalQuickResponseClick = (globalQuickResponse: string) => {
    this.setState({
      globalQuickResponsesMenuOpen: false
    });

    this.props.onSendMessage(globalQuickResponse);
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