import React, { useState } from "react";
import NestedRoute from "./NestedRoute";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';
import { useGuardStore } from '../../modules';
import ScrollToTop from '../../components/Common/ScrollToTop';
import map from "../map.config";


function MainLayout(props) {
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  const { history } = props;
  const [show, SetShow] = useState(true);
  const [isHideSidebar, SetIsHideSidebar] = useState(false);

  const setShow = (show) => {
    SetShow(show);
  }

  const searchParams = new URLSearchParams(props.location.search);
  const isApp = searchParams.get('isApp') || false;
  
  if (props.location.pathname.indexOf("training") > 0 && localStorage.getItem("companyCode") !== "V030") {
    history.push(map.NotFound);
  }

  const isDashBoard = props.location.pathname === '/';

  const updateLayout = (isHideSidebar) => {
    SetIsHideSidebar(isHideSidebar)
  }

  return (
    <>
      <SideBar show={show} user={user} />
      <div id="content-wrapper" className={`d-flex flex-column ${isHideSidebar ? 'w-100' : ''}`}>
        <div id="content">
          <Header user={user} setShow={setShow} isApp={isApp} updateLayout={updateLayout} />
          <div className={`${isDashBoard === true ? "" : "container-fluid"}`} id='main-content'>
            <NestedRoute routes={props.routes} />
          </div>
          <ScrollToTop />
        </div>
        {isDashBoard !== true &&
          <div className="footer-dash-board">
            <Footer />
          </div>
        }
      </div>
    </>
  );
}

export default observer(MainLayout);
