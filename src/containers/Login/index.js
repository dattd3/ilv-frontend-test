import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { Auth } from 'aws-amplify';
import config from '../../commons/aws-config';
import logo from '../../assets/img/logo-vp-vt.png';
import { useLocalizeStore } from '../../modules';

function LoginGuideModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <h4>Hướng dẫn đăng nhập:</h4>
        <p>Bạn vui lòng chọn "Tiếp theo" sau đó nhập thông tin tên đăng nhập và mật khẩu để truy cập website.</p>
        <ul>
          <li><strong>Tên đăng nhập:</strong> sử dụng account AD</li>
          <li><strong>Mật khẩu:</strong> sử dụng mật khẩu account AD</li>
        </ul>
        <p>Trường hợp không rõ Account AD của mình hoặc không đăng nhập được, vui lòng liên hệ bộ phận IT của đơn vị để kiểm tra. </p>
      </Modal.Body>
    </Modal>
  );
}

function Login() {
  const localizeStore = useLocalizeStore();
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [langCode, setLangCode] = useState('vi');


  useEffect(() => {
    localizeStore.setLocale(langCode);
  }, [langCode]);

  const handleLoginClick = () => {
    const authConfig = Auth.configure();
    const {
      domain,
      redirectSignIn,
      redirectSignOut,
      responseType } = authConfig.oauth;

    const clientId = config.AWS_COGNITO_CLIENT_ID;
    const url = `https://${domain}/oauth2/authorize?identity_provider=${config.AWS_COGNITO_IDP_NAME}&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;
    window.location.assign(url);
  }
 
  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-10">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div className="col-lg-6">
                  <div className="float-right language-selector">
                    <Button className={langCode == 'vi' ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode('vi')}>{t("LangViet")}</Button>|
                    <Button className={langCode == 'en' ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode('en')}>{t("LangEng")}</Button>
                  </div>
                  <div className="p-5">
                    <div className="text-center">
                      <img src={logo} className="logo-login" />
                    </div>
                    <Button className="btn-user btn-block btn-login" variant="primary" onClick={handleLoginClick}> {t("Login")}</Button>
                    <div className="text-center login-guide">
                      <Button className="small" variant="link" onClick={() => setModalShow(true)}>{t("HelpToLogin")}</Button>
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