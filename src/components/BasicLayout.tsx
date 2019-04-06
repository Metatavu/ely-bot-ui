import * as React from "react";

import 'semantic-ui-css/semantic.min.css';

import { Container } from "semantic-ui-react";
import logo from "../gfx/ahertava_logo.png";
import ahertaja from "../gfx/ahertaja.png";
import MenuContainer from "./MenuContainer";

class BasicLayout extends React.Component {
  render() {
    return (
      <div>
        <img style={{maxWidth: "70%", position: "fixed", bottom: "75px", left: "0"}} src={ahertaja} />
        <MenuContainer siteLogo={logo} />
          <Container style={{ marginTop: "7em", paddingBottom: "7em" }}>
            {this.props.children}
          </Container>
      </div>
    );
  }
}

export default BasicLayout;