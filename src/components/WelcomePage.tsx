import * as React from "react";

import BasicLayout from "./BasicLayout";
import Bot from "./Bot";

class WelcomePage extends React.Component<any, any> {

  render() {
    return (
      <BasicLayout>
        <Bot storyId="bed51564-655b-46a5-82aa-4d6f8508a536" locale="fi" timeZone="Europe/Helsinki" visitor="From outerspace"/>
      </BasicLayout>
    );
  }
}

export default WelcomePage;