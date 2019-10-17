import React from "react";
import NestedRoute from "./NestedRoute"; 
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';
import { useGuardStore } from '../../modules';

function MainLayout(props) {
  
  const guard = useGuardStore();
  let user = guard.getCurentUser();

  return (
    <>
      <SideBar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header user={user} />
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