import React, { useState, useRef, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from "axios"
import moment from 'moment'
import ReactList from 'react-list';
import Footer from '../../components/Common/Footer';
import { prepareNews } from "../Corporation/News/NewsUtils"
import { getRequestConfigurations } from "commons/Utils"
import mapConfig from "containers/map.config"
import IconDiamond from '../../assets/img/icon/Icon-Diamond.svg'
import IconViewDetail from '../../assets/img/icon/Icon-Arrow-Right.svg'
import IconUser from '../../assets/img/icon/Icon-User.svg'
import IconTime from '../../assets/img/icon/Icon-Time.svg'
import IconLock from '../../assets/img/icon/icon-lock.svg'
import IconSwitchPopup from '../../assets/img/icon/icon-switch-popup.svg'
import BgBannerPrivilege from '../../assets/img/bg_banner_privilege.png'
import IconX from '../../assets/img/icon/icon_x.svg'
import IconGift from 'assets/img/icon/Icon_gift_red.svg'
import IconBackToTop from "assets/img/icon/Icon_back_to_top.svg"
import LoadingModal from "components/Common/LoadingModal"

function NewsOnHome(props) {
    const { t } = useTranslation()
    const myRef = useRef(null);
    const totalTopArticles = 5

    const [isVisibleGoToTop, setIsVisibleGoToTop] = useState(false);
    const [isShowNoticeGuideModal, setIsShowNoticeGuideModal] = useState(false)
    const [listArticles, setListArticles] = useState(null)
    const [privilegeBanner, setPrivilegeBanner] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (Notification.permission !== "granted" && !sessionStorage.getItem("isCloseNotificationGuide")) {
            setIsShowNoticeGuideModal(true);
            sessionStorage.setItem("isCloseNotificationGuide", true);
        }

        const fetchListNewsAndEmployeePrivilegeBanner = async () => {
            const config = getRequestConfigurations()
            try {
                const requestGetListNews = axios.get(`${process.env.REACT_APP_REQUEST_URL}article/list`, {...config, params: {
                    pageIndex: 1,
                    pageSize: 100,
                    domain: '',
                }})
                const requestGetEmployeePrivilegeBanner = axios.get(`${process.env.REACT_APP_REQUEST_URL}article/detail`, {...config, params: {
                    type: 'BANNER',
                }})
        
                const [listNews, employeePrivilegeBanner] = await Promise.allSettled([requestGetListNews, requestGetEmployeePrivilegeBanner])
                setListArticles(listNews?.value?.data)
                setPrivilegeBanner(employeePrivilegeBanner?.value?.data?.data)
            } finally {
                setIsLoading(false)
            }
        }

        fetchListNewsAndEmployeePrivilegeBanner()
    }, [])

    const convertToSlug = input => {
        let slug = input?.toLowerCase()
        slug = slug?.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
            .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
            .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
            .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
            .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
            .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
            .replace(/đ/gi, 'd')
            .replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
            .replace(/ /gi, " - ")
            .replace(/\-\-\-\-\-/gi, '-')
            .replace(/\-\-\-\-/gi, '-')
            .replace(/\-\-\-/gi, '-')
            .replace(/\-\-/gi, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/\@\-|\-\@|\@/gi, '');
        return slug
    }

    const subStringDescription = input => {
        return input && input?.length > 150 ? input.substr(0, 149) : input
    }

    const getTimeByRawTime = rawTime => {
        const time = moment(rawTime).isValid() ? moment(rawTime) : null
        return {
            time: time?.format("HH:mm") || "",
            date: time?.format("DD/MM/YYYY") || ""
        }
    }

    const scrollToTop = () => {
        myRef.current.scrollTo({ behavior: 'smooth', top: 0 });
    }

    const onScroll = () => {       
        setIsVisibleGoToTop(myRef && myRef?.current?.scrollTop > 0)
    }

    // const closeNotificationGuideModal = () => {
    //   setIsShowNotiGuideModal(false);
    // }

    const articles = listArticles?.data || []
    const loaded = listArticles?.data ? true : false;
    const totalArticles = articles.totalRecord
    const totalArticlesPerPage = articles.listArticles?.length

    const topOne = totalArticlesPerPage > 0 ? prepareNews(articles.listArticles[0]) : null
    const timePublishedTopOne = getTimeByRawTime(topOne?.publishedDate)
    const topFour = totalArticlesPerPage > 1 && articles.listArticles?.slice(1, totalTopArticles).map(item => prepareNews(item)) || []
    const others = totalArticlesPerPage > totalTopArticles && articles.listArticles?.slice(totalTopArticles).map(item => prepareNews(item)) || []

    return (
        <>
        <LoadingModal show={isLoading} />
        <div onScroll={e => onScroll()} ref={myRef} className="scroll-custom">
            <div className="container-fluid">
                {
                    totalArticles > 0 ?
                        <>
                            <div className="top-news">
                                <div className="row">
                                    <div className="banner-privilege">
                                        <img src={BgBannerPrivilege} className="privilege-img" alt="banner privilege" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 privilege">
                                        <h1 className="page-title" style={{ color: "#D13238", fontSize: 16 }}><Image src={IconGift} alt="Gift" className="ic-page-title" />{t("VingroupEmployeePrivileges")}</h1>
                                        <div className="top-one shadow-customize">
                                            <a href={mapConfig.EmployeePrivileges} className="link-detail">
                                                <Image src={privilegeBanner?.thumbnail} alt="News" className="thumbnail"
                                                    onError={(e) => {
                                                        e.target.src = "/logo-large.svg"
                                                    }}
                                                />
                                                <p className="title" style={{ color: "#D13238" }}>{privilegeBanner?.title || ''}</p>
                                            </a>
                                            <div className="other-info">
                                                <div className="source-time-info">
                                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{getTimeByRawTime(privilegeBanner?.publishedDate)?.time + ' | ' + getTimeByRawTime(privilegeBanner?.publishedDate)?.date}</span></span>
                                                </div>
                                                <p className="description">{privilegeBanner?.description || ''}</p>
                                                <div className="btn-detail">
                                                    <a href={mapConfig.EmployeePrivileges} className="detail"><span>{t("ViewMore")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 special">
                                        <h2 className="page-title" style={{ fontSize: 16 }}><Image src={IconDiamond} alt="News" className="ic-page-title" />{t("NewsAndEvent")}</h2>
                                        <div className="d-flex shadow-customize wrap-news">
                                            <div className="top-one">
                                                <a href={`/news/${convertToSlug(topOne?.title)}/${topOne.id}`} className="link-detail">
                                                    <Image src={topOne?.thumbnail} alt="News" className="thumbnail"
                                                        onError={(e) => {
                                                            e.target.src = "/logo-large.svg"
                                                        }}
                                                    />
                                                    <p className="title">{topOne?.title || ""}</p>
                                                </a>
                                                <div className="other-info">
                                                    <div className="source-time-info">
                                                        <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne?.sourceSite || ""}</span></span>
                                                        <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne?.date}</span></span>
                                                    </div>
                                                    <p className="description">{subStringDescription(topOne?.description)}...</p>
                                                    <div className="btn-detail">
                                                        <a href={`/news/${convertToSlug(topOne?.title)}/${topOne?.id}`} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="other">
                                                <h1 className="" style={{ textTransform: 'initial', fontSize: 16, color: '#000000', fontWeight: 'bold', margin: "0 20px 15px 20px" }}>Tin tức khác</h1>
                                                <div className="top-four">
                                                    {
                                                        topFour.length > 0 ?
                                                            topFour.map((item, index) => {
                                                                let timePublished = getTimeByRawTime(item?.publishedDate)
                                                                return <div className="item" key={item.id}>
                                                                    <a href={`/news/${convertToSlug(item.title)}/${item.id}`} className="link-image-detail">
                                                                        <Image src={item.thumbnail} className="thumbnail"
                                                                            onError={(e) => {
                                                                                e.target.src = "/logo-small.svg"
                                                                                e.target.className = `thumbnail error`
                                                                            }}
                                                                        />
                                                                    </a>
                                                                    <div className="title-source-time-info">
                                                                        <a href={`/news/${convertToSlug(item.title)}/${item.id}`} className="title">{item.title}</a>
                                                                        <div className="source-time-info">
                                                                            <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{item.sourceSite || ""}</span></span>
                                                                            <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished.date}</span></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            })
                                                        : t("DataNotFound")
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="other-news shadow-customize">
                                <div className="row">
                                    <div className="col-md-12">
                                        <ReactList
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
                                        />
                                    </div>
                                </div>
                            </div>

                        </>
                        : t("DataNotFound")
                }

            </div>
            {
              isShowNoticeGuideModal && <div className="noti-guide-modal">
                <img className="close-icon" src={IconX} alt="icon-lock" onClick={() => setIsShowNoticeGuideModal(false)} />
                  <div className="title">{t("NotificationGuide1")} <br /> ILoveVingroup</div>
                  <div className="guide-text">
                  1. {t("NotificationGuide2")}&nbsp;<img className="image-inline lock-icon" src={IconLock} alt="icon-lock" />&nbsp; {t("NotificationGuide3")}
                  </div>
                  <div className="guide-text">
                  2. {t("NotificationGuide4")}&nbsp;<img className="image-inline switch-icon" src={IconSwitchPopup} alt="icon-switch" /> 
                  </div>
              </div>
            }
            { loaded && (<Footer />) }
            {
                isVisibleGoToTop && (
                    <div onClick={e => scrollToTop()} className="scroll-to-top2" style={{ zIndex: '10' }}>
                        <span><img src={IconBackToTop} /></span>
                    </div>
                )
            }
        </div>
        </>
    );
}

export default NewsOnHome;