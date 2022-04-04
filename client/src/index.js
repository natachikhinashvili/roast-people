import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from 'react-redux';
import gettoken from './token'
ReactDOM.render(
  <BrowserRouter>
    <Provider store={gettoken}>
    <App />
    </Provider>
  </BrowserRouter>, 
  document.getElementById("root")
);