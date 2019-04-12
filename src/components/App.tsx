import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import "../styles/index.css";
import AuthRefresh from "./AuthRefresh";

/**
 * App component
 */
class App extends React.Component {

  public render() {
    return (
      <BrowserRouter>
        <AuthRefresh>
          <div className="App">
            <Route exact path="/" component={WelcomePage} />
          </div>
        </AuthRefresh>
      </BrowserRouter>
    );
  }
}

export default App;