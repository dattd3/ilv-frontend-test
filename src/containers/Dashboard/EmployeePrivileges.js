import React, { useState, useRef, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from "axios"
import ReactList from 'react-list';
import { getRequestConfigurations } from "commons/Utils"
import Footer from '../../components/Common/Footer';
import IconViewDetail from '../../assets/img/icon/Icon-Arrow-Right.svg'
import IconTime from '../../assets/img/icon/Icon-Time.svg'
import IconGift from 'assets/img/icon/Icon_gift_red.svg'
import IconBackToTop from "assets/img/icon/Icon_back_to_top.svg"
import LoadingModal from "components/Common/LoadingModal"
import { getCurrentLanguage } from "../../commons/Utils"
import { isJsonString } from "../../utils/string"

const EmployeePrivileges = (props) => {
    const { t } = useTranslation()
    const myRef = useRef(null)
    const topOneRef = useRef(null)
    const totalTopArticles = 9

    const [isVisibleGoToTop, setIsVisibleGoToTop] = useState(false)
    const [listPrivileges, setListPrivileges] = useState(null)
    const [topOneHeight, setTopOneHeight] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const lang = getCurrentLanguage();

    useEffect(() => {
        const fetchEmployeePrivileges = async () => {
            const config = getRequestConfigurations()
            config.params = {
                pageIndex: 1,
                pageSize: 100,
                domain: 'ILVG',
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}article/privilege/list`, config)
                const listPrivilegeData = (response?.data?.data?.listPrivilege || []).map(item => ({
                    ...item,
                    description: isJsonString(item?.description) ? (JSON.parse(item?.description)?.[lang] || JSON.parse(item?.description)?.['vi']) : item?.description,
                    thumbnail: isJsonString(item?.thumbnail) ? (JSON.parse(item?.thumbnail)?.[lang] || JSON.parse(item?.thumbnail)?.['vi']) : item?.thumbnail,
                    title: isJsonString(item?.title) ? (JSON.parse(item?.title)?.[lang] || JSON.parse(item?.title)?.['vi']) : item?.title
                }))
                setListPrivileges(listPrivilegeData)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEmployeePrivileges()
    }, [])

    useEffect(() => {
      if (!topOneRef.current) return;
      const resizeObserver = new ResizeObserver(() => {
        setTopOneHeight(topOneRef?.current?.clientHeight)
      });
      resizeObserver.observe(topOneRef.current);
      return () => resizeObserver.disconnect();
    }, [topOneRef.current]);

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

    const totalArticles = listPrivileges?.length || 0
    const topOne = listPrivileges?.[0] || null
    const timePublishedTopOne = getTimeByRawTime(topOne?.publishedDate)
    const topFour = totalArticles > 1 && listPrivileges?.slice(1, totalTopArticles) || []
    const others = totalArticles > totalTopArticles && listPrivileges?.slice(totalTopArticles) || []

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="employee-privilege-page">
                <div onScroll={e => onScroll()} ref={myRef} className="scroll-custom">
                    <div className="container-fluid">
                        {
                            totalArticles > 0 ?
                            <>
                                <h1 className="page-title"><Image src={IconGift} alt="Đặc quyền CBNV VGR" className="ic-page-title" />{t("VingroupEmployeePrivileges")}</h1>
                                <div className="top-news">
                                    <div className="row">
                                        <div className="col-md-6 special">
                                            <div className="top-one shadow-customize" ref={topOneRef}>
                                                <a href={`/employee-privileges/${convertToSlug(topOne?.title)}/${topOne.id}`} className="link-detail">
                                                    <Image src={topOne?.thumbnail} alt="News" className="thumbnail"
                                                        onError={(e) => {
                                                            e.target.src = "/logo-large.svg"
                                                        }}
                                                    />
                                                    <p className="title">{topOne?.title || ""}</p>
                                                </a>
                                                <div className="other-info">
                                                    <div className="source-time-info">
                                                        <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne?.time + ' | ' + timePublishedTopOne?.date}</span></span>
                                                    </div>
                                                    <p className="description">{subStringDescription(topOne?.description || "")}</p>
                                                    <div className="btn-detail">
                                                        <a href={`/employee-privileges/${convertToSlug(topOne?.title)}/${topOne?.id}`} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 other">
                                            <div className="top-four shadow-customize" style={{ height: topOneHeight }}>
                                                {
                                                    topFour?.length > 0 ?
                                                    topFour.map((item, index) => {
                                                        let timePublished = getTimeByRawTime(item?.publishedDate)
                                                        return <div className="item" key={item?.id}>
                                                            <a href={`/employee-privileges/${convertToSlug(item?.title)}/${item?.id}`} className="link-image-detail">
                                                                <Image src={item?.thumbnail} className="thumbnail"
                                                                    onError={(e) => {
                                                                        e.target.src = "/logo-small.svg"
                                                                        e.target.className = `thumbnail error`
                                                                    }}
                                                                />
                                                            </a>
                                                            <div className="title-source-time-info">
                                                                <a href={`/employee-privileges/${convertToSlug(item?.title)}/${item?.id}`} className="title">{item?.title}</a>
                                                                <div className="source-time-info">
                                                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished?.time + ' | ' + timePublished?.date}</span></span>
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
                                {
                                    others?.length > 0 && (
                                        <div className="other-news shadow-customize">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <ReactList
                                                        itemRenderer={
                                                            (index, key) => {
                                                                const item = others[index];
                                                                let timePublished = getTimeByRawTime(item?.publishedDate)
                                                                return <div className="item" key={key}>
                                                                    <a href={`/employee-privileges/${convertToSlug(item?.title)}/${item?.id}`} className="link-image-detail">
                                                                        <Image src={item?.thumbnail} alt="News" className="thumbnail"
                                                                            onError={(e) => {
                                                                                e.target.src = "/logo-normal.svg"
                                                                                e.target.className = `thumbnail error`
                                                                            }}
                                                                        />
                                                                    </a>
                                                                    <div className="title-source-time-info">
                                                                        <div className="main-info">
                                                                            <a href={`/employee-privileges/${convertToSlug(item?.title)}/${item?.id}`} className="title">{item?.title}</a>
                                                                            <p className="description">{subStringDescription(item?.description)}</p>
                                                                            <div className="source-time-info">
                                                                                <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished?.time + ' | ' + timePublished?.date}</span></span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="btn-detail">
                                                                            <a href={`/employee-privileges/${convertToSlug(item?.title)}/${item?.id}`} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        }
                                                        length={others?.length}
                                                        type='variable'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                            : t("DataNotFound")
                        }
                    </div>
                    { listPrivileges?.length === 0 && (<Footer />) }
                    {
                        isVisibleGoToTop && (
                            <div onClick={e => scrollToTop()} className="scroll-to-top2" style={{ zIndex: '10' }}>
                                <span><img src={IconBackToTop} alt="Back to top" /></span>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default EmployeePrivileges
