import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import moment from "moment";
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import logo from '../../assets/img/LogoVingroup.svg';
import ic_ios from '../../assets/img/icon/ic_ios.svg';
import ic_android from '../../assets/img/icon/ic_android.svg';
import qrCode from '../../assets/img/qr_code.svg';
import icVietnam from '../../assets/img/icon/ic_vietnam.svg';
import icEnglish from '../../assets/img/icon/ic_english.svg';
import prevSlideIcon from '../../assets/img/icon/prev-slide-icon.png';
import nextSlideIcon from '../../assets/img/icon/next-slide-icon.png';
import IconUser from 'assets/img/icon/Icon-User.svg'
import IconTime from 'assets/img/icon/Icon-Time.svg'
import IconVinfast from 'assets/img/icon/pnl/vinfast.svg'
import IconVinhomes from 'assets/img/icon/pnl/vinhomes.svg'
import IconVinperl from 'assets/img/icon/pnl/vinpearl.svg'
import IconVingroup from 'assets/img/icon/pnl/vingroup.svg'
import IconVinAI from 'assets/img/icon/pnl/vinai.svg'
import IconVinbigdata from 'assets/img/icon/pnl/vinbigdata.svg'
import IconVinbrain from 'assets/img/icon/pnl/vinbrain.svg'
import IconVinbus from 'assets/img/icon/pnl/vinbus.svg'
import IconVinschool from 'assets/img/icon/pnl/vinschool.svg'
import IconVinUni from 'assets/img/icon/pnl/vinuni.svg'
import IconVinHMS from 'assets/img/icon/pnl/vinhms.png'
import IconVinmec from 'assets/img/icon/pnl/vinmec.svg'
import IconVinits from 'assets/img/icon/pnl/vinitis.svg'
import IconGSM from 'assets/img/icon/pnl/gsm.png'
import IconVincom from 'assets/img/icon/pnl/vincom.svg'
import IconVincss from 'assets/img/icon/pnl/vincss.svg'
import IconQTT from 'assets/img/icon/pnl/qtt.svg'
import IconVTLX from 'assets/img/icon/pnl/tuonglaixanh.jpg'
import IconVinFuture from 'assets/img/icon/pnl/vinfuture.svg'
import IconVinif from 'assets/img/icon/pnl/vinif.svg'

import { useLocalizeStore } from '../../modules';
import Constants from "../../commons/Constants";
import Select, { components } from 'react-select'
import { getStateRedirect, getRequestConfigs } from "../../commons/commonFunctions";
import { isExistCurrentUserInWhiteList } from "commons/Utils";
import map from "containers/map.config"
import LoadingModal from "components/Common/LoadingModal";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const PNL_SWIPER_LIST = [
  [
    {
      logo: IconVinfast,
      url: "https://vinfastauto.com",
    },
    {
      logo: IconVinHMS,
      url: "https://vinhms.com",
    },
    {
      logo: IconVingroup,
      url: "https://vingroup.net",
    },
    {
      logo: IconVinhomes,
      url: "https://vinhomes.vn",
    },
    {
      logo: IconVinperl,
      url: "https://vinpearl.com",
    },
  ],
  [
    {
      logo: IconVinAI,
      url: "https://www.vinai.io",
    },
    {
      logo: IconVinbigdata,
      url: "https://vinbigdata.com",
    },
    {
      logo: IconVingroup,
      url: "https://vingroup.net",
    },
    {
      logo: IconVinbrain,
      url: "https://vinbrain.net",
    },
    {
      logo: IconVinits,
      url: "https://vingroup.net",
    },
  ],
  [
    {
      logo: IconVinschool,
      url: "https://vinschool.edu.vn",
    },
    {
      logo: IconVinUni,
      url: "https://vinuni.edu.vn",
    },
    {
      logo: IconVingroup,
      url: "https://vingroup.net",
    },
    {
      logo: IconVinHMS,
      url: "https://vinhms.com",
    },
    {
      logo: IconVinmec,
      url: "https://vinmec.com",
    },
  ],
  [
    {
      logo: IconVinbus,
      url: "https://vinbus.vn",
    },
    {
      logo: IconGSM,
      url: "https://xanhsm.com",
    },
    {
      logo: IconVingroup,
      url: "https://vingroup.net",
    },
    {
      logo: IconVincom,
      url: "https://vincom.com.vn",
    },
    {
      logo: IconVincss,
      url: "https://vincss.net",
    },
  ],
  [
    {
      logo: IconVTLX,
      url: "https://vingroup.net",
    },
    {
      logo: IconVinUni,
      url: "https://vinuni.edu.vn/",
    },
    {
      logo: IconVingroup,
      url: "https://vingroup.net",
    },
    {
      logo: IconQTT,
      url: "https://vingroup.net",
    },
    {
      logo: IconVinif,
      url: "https://vinif.org",
    },
  ],
];

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

