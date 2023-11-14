import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import { useGuardStore } from '../../../modules'
import { getRequestConfigurations } from '../../../commons/Utils'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import { evaluationStatus, evaluationApiVersion } from '../Constants'
import IconLoop from '../../../assets/img/icon/Icon_Loop.svg'
import { useCookiesHook } from '../../../commons/hooks'
import HOCComponent from '../../../components/Common/HOCComponent'

function EvaluationFormItem(props) {
    const { t } = useTranslation()
    const { item } = props

    const statusDone = 5
    const statusMapping = {
        label: item?.status === statusDone ? t("EvaluationDetailCompleted") : t("EvaluationInProgress"),
        className: item?.status === statusDone ? 'done' : 'in-progress',
    }

    const stepMapping = {
        [evaluationStatus.initialization]: {label: 'Khởi tạo', nextStep: 'Khởi chạy'},
        [evaluationStatus.launch]: {label: 'Khởi chạy', nextStep: t("EvaluationSelfAssessment")},
        [evaluationStatus.selfAssessment]: {label: t("EvaluationSelfAssessment"), nextStep: t("EvaluationDetailEmployeeManagerAssessment")},
        [evaluationStatus.qlttAssessment]: {label: t("EvaluationDetailEmployeeManagerAssessment"), nextStep: t("EvaluationManagerApproval")},
        [evaluationStatus.cbldApproved]: {label: t("EvaluationManagerApproval"), nextStep: t("EvaluationDetailCompleted")},
    }

    return (
        <tr>
            <td className='c-form-name'><div className='form-name'><a href={`/evaluations/${item?.checkPhaseFormId}/${item?.formCode}/${item?.version}`} alt={item?.checkPhaseFormName} className="form-name">{item?.checkPhaseFormName}</a></div></td>
            <td className='c-created-date text-center'><div className='created-date'>{item?.runFormDate && moment(item?.runFormDate).format("DD/MM/YYYY")}</div></td>
            <td className='c-status text-center'><div className={`status ${statusMapping?.className}`}>{statusMapping?.label}</div></td>
            <td className='c-step text-center'><div className='step'>{stepMapping[item?.status]?.nextStep}</div></td>
        </tr>
    )
}

function MyEvaluation(props) {
    const currentYear = new Date().getFullYear()
    const { t } = useTranslation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    // const { accessToken } = useCookiesHook()
    
    const [evaluationForms, SetEvaluationForms] = useState([])
    const [years, SetYears] = useState([])
    const [year, SetYear] = useState({value: currentYear, label: currentYear})
    const [isLoading, SetIsLoading] = useState(false)
    const [statusModal, SetStatusModal] = useState({isShow: false, content: '', isSuccess: true})

    useEffect(() => {
        const processInitialData = response => {
            const [yearData, evaluationFormData] = response

            if (yearData && yearData?.status === 'fulfilled') {
                const yearDataValue = yearData?.value
                if (yearDataValue && yearDataValue?.data && yearDataValue?.data?.result && yearDataValue?.data?.result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    let yearsResult = yearDataValue?.data?.data
                    if (!yearsResult.includes(currentYear)) {
                        yearsResult.push(currentYear)
                    }
                    const yearsToSave = (yearsResult || []).map(item => ({value: item, label: item}))
                    SetYears(yearsToSave)
                }
            }
            if (evaluationFormData && evaluationFormData?.status === 'fulfilled') {
                const evaluationFormDataValue = evaluationFormData?.value
                if (evaluationFormDataValue && evaluationFormDataValue?.data && evaluationFormDataValue?.data?.result && evaluationFormDataValue?.data?.result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    SetEvaluationForms(evaluationFormDataValue?.data?.data || [])
                }
            }
        }

        const fetchDataInitial = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                const getEvaluationYearConfig = {...config}
                getEvaluationYearConfig.params = {
                    EmployeeCode: user?.employeeNo
                }
                const requestGetEvaluationYears = axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/listYear`, getEvaluationYearConfig)
                const requestGetListEvaluationForms = fetchListEvaluationForms()
                const response = await Promise.allSettled([requestGetEvaluationYears, requestGetListEvaluationForms])
                processInitialData(response)
            } catch (e) {
                SetStatusModal({
                    ...statusModal,
                    isShow: true,
                    content: t("AnErrorOccurred"),
                    isSuccess: false
                })
            } finally {
                SetIsLoading(false)
            }
        }

        fetchDataInitial()
    }, [])

    const handleChangeSelectInput = e => {
        SetYear(e)
    }

    const fetchListEvaluationForms = () => {
        const config = getRequestConfigurations()
        config.params = {
            PageIndex: 1,
            PageSize: 100,
            EmployeeCode: user?.employeeNo,
            Year: year?.value
        }
        return axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/listUseForm`, config)
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        SetIsLoading(true)
        try {
            const response = await fetchListEvaluationForms()
            if (response?.data?.result?.code == Constants.PMS_API_SUCCESS_CODE) {
                SetEvaluationForms(response?.data?.data || [])
            }
        } catch (e) {
            SetStatusModal({
                ...statusModal,
                isShow: true,
                content: t("AnErrorOccurred"),
                isSuccess: false
            })
        } finally {
            SetIsLoading(false)
        }
    }

    const renderListEvaluationForms = () => {
        return (
            (evaluationForms || []).map((item, index) => {
                return <React.Fragment key={index}>
                    <EvaluationFormItem item={item} />
                </React.Fragment>
            })
        )
    }

    const onHideStatusModal = () => {
        SetStatusModal({
            ...statusModal,
            isShow: false,
            content: '',
            isSuccess: true
        })
    }

    return (
        <>
        <LoadingModal show={isLoading} />
        <StatusModal show={statusModal.isShow} content={statusModal.content} isSuccess={statusModal.isSuccess} onHide={onHideStatusModal} />
        <div className="my-evaluation-page">
            <h1 className="content-page-header">{t("EvaluationLabel")}</h1>
            <div className="card card-evaluation">
                <form onSubmit={handleOnSubmit}>
                    <div className="filter-block">
                        <p className="label-filter">{t("EvaluationSelectYear")}</p>
                        <div className="form-filter">
                            <div className="year-input">
                                <Select 
                                    placeholder={t("EvaluationSelectYear")} 
                                    isClearable={true} 
                                    value={year} 
                                    options={years} 
                                    onChange={handleChangeSelectInput} />
                            </div>
                            <button type="submit" className="btn-filter"><Image src={IconLoop} alt='Loop' />{t("Search")}</button>
                        </div>
                    </div>
                </form>
                {
                    evaluationForms?.length > 0 ?
                    <div className="wrap-table-list-evaluation">
                        <table className='table-list-evaluation'>
                            <thead>
                                <tr>
                                    <th className='c-form-name text-center'><div className='form-name'>{t("EvaluationFormName")}</div></th>
                                    <th className='c-created-date text-center'><div className='created-date'>{t("EvaluationCreatedOn")}</div></th>
                                    <th className='c-status text-center'><div className='status'>{t("EvaluationStatus")}</div></th>
                                    <th className='c-step text-center'><div className='step'>{t("EvaluationCurrentStep")}</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                { renderListEvaluationForms() }
                            </tbody>
                        </table>
                    </div>
                    : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                }
            </div>
        </div>
        </>
    )
}

export default HOCComponent(MyEvaluation)
