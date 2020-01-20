import React from "react";
import { useApi, useFetcher } from "../../../../modules";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NewsRelationApp from './NewsRelationApp';
import LoadingSpinner from "../../../../components/Forms/CustomForm/LoadingSpinner";
import moment from 'moment';
import { useTranslation } from "react-i18next";

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

    if (result && result.data) {
        const detail = result.data;
        var content = detail.content;

        return (
            <div className="news-app">
                {
                    isApp ? null : <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/"><i className="fas fa-home"></i> {t("Menu")}</a> </li>
                            <li className="breadcrumb-item"><a href="/news">{t("NewsAndEvent")}</a></li>
                        </ol>
                    </nav>
                }

                <div className="d-sm-flex align-items-center justify-content-between">
                    <h1 className="h3 mb-0 text-gray-800">{detail.title}</h1>
                </div>
                <div className="mb-4">
                    <span className="datetime-info w3-left">
                        <i className="far fa-user"></i> &nbsp;
                            {detail.sourceSite}
                    </span>
                    &nbsp;&nbsp;&nbsp;
                       <span className="datetime-info">
                        <i className="far">&#xf017;</i> &nbsp;
                            {moment(detail.publishedDate).format('DD/MM/YYYY')}
                    </span>
                </div>
                <div className="news-detail" dangerouslySetInnerHTML={{ __html: content }}>
                </div>
                <div className="news-source text-right small">
                    <a href={detail.sourceUrl} className="text-gray-600" target='_blank'>Xem bài gốc</a>
                </div>
                <hr />
                <NewsRelationApp id={Id} />
            </div>
        );
    } else {
        return <LoadingSpinner />;
    }
}

function NewsDetailApp(props) {
    return (
        <div>
            <Router>
                <Route path="/news-app/:Id" component={NewsDetailElement} />
            </Router>
        </div>
    );
}
export default NewsDetailApp;
