import * as React from "react";

import BasicLayout from "./BasicLayout";
import Bot from "./Bot";

class WelcomePage extends React.Component<any, any> {

  render() {
    return (
      <BasicLayout>
        <Bot storyId="fe7f8564-080d-423d-b21a-01f9fba3a94d" locale="fi" timeZone="Europe/Helsinki" visitor="From outerspace"/>
      </BasicLayout>
    );
  }
}

export default WelcomePage;