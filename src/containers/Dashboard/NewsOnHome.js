import React, { useState } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { useApi, useFetcher } from "../../modules"

// import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner"
import CustomPaging from '../../components/Common/CustomPaging'
import IconDiamond from '../../assets/img/icon/Icon-Diamond.svg'
import IconViewDetail from '../../assets/img/icon/Icon-Arrow-Right.svg'
import IconUser from '../../assets/img/icon/Icon-User.svg'
import IconTime from '../../assets/img/icon/Icon-Time.svg'

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleList,
        autoRun: true,
        params: params
    });
    return data;
};

const convertToSlug = input => {
    let slug = input?.toLowerCase()
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
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

function NewsOnHome(props) {
    const { t } = useTranslation()
    const [pageIndex, SetPageIndex] = useState(1)
    const [pageSize, SetPageSize] = useState(9)

    const listArticles = usePreload([pageIndex, pageSize])


    const articles = listArticles?.data || []
    const totalArticles = articles.totalRecord

    console.log("AAAAAAAAAAAAAAAAAAAA")
    console.log(articles)


    const onChangePage = page => {
        SetPageIndex(page)
    }

    const topOne = totalArticles > 0 ? articles.listArticles[0] : null
    const timePublishedTopOne = getTimeByRawTime(topOne?.publishedDate)

    console.log(topOne?.thumbnail)

    return (
        totalArticles > 0 ?
        <>
        <h1 className="page-title"><Image src={IconDiamond} alt="News" className="ic-page-title" />{t("NewsAndEvent")}</h1>
        <div className="top-news">
            <div className="row">
                <div className="col-md-6 special">
                    <div className="top-one">
                        <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-detail">
                            <Image src={topOne?.thumbnail} alt="News" className="thumbnail" 
                                onError={(e) => {
                                    e.target.src = "https://ircdn.vingroup.net/storage/Uploads/0_Tintuchoatdong/2021/Jun/Anh%20VinFuture%20Prize%20Council.jpg"
                                }}
                            />
                            <p className="title">{topOne.title || ""}</p>
                        </a>
                        <div className="other-info">
                            <div className="source-time-info">
                                <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                            </div>
                            <p className="description">{subStringDescription(topOne.description)}...</p>
                            <div className="btn-detail">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 other">
                    <div className="top-four">
                        <div className="item">
                            <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                                <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                            </a>
                            <div className="title-source-time-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                                <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                            </a>
                            <div className="title-source-time-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                                <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                            </a>
                            <div className="title-source-time-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                                <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                            </a>
                            <div className="title-source-time-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="other-news">
            <div className="row">
                <div className="col-md-12">
                    <div className="item">
                        <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                            <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                        </a>
                        <div className="title-source-time-info">
                            <div className="main-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <p className="description">{subStringDescription(topOne.description)}...</p>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                            <div className="btn-detail">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                            <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                        </a>
                        <div className="title-source-time-info">
                            <div className="main-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <p className="description">{subStringDescription(topOne.description)}...</p>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                            <div className="btn-detail">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                            <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                        </a>
                        <div className="title-source-time-info">
                            <div className="main-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <p className="description">{subStringDescription(topOne.description)}...</p>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                            <div className="btn-detail">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="link-image-detail">
                            <Image src={topOne.thumbnail} alt="News" className="thumbnail" />
                        </a>
                        <div className="title-source-time-info">
                            <div className="main-info">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="title">{topOne.title}</a>
                                <p className="description">{subStringDescription(topOne.description)}...</p>
                                <div className="source-time-info">
                                    <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{topOne.sourceSite || ""}</span></span>
                                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublishedTopOne.time} | {timePublishedTopOne.date}</span></span>
                                </div>
                            </div>
                            <div className="btn-detail">
                                <a href={`/news/${convertToSlug(topOne.title)}/${topOne.id}`} title={topOne.title} className="detail"><span>{t("Details")}</span><Image src={IconViewDetail} alt="Detail" className="icon-view-detail" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-sm"></div>
            <div className="col-sm">
                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={totalArticles} />
            </div>
            <div className="col-sm text-right">
                {t("Total")}: {totalArticles}
            </div>
        </div>
        </>
        : t("DataNotFound")
    );
}

export default NewsOnHome;