import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { fetchToken, onMessageListener } from './firebase';
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import Maintenance from "../Maintenance";
import ContextProviders from "./providers";
import config from '../../commons/aws-config';
import '../../assets/scss/sb-admin-2.scss';
import LoadingModal from '../../components/Common/LoadingModal';
import {Button, Toast} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const listUsersIgnoreMaintenanceMode = ['cuongnv56@vingroup.net', 'minhtd6@vingroup.net', 'GiangLH21@vingroup.net', 'vuongvt2@vingroup.net', 'thuypx2@vingroup.net', 'chiennd4@vingroup.net', 'datth3@vingroup.net', 'khanhnn17@vingroup.net']
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
  const [show, setShow] = React.useState(false);
  const [notification, setNotification] = React.useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = React.useState(false);

  fetchToken(setTokenFound);

  onMessageListener().then(payload => {
    setNotification({title: payload.notification.title, body: payload.notification.body})
    setShow(true);
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    setNotification({title: "Notification", body: "This is a test notification"})
    setShow(true);
  }

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
        {/* } */}
      </BrowserRouter>
    </ContextProviders>
    
    <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide animation style={{
      position: 'absolute',
      top: 20,
      right: 20,
      minWidth: 200
    }}>
      <Toast.Header>
        <img
          src="holder.js/20x20?text=%20"
          className="rounded mr-2"
          alt=""
        />
        <strong className="mr-auto">{notification.title}</strong>
        <small>just now</small>
      </Toast.Header>
      <Toast.Body>{notification.body}</Toast.Body>
    </Toast>
    <header className="App-header">
      {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
      {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
      <Button onClick={() => onShowNotificationClicked()}>Show Toast</Button>
    </header>
    </>
  );
}

export default Root;
