import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import moment from 'moment';
import purify from "dompurify"
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "../../../modules";
import mapConfig from "containers/map.config"
import NewsRelation from './NewsRelation';
import HOCComponent from '../../../components/Common/HOCComponent'
import IconBack from '../../../assets/img/icon/Icon-Arrow-Left.svg'
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

function EmployeePrivilegeDetailElement({ match, location }) {
    const {
        params: { Id }
    } = match;
    const { t } = useTranslation();
    const result = usePreload([Id]);

    const getTimeByRawTime = rawTime => {
        const time = moment(rawTime).isValid() ? moment(rawTime) : null
        return {
            time: time?.format("HH:mm") || "",
            date: time?.format("DD/MM/YYYY") || ""
        }
    }

    const detail = result?.data
    const timePublished = getTimeByRawTime(detail?.publishedDate)

    return (
        <>
        <div className="back-block"><a href={mapConfig.EmployeePrivileges} title={t("ComeBack")}><Image src={IconBack} alt="Back" className="ic-back" />{t("ComeBack")}</a></div>
        <div className="news-detail-page">
            <div className="news-content">
                <h1 className="news-title">{detail?.title || ''}</h1>
                <div className="source-time-info">
                    <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished?.time + ' | ' + timePublished?.date}</span></span>
                </div>
                <h2 className="news-description">{detail?.description || ''}</h2>
                <div className="news-detail" dangerouslySetInnerHTML={{
                    __html: purify.sanitize(detail?.content || ''),
                }} />
            </div>
            <hr />
            <NewsRelation id={Id} isEmployeePrivilege={true} />
        </div>
        </>
    )
}

function EmployeePrivilegeDetail(props) {
    return (
        <div>
            <Router>
                <Route path="/employee-privileges/:Slug/:Id" component={EmployeePrivilegeDetailElement} />
            </Router>
        </div>
    );
}

export default HOCComponent(EmployeePrivilegeDetail);
