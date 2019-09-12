import React, { Suspense, useEffect } from "react";
import clsx from "clsx";
import NestedRoute from "./NestedRoute";
import {
  GuardianComponent,
  useApi,
  useFetcher,
  useGuardStore
} from "../../modules";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';

const usePreload = () => {
  const api = useApi();
  const [user = '', error] = useFetcher({
    api: api.fetchUser,
    autoRun: true
  });
 
  return user;
};

function MainLayout(props) {
  const user = usePreload();

  return (
    <>
      <SideBar />
      <div id="content-wrapper" className="d-flex flex-column">
        <Header />
        <div className="container-fluid">
          <NestedRoute routes={props.routes} />
        </div>
      </div>
    </>
  );
}

export default observer(MainLayout);