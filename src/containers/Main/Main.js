import React from "react";
import NestedRoute from "./NestedRoute";
import {
  useApi,
  useFetcher
} from "../../modules";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';

const usePreload = () => {
  const api = useApi();
  const [user = {}, err] = useFetcher({
    api: api.fetchUser,
    autoRun: true
  });
  console.log(err);
  return user;
};

function MainLayout(props) {
  const user = usePreload();
  return (
    <>
      <SideBar />
      <div id="content-wrapper" className="d-flex flex-column">
        <Header user={user} />
        <div className="container-fluid">
          <NestedRoute routes={props.routes} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default observer(MainLayout);