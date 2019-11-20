import React, { useState } from "react";
import NestedRoute from "./NestedRoute";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';
import { useGuardStore } from '../../modules';

function MainLayout(props) {
  const [show, SetShow] = useState(true);
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  
  const setShow = (show) => {
    SetShow(show);
  }

  return (
    <>
      <SideBar show={show} />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header user={user} setShow={setShow} />
          <div className="container-fluid" id='main-content'>
            <NestedRoute routes={props.routes} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default observer(MainLayout);