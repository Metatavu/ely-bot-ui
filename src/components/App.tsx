import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import "../styles/index.css";

/**
 * App component
 */
class App extends React.Component {

  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={WelcomePage} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;