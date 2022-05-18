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
import map from '../../map.config'
import { evaluationStatus } from '../Constants'
import IconLoop from '../../../assets/img/icon/Icon_Loop.svg'

function EvaluationFormItem(props) {
    const { item } = props
    const statusDone = 5
    const statusMapping = {
        label: item?.status === statusDone ? 'Đã hoàn thành' : 'Đang đánh giá',
        className: item?.status === statusDone ? 'done' : 'in-progress',
    }

    const stepMapping = {
        [evaluationStatus.initialization]: {label: 'Khởi tạo', nextStep: 'Khởi chạy'},
        [evaluationStatus.launch]: {label: 'Khởi chạy', nextStep: 'Tự đánh giá'},
        [evaluationStatus.selfAssessment]: {label: 'Tự đánh giá', nextStep: 'QLTT đánh giá'},
        [evaluationStatus.qlttAssessment]: {label: 'QLTT đánh giá', nextStep: 'CBLĐ phê duyệt'},
        [evaluationStatus.cbldApproved]: {label: 'CBLĐ phê duyệt', nextStep: 'Hoàn thành'},
    }

    return (
        <tr>
            <td className='c-form-name'><div className='form-name'><a href={`/evaluations/${item?.checkPhaseFormId}/${item?.formCode}`} alt={item?.checkPhaseFormName} className={`form-name ${statusMapping?.className}`}>{item?.checkPhaseFormName}</a></div></td>
            <td className='c-created-date text-center'><div className='created-date'>{item?.createDate && moment(item?.createDate).format("DD/MM/YYYY")}</div></td>
            <td className='c-status text-center'><div className={`status ${statusMapping?.className}`}>{statusMapping?.label}</div></td>
            <td className='c-step text-center'><div className='step'>{stepMapping[item?.status].nextStep}</div></td>
        </tr>
    )
}

function MyEvaluation(props) {
    const currentYear = new Date().getFullYear()
    const { t } = useTranslation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const [evaluationForms, SetEvaluationForms] = useState([])
    const [years, SetYears] = useState([])
    const [year, SetYear] = useState({value: currentYear, label: currentYear} )
    const [isLoading, SetIsLoading] = useState(false)

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
            SetIsLoading(false)
        }

        const fetchDataInitial = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                const getEvaluationYearConfig = {...config}
                getEvaluationYearConfig.params = {
                    EmployeeCode: user?.employeeNo
                }
                const requestGetEvaluationYears = axios.get(`${process.env.REACT_APP_HRDX_URL}api/form/listYear`, getEvaluationYearConfig)
                const requestGetListEvaluationForms = fetchListEvaluationForms()
                const response = await Promise.allSettled([requestGetEvaluationYears, requestGetListEvaluationForms])
                processInitialData(response)
            } catch (e) {
                console.log(e)
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
        return axios.get(`${process.env.REACT_APP_HRDX_URL}api/form/listUseForm`, config)
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        SetIsLoading(true)
        const response = await fetchListEvaluationForms()
        if (response && response?.data && response?.data?.result && response?.data?.result?.code == Constants.PMS_API_SUCCESS_CODE) {
            SetEvaluationForms(response?.data?.data || [])
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

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="my-evaluation-page">
            <h1 className="content-page-header">Đánh giá</h1>
            <div className="card shadow card-evaluation">
                <form onSubmit={handleOnSubmit}>
                    <div className="filter-block">
                        <p className="label-filter">Lựa chọn năm</p>
                        <div className="form-filter">
                            <div className="year-input">
                                <Select 
                                    placeholder="Lựa chọn năm" 
                                    isClearable={true} 
                                    value={year} 
                                    options={years} 
                                    onChange={handleChangeSelectInput} />
                            </div>
                            <button type="submit" className="btn-filter"><Image src={IconLoop} alt='Loop' />Tìm kiếm</button>
                        </div>
                    </div>
                </form>
                {
                    evaluationForms?.length > 0 ?
                    <div className="wrap-table-list-evaluation">
                        <table className='table-list-evaluation'>
                            <thead>
                                <tr>
                                    <th className='c-form-name text-center'><div className='form-name'>Tên biểu mẫu</div></th>
                                    <th className='c-created-date text-center'><div className='created-date'>Được tạo ngày</div></th>
                                    <th className='c-status text-center'><div className='status'>Tình trạng</div></th>
                                    <th className='c-step text-center'><div className='step'>Bước hiện tại</div></th>
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

export default MyEvaluation
