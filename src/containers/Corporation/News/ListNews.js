import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import CustomPaging from '../../../components/Common/CustomPaging';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import { useTranslation } from "react-i18next";
import NewsItemGrid from "./NewsItemGrid";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleList,
        autoRun: true,
        params: params
    });
    return data;
};
 
function ListNews() {

    const { t } = useTranslation();
    const [pageIndex, SetPageIndex] = useState(1);
    const [pageSize, SetPageSize] = useState(9);

    const result = usePreload([pageIndex, pageSize]);

    function onChangePage(page) {
        SetPageIndex(page);
    }

    if (result && result.data) {
        const objDataRes = result.data;
        return (
            <>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">{t("NewsAndEvent")}</h1>
                </div>
                <div className="row list-news">
                    {
                        objDataRes.listArticles.map((item, i) => {
                            return <NewsItemGrid article={item}  key={i} />;
                        })
                    }
                </div>
                <div className="row">
                    <div className="col-sm"> </div>
                    <div className="col-sm">
                        <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={objDataRes.totalRecord} />
                    </div>
                    <div className="col-sm text-right">
                        {t("Total")}: {objDataRes.totalRecord}
                    </div>
                </div>
            </>
        );

    } else {
        return <LoadingSpinner />;
    }
}
export default ListNews;
