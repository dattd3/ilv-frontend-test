import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import Maintenance from "../Maintenance";
import ContextProviders from "./providers";
import Amplify from 'aws-amplify';
import AWS from 'aws-sdk';
import config from '../../commons/aws-config';
import '../../assets/scss/sb-admin-2.scss';
import LoadingModal from '../../components/Common/LoadingModal';

function Root() {
  // AWS SDK & AWS Amplity Configuration
  AWS.config.region = config.AWS_REGION;
  Amplify.configure({
    Auth: {
      identityPoolId: config.AWS_COGNITO_IDENTITY_POOL_ID,
      region: config.AWS_REGION,
      userPoolId: config.AWS_COGNITO_USER_POOL_ID,
      userPoolWebClientId: config.AWS_COGNITO_CLIENT_ID,
      oauth: {
        domain: config.AWS_COGNITO_CLIENT_DOMAIN_NAME,
        scope: config.AWS_COGNITO_IDP_OAUTH_CLAIMS,
        redirectSignIn: config.AWS_COGNITO_IDP_SIGNIN_URL,
        redirectSignOut: config.AWS_COGNITO_IDP_SIGNOUT_URL,
        responseType: config.AWS_COGNITO_IDP_GRANT_FLOW
      }
    }
  }); 

  return (
    <ContextProviders>
      <BrowserRouter>
      {/* <Maintenance/> */}
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
      </BrowserRouter>
    </ContextProviders>
  );
}

export default Root;