function Login(props) {
  const localizeStore = useLocalizeStore();
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [langCode, setLangCode] = useState(localStorage.getItem("locale")  || Constants.LANGUAGE_VI);
  const [newsData, setNewsData] = useState([]);
  const newsSwiperRef = useRef(null);
  const langData = [
    { value: Constants.LANGUAGE_VI, label: t("LangViet") },
    { value: Constants.LANGUAGE_EN, label: t("LangEng") }
  ];

  useEffect(()=> {
    const fetchNewsData = async () => {
      try {
        const newsResponse = await axios.get(
          `${process.env.REACT_APP_REQUEST_URL}article/list`,
          {
            params: {
              domain: "",
              pageIndex: 1,
              pageSize: 15,
            },
          }
        );
        setNewsData(newsResponse.data?.data?.listArticles)
      } catch {}
    }
    
    fetchNewsData();
  }, []);

  useEffect(() => {
    const fetchMaintenanceInfo = async () => {
      setIsLoading(true)
      const config = getRequestConfigs()
      config.params = {
        appId: Constants.MAINTENANCE.APP_ID,
        device: Constants.MAINTENANCE.DEVICE,
        type: Constants.MAINTENANCE.MODE,
      }
      const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}api/guest/system`, config)
      setIsLoading(false)
      if (response?.data?.data?.maintainStatus) {
        window.location.href = map.Maintenance
      }
    }

    !isExistCurrentUserInWhiteList() && fetchMaintenanceInfo()
  }, []);

  useEffect(() => {
    localizeStore.setLocale(langCode || Constants.LANGUAGE_VI)
  }, [langCode, localizeStore]);

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

  const handleLoginClick = () => {
    const state = getStateRedirect(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNIN_URL, process.env.REACT_APP_ENVIRONMENT);
    const url = `${process.env.REACT_APP_LOGIN_V2_PATH}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&scope=user.read&prompt=select_account&state=${state}%26response_type%3Dcode`;
    window.location.assign(url);
  }

  const handleChangeSelectInputs = (e) => {
    setLangCode(e ? e.value : Constants.LANGUAGE_VI)
  }

  const handleNextNewsSwiper = () => {
    return (newsSwiperRef && newsSwiperRef.current?.swiper?.activeIndex < 15) ? newsSwiperRef.current?.swiper?.slideNext() : null;
  }

  const handlePrevNewsSwiper = () => {
    return (newsSwiperRef && newsSwiperRef.current?.swiper?.activeIndex > 0) ? newsSwiperRef.current?.swiper?.slidePrev() : null;
  }

  const handleClickNewsCard = (id) => {
    props.history.push({
      pathname: `/guest-news/${id}`,
      state: {
        newsData
      }
    });
  }

  return (
    <>
    <LoadingModal show={isLoading} />
    <Container className="login-page">
      <Row className="justify-content-center">
        <Col className="col-xl-12 col-lg-12 col-md-12">
          <div className="card o-hidden border-0 shadow-lg">
            <div className="card-body p-0">
              <div className="row" style={{ height: 618 }}>

                <div className="col-lg-4 bg-gray-trasparent pr-0">
                  <div className="opacity-1 wrap-left">
                    <div className="language-selector">
                      {/* <Button className={langCode === Constants.LANGUAGE_VI ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode(Constants.LANGUAGE_VI)}>{t("LangViet")}</Button>|
                    <Button className={langCode === Constants.LANGUAGE_EN ? "lang-active" : ""} variant="link" onClick={(e) => setLangCode(Constants.LANGUAGE_EN)}>{t("LangEng")}</Button> */}

                      <Select options={langData} value={(langData || []).filter(l => l.value === langCode)}
                        onChange={handleChangeSelectInputs} className="input i_lang" name="i_lang"
                        styles={customStyles}
                        components={{ ValueContainer: CustomOption, IndicatorSeparator: () => null }} />
                    </div>
                    <div className="left-main-content">
                      <div className="text-center w-100 d-flex justify-content-center" style={{ marginBottom: 40 }}>
                        <img src={logo} className="logo-login" alt='Logo' />
                      </div>
                      <Button className="btn-user btn-login" variant="primary" onClick={handleLoginClick}>{t("Login")}</Button>
                      <Button className="btn-user btn-help-login" variant="primary" onClick={() => setModalShow(true)}>{t("HelpToLogin")}</Button>
                      <p className="select-title text-center" >{t('LoginGuideOS')}</p>

                      <div className="link-mobile">
                        <a style={{ flex: 1, textDecoration: 'none' }} href="https://apps.apple.com/app/ilovevingroup/id1617033050" target="_blank">
                          <div className="mobile-contain shadow-sm">
                            <img src={ic_ios} className='ic-mobile' />
                            {/* <br /> */}
                            <div className="mobile-title-contain" >
                              <span className="mobile-title">Available on the</span>
                              <span className="mobile-subtitle">App Store</span>
                            </div>
                          </div>
                        </a>
                        <div style={{ width: '20px' }}></div>
                        <a style={{ flex: 1, textDecoration: 'none' }} href="https://apps.apple.com/app/ilovevingroup/id1617033050" target="_blank">
                          <div className="mobile-contain shadow-sm">
                            <img src={qrCode} className='qr-code' />
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
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 d-flex flex-column banner-region">
                  <div className="banner-block">
                    <div className="text-center banner-title">Welcome to&nbsp;<span className="font-weight-bold">ILOVEVINGROUP!</span></div>
                  </div>
                  <div className="banner-body">
                    {
                      newsData.length > 0 && <>
                        <div className="news-event-header">
                          <div className="news-event-title">
                            {t("NewsAndEvent")}
                          </div>
                          <div>
                            <img src={prevSlideIcon} alt="" className="slide-action-icon" onClick={handlePrevNewsSwiper} />
                            <img src={nextSlideIcon} alt="" className="slide-action-icon" onClick={handleNextNewsSwiper} />
                          </div>
                        </div>
                        <Swiper
                          spaceBetween={15}
                          freeMode={true}
                          modules={[FreeMode, Autoplay]}
                          rewind={true}
                          ref={newsSwiperRef}
                          slidesPerView="auto"
                          loop={true}
                          autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                          }}
                        >
                          {newsData.map(news => (
                            <SwiperSlide key={news.id} style={{width: "auto"}}>
                              <div className="news-card" onClick={() => handleClickNewsCard(news.id)}>
                                <img className="news-img" alt="" src={news.thumbnail} />
                                <div className="news-card-body">
                                  <div className="title">
                                    {news.title}
                                  </div>
                                  <div className="source-time-info">
                                    <span className="source">
                                      <img src={IconUser} alt="Source" className="icon" />&nbsp;
                                      <span className="source-name">{news.sourceSite || ""}</span>
                                    </span>
                                    <span className="time">
                                      <img src={IconTime} alt="Time" className="icon" />&nbsp;
                                      <span className="hour">{getTimeByRawTime(news.publishedDate).time} | {getTimeByRawTime(news.publishedDate).date}</span>
                                    </span>
                                  </div>
                                  <div className="description">
                                    {news.description}
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </>
                    }
                  </div>
                  <div className="banner-footer">
                    <div className="title">
                      {t("PnlOfVingroup")}
                    </div>
                    <Swiper 
                      loop={true}
                      navigation={true}
                      modules={[Navigation, Autoplay]}
                      className="pnlSwipper"
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      speed={1000}
                    >
                      {PNL_SWIPER_LIST.map((pnlList, index) => (
                        <SwiperSlide key={index}>
                          {pnlList.map((pnl, pnlIndex) => (
                            <a className="pnl-icon-wrapper" href={pnl.url} key={pnl.url + pnlIndex} target="_blank" rel="noreferrer">
                            <img src={pnl.logo} alt="" width="60%" />
                          </a>
                          ))}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
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
    </>
  );
}

const getTimeByRawTime = rawTime => {
  const time = moment(rawTime).isValid() ? moment(rawTime) : null
  return {
      time: time?.format("HH:mm") || "",
      date: time?.format("DD/MM/YYYY") || ""
  }
}

export default Login;