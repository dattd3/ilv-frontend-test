import React from "react";
import OnGoingClass from './OnGoingClass';
import SuccessClass from './SuccessClass';
import RejectClass from './RejectClass';
import { useTranslation } from "react-i18next";

function Learning(props) {
    const { t } = useTranslation();


    return (
        <>
            <h1 className="h3 mb-3 text-uppercase text-gray-800">{t("LearningHistory")}</h1>
            <OnGoingClass />
            <SuccessClass />
            <RejectClass />
        </>
    );
}
export default Learning;