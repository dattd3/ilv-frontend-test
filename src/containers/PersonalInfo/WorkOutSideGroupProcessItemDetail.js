import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import IconEyeClosed from "assets/img/icon/not-eye.svg"
import IconEyeOpened from "assets/img/icon/eye.svg"

function WorkOutSideGroupProcessItemDetail({ index, item, isAddNew, isShowLine2, hiddenViewSalary, handleToggleViewSalary }) {
    const { t } = useTranslation()
    const itemNo = index + 1
    const line1Number = 1
    const line2Number = 2
    const valueType = {
        date: 'date',
        salary: 'salary',
        other: 'other',
    }

    const getSalaryByValue = (val) => {
        if (val !== null && val !== '') {
            if (hiddenViewSalary) {
                return '**********'
            }
            return val
        }
        return null
    }

    const showValueByConditions = (key, lineNumber = line1Number, valType = valueType.other) => {
        try {
            const currentDefaultValue = item[key]
            switch (valType) {
                case valueType.date:
                    return lineNumber === line1Number 
                    ? isAddNew ? (currentDefaultValue ? moment(currentDefaultValue, 'YYYYMMDD').format('DD/MM/YYYY') : '') : (item?.OldExperience[key] ? moment(item?.OldExperience[key], 'YYYYMMDD').format('DD/MM/YYYY') : '') 
                    : isAddNew ? (currentDefaultValue ? moment(currentDefaultValue, 'YYYYMMDD').format('DD/MM/YYYY') : '') : (item?.NewExperience[key] ? moment(item?.NewExperience[key], 'YYYYMMDD').format('DD/MM/YYYY') : '')
                case valueType.salary:
                    return lineNumber === line1Number 
                    ? isAddNew ? getSalaryByValue(currentDefaultValue) : getSalaryByValue(item?.OldExperience[key])
                    : isAddNew ? getSalaryByValue(currentDefaultValue) : getSalaryByValue(item?.NewExperience[key])
                default:
                    return lineNumber === line1Number 
                    ? isAddNew ? (currentDefaultValue || '') : (item?.OldExperience[key] || '') 
                    : isAddNew ? (currentDefaultValue || '') : (item?.NewExperience[key] || '')
            }
        } catch {
            return ''
        }
    }

    const BEG_Line1 = showValueByConditions(`BEG${itemNo}`, line1Number, valueType.date)
    const BEG_Line2 = showValueByConditions(`BEG${itemNo}`, line2Number, valueType.date)
    const END_Line1 = showValueByConditions(`END${itemNo}`, line1Number, valueType.date)
    const END_Line2 = showValueByConditions(`END${itemNo}`, line2Number, valueType.date)
    const PLAN_Line1 = showValueByConditions(`PLAN${itemNo}`, line1Number, valueType.other)
    const PLAN_Line2 = showValueByConditions(`PLAN${itemNo}`, line2Number, valueType.other)
    const DUT_Line1 = showValueByConditions(`DUT${itemNo}`, line1Number, valueType.other)
    const DUT_Line2 = showValueByConditions(`DUT${itemNo}`, line2Number, valueType.other)
    const DE_NET_Line1 = showValueByConditions(`DE_NET${itemNo}`, line1Number, valueType.salary)
    const DE_NET_Line2 = showValueByConditions(`DE_NET${itemNo}`, line2Number, valueType.salary)
    const DE_GROSS_Line1 = showValueByConditions(`DE_GROSS${itemNo}`, line1Number, valueType.salary)
    const DE_GROSS_Line2 = showValueByConditions(`DE_GROSS${itemNo}`, line2Number, valueType.salary)
    const WAERS_Line1 = showValueByConditions(`WAERS${itemNo}`, line1Number, valueType.other)
    const WAERS_Line2 = showValueByConditions(`WAERS${itemNo}`, line2Number, valueType.other)

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
                                isShowLine2 && (
                                    <div className={`value second ${BEG_Line1 !== BEG_Line2 ? 'updated' : ''}`}>{BEG_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("End")}</label>
                            <div className="value">{END_Line1}</div>
                            {
                                isShowLine2 && (
                                    <div className={`value second ${END_Line1 !== END_Line2 ? 'updated' : ''}`}>{END_Line2}</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Title")}</label>
                            <div className="value">{PLAN_Line1}</div>
                            {
                                isShowLine2 && (
                                    <div className={`value second ${PLAN_Line1 !== PLAN_Line2 ? 'updated' : ''}`}>{PLAN_Line2}</div>
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
                                isShowLine2 && (
                                    <div className={`value second ${DUT_Line1 !== DUT_Line2 ? 'updated' : ''}`}>{DUT_Line2}</div>
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
                                isShowLine2 && (
                                    <div className={`value second salary-view ${DE_NET_Line1 !== DE_NET_Line2 ? 'updated' : ''}`}>
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
                                isShowLine2 && (
                                    <div className={`value second salary-view ${DE_GROSS_Line1 !== DE_GROSS_Line2 ? 'updated' : ''}`}>
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
                                isShowLine2 && (
                                    <div className={`value second ${WAERS_Line1 !== WAERS_Line2 ? 'updated' : ''}`}>{WAERS_Line2}</div>
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
