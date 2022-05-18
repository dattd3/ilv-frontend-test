import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Carousel } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { Auth } from 'aws-amplify';
import config from '../../commons/aws-config';
import logo from '../../assets/img/LogoVingroup.svg';
import imageIos from '../../assets/img/image_ios.svg';
import imageAndroid from '../../assets/img/image_android.svg';
import imageWeb from '../../assets/img/image_web.svg';
import ic_ios from '../../assets/img/icon/ic_ios.svg';
import ic_android from '../../assets/img/icon/ic_android.svg';
import qrAndroid from '../../assets/img/qr_android.svg';
import icVietnam from '../../assets/img/icon/ic_vietnam.svg';
import icEnglish from '../../assets/img/icon/ic_english.svg';
import qrIos from '../../assets/img/qr_ios.svg';
import { useLocalizeStore } from '../../modules';
import Constants from "../../commons/Constants";
import Select, { components } from 'react-select'

const CustomOption = ({ children, ...props }) => {
  console.log(props);
  return (<components.ValueContainer {...props}>
    <div style={{
      display: 'inline-block',
      textOverflow: 'ellipsis',
      /* width: 123px; */
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }}><div style={{ height: '1px', visibility: 'hidden' }} >{children}</div>
      {
        props?.selectProps?.value?.length > 0 ?
          <>
            <img src={props.selectProps.value[0].value == 'vi-VN' ? icVietnam : icEnglish} style={{ marginRight: '7px', width: '22px', height: '16px' }} />
            {props.selectProps.value[0].label}
          </>
          : ''
      }
    </div>
  </components.ValueContainer>)
};

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
  const langData = [
    { value: "vi-VN", label: t("LangViet") },
    { value: "en-US", label: t("LangEng") }
  ]

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#8c2332",
      color: "#FFFFFF",
      borderRadius: 0,
      borderColor: "#8c2332",
      boxShadow: state.isFocused ? null : null,
      cursor: "pointer",
      "&:hover": {
        borderColor: "#8c2332",
        color: "#FFFFFF"
      }
    }),
    indicatorSeparator: base => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: base => ({
      ...base,
      color: "#FFFFFF",
      "&:hover": {
        color: "#FFFFFF"
      }
    }),
    singleValue: base => ({
      ...base,
      color: "#FFFFFF",
    }),
    menu: (base, state) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0
    }),
    menuList: (base, state) => ({
      ...base,
      padding: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "#8c2332" : "#FFFFFF",
        color: isFocused ? "#FFFFFF" : "#8c2332",
        cursor: "pointer",
        "&:hover": {
          color: "#FFFFFF"
        }
      };
    }
  };

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

  const handleChangeSelectInputs = (e) => {
    setLangCode(e ? e.value : "vi-VN")
  }

  return (
    <Container className="login-page">
      <Row className="justify-content-center">
        <Col className="col-xl-12 col-lg-12 col-md-12">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row" >

                <div className="col-lg-5 bg-white-trasparent">
                  <div className="opacity-1">
                    <div className="float-right language-selector">
                      {/* <Button className={langCode === 'vi-VN' ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode('vi-VN')}>{t("LangViet")}</Button>|
                    <Button className={langCode === 'en-US' ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode('en-US')}>{t("LangEng")}</Button> */}

                      <Select options={langData} value={(langData || []).filter(l => l.value === langCode)}
                        onChange={handleChangeSelectInputs} className="input i_lang" name="i_lang"

                        components={{ ValueContainer: CustomOption, IndicatorSeparator: () => null }} />
                    </div>
                    <div className="p-5">
                      <div className="text-center w-100 d-flex justify-content-center">
                        <img src={logo} className="logo-login" alt='' />
                      </div>
                      <Button className="btn-user btn-block btn-login" variant="primary" onClick={handleLoginClick}> {t("Login")}</Button>
                      <Button className="btn-user btn-block btn-help-login" variant="primary" onClick={() => setModalShow(true)}> {t("HelpToLogin")}</Button>
                      <p className="select-title text-center" >{t('LoginGuideOS')}</p>

                      <div className="link-mobile">
                        <a style={{ flex: 1 }} href="https://apps.apple.com/app/ilovevingroup/id1617033050" target="_blank">
                          <div className="mobile-contain shadow-sm">
                            <img src={ic_ios} className='ic-mobile' />

                            <div className="mobile-title-contain" >
                              <span className="mobile-title">Available on the</span>
                              <span className="mobile-subtitle">App Store</span>
                            </div>
                          </div>
                        </a>
                        <div style={{ width: '20px' }}></div>
                        <a style={{ flex: 1 }} href="https://play.google.com/store/apps/details?id=com.vinpearl.myvinpearl.app&hl=en&gl=VN" target="_blank">
                          <div className="mobile-contain shadow-sm">
                            <img src={ic_android} className='ic-mobile' />
                            <div className="mobile-title-contain">
                              <span className="mobile-title">Available on the</span>
                              <span className="mobile-subtitle">Google Play</span>
                            </div>
                          </div>
                        </a>
                      </div>

                      {/* <div className="text-center login-guide">
                      <Button className="small color-C11D2A" variant="link" onClick={() => setModalShow(true)}>{t("HelpToLogin")}</Button>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-7 d-none d-lg-block">
                  <Carousel nextIcon={null} prevIcon={null}>
                    <Carousel.Item interval={1000}>
                      <div className="detail-contain">
                        <div className="version-contain">
                          <span className="version-web-subtitle">Welcome to </span>
                          <span className="version-web-title">ILOVEVINGROUP!</span>
                        </div>
                        <img
                          className="d-block"
                          src={imageWeb}
                          alt="First slide"
                        />
                        <span style={{ visibility: "hidden" }} className="scan-title">Quét mã QR Code để cài đặt ứng dụng</span>
                        <img style={{ visibility: "hidden" }} className="scan-image" src={qrAndroid} />
                      </div>

                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                      <div className="detail-contain">
                        <div className="version-contain">
                          {
                            langCode == 'vi-VN' ?
                              <>
                                <span className="version-subtitle">{t('LoginVersionOS')}</span>
                                <span className="version-title">iOS</span>
                              </>
                              :
                              <>
                                <span className="version-title">iOS</span>
                                <span className="version-subtitle">{t('LoginVersionOS')}</span>
                              </>
                          }

                        </div>
                        <img
                          className="d-block"
                          src={imageIos}
                          alt="First slide"
                        />
                        <span className="scan-title">{t('LoginGuideQr')}</span>
                        <img className="scan-image" src={qrIos} />
                      </div>
                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                      <div className="detail-contain">
                        <div className="version-contain">
                          {
                            langCode == 'vi-VN'
                              ?
                              <>
                                <span className="version-subtitle">{t('LoginVersionOS')}</span>
                                <span className="version-title">Android</span>
                              </>
                              :
                              <>
                                <span className="version-title">Android</span>
                                <span className="version-subtitle">{t('LoginVersionOS')}</span>
                              </>
                          }

                        </div>
                        <img
                          className="d-block"
                          src={imageAndroid}
                          alt="First slide"
                        />
                        <span className="scan-title">{t('LoginGuideQr')}</span>
                        <img className="scan-image" src={qrAndroid} />
                      </div>

                    </Carousel.Item>

                  </Carousel>
                  <div className="bottom-link">
                        <span>Website: www.myvingroup.vingroup.net</span>
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