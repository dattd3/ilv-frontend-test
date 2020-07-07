import React from "react";
import ReactDOM from "react-dom";
import { Root } from "./containers";
import * as serviceWorker from "./serviceWorker";
import './assets/scss/sb-admin-2.scss';
import './app.scss';
import './assets/scss/timesheet.scss'

ReactDOM.render(<Root />, document.getElementById("wrapper"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();