import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from "react-toastify";
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import Maintenance from "../Maintenance";
import ContextProviders from "./providers";
import '../../assets/scss/sb-admin-2.scss';
import LoadingModal from '../../components/Common/LoadingModal';
import 'react-toastify/dist/ReactToastify.min.css';

const listUsersIgnoreMaintenanceMode = ['cuongnv56@vingroup.net', 'vuongvt2@vingroup.net', 'thuypx2@vingroup.net', 'chiennd4@vingroup.net', 'datth3@vingroup.net']
const currentUserLogged = localStorage.getItem('email')

function Root() {
  return (
    // <CookiesProvider>
      <ContextProviders>
        <BrowserRouter>
          {/* { !listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && <Maintenance /> } */}
          {/* { listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && */}
          <>
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          <Switch>
            {routes.map(
              ({ component: Content, key, routeProps, contentProps }) => (
                <Route
                  key={key}
                  {...routeProps}
                  render={props => (
                    <GuardianRouter {...props} settings={RouteSettings}>
                      {childProps => (
                        <Suspense fallback={<LoadingModal show={true} />}>
                          <Content {...contentProps} {...childProps} />
                        </Suspense>
                      )}
                    </GuardianRouter>
                  )}
                />
              )
            )}
          </Switch>
          </>
          {/* } */}
        </BrowserRouter>
      </ContextProviders>
    // </CookiesProvider>
  );
}

export default Root;
