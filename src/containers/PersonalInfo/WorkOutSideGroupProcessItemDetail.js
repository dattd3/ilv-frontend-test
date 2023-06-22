import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { size } from "lodash"
import { prefixUpdating } from "./WorkOutSideGroup"
import { formatStringByMuleValue } from "../../commons/Utils"
import IconEyeClosed from "assets/img/icon/not-eye.svg"
import IconEyeOpened from "assets/img/icon/eye.svg"

function WorkOutSideGroupProcessItemDetail({ index, item, hiddenViewSalary, handleToggleViewSalary, handleInputChange }) {
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
                            <div className="value">{item[`BEG${itemNo}`] && moment(item[`BEG${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                            <div className="value second">{item[`BEG${itemNo}`] && moment(item[`BEG${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("End")}</label>
                            <div className="value">{item[`END${itemNo}`] && moment(item[`END${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                            <div className="value second">{item[`END${itemNo}`] && moment(item[`END${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Title")}</label>
                            <div className="value">{item[`PLAN${itemNo}`] || ''}</div>
                            <div className="value second">{item[`PLAN${itemNo}`] || ''}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="group-input role">
                            <label>{t("MainRole")}</label>
                            <div className="value">{item[`DUT${itemNo}`] || ''}</div>
                            <div className="value second">{item[`DUT${itemNo}`] || ''}</div>
                        </div>
                    </div>
                </div>
                <div className="row salary">
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("NetSalary")}</label>
                            <div className="value salary-view"><span>{getSalaryByValue(item[`DE_NET${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>
                            <div className="value second salary-view"><span>{getSalaryByValue(item[`DE_NET${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("GrossSalary")}</label>
                            <div className="value salary-view"><span>{getSalaryByValue(item[`DE_GROSS${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>
                            <div className="value second salary-view"><span>{getSalaryByValue(item[`DE_GROSS${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Currency")}</label>
                            <div className="value">{item[`WAERS${itemNo}`] || ''}</div>
                            <div className="value second">{item[`WAERS${itemNo}`] || ''}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkOutSideGroupProcessItemDetail
