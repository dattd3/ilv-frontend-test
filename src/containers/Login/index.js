import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Amplify, { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import config from '../../commons/aws-config';
import logo from '../../assets/img/logo-vp-vt.png';
import '../app.css';

function Login() {
  const { t } = useTranslation();

  const handleLoginClick = () => {
    const authConfig = Auth.configure();
    const {
        domain,
        redirectSignIn,
        redirectSignOut,
        responseType } = authConfig.oauth;

    const clientId = config.AWS_COGNITO_CLIENT_ID;
    const url = `https://${domain}/oauth2/authorize?identity_provider=${config.AWS_COGNITO_IDP_NAME}&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;

    console.log('Signin.signIn() sign url: ', url);
    window.location.assign(url);
  }

  return (
      <Container>
        <Row className="justify-content-center">
          <Col className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <img src={logo} className="logo-login" />
                      </div>
                      <a href="#" className="btn btn-primary btn-user btn-block btn-login" onClick={handleLoginClick}>
                        Login with your Ad Account
                      </a>
                      <div className="text-center">
                        <a className="small" href="register.html">Help to login</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
}
export default Login;