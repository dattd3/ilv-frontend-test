import React, { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Row, Col, Collapse } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import { evaluationStatus, actionButton, processStep, stepEvaluation360Config, evaluation360Status, evaluationApiVersion } from '../Constants'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations, getCurrentLanguage } from '../../../commons/Utils'
import { isJsonString } from "utils/string"
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import EvaluationDetailModal from '../EvaluationDetailModal'
import SearchUser from '../SearchUser'
import CustomPaging from '../../../components/Common/CustomPaging'
import HOCComponent from '../../../components/Common/HOCComponent'
import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'
import IconCollapse from '../../../assets/img/icon/pms/icon-collapse.svg'
import IconSearch from '../../../assets/img/icon/Icon_Loop.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconSend from '../../../assets/img/icon/Icon_send.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const employeeCode = localStorage.getItem('employeeNo')
const employeeAD = localStorage.getItem('email').split('@')[0]
const approvalTabCode = 'approval'
const batchApprovalTabCode = 'batchApproval'

const BatchEvaluation360 = ({ evaluationData }) => {
    const listPageSizes = [10, 20, 30, 40, 50]
    const { t } = useTranslation()
    const history = useHistory()
    const [isLoading, SetIsLoading] = useState(false)
    const [users, SetUsers] = useState([])
    const [evaluationDataState, SetEvaluationDataState] = useState(null)
    const [paging, SetPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
        totalPages: 1,
    })
    const [refresh, SetRefresh] = useState(false)

    useEffect(() => {
        const indexLastItem = paging.pageIndex * paging.pageSize
        const indexFirstItem = indexLastItem - paging.pageSize

        SetPaging({
            ...paging,
            totalPages: Math.ceil((evaluationData?.total || 0) / paging.pageSize)
        })
        SetEvaluationDataState(evaluationData)
        SetUsers((evaluationData?.data || []).slice(indexFirstItem, indexLastItem))
    }, [evaluationData])

    useEffect(() => {
        const indexLastItem = paging.pageIndex * paging.pageSize
        const indexFirstItem = indexLastItem - paging.pageSize
        SetUsers((evaluationDataState?.data || []).slice(indexFirstItem, indexLastItem))
    }, [paging.pageIndex])

    useEffect(() => {
        SetPaging({
            ...paging,
            pageIndex: 1, // Reset page index khi thay đổi page size
        })
    }, [paging.pageSize])

    const handleInputChange = (index, targetIndex, e) => {
        const evaluationDataStateClone = {...evaluationDataState}
        evaluationDataStateClone.data[index].listGroup[1].listTarget[targetIndex].seftPoint = e?.target?.value || null
        SetEvaluationDataState(evaluationDataStateClone)
    }

    const handleChangePageSize = () => {

    }

    const handleChangePage = () => {

    }

    const lang = getCurrentLanguage()
    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const jobPerformanceGroup = evaluationDataState?.data?.[0]?.listGroup?.[1]

    console.log('ahihihi => ', jobPerformanceGroup)
    console.log('evaluationDataState => ', evaluationDataState)
    console.log('users => ', users)

    return (
        <>
        <LoadingModal show={isLoading} />
        {/* <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} className='evaluation-status-modal' /> */}
        
        <div className="card shadow batch-evaluation-360">
            <div className="wrap-table-batch-evaluation-360">
                <table>
                    <thead>
                        <tr>
                            <th className="col-customize sticky-col kpi">Nội dung đánh giá</th>
                            {
                                (users || []).map((user, uIndex) => {
                                    return (
                                        <th key={`${paging.pageIndex}-${uIndex}`} className="col-customize user-point">
                                            <div className="user">
                                                <div className="full-name">{user?.fullName}</div>
                                                <div className="employee-code">({user?.employeeCode})</div>
                                            </div>
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (jobPerformanceGroup?.listTarget || []).map((target, tIndex) => {
                                return (
                                    <Fragment key={target?.id}>
                                        {
                                            target?.kpiGroup 
                                            ? (
                                                <tr className="group">
                                                    <td colSpan={3} className="sticky-col group">{target?.kpiGroup}</td>
                                                </tr>
                                            )
                                            : (
                                                <tr>
                                                    <td colSpan={users?.length} className="row-seperate"></td>
                                                </tr>
                                            )
                                        }
                                        <tr className="kpi-item">
                                            <td className="col-customize sticky-col kpi">{isJsonString(target?.targetName) ? (JSON.parse(target?.targetName)?.[lang] || JSON.parse(target?.targetName)?.['vi']) : target?.targetName}</td>
                                            {
                                                (users || []).map((user, uIndex) => {
                                                    return (
                                                        <td key={`${target?.id}-${uIndex}-${paging.pageIndex}`} className="col-customize user-point">
                                                            <select onChange={e => handleInputChange(uIndex, tIndex, e)} value={user?.listGroup?.[1]?.listTarget?.[tIndex]?.seftPoint || ''}>
                                                                <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                                                {
                                                                    (scores || []).map((score, i) => {
                                                                        return (<option value={score} key={i}>{score}</option>)
                                                                    })
                                                                }
                                                            </select>
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }

                        {
                            users?.length > 0 && (
                                <>
                                    <tr>
                                        <td colSpan={users?.length} className="row-seperate"></td>
                                    </tr>
                                    <tr className="kpi-item">
                                        <td className="col-customize sticky-col kpi">Ý kiến</td>
                                        {
                                            (users || []).map((user, uIndex) => {
                                                return (
                                                    <td key={`comment-${user?.id}-${uIndex}-${paging.pageIndex}`} className="col-customize user-point">
                                                        <textarea 
                                                            rows={3} 
                                                            placeholder={t("EvaluationInput")} 
                                                            value={user?.opinion || ""} 
                                                            onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'seftOpinion', e)} 
                                                            // disabled={isDisableEmployeeComment} 
                                                        />
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                </>
                            )
                        }



                        
                        {/* <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={9} className="row-seperate"></td>
                        </tr> */}

                        {/* <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr className="group">
                            <td colSpan={3} className="sticky-col group">Năng lực chuyên môn | Professional competency</td>
                        </tr>
                        <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>

            <div className="bottom-region">
                    <div className="customize-display">
                        <label>{t("EvaluationShow")}</label>
                        <select value={paging.pageSize} onChange={(e) => handleChangePageSize('approval', e?.target?.value)}>
                            {
                                listPageSizes.map((page, i) => {
                                    return <option value={page} key={i}>{page}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="paging-block">
                        <CustomPaging 
                            pageSize={parseInt(paging.pageSize)} 
                            onChangePage={(page) => handleChangePage('approval', page)} 
                            totalRecords={evaluationDataState?.total} 
                            needRefresh={refresh} 
                        />
                    </div>
                </div>
            </div>
            <div className="button-region">
                <button className="btn-action approve"><img src={IconSend} alt="Approve" />Gửi</button>
            </div>
        </>
    )
}

export default BatchEvaluation360
