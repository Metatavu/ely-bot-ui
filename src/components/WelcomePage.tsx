import * as React from "react";

import BasicLayout from "./BasicLayout";
import Bot from "./Bot";

class WelcomePage extends React.Component<any, any> {

  render() {
    return (
      <BasicLayout>
        <Bot storyId="3989e9f1-339b-43aa-a147-71e829973ad5" locale="fi" timeZone="Europe/Helsinki" visitor="From outerspace"/>
      </BasicLayout>
    );
  }
}

export default WelcomePage;