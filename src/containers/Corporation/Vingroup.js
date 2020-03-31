import React, { useEffect } from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleDetail,
        autoRun: true,
        params: params
    });
    return data;
};

function Vingroup(props) {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("Menu_GroupIntroduction");
    });

    const result = usePreload([1]);


    if (result && result.data) {
        const detail = result.data;
        var content = detail.content;

        return (
            <div className="about-vingroup" dangerouslySetInnerHTML={{ __html: content }}>
            </div>
        );
    } else {
        return <LoadingSpinner />;
    }
}
export default Vingroup;