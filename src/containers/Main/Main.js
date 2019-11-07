import React, { useEffect, useState } from "react";
import NestedRoute from "./NestedRoute";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';
import { useGuardStore } from '../../modules';
import { useLocalizeStore } from '../../modules';

function MainLayout(props) {
  const guard = useGuardStore();
  const localizeStore = useLocalizeStore();
  const [show, SetShow] = useState(true);

  const setShow = (show) => {
    SetShow(show);
  }

  useEffect(() => {
    localizeStore.load();
  });

  let user = guard.getCurentUser();
  return (
    <>
      <SideBar show={show} />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header user={user} setShow={setShow} />
          <div className="container-fluid">
            <NestedRoute routes={props.routes} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default observer(MainLayout);