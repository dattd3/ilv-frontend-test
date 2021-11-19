import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { Auth } from 'aws-amplify';
import config from '../../commons/aws-config';
import logo from '../../assets/img/LogoVingroup.svg';
import { useLocalizeStore } from '../../modules';
import Constants from "../../commons/Constants";

function LoginGuideModal(props) {
  const { t } = useTranslation();
  

  return (
    <Modal
      {...props}
      className="login-instructions-modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <h5>{t("LoginGuide_Title")}</h5>
        <p>{t("LoginGuide_Description")}</p>
        <p className="guide-account">+ <strong>{t("Username")}:</strong> {t("LoginGuide_UserName")}</p>
        <p className="guide-password">+ <strong>{t("Password")}:</strong> {t("LoginGuide_Password")}</p>
        <p>- {t("LoginGuide_Note")} </p>
        <p>- {t("LoginGuideNoteSecond")} <a href={Constants.LOGIN_INSTRUCTION_PATH} title="File" target="_blank" className="here">{t("Here")}</a></p>
      </Modal.Body>
    </Modal>
  );
}

function Login() {
  const localizeStore = useLocalizeStore();
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [langCode, setLangCode] = useState(localStorage.getItem("locale"));

  useEffect(() => { 
    localizeStore.setLocale(langCode || "vi-VN") 
  }, [langCode, localizeStore]);

  const handleLoginClick = () => {
    const authConfig = Auth.configure();
    const { domain, redirectSignIn, responseType } = authConfig.oauth;
    const clientId = config.AWS_COGNITO_CLIENT_ID;
    const url = `https://${domain}/oauth2/authorize?identity_provider=${config.AWS_COGNITO_IDP_NAME}&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;
    window.location.assign(url);
  }

  return (
    <Container className="login-page">
      <Row className="justify-content-center">
        <Col className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-10">
            <div className="card-body p-0">
              <div className="row bg-login-image" >
                <div className="col-lg-6 d-none d-lg-block"></div>
                <div className="col-lg-6 bg-white-trasparent">
                <div className="opacity-1">
                  <div className="float-right language-selector">
                    <Button className={langCode === 'vi-VN' ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode('vi-VN')}>{t("LangViet")}</Button>|
                    <Button className={langCode === 'en-US' ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode('en-US')}>{t("LangEng")}</Button>
                  </div>
                  <div className="p-5">
                    <div className="text-center">
                      <img src={logo} className="logo-login" alt='' />
                    </div>
                    <Button className="btn-user btn-block btn-login" variant="primary" onClick={handleLoginClick}> {t("Login")}</Button>
                    <div className="text-center login-guide">
                      <Button className="small color-C11D2A" variant="link" onClick={() => setModalShow(true)}>{t("HelpToLogin")}</Button>
                    </div>
                  </div>
                </div>
                </div>
                
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <LoginGuideModal show={modalShow} onHide={() => setModalShow(false)}
      />
    </Container>
  );
}
export default Login;