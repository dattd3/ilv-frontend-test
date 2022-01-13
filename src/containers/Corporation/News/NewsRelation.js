import React from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { useApi, useFetcher } from "../../../modules"
import { prepareNews } from "./NewsUtils"
import NewsItemGrid from "./NewsItemGrid"
import IconDiamond from '../../../assets/img/icon/Icon-Diamond.svg'

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleOthers,
        autoRun: true,
        params: params
    });
    return data;
};
 
export default function NewsRelation(props) {
    const { t } = useTranslation();
    const { id } = props;
    const result = usePreload([id, 4]);

    if (result && result.data) {
        const objDataRes = result.data;

        return (
            <div className="news-others">
                <h4 className="page-title"><Image src={IconDiamond} alt="News" />{t("OtherNews")}</h4>
                <div className="row list-news">
                    {
                        objDataRes.map((item, i) => {
                            let news = prepareNews(item)
                            return <NewsItemGrid article={news} key={news.id} id={news.id} />
                        })
                    }
                </div>
            </div>
        );

    } else {
        return null;
    }
}
