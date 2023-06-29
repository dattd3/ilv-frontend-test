import React from "react"
import { useTranslation } from "react-i18next"
import DatePicker, {registerLocale } from 'react-datepicker'
import { Collapse } from "react-bootstrap"
import moment from 'moment'
import { prefixUpdating } from "./WorkOutSideGroup"
import WorkOutSideGroupProcessItem from "./WorkOutSideGroupProcessItem"
import IconCancel from "assets/img/icon/Icon_Cancel_White.svg"
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg"
import IconCollapse from "assets/img/icon/pms/icon-collapse.svg"
import IconExpand from "assets/img/icon/pms/icon-expand.svg"
import vi from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
registerLocale("vi", vi)

function WorkOutSideGroupItem({ index, item, canUpdate, viewSalaryAtLeastOnceTime, hiddenViewSalary, handleRemoveCompany, handleToggleProcess, handleToggleViewSalary, handleInputChangeOnParent }) {
    const { t } = useTranslation()

    const handleInputChange = (key, value) => {
        handleInputChangeOnParent(index, key, value)
    }

    let listWorking = []
    for (let i = 1; i < 6; i++) {
        listWorking = [...listWorking, {
            [`BEG${i}`]: item[`BEG${i}`],
            [`END${i}`]: item[`END${i}`],
            [`PLAN${i}`]: item[`PLAN${i}`],
            [`DUT${i}`]: item[`DUT${i}`],
            [`DE_NET${i}`]: item[`DE_NET${i}`],
            [`DE_GROSS${i}`]: item[`DE_GROSS${i}`],
            [`WAERS${i}`]: item[`WAERS${i}`],
            ...(item?.isAddNew !== undefined && { isAddNew: item?.isAddNew }),
            ...(item[`BEG${i}_${prefixUpdating}`] !== undefined && { [`BEG${i}_${prefixUpdating}`]: item[`BEG${i}_${prefixUpdating}`] }),
            ...(item[`END${i}_${prefixUpdating}`] !== undefined && { [`END${i}_${prefixUpdating}`]: item[`END${i}_${prefixUpdating}`] }),
            ...(item[`PLAN${i}_${prefixUpdating}`] !== undefined && { [`PLAN${i}_${prefixUpdating}`]: item[`PLAN${i}_${prefixUpdating}`] }),
            ...(item[`DUT${i}_${prefixUpdating}`] !== undefined && { [`DUT${i}_${prefixUpdating}`]: item[`DUT${i}_${prefixUpdating}`] }),
            ...(item[`DE_NET${i}_${prefixUpdating}`] !== undefined && { [`DE_NET${i}_${prefixUpdating}`]: item[`DE_NET${i}_${prefixUpdating}`] }),
            ...(item[`DE_GROSS${i}_${prefixUpdating}`] !== undefined && { [`DE_GROSS${i}_${prefixUpdating}`]: item[`DE_GROSS${i}_${prefixUpdating}`] }),
            ...(item[`WAERS${i}_${prefixUpdating}`] !== undefined && { [`WAERS${i}_${prefixUpdating}`]: item[`WAERS${i}_${prefixUpdating}`] }),
        }]
    }
    item.listWorking = listWorking

    return (
        <div className="work-outside-group-item">
            <div className="company-info">
                <div className="group-header">
                    <h5>{t("CompanyInfo")}</h5>
                    {
                        canUpdate && (
                            <span className="btn-cancel" onClick={() => handleRemoveCompany(index)}>
                                <img src={IconCancel} alt="Cancel" />
                                <span>{t("Cancel2")}</span>
                            </span>
                        )
                    }
                </div>
                <div className="company">
                    <div className="company-item">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="group-name">
                                    <label>{t("CompanyName")}</label>
                                    {
                                        canUpdate
                                        ? (
                                            <>
                                                {
                                                    item?.isAddNew
                                                    ? (<input type="text" placeholder={t("import")} value={item?.ORGEH || ''} onChange={e => handleInputChange('ORGEH', e?.target?.value || '')} className="first" />)
                                                    : (<div className="value">{item?.ORGEH || ''}</div>)
                                                }
                                                {!item?.isAddNew && (<input type="text" placeholder={t("import")} value={item[`ORGEH_${prefixUpdating}`] || ''} onChange={e => handleInputChange(`ORGEH_${prefixUpdating}`, e?.target?.value || '')} className="second" />)}
                                            </>
                                        )
                                        : (<div className="value">{item?.ORGEH || ''}</div>)
                                    }
                                </div>
                                {
                                    item?.errorCompanyName && (<div className="message-in-valid">{item?.errorCompanyName}</div>)
                                }
                            </div>
                            <div className="col-md-2">
                                <div className="group-date">
                                    <label>{t("Start")}</label>
                                    {
                                        // canUpdate && item?.isAddNew
                                        // ? (
                                        //     <label className="input-date">
                                        //         <DatePicker
                                        //             selected={item?.BEGDA ? moment(item?.BEGDA, 'YYYYMMDD').toDate() : null}
                                        //             onChange={dateInput => handleInputChange('BEGDA', !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                        //             dateFormat="dd/MM/yyyy"
                                        //             locale="vi"
                                        //             className="form-control form-control-lg input"/>
                                        //             <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                        //     </label>
                                        // )
                                        // : (<div className="value">{ item?.BEGDA && moment(item?.BEGDA, 'YYYYMMDD').format('DD/MM/YYYY') }</div>)

                                        canUpdate
                                        ? (
                                            <>
                                                {
                                                    item?.isAddNew
                                                    ? (
                                                        <label className="input-date">
                                                            <DatePicker
                                                                selected={item?.BEGDA ? moment(item?.BEGDA, 'YYYYMMDD').toDate() : null}
                                                                maxDate={item?.ENDDA ? moment(item?.ENDDA, 'YYYYMMDD').toDate() : null}
                                                                onChange={dateInput => handleInputChange('BEGDA', !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                                dateFormat="dd/MM/yyyy"
                                                                locale="vi"
                                                                className="form-control form-control-lg input"/>
                                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                        </label>
                                                    )
                                                    : (<div className="value">{item?.BEGDA && moment(item?.BEGDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                                                }
                                                {!item?.isAddNew && (
                                                    <label className="input-date second">
                                                        <DatePicker
                                                            selected={item[`BEGDA_${prefixUpdating}`] ? moment(item[`BEGDA_${prefixUpdating}`], 'YYYYMMDD').toDate() : null}
                                                            maxDate={item[`ENDDA_${prefixUpdating}`] ? moment(item[`ENDDA_${prefixUpdating}`], 'YYYYMMDD').toDate() : item?.ENDDA ? moment(item?.ENDDA, 'YYYYMMDD').toDate() : null}
                                                            onChange={dateInput => handleInputChange(`BEGDA_${prefixUpdating}`, !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                            dateFormat="dd/MM/yyyy"
                                                            locale="vi"
                                                            className="form-control form-control-lg input"/>
                                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                    </label>
                                                )}
                                            </>
                                        )
                                        : (<div className="value">{item?.BEGDA && moment(item?.BEGDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                                    }
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-date">
                                    <label>{t("End")}</label>
                                    {
                                        // canUpdate && item?.isAddNew
                                        // ? (
                                        //     <label className="input-date">
                                        //         <DatePicker
                                        //             selected={item?.ENDDA ? moment(item?.ENDDA, 'YYYYMMDD').toDate() : null}
                                        //             onChange={dateInput => handleInputChange('ENDDA', !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                        //             dateFormat="dd/MM/yyyy"
                                        //             locale="vi"
                                        //             className="form-control form-control-lg input"/>
                                        //             <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                        //     </label>
                                        // )
                                        // : (<div className="value">{item?.ENDDA && moment(item?.ENDDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>)

                                        canUpdate
                                        ? (
                                            <>
                                                {
                                                    item?.isAddNew
                                                    ? (
                                                        <label className="input-date">
                                                            <DatePicker
                                                                selected={item?.ENDDA ? moment(item?.ENDDA, 'YYYYMMDD').toDate() : null}
                                                                minDate={item?.BEGDA ? moment(item?.BEGDA, 'YYYYMMDD').toDate() : null}
                                                                onChange={dateInput => handleInputChange('ENDDA', !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                                dateFormat="dd/MM/yyyy"
                                                                locale="vi"
                                                                className="form-control form-control-lg input"/>
                                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                        </label>
                                                    )
                                                    : (<div className="value">{item?.ENDDA && moment(item?.ENDDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                                                }
                                                {!item?.isAddNew && (
                                                    <label className="input-date second">
                                                        <DatePicker
                                                            selected={item[`ENDDA_${prefixUpdating}`] ? moment(item[`ENDDA_${prefixUpdating}`], 'YYYYMMDD').toDate() : null}
                                                            minDate={item[`BEGDA_${prefixUpdating}`] ? moment(item[`BEGDA_${prefixUpdating}`], 'YYYYMMDD').toDate() : item?.BEGDA ? moment(item?.BEGDA, 'YYYYMMDD').toDate() : null}
                                                            maxDate={item?.ENDDA ? moment(item?.ENDDA, 'YYYYMMDD').toDate() : null}
                                                            onChange={dateInput => handleInputChange(`ENDDA_${prefixUpdating}`, !dateInput ? null : moment(dateInput).format('YYYYMMDD'))}
                                                            dateFormat="dd/MM/yyyy"
                                                            locale="vi"
                                                            className="form-control form-control-lg input"/>
                                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                    </label>
                                                )}
                                            </>
                                        )
                                        : (<div className="value">{item?.ENDDA && moment(item?.ENDDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <Collapse in={!item?.isCollapse}>
                        {/* Quá trình */}
                        <div className="process">
                        {
                            (item?.listWorking || []).map((sub, subIndex) => {
                                return (
                                    <WorkOutSideGroupProcessItem 
                                        key={`${index}-${subIndex}`}
                                        index={subIndex}
                                        item={sub}
                                        maxEndDate={item?.isAddNew ? item?.ENDDA : item[`ENDDA_${prefixUpdating}`] ? item[`ENDDA_${prefixUpdating}`] : item?.ENDDA}
                                        canUpdate={canUpdate}
                                        viewSalaryAtLeastOnceTime={viewSalaryAtLeastOnceTime}
                                        hiddenViewSalary={hiddenViewSalary}
                                        handleToggleViewSalary={handleToggleViewSalary}
                                        handleInputChange={handleInputChange}
                                    />
                                )
                            })
                        }
                        {/* {
                            canUpdate && (
                                <div className="block-btn-add-process">
                                    <button onClick={() => handleAddProcess(index)}><img src={IconAddGreen} alt="Add" /><span>{t("AddProcess")}</span></button>
                                </div>
                            )
                        } */}
                        </div>
                    </Collapse>
                    <div className="collapse-expand-block">
                        <span onClick={() => handleToggleProcess(index)}>
                            <img src={item?.isCollapse ? IconExpand : IconCollapse} alt={item?.isCollapse ? 'Expand' : 'Collapse'} />
                            <span>{item?.isCollapse ? t("ExpandAll") : t("Collapse")}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkOutSideGroupItem