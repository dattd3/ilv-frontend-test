import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import IconEyeClosed from "assets/img/icon/not-eye.svg"
import IconEyeOpened from "assets/img/icon/eye.svg"
import { valueType, isEmptyByValue, formatValue } from "./WorkOutSideGroupDetail"

function WorkOutSideGroupProcessItemDetail({ index, item, isAddNew, isOnlyUpdated, hiddenViewSalary, handleToggleViewSalary }) {
    const { t } = useTranslation()
    const itemNo = index + 1

    const getSalaryByValue = (val) => {
        if (val !== null && val !== '') {
            if (hiddenViewSalary) {
                return '**********'
            }
            return val
        }
        return null
    }

    const showValueByConditions = (key, lineNumber = 1, valType = valueType.other) => {
        try {
            const currentDefaultValue = item[key]
            switch (valType) {
                case valueType.date:
                    return lineNumber === 1 
                    ? isAddNew ? (currentDefaultValue && moment(currentDefaultValue, 'YYYYMMDD').isValid() ? moment(currentDefaultValue, 'YYYYMMDD').format('DD/MM/YYYY') : null) : (item?.OldExperience[key] && moment(item?.OldExperience[key], 'YYYYMMDD').isValid() ? moment(item?.OldExperience[key], 'YYYYMMDD').format('DD/MM/YYYY') : null) 
                    : isAddNew ? (currentDefaultValue && moment(currentDefaultValue, 'YYYYMMDD').isValid() ? moment(currentDefaultValue, 'YYYYMMDD').format('DD/MM/YYYY') : null) : (item?.NewExperience[key] && moment(item?.NewExperience[key], 'YYYYMMDD').isValid() ? moment(item?.NewExperience[key], 'YYYYMMDD').format('DD/MM/YYYY') : null)
                case valueType.salary:
                    return lineNumber === 1 
                    ? isAddNew ? getSalaryByValue(currentDefaultValue) : getSalaryByValue(item?.OldExperience[key])
                    : isAddNew ? getSalaryByValue(currentDefaultValue) : getSalaryByValue(item?.NewExperience[key])
                default:
                    return lineNumber === 1 
                    ? isAddNew ? (currentDefaultValue) : (item?.OldExperience[key]) 
                    : isAddNew ? (currentDefaultValue) : (item?.NewExperience[key])
            }
        } catch {
            return ''
        }
    }

    const BEG_Line1 = showValueByConditions(`BEG${itemNo}`, 1, valueType.date)
    const BEG_Line2 = showValueByConditions(`BEG${itemNo}`, 2, valueType.date)
    const END_Line1 = showValueByConditions(`END${itemNo}`, 1, valueType.date)
    const END_Line2 = showValueByConditions(`END${itemNo}`, 2, valueType.date)
    const PLAN_Line1 = showValueByConditions(`PLAN${itemNo}`, 1, valueType.other)
    const PLAN_Line2 = showValueByConditions(`PLAN${itemNo}`, 2, valueType.other)
    const DUT_Line1 = showValueByConditions(`DUT${itemNo}`, 1, valueType.other)
    const DUT_Line2 = showValueByConditions(`DUT${itemNo}`, 2, valueType.other)
    const DE_NET_Line1 = showValueByConditions(`DE_NET${itemNo}`, 1, valueType.salary)
    const DE_NET_Line2 = showValueByConditions(`DE_NET${itemNo}`, 2, valueType.salary)
    const DE_GROSS_Line1 = showValueByConditions(`DE_GROSS${itemNo}`, 1, valueType.salary)
    const DE_GROSS_Line2 = showValueByConditions(`DE_GROSS${itemNo}`, 2, valueType.salary)
    const WAERS_Line1 = showValueByConditions(`WAERS${itemNo}`, 1, valueType.other)
    const WAERS_Line2 = showValueByConditions(`WAERS${itemNo}`, 2, valueType.other)

    const isShowRow1 = isOnlyUpdated && (!isEmptyByValue(BEG_Line2, valueType.date) || !isEmptyByValue(END_Line2, valueType.date) || !isEmptyByValue(PLAN_Line2))
    const isShowRow2 = isOnlyUpdated && !isEmptyByValue(DUT_Line2)
    const isShowRow3 = isOnlyUpdated && (!isEmptyByValue(DE_NET_Line2) || !isEmptyByValue(DE_GROSS_Line2) || !isEmptyByValue(WAERS_Line2))

    return (
        <div className="process-item">
            <div className="group-header">
                <h5>{t("WorkProcess")} {itemNo}</h5>
            </div>
            <div className="content">
                <div className="row">
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("Start")}</label>
                            <div className="value">{BEG_Line1}</div>
                            {
                                isShowRow1 && (
                                    <div className={`value second ${!isEmptyByValue(BEG_Line2, valueType.date) ? 'updated' : ''}`}>{BEG_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("End")}</label>
                            <div className="value">{END_Line1}</div>
                            {
                                isShowRow1 && (
                                    <div className={`value second ${!isEmptyByValue(END_Line2, valueType.date) ? 'updated' : ''}`}>{END_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Title")}</label>
                            <div className="value">{PLAN_Line1}</div>
                            {
                                isShowRow1 && (
                                    <div className={`value second ${!isEmptyByValue(PLAN_Line2) ? 'updated' : ''}`}>{PLAN_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="group-input role">
                            <label>{t("MainRole")}</label>
                            <div className="value">{DUT_Line1}</div>
                            {
                                isShowRow2 && (
                                    <div className={`value second ${!isEmptyByValue(DUT_Line2) ? 'updated' : ''}`}>{DUT_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="row salary">
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("NetSalary")}</label>
                            <div className="value salary-view">
                                <span>{DE_NET_Line1}</span>
                                {
                                    DE_NET_Line1 && (<img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} />)
                                }
                            </div>
                            {
                                isShowRow3 && (
                                    <div className={`value second salary-view ${!isEmptyByValue(DE_NET_Line2) ? 'updated' : ''}`}>
                                        <span>{DE_NET_Line2}</span>
                                        {
                                            DE_NET_Line2 && (<img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} />)
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("GrossSalary")}</label>
                            <div className="value salary-view">
                                <span>{DE_GROSS_Line1}</span>
                                {
                                    DE_GROSS_Line1 && (<img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} />)
                                }
                            </div>
                            {
                                isShowRow3 && (
                                    <div className={`value second salary-view ${!isEmptyByValue(DE_GROSS_Line2) ? 'updated' : ''}`}>
                                        <span>{DE_GROSS_Line2}</span>
                                        {
                                            DE_GROSS_Line2 && (<img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} />)
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Currency")}</label>
                            <div className="value">{WAERS_Line1}</div>
                            {
                                isShowRow3 && (
                                    <div className={`value second ${!isEmptyByValue(WAERS_Line2) ? 'updated' : ''}`}>{WAERS_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkOutSideGroupProcessItemDetail
