import * as React from "react";

import 'semantic-ui-css/semantic.min.css';

import { Container } from "semantic-ui-react";
import logo from "../gfx/ELY_LN04_nega___FI_B___NEGA.png";
import MenuContainer from "./MenuContainer";

class BasicLayout extends React.Component {
  render() {
    return (
      <div>
        <MenuContainer siteLogo={logo} />
          <Container>
            {this.props.children}
          </Container>
      </div>
    );
  }
}

export default BasicLayout;