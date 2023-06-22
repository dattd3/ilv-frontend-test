import React, {useEffect} from "react"
import { useTranslation } from "react-i18next"
import DatePicker, {registerLocale } from 'react-datepicker'
import { Collapse } from "react-bootstrap"
import moment from 'moment'
import { prefixUpdating } from "./WorkOutSideGroup"
import WorkOutSideGroupProcessItem from "./WorkOutSideGroupProcessItem"
import IconCancel from "assets/img/icon/Icon_Cancel_White.svg"
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg"
import IconAddGreen from "assets/img/ic-add-green.svg"
import IconCollapse from "assets/img/icon/pms/icon-collapse.svg"
import IconExpand from "assets/img/icon/pms/icon-expand.svg"
import vi from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
import WorkOutSideGroupProcessItemDetail from "./WorkOutSideGroupProcessItemDetail"
registerLocale("vi", vi)

const prepareClassByConditions = (isDeleted = false, oldValue, newValue) => {
    if (isDeleted) {
        return 'deleted'
    }

    return oldValue !== newValue ? 'updated' : ''
}

const isDifference = (oldValue, newValue) => {
    return oldValue !== newValue
}

function WorkOutSideGroupItemDetail({ index, item, canUpdate, hiddenViewSalary, handleRemoveCompany, handleToggleProcess, handleToggleViewSalary, handleInputChangeOnParent }) {
    const { t } = useTranslation()

    const handleInputChange = (key, value) => {
        handleInputChangeOnParent(index, key, value)
    }

    console.log('kaskasdfkasdfkadsf', item)

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
                </div>
                <div className={item?.NewExperience?.isDeleted ? 'company deleted' : 'company' }>
                    <div className="company-item">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="group-name">
                                    <label>{t("CompanyName")}</label>
                                    <div className="value">{item?.OldExperience?.ORGEH || ''}</div>
                                    {
                                        isDifference(item?.OldExperience?.ORGEH, item?.NewExperience?.ORGEH) && (
                                            <div className={`value second ${prepareClassByConditions(item?.NewExperience?.isDeleted, item?.OldExperience?.ORGEH, item?.NewExperience?.ORGEH)}`}>{item?.NewExperience?.ORGEH || ''}</div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-date">
                                    <label>{t("Start")}</label>
                                    <div className="value">{item?.OldExperience?.BEGDA && moment(item?.OldExperience?.BEGDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                                    {
                                        isDifference(item?.OldExperience?.BEGDA, item?.NewExperience?.BEGDA) && (
                                            <div className={`value second ${prepareClassByConditions(item?.NewExperience?.isDeleted, item?.OldExperience?.BEGDA, item?.NewExperience?.BEGDA)}`}>{item?.NewExperience?.BEGDA && moment(item?.NewExperience?.BEGDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-date">
                                    <label>{t("End")}</label>
                                    <div className="value">{item?.OldExperience?.ENDDA && moment(item?.OldExperience?.ENDDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>
                                    {
                                        isDifference(item?.OldExperience?.ENDDA, item?.NewExperience?.ENDDA) && (
                                            <div className={`value second ${prepareClassByConditions(item?.NewExperience?.isDeleted, item?.OldExperience?.ENDDA, item?.NewExperience?.ENDDA)}`}>{item?.NewExperience?.ENDDA && moment(item?.NewExperience?.ENDDA, 'YYYYMMDD').format('DD/MM/YYYY')}</div>
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
                                        canUpdate={canUpdate}
                                        hiddenViewSalary={hiddenViewSalary}
                                        handleToggleViewSalary={handleToggleViewSalary}
                                        handleInputChange={handleInputChange}
                                    />
                                )
                            })
                        }
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

export { prepareClassByConditions }
export default WorkOutSideGroupItemDetail