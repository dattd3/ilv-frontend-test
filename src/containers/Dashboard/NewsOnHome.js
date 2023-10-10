import React, { useState, useRef, useEffect } from "react";
import { Image, Carousel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import ReactList from "react-list";
import Footer from "../../components/Common/Footer";
import { formatInternalNewsData, getRequestConfigurations } from "commons/Utils";
import mapConfig from "containers/map.config";
import IconViewDetail from "../../assets/img/icon/Icon-Arrow-Right.svg";
import IconUser from "../../assets/img/icon/Icon-User.svg";
import IconTime from "../../assets/img/icon/Icon-Time.svg";
import IconLock from "../../assets/img/icon/icon-lock.svg";
import IconSwitchPopup from "../../assets/img/icon/icon-switch-popup.svg";
import IconX from "../../assets/img/icon/icon_x.svg";
import IconGift from "assets/img/icon/Icon_gift_red.svg";
import IconBackToTop from "assets/img/icon/Icon_back_to_top.svg";
import IconInternalNews from "assets/img/icon/internal_news_icon.svg";
import LoadingModal from "components/Common/LoadingModal";
import Constants from "commons/Constants";
import { getCurrentLanguage } from "../../commons/Utils";
import { isJsonString } from "../../utils/string";

function NewsOnHome() {
  const { t } = useTranslation();
  const myRef = useRef(null);
  const listInternalNewsRef = useRef(null);
  const [isVisibleGoToTop, setIsVisibleGoToTop] = useState(false);
  const [isShowNoticeGuideModal, setIsShowNoticeGuideModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [listInternalNews, setListInternalNews] = useState([]);
  const [listInternalNewsPodcasts, setListInternalNewsPodcasts] = useState([]);
  const [listInternalNewsVideo, setListInternalNewsVideo] = useState([]);
  const [totalListInternalNews, setTotalListInternalNews] = useState(0);
  const [currentPageInternalNews, setCurrentPageInternalNews] = useState(1);

  const [privilegeBanner, setPrivilegeBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lang = getCurrentLanguage();

  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      !sessionStorage.getItem("isCloseNotificationGuide")
    ) {
      setIsShowNoticeGuideModal(true);
      sessionStorage.setItem("isCloseNotificationGuide", true);
    }

    const fetchListNewsAndEmployeePrivilegeBanner = async () => {
      const config = getRequestConfigurations(),
        locale = localStorage.getItem("locale"),
        languageKeyMapping = {
          [Constants.LANGUAGE_EN]: "en",
          [Constants.LANGUAGE_VI]: "vi",
        };
      try {
        const requestGetListInternalNews = axios.get(
            `${process.env.REACT_APP_REQUEST_URL}internal-news/list`,
            {
              ...config,
              params: {
                page: currentPageInternalNews,
                size: 10,
                newsType: 1,
              },
            }
          ),
          requestGetListInternalNewsPodcasts = axios.get(
            `${process.env.REACT_APP_REQUEST_URL}internal-news/list`,
            {
              ...config,
              params: {
                page: 1,
                size: 3,
                newsType: 2,
              },
            }
          ),
          requestGetListInternalNewsVideos = axios.get(
            `${process.env.REACT_APP_REQUEST_URL}internal-news/list`,
            {
              ...config,
              params: {
                page: 1,
                size: 3,
                newsType: 3,
              },
            }
          ),
          requestGetEmployeePrivilegeBanner = axios.get(
            `${process.env.REACT_APP_REQUEST_URL}article/detail`,
            {
              ...config,
              params: {
                type: "BANNER",
              },
            }
          ),
          getPrivilegeBanners = axios.get(
            `${process.env.REACT_APP_REQUEST_URL}api/vanhoavin/list`,
            {
              ...config,
              params: {
                language: languageKeyMapping[locale],
                categoryCode: "6.1",
                device: "WEB",
              },
            }
          );

        const [
          _listInternalNews,
          _listInternalNewsPodcasts,
          _listInternalNewsVideos,
          employeePrivilegeBanner,
          privilegeBanners,
        ] = await Promise.allSettled([
          requestGetListInternalNews,
          requestGetListInternalNewsPodcasts,
          requestGetListInternalNewsVideos,
          requestGetEmployeePrivilegeBanner,
          getPrivilegeBanners,
        ]);
        setListInternalNews(formatInternalNewsData(_listInternalNews.value.data?.data?.data, lang));
        setListInternalNewsPodcasts(
          formatInternalNewsData(_listInternalNewsPodcasts.value.data?.data?.data, lang)
        );
        setListInternalNewsVideo(
          formatInternalNewsData(_listInternalNewsVideos.value.data?.data.data, lang)
        );
        setTotalListInternalNews(_listInternalNews.value.data?.data?.total || 0);
        const _privilegeBanner = employeePrivilegeBanner?.value?.data?.data;
        setPrivilegeBanner({
          ...privilegeBanner,
          description: isJsonString(_privilegeBanner?.description)
            ? JSON.parse(_privilegeBanner?.description)?.[lang] ||
              JSON.parse(_privilegeBanner?.description)?.["vi"]
            : _privilegeBanner?.description,
          thumbnail: isJsonString(_privilegeBanner?.thumbnail)
            ? JSON.parse(_privilegeBanner?.thumbnail)?.[lang] ||
              JSON.parse(_privilegeBanner?.thumbnail)?.["vi"]
            : _privilegeBanner?.thumbnail,
          title: isJsonString(_privilegeBanner?.title)
            ? JSON.parse(_privilegeBanner?.title)?.[lang] ||
              JSON.parse(_privilegeBanner?.title)?.["vi"]
            : _privilegeBanner?.title,
        });
        setBanners(privilegeBanners?.value?.data?.data || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListNewsAndEmployeePrivilegeBanner();
  }, []);

  const subStringDescription = (input) => {
    return input && input?.length > 150 ? input.substr(0, 149) : input;
  };

  const getTimeByRawTime = (rawTime) => {
    const time = moment(rawTime).isValid() ? moment(rawTime) : null;
    return {
      time: time?.format("HH:mm") || "",
      date: time?.format("DD/MM/YYYY") || "",
    };
  };

  const scrollToTop = () => {
    myRef.current.scrollTo({ behavior: "smooth", top: 0 });
  };

  const onScroll = () => {
    setIsVisibleGoToTop(myRef && myRef?.current?.scrollTop > 0);
  };

  const fetchNextInternalNews = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REQUEST_URL}internal-news/list`,
        {
          ...getRequestConfigurations(),
          params: {
            page: currentPageInternalNews + 1,
            size: 10,
            newsType: 1,
          },
        }
      );
      setCurrentPageInternalNews(currentPageInternalNews + 1);
      setTotalListInternalNews(response.value.data?.data?.total || 0);
      setListInternalNews(...listInternalNews ,...formatInternalNewsData(response.value.data?.data?.data, lang));
    } catch (error) {
      
    }
  }

  const loaded = listInternalNews?.data ? true : false;

  const topOne = listInternalNews.length > 0 ? listInternalNews[0] : null;
  const timePublishedTopOne = getTimeByRawTime(topOne?.publishedDate);
  const listInternalNewsOther = listInternalNews.length > 1 ? listInternalNews?.slice(1, listInternalNews.length) : [];
  
  const onListInternalNewsScroll = () => {
    const [
      _,
      lastIndexVisible
  ] = listInternalNewsRef.current?.getVisibleRange();
  console.log(lastIndexVisible)
    // Fetch Next page
    if (lastIndexVisible === listInternalNewsOther.length - 2 && listInternalNews.length < totalListInternalNews) {
      fetchNextInternalNews();
    }
  }
  
  const renderItemInternalNews = (index, key) => {
    const itemNews = listInternalNewsOther[index];
    const timePublished = getTimeByRawTime(
      itemNews?.publishedDate
    );

    return <div className="item" key={itemNews.id}>
        <a
          href={`/internal-news/${itemNews.id}`}
          className="link-image-detail"
        >
          <Image
            src={itemNews.thumbnail}
            className="thumbnail"
            onError={(e) => {
              e.target.src = "/logo-small.svg";
              e.target.className = `thumbnail error`;
            }}
          />
        </a>
        <div className="title-source-time-info">
          <a
            href={`/internal-news/${itemNews.id}`}
            className="title"
          >
            {itemNews.title}
          </a>
          <div className="source-time-info">
            <span className="source">
              <Image
                src={IconUser}
                alt="Source"
                className="icon"
              />
              <span className="source-name">
                {t("VingroupCultural")}
              </span>
            </span>
            <span className="time">
              <Image
                src={IconTime}
                alt="Time"
                className="icon"
              />
              <span className="hour">
                {timePublished.date || "N/A"}
              </span>
            </span>
          </div>
        </div>
      </div>
  }

  return (
    <>
      <LoadingModal show={isLoading} />
      <div onScroll={(e) => onScroll()} ref={myRef} className="scroll-custom">
        <div className="container-fluid">
          <div className="top-news">
            <div className="row banner-privilege">
              <Carousel>
                {banners.length > 0 &&
                  banners.map((ele, i) => (
                    <Carousel.Item interval={9000} key={i}>
                      <div className="banner-privilege-item">
                        <img
                          src={ele.link}
                          className="privilege-img"
                          alt="banner privilege"
                        />
                      </div>
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>
            <div className="row">
              <div className="col-md-4 privilege">
                <h1
                  className="page-title"
                  style={{ color: "#D13238", fontSize: 16 }}
                >
                  <Image src={IconGift} alt="Gift" className="ic-page-title" />
                  {t("VingroupEmployeePrivileges")}
                </h1>
                <div className="top-one shadow-customize">
                  <a
                    href={mapConfig.EmployeePrivileges}
                    className="link-detail"
                  >
                    <Image
                      src={privilegeBanner?.thumbnail}
                      alt="News"
                      className="thumbnail"
                      onError={(e) => {
                        e.target.src = "/logo-large.svg";
                      }}
                    />
                    <p className="title">{privilegeBanner?.title || ""}</p>
                  </a>
                  <div className="other-info">
                    <div className="source-time-info">
                      <span className="source">
                        <Image src={IconUser} alt="Source" className="icon" />
                        <span className="source-name">
                          {t("VingroupCulture")}
                        </span>
                      </span>
                    </div>
                    <p className="description">
                      {privilegeBanner?.description || ""}
                    </p>
                    <div className="btn-detail">
                      <a href={mapConfig.EmployeePrivileges} className="detail">
                        <span>{t("ViewMore")}</span>
                        <Image
                          src={IconViewDetail}
                          alt="Detail"
                          className="icon-view-detail"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 special">
                <h2 className="page-title" style={{ fontSize: 16 }}>
                  <Image
                    src={IconInternalNews}
                    alt="News"
                    className="ic-page-title"
                  />
                  {t("InternalNews")}
                </h2>
                <div className="d-flex shadow-customize wrap-news">
                  {topOne && (
                    <div className="top-one">
                      <a
                        href={`/internal-news/${topOne.id}`}
                        className="link-detail"
                      >
                        <Image
                          src={topOne?.thumbnail}
                          alt="News"
                          className="thumbnail"
                          onError={(e) => {
                            e.target.src = "/logo-large.svg";
                          }}
                        />
                        <p className="title">{topOne?.title || ""}</p>
                      </a>
                      <div className="other-info">
                        <div className="source-time-info">
                          <span className="source">
                            <Image
                              src={IconUser}
                              alt="Source"
                              className="icon"
                            />
                            <span className="source-name">
                              {t("VingroupCultural")}
                            </span>
                          </span>
                          <span className="time">
                            <Image src={IconTime} alt="Time" className="icon" />
                            <span className="hour">
                              {timePublishedTopOne?.date || "N/A"}
                            </span>
                          </span>
                        </div>
                        <p className="description">
                          {subStringDescription(topOne?.description)}...
                        </p>
                        <div className="btn-detail">
                          <a
                            href={`/internal-news/${topOne?.id}`}
                            className="detail"
                          >
                            <span>{t("Details")}</span>
                            <Image
                              src={IconViewDetail}
                              alt="Detail"
                              className="icon-view-detail"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className="other"
                  >
                    <div className="top-four" onScroll={onListInternalNewsScroll}>
                      {
                        listInternalNews.length > 1 &&  <ReactList
                        itemRenderer={renderItemInternalNews}
                        length={listInternalNewsOther.length}
                        ref={listInternalNewsRef}
                      />
                      }
                      {/* {listInternalNewsOther.length > 0
                        ? listInternalNewsOther.map((item) => {
                            
                            );
                          })
                        : t("DataNotFound")} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="other-news shadow-customize">
            <div className="row">
              <div className="col-md-12">
                {/* <ReactList
                                            itemRenderer={
                                                (index, key) => {
                                                    const item = others[index];
                                                    let timePublished = getTimeByRawTime(item?.publishedDate)
                                                    return <div className="item" key={key}>
                                                        <a href={`/news/${convertToSlug(item.title)}/${item.id}`} className="link-image-detail">
                                                            <Image src={item.thumbnail} alt="News" className="thumbnail"
                                                                onError={(e) => {
                                                                    e.target.src = "/logo-normal.svg"
                                                                    e.target.className = `thumbnail error`
                                                                }}
                                                            />
                                                        </a>
                                                        <div className="title-source-time-info">
                                                            <div className="main-info">
                                                                <a href={`/news/${convertToSlug(item.title)}/${item.id}`} className="title">{item.title}</a>
                                                                <p className="description">{subStringDescription(item.description)}</p>
                                                                <div className="source-time-info">
                                                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{item.sourceSite || ""}</span></span>
                                                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished.date}</span></span>
                                                                </div>
                                                            </div>
                                                            <div className="btn-detail">
                                                                <a href={`/news/${convertToSlug(item.title)}/${item.id}`} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            }
                                            length={others.length}
                                            type='variable'
                                        /> */}
              </div>
            </div>
          </div>
        </div>
        {isShowNoticeGuideModal && (
          <div className="noti-guide-modal">
            <img
              className="close-icon"
              src={IconX}
              alt="icon-lock"
              onClick={() => setIsShowNoticeGuideModal(false)}
            />
            <div className="title">
              {t("NotificationGuide1")} <br /> ILoveVingroup
            </div>
            <div className="guide-text">
              1. {t("NotificationGuide2")}&nbsp;
              <img
                className="image-inline lock-icon"
                src={IconLock}
                alt="icon-lock"
              />
              &nbsp; {t("NotificationGuide3")}
            </div>
            <div className="guide-text">
              2. {t("NotificationGuide4")}&nbsp;
              <img
                className="image-inline switch-icon"
                src={IconSwitchPopup}
                alt="icon-switch"
              />
            </div>
          </div>
        )}
        {loaded && <Footer />}
        {isVisibleGoToTop && (
          <div
            onClick={(e) => scrollToTop()}
            className="scroll-to-top2"
            style={{ zIndex: "10" }}
          >
            <span>
              <img src={IconBackToTop} alt="Back to top" />
            </span>
          </div>
        )}
      </div>
    </>
  );
}


export default NewsOnHome;
