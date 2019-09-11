import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SideBar from '../../components/Common/sidebar';
import Header from '../../components/Common/header';
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import ContextProviders from "./providers";
import Amplify from 'aws-amplify';
import AWS from 'aws-sdk';
import config from '../../commons/aws-config';
import '../../assets/css/sb-admin-2.css';

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
        <Switch> 
          {routes.map(
            ({ component: Content, key, routeProps, contentProps }) => (
              <Route
                key={key}
                {...routeProps}
                render={props => (
                  <GuardianRouter {...props} settings={RouteSettings}>
                    {childProps => (
                      <Suspense fallback={"loading..."}>
                        <SideBar />
                        <div id="content-wrapper" className="d-flex flex-column">
                          <Header />
                          <div className="container-fluid">
                            <Content {...contentProps} {...childProps} />
                          </div>
                        </div>
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
