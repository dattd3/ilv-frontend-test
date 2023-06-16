import React from "react"
import { useTranslation } from "react-i18next"
import DatePicker, {registerLocale } from 'react-datepicker'
import { Collapse, Button } from "react-bootstrap"
import moment from 'moment'
import { size } from "lodash"
import { prefixUpdating } from "./WorkOutSideGroup"
import { formatStringByMuleValue } from "../../commons/Utils"
import IconCancel from "assets/img/icon/Icon_Cancel_White.svg"
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg"
import IconEyeClosed from "assets/img/icon/not-eye.svg"
import IconEyeOpened from "assets/img/icon/eye.svg"
import vi from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
registerLocale("vi", vi)

function WorkOutSideGroupProcessItem({ index, item, canUpdate, hiddenViewSalary, handleToggleViewSalary, handleInputChange }) {
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
                {/* {
                    canUpdate && size(item?.listWorking || {}) > 1 && (
                        <span className="btn-cancel" onClick={() => handleRemoveProcess(index, sub[0])}>
                            <img src={IconCancel} alt="Cancel" />
                        </span>
                    )
                } */}
            </div>
            <div className="content">
                <div className="row">
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("Start")}</label>
                            {
      
                                canUpdate
                                ? (
                                    <>
                                    {
                                        item?.isAddNew
                                        ? (
                                            <label className="input-date">
                                                <DatePicker
                                                    selected={item[`BEG${itemNo}`] ? moment(item[`BEG${itemNo}`], 'YYYYMMDD').toDate() : null}
                                                    onChange={dateInput => handleInputChange(`BEG${itemNo}`, !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="vi"
                                                    className="form-control form-control-lg input"/>
                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                            </label>
                                        )
                                        : (<div className="value">{item[`BEG${itemNo}`] && moment(item[`BEG${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                                    }
                                    {
                                        !item?.isAddNew && (
                                            <label className="input-date second">
                                                <DatePicker
                                                    selected={item[`BEG${itemNo}_${prefixUpdating}`] ? moment(item[`BEG${itemNo}_${prefixUpdating}`], 'YYYYMMDD').toDate() : null}
                                                    onChange={dateInput => handleInputChange(`BEG${itemNo}_${prefixUpdating}`, !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="vi"
                                                    className="form-control form-control-lg input"/>
                                                    <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                            </label>
                                        )
                                    }
                                    </>
                                )
                                : (<div className="value">{item[`BEG${itemNo}`] && moment(item[`BEG${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                            }
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("End")}</label>
                            {
                                canUpdate
                                ? (
                                    <>
                                    {
                                        item?.isAddNew
                                        ? (
                                            <label className="input-date">
                                                <DatePicker
                                                    selected={item[`END${itemNo}`] ? moment(item[`END${itemNo}`], 'YYYYMMDD').toDate() : null}
                                                    onChange={dateInput => handleInputChange(`END${itemNo}`, !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="vi"
                                                    className="form-control form-control-lg input"/>
                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                            </label>
                                        )
                                        : (<div className="value">{item[`END${itemNo}`] && moment(item[`END${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                                    }
                                    {
                                        !item?.isAddNew && (
                                            <label className="input-date second">
                                                <DatePicker
                                                    selected={item[`END${itemNo}_${prefixUpdating}`] ? moment(item[`END${itemNo}_${prefixUpdating}`], 'YYYYMMDD').toDate() : null}
                                                    onChange={dateInput => handleInputChange(`END${itemNo}_${prefixUpdating}`, !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="vi"
                                                    className="form-control form-control-lg input"/>
                                                    <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                            </label>
                                        )
                                    }
                                    </>
                                )
                                : (<div className="value">{item[`END${itemNo}`] && moment(item[`END${itemNo}`], 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Title")}</label>
                            {
                                canUpdate
                                ? (
                                    <>
                                        {
                                            item?.isAddNew
                                            ? (<input type="text" placeholder={t("import")} value={item[`PLAN${itemNo}`] || ""} onChange={e => handleInputChange(`PLAN${itemNo}`, e?.target?.value || '')} className="first" />)
                                            : (<div className="value">{item[`PLAN${itemNo}`] || ''}</div>)
                                        }
                                        {!item?.isAddNew && (<input type="text" placeholder={t("import")} value={item[`PLAN${itemNo}_${prefixUpdating}`] || ""} onChange={e => handleInputChange(`PLAN${itemNo}_${prefixUpdating}`, e?.target?.value || '')} className="second" />)}
                                    </>
                                )
                                : (<div className="value">{item[`PLAN${itemNo}`] || ''}</div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="group-input role">
                            <label>{t("MainRole")}</label>
                            {
                                canUpdate
                                ? (
                                    <>
                                        {
                                            item?.isAddNew
                                            ? (<textarea rows="2" value={item[`DUT${itemNo}`] || ""} onChange={e => handleInputChange(`DUT${itemNo}`, e?.target?.value || '')} />)
                                            : (<div className="value">{item[`DUT${itemNo}`] || ''}</div>)
                                        }
                                        {!item?.isAddNew && (<textarea rows="2" value={item[`DUT${itemNo}_${prefixUpdating}`] || ""} onChange={e => handleInputChange(`DUT${itemNo}_${prefixUpdating}`, e?.target?.value || '')} className="second" />)}       
                                    </>
                                )
                                : (<div className="value">{item[`DUT${itemNo}`] || ''}</div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="row salary">
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("NetSalary")}</label>
                            {
                                canUpdate
                                ? (
                                    <>
                                        {
                                            item?.isAddNew
                                            ? (<input type="text" placeholder={t("import")} value={item[`NET${itemNo}`] || ''} onChange={e => handleInputChange(`NET${itemNo}`, e?.target?.value || '')} className="first" />)
                                            : (<div className="value"><span>{getSalaryByValue(item[`NET${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>)
                                        }
                                        {!item?.isAddNew && (<input type="text" placeholder={t("import")} value={item[`NET${itemNo}_${prefixUpdating}`] || ''} onChange={e => handleInputChange(`NET${itemNo}_${prefixUpdating}`, e?.target?.value || '')} className="second" />)}
                                    </>
                                )
                                : (<div className="value"><span>{getSalaryByValue(item[`NET${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>)
                            }
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="group-input">
                            <label>{t("GrossSalary")}</label>
                            {
                                canUpdate
                                ? (
                                    <>
                                        {
                                            item?.isAddNew
                                            ? (<input type="text" placeholder={t("import")} value={item[`GROSS${itemNo}`] || ''} onChange={e => handleInputChange(`GROSS${itemNo}`, e?.target?.value || '')} className="first" />)
                                            : (<div className="value"><span>{getSalaryByValue(item[`GROSS${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>)
                                        }
                                        {!item?.isAddNew && (<input type="text" placeholder={t("import")} value={item[`GROSS${itemNo}_${prefixUpdating}`] || ''} onChange={e => handleInputChange(`GROSS${itemNo}_${prefixUpdating}`, e?.target?.value || '')} className="second" />)}
                                    </>
                                )
                                : (<div className="value"><span>{getSalaryByValue(item[`GROSS${itemNo}`])}</span><img src={hiddenViewSalary ? IconEyeClosed : IconEyeOpened} alt='Eye' className="eye" onClick={handleToggleViewSalary} /></div>)
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="group-input">
                            <label>{t("Currency")}</label>
                            {
                                canUpdate
                                ? (
                                    <>
                                        {
                                            item?.isAddNew
                                            ? (<input type="text" placeholder={t("import")} value={item[`WAERS${itemNo}`] || ''} onChange={e => handleInputChange(`WAERS${itemNo}`, e?.target?.value || '')} className="first" maxLength={5} />)
                                            : (<div className="value">{item[`WAERS${itemNo}`] || ''}</div>)
                                        }

                                        {!item?.isAddNew && (<input type="text" placeholder={t("import")} value={item[`WAERS${itemNo}_${prefixUpdating}`] || ''} onChange={e => handleInputChange(`WAERS${itemNo}_${prefixUpdating}`, e?.target?.value || '')} className="second" maxLength={5} />)}
                                    </>
                                )
                                : (<div className="value">{item[`WAERS${itemNo}`] || ''}</div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkOutSideGroupProcessItem