import React, { useState, useEffect, Fragment } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import { actionButton, evaluation360Status, evaluationApiVersion } from '../Constants'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, getCurrentLanguage } from '../../../commons/Utils'
import { isJsonString } from "utils/string"
import { hasNotValue } from "../Utils"
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import CustomPaging from '../../../components/Common/CustomPaging'
import IconSend from '../../../assets/img/icon/Icon_send.svg'
import IconSave from '../../../assets/img/ic-save.svg'

const BatchEvaluation360 = ({ evaluationData }) => {
    const listPageSizes = [10, 20, 30, 40, 50]
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [users, SetUsers] = useState([])
    const [evaluationDataState, SetEvaluationDataState] = useState(null)
    const [paging, SetPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
        totalPages: 1,
    })
    const [refresh, SetRefresh] = useState(false)
    const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true })
    const [errors, SetErrors] = useState({})

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
    }, [paging])

    useEffect(() => {
        SetPaging({
            ...paging,
            pageIndex: 1, // Reset page index khi thay đổi page size
        })
    }, [paging.pageSize])

    const handleScoreChange = (index, targetIndex, e) => {
        const evaluationDataStateClone = {...evaluationDataState}
        evaluationDataStateClone.data[index].listGroup[1].listTarget[targetIndex].seftPoint = e?.target?.value || null
        SetEvaluationDataState(evaluationDataStateClone)
    }

    const handleInputChange = (index, e) => {
        const evaluationDataStateClone = {...evaluationDataState}
        evaluationDataStateClone.data[index].opinion = e?.target?.value || ''
        SetEvaluationDataState(evaluationDataStateClone)
    }

    const handleChangePageSize = (size = 1) => {
        SetPaging({
            ...paging,
            pageSize: size,
        })
    }

    const handleChangePage = (page = 1) => {
        SetPaging({
            ...paging,
            pageIndex: page,
        })
    }

    const onHideStatusModal = () => {
        SetStatusModal({
            isShow: false,
            isSuccess: true,
            content: '',
            needReload: true,
        })
    
        if (statusModal?.needReload) {
            window.location.reload()
        }
    }

    const isDataValid = () => {
        const errorTemp = {}
        for (let index = 0, len = evaluationDataState?.data?.length; index < len; index++) {
            const element = evaluationDataState?.data[index]
            if (!hasNotValue(element?.opinion) 
            || (element?.listGroup?.[1]?.listTarget || []).some(item => item?.seftPoint !== '' && item?.seftPoint !== null && item?.seftPoint !== undefined)) { // Đã thực hiện đánh giá
                for (let targetIndex = 0, lenTargets = element?.listGroup?.[1]?.listTarget?.length ; targetIndex < lenTargets; targetIndex++) {
                    const target = element?.listGroup?.[1]?.listTarget[targetIndex]
                    if (hasNotValue(target?.seftPoint)) {
                        errorTemp[`${index}-${targetIndex}-seftPoint`] = t("Required")
                    }
                }
            }
        }
        SetErrors(errorTemp)
        const hasError = (Object.values(errorTemp) || []).some(item => item)
        if (hasError) {
          SetStatusModal({
            ...statusModal,
            isShow: true,
            isSuccess: false,
            content: t("RequiredEvaluationScore"),
            needReload: false,
          })
        }
    
        return !hasError
    }

    const sendEvaluation = async (action = actionButton.save) => {
        if (action == actionButton.approve) {
            const isValid = isDataValid()
            if (!isValid) {
                return
            }
        }

        const statusModalTemp = { ...statusModal }
        SetIsLoading(true)
        try {
            const config = getRequestConfigurations()
            const payload = (evaluationDataState?.data || [])
            .filter(item => !hasNotValue(item?.opinion) || (item?.listGroup?.[1]?.listTarget || []).some(target => !hasNotValue(target?.seftPoint)))
            .map(item => {
                return {
                    ...item,
                    status: action == actionButton.approve ? evaluation360Status.evaluated : evaluation360Status.save
                }
            })

            const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/${evaluationApiVersion.v1}/targetform/update-batch`, { requestStrings: JSON.stringify(payload || []) }, config)
            SetErrors({})
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = action == actionButton.approve ? t("EvaluationFailedToEvaluateForm") : t("EvaluationFailedToSaveForm")
            if (response?.data) {
                const result = response.data?.result
                if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    statusModalTemp.isSuccess = true
                    statusModalTemp.content = action == actionButton.approve ? t("EvaluationFormEvaluatedSuccessfully") : t("EvaluationFormSaveSuccessfully")
                    statusModalTemp.needReload = true
                } else {
                    statusModalTemp.content = result?.message
                }
            }
            SetStatusModal(statusModalTemp)
        } catch (e) {
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            statusModalTemp.needReload = false
            SetStatusModal(statusModalTemp)
        } finally {
            SetIsLoading(false)
        }
    }

    const lang = getCurrentLanguage()
    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const jobPerformanceGroup = evaluationDataState?.data?.[0]?.listGroup?.[1]

    return (
        <>
        <LoadingModal show={isLoading} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} className='evaluation-status-modal' />
        {

            evaluationDataState?.data?.length > 0
            ? (
                <>
                    <div className="card shadow batch-evaluation-360">
                        <div className="wrap-table-batch-evaluation-360">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="col-customize sticky-col kpi">{t("ContentsOfAssessment")}</th>
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
                                                                        {
                                                                            !user?.isEdit || user?.isDeleted || user?.status == evaluation360Status.completed 
                                                                            ? (
                                                                                <input type="text" value={parseInt(user?.listGroup?.[1]?.listTarget?.[tIndex]?.seftPoint) === 0 ? 'N/A' : (user?.listGroup?.[1]?.listTarget?.[tIndex]?.seftPoint ?? '')} disabled />
                                                                            )
                                                                            : (
                                                                                <select onChange={e => handleScoreChange(uIndex, tIndex, e)} value={user?.listGroup?.[1]?.listTarget?.[tIndex]?.seftPoint ?? ''}>
                                                                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                                                                    {
                                                                                        (scores || []).map((score, i) => {
                                                                                            return (<option value={score} key={i}>{score === 0 ? 'N/A' : score}</option>)
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                            )
                                                                        }
                                                                        { errors[`${uIndex}-${tIndex}-seftPoint`] && (<div className="error-message">{errors[`${uIndex}-${tIndex}-seftPoint`]}</div>) }
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
                                                    <td className="col-customize sticky-col kpi">{t("Opinion")}</td>
                                                    {
                                                        (users || []).map((user, uIndex) => {
                                                            return (
                                                                <td key={`comment-${user?.id}-${uIndex}-${paging.pageIndex}`} className="col-customize user-point">
                                                                    <textarea 
                                                                        rows={3} 
                                                                        placeholder={t("EvaluationInput")} 
                                                                        value={user?.opinion || ""} 
                                                                        onChange={e => handleInputChange(uIndex, e)} 
                                                                        disabled={!user?.isEdit || user?.isDeleted || user?.status == evaluation360Status.completed} 
                                                                    />
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>{t("EvaluationShow")}</label>
                                <select value={paging.pageSize} onChange={(e) => handleChangePageSize(e?.target?.value)}>
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
                                    onChangePage={(page) => handleChangePage(page)} 
                                    totalRecords={evaluationDataState?.total} 
                                    needRefresh={refresh} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="button-region-batch-evaluation-360 d-flex justify-content-end">
                        <button className="btn-action save" onClick={() => sendEvaluation(actionButton.save)}><img src={IconSave} alt="Save" />{t("Save")}</button>
                        <button className="btn-action send" onClick={() => sendEvaluation(actionButton.approve)}><img src={IconSend} alt="Send" />{t("Evaluation360ButtonSend")}</button>
                    </div>
                </>
            )
            : (
                <div className="card shadow batch-evaluation-360">
                    <h6 className="alert alert-danger not-found-data" role="alert">Không tìm thấy dữ liệu</h6>
                </div>
            )
        }
        </>
    )
}

export default BatchEvaluation360
