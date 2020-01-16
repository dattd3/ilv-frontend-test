import React from "react";
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "../../../modules";
import NewsItemGrid from "./NewsItemGrid";

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
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{t("OtherNews")}</h1>
                </div>
                <div className="row list-news">
                    {
                        objDataRes.map((item, i) => {
                            return <NewsItemGrid article={item} key={i} col="3" />;
                        })
                    }
                </div>
            </div>
        );

    } else {
        return null;
    }
}
