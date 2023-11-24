import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { Root } from "./containers";
import * as serviceWorker from "./serviceWorker";
import store from "store/index";
import './assets/scss/sb-admin-2.scss';
import './app.scss';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Root />
        </Provider>
    </BrowserRouter>
, document.getElementById("wrapper"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();