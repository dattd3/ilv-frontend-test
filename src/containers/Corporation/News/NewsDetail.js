import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import moment from 'moment';
import purify from "dompurify"
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "../../../modules";
import NewsRelation from './NewsRelation';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import HOCComponent from '../../../components/Common/HOCComponent'
import IconBack from '../../../assets/img/icon/Icon-Arrow-Left.svg'
import IconUser from '../../../assets/img/icon/Icon-User.svg'
import IconTime from '../../../assets/img/icon/Icon-Time.svg'

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleDetail,
        autoRun: true,
        params: params
    });
    return data;
};

function NewsDetailElement({ match, location }) {
    const {
        params: { Id }
    } = match;
    const { t } = useTranslation();

    const result = usePreload([Id]);
    const searchParams = new URLSearchParams(location.search);
    const isApp = searchParams.get('isApp') || false;

    const getTimeByRawTime = rawTime => {
        const time = moment(rawTime).isValid() ? moment(rawTime) : null
        return {
            time: time?.format("HH:mm") || "",
            date: time?.format("DD/MM/YYYY") || ""
        }
    }

    if (result && result.data) {
        const detail = result.data
        const content = detail.content
        const timePublished = getTimeByRawTime(detail.publishedDate)

        return (
            <>
            <div className="back-block"><a href="/" title={t("ComeBack")}><Image src={IconBack} alt="Back" className="ic-back" />{t("ComeBack")}</a></div>
            <div className="news-detail-page">
                {/* {
                    isApp ? null : <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/"><i className="fas fa-home"></i> {t("Menu")}</a> </li>
                            <li className="breadcrumb-item"><a href="/news">{t("NewsAndEvent")}</a></li>
                        </ol>
                    </nav>
                } */}
                <div className="news-content">
                    <h1 className="news-title">{detail.title}</h1>
                    <div className="source-time-info">
                        <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{detail?.sourceSite || ""}</span></span>
                        <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished?.date}</span></span>
                    </div>
                    <h2 className="news-description">{detail.description}</h2>
                    <div className="news-detail" dangerouslySetInnerHTML={{
                        __html: purify.sanitize(content || ''),
                    }}>
                    </div>
                    <div className="news-source">{t("Source")}: {detail.sourceSite}</div>
                </div>
                <hr />
                <NewsRelation id={Id} />
            </div>
            </>
        );
    } else {
        return <LoadingSpinner />;
    }
}

function NewsDetail(props) {
    return (
        <div>
            <Router>
                <Route path="/news/detail/:Id" component={NewsDetailElement} />
            </Router>
        </div>
    );
}

export default HOCComponent(NewsDetail);
