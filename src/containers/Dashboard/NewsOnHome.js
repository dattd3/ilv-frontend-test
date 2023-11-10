import { useState, useRef, useEffect } from "react";
import { Image, Carousel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ReactList from "react-list";
import Footer from "../../components/Common/Footer";
import {
  formatInternalNewsData,
  getPublishedTimeByRawTime,
  getRequestConfigurations,
} from "commons/Utils";
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
import IconMic from "assets/img/icon/mic-icon.svg";
import IconVideo from "assets/img/icon/video-icon.svg";
import IconPlay from "assets/img/icon/play-icon-red.svg";
import IconArrowNext from "assets/img/icon/arrow-next-red.svg";

import LoadingModal from "components/Common/LoadingModal";
import Constants from "commons/Constants";
import { getCurrentLanguage } from "../../commons/Utils";
import { isJsonString } from "../../utils/string";

function NewsOnHome() {
  const { t } = useTranslation();
  const myRef = useRef(null);
  const privilegesRef = useRef(null);
  const listInternalNewsRef = useRef(null);
  const [isVisibleGoToTop, setIsVisibleGoToTop] = useState(false);
  const [isShowNoticeGuideModal, setIsShowNoticeGuideModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [listInternalNews, setListInternalNews] = useState([]);
  const [listInternalNewsPodcasts, setListInternalNewsPodcasts] = useState([]);
  const [listInternalNewsVideo, setListInternalNewsVideo] = useState([]);
  const [currentPageInternalNews, setCurrentPageInternalNews] = useState(1);

  const [privilegeBanner, setPrivilegeBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [privilegesRefHeight, setPrivilegesRefHeight] = useState(0);
  const lang = getCurrentLanguage();

  useEffect(() => {
    const privileges = privilegesRef.current;
    if (!privileges) return;
    const resizeObserver = new ResizeObserver(() => {
      if (privilegesRefHeight !== privileges?.clientHeight && privileges?.clientHeight > 0) setPrivilegesRefHeight(privileges?.clientHeight)
    });
    resizeObserver.observe(privileges);

    return () => resizeObserver.disconnect();
  }, [privilegesRef.current, privilegesRefHeight]);

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
                culture: lang
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
                culture: lang
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
                culture: lang
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
        setListInternalNews(
          formatInternalNewsData(_listInternalNews.value?.data?.data?.data, lang)
        );
        setListInternalNewsPodcasts(
          formatInternalNewsData(
            _listInternalNewsPodcasts.value?.data?.data?.data,
            lang
          )
        );
        setListInternalNewsVideo(
          formatInternalNewsData(
            _listInternalNewsVideos.value?.data?.data.data,
            lang
          )
        );
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
    if (!input) return input;
    return input?.length > 150 ? `${input.substr(0, 149)}...` : input;
  };

  const scrollToTop = () => {
    myRef.current.scrollTo({ behavior: "smooth", top: 0 });
  };

  const onScroll = () => {
    setIsVisibleGoToTop(myRef && myRef?.current?.scrollTop > 0);
  };

  const handleViewDetail = link => window.location.href = link;

  const loaded = listInternalNews?.data ? true : false;

  const topOne = listInternalNews.length > 0 ? listInternalNews[0] : null;
  const timePublishedTopOne = getPublishedTimeByRawTime(topOne?.publishedDate);
  const listInternalNewsOther =
    listInternalNews.length > 1
      ? listInternalNews?.slice(1, listInternalNews.length)
      : [];

  const renderItemInternalNews = (index, key) => {
    const itemNews = listInternalNewsOther[index];
    const timePublished = getPublishedTimeByRawTime(itemNews?.publishedDate);

    return (
      <div className="item" key={itemNews.id}>
        <a href={`/internal-news/detail/${itemNews.id}`} className="link-image-detail">
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
          <a href={`/internal-news/detail/${itemNews.id}`} className="title">
            {itemNews.title}
          </a>
          <div className="source-time-info">
            <span className="time">
              <Image src={IconTime} alt="Time" className="icon" />
              <span className="hour">{timePublished.date || "N/A"}</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <LoadingModal show={isLoading} />
      <div onScroll={onScroll} ref={myRef} className="scroll-custom">
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
                <div className="block-page-title">
                  <h1
                    className="page-title" style={{ color: "#D13238" }}
                  >
                    <Image src={IconGift} alt="Gift" className="ic-page-title" />
                    {t("VingroupEmployeePrivileges")}
                  </h1>
                </div>
                <div className="top-one shadow-customize" ref={privilegesRef}>
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
                    {privilegeBanner?.description && (
                      <p className="description">
                        {subStringDescription(privilegeBanner?.description)}
                      </p>
                    )}
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
                <div className="block-page-title">
                  <h2 className="page-title">
                    <Image
                      src={IconInternalNews}
                      alt="News"
                      className="ic-page-title"
                    />
                    {t("NewsInternal")}
                  </h2>
                    
                  <a href="/internal-news?type=1"  className="news-link">
                    <div className="expand-all-container">
                      {t("ExpandAll")}&nbsp;&nbsp;
                      <img src={IconArrowNext} alt="" />
                    </div>
                  </a>
                </div>
                <div className="d-flex shadow-customize wrap-news">
                  {topOne && (
                    <div className="top-one">
                      <a
                        href={`/internal-news/detail/${topOne.id}`}
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
                          <span className="time">
                            <Image src={IconTime} alt="Time" className="icon" />
                            <span className="hour">
                              {timePublishedTopOne?.date || "N/A"}
                            </span>
                          </span>
                        </div>
                        {privilegeBanner?.description && (
                          <p className="description">
                            {subStringDescription(topOne?.description)}
                          </p>
                        )}
                        <div className="btn-detail">
                          <a
                            href={`/internal-news/detail/${topOne?.id}`}
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
                  <div className="other" style={{ maxHeight: privilegesRefHeight > 0 ? privilegesRefHeight - 40 : 0 }}>
                    <div className="top-four">
                      {listInternalNews.length > 1 && (
                        <ReactList
                          itemRenderer={renderItemInternalNews}
                          length={listInternalNewsOther.length}
                          ref={listInternalNewsRef}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {listInternalNewsPodcasts?.length > 0 && (
            <>
              <div className="internal-news-title">
                <div className="title">
                  <img src={IconMic} alt="" />
                  &nbsp; PODCASTS
                </div>
                <a href="/internal-news?type=2"  className="news-link">
                  <div className="expand-all-container">
                    {t("ExpandAll")}&nbsp;&nbsp;
                    <img src={IconArrowNext} alt="" />
                  </div>
                </a>
              </div>
              <div className="other-news shadow-customize">
                <div className="row internal-news-grid">
                  {listInternalNewsPodcasts.map((item) => (
                    <div className="col-md-4" key={item.id}>
                      <div className="internal-news-card" onClick={() => handleViewDetail(`/internal-news/detail/${item.id}`)}>
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="thumbnail"
                        />
                        <div className="card-body">
                          <div className="title">{item.title}</div>
                          <div className="source-time-info">
                            <span className="time">
                              <img src={IconTime} alt="Time" className="icon" />
                              <span className="hour">
                                {getPublishedTimeByRawTime(item.publishedDate)?.date || "N/A"}
                              </span>
                            </span>
                          </div>
                          <a
                            href={`/internal-news/detail/${item.id}`}
                            className="news-link"
                          >
                            <button className="play-btn">
                              <img src={IconPlay} alt="" />
                              &nbsp;&nbsp;
                              {t("PlayNow")}
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {listInternalNewsVideo.length > 0 && (
            <>
              <div className="internal-news-title">
                <div className="title">
                  <img src={IconVideo} alt="" />
                  &nbsp; VIDEO
                </div>
                <a href="/internal-news?type=3"  className="news-link">
                  <div className="expand-all-container">
                    {t("ExpandAll")}&nbsp;&nbsp;
                    <img src={IconArrowNext} alt="" />
                  </div>
                </a>
              </div>
              <div className="other-news shadow-customize">
                <div className="row internal-news-grid">
                  {listInternalNewsVideo.map((item) => (
                    <div className="col-md-4" key={item.id}>
                      <div className="internal-news-card" onClick={() => handleViewDetail(`/internal-news/detail/${item.id}`)}>
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="thumbnail"
                        />
                        <div className="card-body">
                          <div className="title">{item.title}</div>
                          <div className="source-time-info">
                            <span className="time">
                              <img src={IconTime} alt="Time" className="icon" />
                              <span className="hour">
                                {getPublishedTimeByRawTime(item.publishedDate)?.date || "N/A"}
                              </span>
                            </span>
                          </div>
                          <a
                            href={`/internal-news/detail/${item.id}`}
                            className="news-link"
                          >
                            <button className="play-btn">
                              <img src={IconPlay} alt="" />
                              &nbsp;&nbsp;
                              {t("PlayNow")}
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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
        <div className="footer-dash-board">
          <Footer />
        </div>
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
