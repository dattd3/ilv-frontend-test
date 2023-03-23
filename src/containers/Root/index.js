import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { CookiesProvider } from 'react-cookie';
import { FirebaseMessageListener } from '../../commons/Firebase';
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import Maintenance from "../Maintenance";
import ContextProviders from "./providers";
import '../../assets/scss/sb-admin-2.scss';
import LoadingModal from '../../components/Common/LoadingModal';
import {Toast} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const listUsersIgnoreMaintenanceMode = ['cuongnv56@vingroup.net', 'vuongvt2@vingroup.net', 'thuypx2@vingroup.net', 'chiennd4@vingroup.net', 'datth3@vingroup.net']
const currentUserLogged = localStorage.getItem('email')

function Root() {
  // AWS SDK & AWS Amplity Configuration
  // AWS.config.region = config.AWS_REGION;
  // Amplify.configure({
  //   Auth: {
  //     identityPoolId: config.AWS_COGNITO_IDENTITY_POOL_ID,
  //     region: config.AWS_REGION,
  //     userPoolId: config.AWS_COGNITO_USER_POOL_ID,
  //     userPoolWebClientId: config.AWS_COGNITO_CLIENT_ID,
  //     oauth: {
  //       domain: config.AWS_COGNITO_CLIENT_DOMAIN_NAME,
  //       scope: config.AWS_COGNITO_IDP_OAUTH_CLAIMS,
  //       redirectSignIn: config.AWS_COGNITO_IDP_SIGNIN_URL,
  //       redirectSignOut: config.AWS_COGNITO_IDP_SIGNOUT_URL,
  //       responseType: config.AWS_COGNITO_IDP_GRANT_FLOW
  //     }
  //   }
  // });

  const [notification, setNotification] = React.useState({ isShow: false, title: 'Title click here title click here title click here', body: 'description click here description click here description click here description click here' });

  FirebaseMessageListener()
    .then((payload) => {
        setNotification({
        isShow: true,
        title: payload.notification.title,
        body: payload.notification.body,
      })
    })
    .catch((err) => console.log('receive message fail: ', err));

  return (
    <>
      <ContextProviders>
        <BrowserRouter>
          {/* { !listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && <Maintenance /> } */}

          {/* { listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && */}
          <Switch>
            {routes.map(
              ({ component: Content, key, routeProps, contentProps }) => (
                <Route
                  key={key}
                  {...routeProps}
                  render={(props) => (
                    <GuardianRouter {...props} settings={RouteSettings}>
                      {(childProps) => (
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
          {/* } */}
        </BrowserRouter>
      </ContextProviders>

      <Toast
        onClose={() => setNotification({ ...notification, isShow: false })}
        show={notification.isShow}
        delay={3000}
        autohide
        animation
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          minWidth: 300,
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">{notification.title}</strong>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
      <ToastContainer />
    </>
  );
}

export default Root;
