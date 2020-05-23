import React from "react";
import { useTranslation } from "react-i18next";

function Target(props) {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="h3 mb-3 text-uppercase text-gray-800">{t("KPI Detail")}</h1>
        </>
    );
}
export default Target;