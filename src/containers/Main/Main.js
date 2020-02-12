import React, { useState } from "react";
import NestedRoute from "./NestedRoute";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';
import { useGuardStore } from '../../modules';
import map from "../map.config";
import { useTranslation } from "react-i18next";


function MainLayout(props) {
  const [show, SetShow] = useState(true);
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  const { t } = useTranslation();

  const setShow = (show) => {
    SetShow(show);
  }

  const searchParams = new URLSearchParams(props.location.search);
  const isApp = searchParams.get('isApp') || false;

  // if (props.location.pathname.indexOf("training") < 0 || props.location.pathname.indexOf("news") < 0) {
  //   const { history } = props;
  //   let is404 = props.routes.filter(r => r.routeProps.path === props.location.pathname).length <= 0;
  //   if (is404) {
  //     history.push(map.NotFound);
  //   }
  // }

  if (user.sabaId && user.sabaId !== undefined && user.sabaId !== '') {
    return (
      <>
        <SideBar show={show} />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header user={user} setShow={setShow} isApp={isApp} />
            <div className="container-fluid" id='main-content'>
              <NestedRoute routes={props.routes} />
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  } else {
    return (
      <>
        <SideBar show={show} />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header user={user} setShow={setShow} isApp={isApp} />
            <div className="container-fluid" id='main-content'>
              {t("NotConnectToSaba")}
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}

export default observer(MainLayout);
