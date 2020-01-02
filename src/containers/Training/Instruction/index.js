import React from "react";
import OnGoingClass from './OnGoingClass';
import SuccessClass from './SuccessClass';
import { useTranslation } from "react-i18next";

function Instruction() {
    const { t } = useTranslation();
    
    return (
        <>
            <h1 className="h3 mb-3 text-uppercase text-gray-800">{t("TeachingHistory")}</h1>
            <OnGoingClass />
            <SuccessClass />
        </>
    );
}
export default Instruction;