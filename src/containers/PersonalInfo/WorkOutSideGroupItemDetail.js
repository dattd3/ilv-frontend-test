import React from "react"
import { useTranslation } from "react-i18next"
import { Collapse } from "react-bootstrap"
import moment from 'moment'
import IconCollapse from "assets/img/icon/pms/icon-collapse.svg"
import IconExpand from "assets/img/icon/pms/icon-expand.svg"
import WorkOutSideGroupProcessItemDetail from "./WorkOutSideGroupProcessItemDetail"
import { valueType, isEmptyByValue, formatValue } from "./WorkOutSideGroupDetail"

function WorkOutSideGroupItemDetail({ index, item, isAddNew, hiddenViewSalary, handleToggleProcess, handleToggleViewSalary }) {
    const { t } = useTranslation()

    let listWorking = []
    let isDeleted = false
    let ORGEH = null
    let BEGDA = null
    let ENDDA = null
    if (isAddNew) {
        ORGEH = item?.ORGEH || null
        BEGDA = item?.BEGDA || null
        ENDDA = item?.ENDDA || null
        for (let i = 1; i < 6; i++) {
            listWorking = [...listWorking, {
                [`BEG${i}`]: item[`BEG${i}`],
                [`END${i}`]: item[`END${i}`],
                [`PLAN${i}`]: item[`PLAN${i}`],
                [`DUT${i}`]: item[`DUT${i}`],
                [`DE_NET${i}`]: item[`DE_NET${i}`],
                [`DE_GROSS${i}`]: item[`DE_GROSS${i}`],
                [`WAERS${i}`]: item[`WAERS${i}`],
            }]
        }
    } else {
        isDeleted = item?.NewExperience?.isDeleted
        ORGEH = item?.OldExperience?.ORGEH || null
        BEGDA = item?.OldExperience?.BEGDA || null
        ENDDA = item?.OldExperience?.ENDDA || null

        let { NewExperience, OldExperience } = item
        for (let i = 1; i < 6; i++) {
            listWorking = [...listWorking, 
                {
                    OldExperience: {
                        [`BEG${i}`]: OldExperience[`BEG${i}`],
                        [`END${i}`]: OldExperience[`END${i}`],
                        [`PLAN${i}`]: OldExperience[`PLAN${i}`],
                        [`DUT${i}`]: OldExperience[`DUT${i}`],
                        [`DE_NET${i}`]: OldExperience[`DE_NET${i}`],
                        [`DE_GROSS${i}`]: OldExperience[`DE_GROSS${i}`],
                        [`WAERS${i}`]: OldExperience[`WAERS${i}`],
                    },
                    NewExperience: {
                        [`BEG${i}`]: NewExperience[`BEG${i}`],
                        [`END${i}`]: NewExperience[`END${i}`],
                        [`PLAN${i}`]: NewExperience[`PLAN${i}`],
                        [`DUT${i}`]: NewExperience[`DUT${i}`],
                        [`DE_NET${i}`]: NewExperience[`DE_NET${i}`],
                        [`DE_GROSS${i}`]: NewExperience[`DE_GROSS${i}`],
                        [`WAERS${i}`]: NewExperience[`WAERS${i}`],
                    },
                }
            ]
        }
    }
    item.listWorking = listWorking

    const prepareClassByConditions = (isDeleted = false, newValue, valType = valueType.other) => {
        if (isDeleted) {
            return 'deleted'
        }
        return isEmptyByValue(newValue, valType) ? '' : 'updated'
    }

    const isOnlyUpdated = (() => {
        return !isAddNew && !isDeleted
    })()

    const isOnlyUpdateCompanyInfo = (() => {
        return !isAddNew && !isDeleted 
        && (
            !isEmptyByValue(item?.NewExperience?.ORGEH, valueType.other) 
            || !isEmptyByValue(item?.NewExperience?.BEGDA, valueType.date) 
            || !isEmptyByValue(item?.NewExperience?.ENDDA, valueType.date)
        )
    })()

    return (
        <div className="work-outside-group-item">
            <div className="company-info">
                <div className="group-header">
                    <h5>{t("CompanyInfo")}</h5>
                </div>
                <div className={ isAddNew ? 'company add-new' : item?.NewExperience?.isDeleted ? 'company deleted' : 'company' }>
                    <div className="company-item">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="group-name">
                                    <label>{t("CompanyName")}</label>
                                    <div className="value">{formatValue(ORGEH, valueType.other)}</div>
                                    {
                                        isOnlyUpdateCompanyInfo && (
                                            <div className={`value second ${prepareClassByConditions(item?.NewExperience?.isDeleted, item?.NewExperience?.ORGEH, valueType.other)}`}>{formatValue(item?.NewExperience?.ORGEH, valueType.other)}</div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-date">
                                    <label>{t("Start")}</label>
                                    <div className="value">{BEGDA && moment(BEGDA, 'YYYYMMDD').isValid() ? moment(BEGDA, 'YYYYMMDD').format('DD/MM/YYYY') : ''}</div>
                                    {
                                        isOnlyUpdateCompanyInfo && (
                                            <div className={`value second ${prepareClassByConditions(item?.NewExperience?.isDeleted, item?.NewExperience?.BEGDA, valueType.date)}`}>{item?.NewExperience?.BEGDA && moment(item?.NewExperience?.BEGDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-date">
                                    <label>{t("End")}</label>
                                    <div className="value">{ENDDA && moment(ENDDA, 'YYYYMMDD').isValid() ? moment(ENDDA, 'YYYYMMDD').format('DD/MM/YYYY') : ''}</div>
                                    {
                                        isOnlyUpdateCompanyInfo && (
                                            <div className={`value second ${prepareClassByConditions(item?.NewExperience?.isDeleted, item?.NewExperience?.ENDDA, valueType.date)}`}>{item?.NewExperience?.ENDDA && moment(item?.NewExperience?.ENDDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Collapse in={!item?.isCollapse}>
                        <div className="process">
                        {
                            (item?.listWorking || []).map((sub, subIndex) => {
                                return (
                                    <WorkOutSideGroupProcessItemDetail 
                                        key={`${index}-${subIndex}`}
                                        index={subIndex}
                                        item={sub}
                                        isAddNew={isAddNew}
                                        isOnlyUpdated={isOnlyUpdated}
                                        hiddenViewSalary={hiddenViewSalary}
                                        handleToggleViewSalary={handleToggleViewSalary}
                                    />
                                )
                            })
                        }
                        </div>
                    </Collapse>
                    <div className="collapse-expand-block">
                        <span onClick={() => handleToggleProcess(index, isAddNew)}>
                            <img src={item?.isCollapse ? IconExpand : IconCollapse} alt={item?.isCollapse ? 'Expand' : 'Collapse'} />
                            <span>{item?.isCollapse ? t("ExpandAll") : t("Collapse")}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkOutSideGroupItemDetail