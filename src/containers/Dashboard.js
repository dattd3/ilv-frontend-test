import React, { useState } from "react";
import logo from "../assets/img/logo.svg";
import { useApi, useFetcher, useGuardStore } from "../modules";
import { GuardianComponent } from "../modules";
import { Link as RouterLink } from "react-router-dom";
import map from "./map.config";

function Home(props) {
  const [counter, setCounter] = useState(1);
  const [param, setParam] = useState(23);

  const api = useApi();
  const [data, , request] = useFetcher({
    api: api.fetchDemo,
    autoRun: true,
    params: [param, 20]
  });

  const guard = useGuardStore();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {data}
        </a>
        <p>{counter}</p>
        <button onClick={() => setCounter(counter + 1)}>counter</button>
        <button onClick={() => setParam(param + 1)}>update param</button>
        <button onClick={() => request(param, 22)}>force reload</button>
        <GuardianComponent activity={"ChangeUser"}>
          you should see mee
        </GuardianComponent>
        <button
          onClick={() => {
            guard.setActivity("ChangeUser", false);
          }}
        >
          Set change user to false
        </button>
      </header>
    </div>
  );
}

export default Home;
