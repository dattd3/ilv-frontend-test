import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Carousel } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import config from '../../commons/aws-config';
import logo from '../../assets/img/LogoVingroup.svg';
import imageIos from '../../assets/img/image_ios.png';
import imageAndroid from '../../assets/img/image_android.png';
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
import { getStateRedirect } from "../../commons/commonFunctions";

const CustomOption = ({ children, ...props }) => {
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
            <img src={props.selectProps.value[0].value == Constants.LANGUAGE_VI ? icVietnam : icEnglish} style={{ marginRight: '7px', width: '22px', height: '16px' }} />
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
  const [langCode, setLangCode] = useState(localStorage.getItem("locale")  || Constants.LANGUAGE_VI);
  const langData = [
    { value: Constants.LANGUAGE_VI, label: t("LangViet") },
    { value: Constants.LANGUAGE_EN, label: t("LangEng") }
  ];
  

  const customStyles = {
    indicatorSeparator: base => ({
      ...base,
      display: "none",
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
        backgroundColor: isFocused ? "#F9F9F9" : "#FFFFFF",
        color: isFocused ? "#000000" : "#000000",
        cursor: "pointer",
        "&:hover": {
          color: "#000000"
        }
      };
    }
  };

  useEffect(() => {
    localizeStore.setLocale(langCode || Constants.LANGUAGE_VI)
  }, [langCode, localizeStore]);

  const handleLoginClick = () => {
    const state = getStateRedirect(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNIN_URL, process.env.REACT_APP_ENVIRONMENT);
    const url = `${process.env.REACT_APP_LOGIN_V2_PATH}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&scope=user.read&prompt=select_account&state=${state}%26response_type%3Dcode`;
    window.location.assign(url);
  }

  const handleChangeSelectInputs = (e) => {
    setLangCode(e ? e.value : Constants.LANGUAGE_VI)
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
                      {/* <Button className={langCode === Constants.LANGUAGE_VI ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode(Constants.LANGUAGE_VI)}>{t("LangViet")}</Button>|
                    <Button className={langCode === Constants.LANGUAGE_EN ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode(Constants.LANGUAGE_EN)}>{t("LangEng")}</Button> */}

                      <Select options={langData} value={(langData || []).filter(l => l.value === langCode)}
                        onChange={handleChangeSelectInputs} className="input i_lang" name="i_lang"
                        styles={customStyles}
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
                        <a style={{ flex: 1, textDecoration: 'none' }} href="https://apps.apple.com/app/ilovevingroup/id1617033050" target="_blank">
                          <div className="mobile-contain shadow-sm">
                            <img src={ic_ios} className='ic-mobile' />

                            <div className="mobile-title-contain" >
                              <span className="mobile-title">Available on the</span>
                              <span className="mobile-subtitle">App Store</span>
                            </div>
                          </div>
                        </a>
                        <div style={{ width: '20px' }}></div>
                        <a style={{ flex: 1, textDecoration: 'none' }} href="https://play.google.com/store/apps/details?id=com.vinpearl.myvinpearl.app&hl=en&gl=VN" target="_blank">
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
                <div className="col-lg-7">
                  <Carousel nextIcon={null} prevIcon={null}>
                    <Carousel.Item interval={1000}>
                      <div className="detail-contain">
                        <div className="version-contain">
                          <span className="version-web-subtitle">Welcome to </span>
                          <span className="version-web-title">ILOVEVINGROUP!</span>
                        </div>
                        <img
                          className="d-block h-270"
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
                            langCode == Constants.LANGUAGE_VI ?
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
                          className="d-block h-270"
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
                            langCode == Constants.LANGUAGE_VI
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
                          className="d-block h-270"
                          src={imageAndroid}
                          alt="First slide"
                        />
                        <span className="scan-title">{t('LoginGuideQr')}</span>
                        <img className="scan-image" src={qrAndroid} />
                      </div>

                    </Carousel.Item>

                  </Carousel>
                  <div className="bottom-link">
                    <span>Website: https://myvingroup.vingroup.net</span>
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