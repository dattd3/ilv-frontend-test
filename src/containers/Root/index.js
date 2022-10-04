import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import Maintenance from "../Maintenance";
import ContextProviders from "./providers";
import config from '../../commons/aws-config';
import '../../assets/scss/sb-admin-2.scss';
import LoadingModal from '../../components/Common/LoadingModal';

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

  return (
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
  );
}

export default Root;
