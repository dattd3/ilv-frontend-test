import { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Tabs, Tab, FormControl } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations, getCurrentLanguage } from 'commons/Utils'
import { isJsonString } from "utils/string"
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import CustomPaging from 'components/Common/CustomPaging'
import HOCComponent from 'components/Common/HOCComponent'
import IconExpand from 'assets/img/icon/pms/icon-expand.svg'
import IconCollapse from 'assets/img/icon/pms/icon-collapse.svg'
// import IconSearch from 'assets/img/icon/Icon_Loop.svg'
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconApprove from 'assets/img/icon/Icon_Check.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
import IconSearch from "assets/img/icon/icon-search.svg"
import IconCalender from "assets/img/icon/icon-calender.svg"

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const FilterBlock = (props) => {
    const tabMapping = {
        request: 'request',
        appraisal: 'appraisal',
        approval: 'approval',
        evaluation: 'evaluation',
    }
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, SetActiveTab] = useState(tabMapping.request)

    useEffect(() => {
        // const processEvaluationForms = response => {
        //     if (response && response.data) {
        //         const result = response.data.result
        //         if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
        //             const data = (response?.data?.data || []).map(item => {
        //                 return {value: item?.id, label: item?.name, reviewStreamCode: item?.reviewStreamCode}
        //             })
        //             SetFilter({
        //                 ...filter,
        //                 isOpenFilterAdvanced: false,
        //                 evaluationForm: null,
        //                 employees: [],
        //                 employee: null,
        //                 currentStep: null,
        //                 blocks: [],
        //                 block: null,
        //                 regions: [],
        //                 region: null,
        //                 units: [],
        //                 unit: null,
        //                 groups: [],
        //                 group: [],
        //                 rank: null,
        //                 title: null,
        //                 fromDate: null,
        //                 toDate: null,
        //                 isFormFilterValid: true,
        //                 evaluationForms: data,
        //             })
        //         }
        //     }
        //     processLoading(false)
        // }

        // const fetchEvaluationForms = async () => {
        //     processLoading(true)
        //     const config = getRequestConfigurations()
        //     const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/listFormToApprove?EmployeeCode=${employeeCode}&ApproverEmployeeAdCode=${employeeAD}`, config)
        //     processEvaluationForms(response)
        // }

        // if (isOpen) {
        //     fetchEvaluationForms()
        // }
    }, [])

    const handleChangeDateFilter = () => {

    }

    const handleRequestCategorySelect = () => {

    }

    const showRequestTypesSelect = () => {

    }

    const handleSelectChange = () => {

    }

    const handleInputChange = () => {

    }

    const search = () => {

    }

    return (
        <div className="d-flex align-items-center filter-block">
            <div className="position-relative status-block">
                <img src={IconFilter} alt="Filter" className="icon-prefix-select" />
                <Select name="absenceType"
                    value={null}
                    isClearable={false}
                    onChange={absenceType => handleSelectChange('absenceType', absenceType)}
                    placeholder={t('Status')}
                    options={[]}
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 2 })
                    }}
                    classNamePrefix="filter-select"
                />
            </div>
            <div className="position-relative keyword-block">
                <img src={IconSearch} alt="" className="icon-prefix-select" />
                <FormControl
                    placeholder={t('SearchRequester')}
                    className="request-user"
                    onChange={handleInputChange}
                />
            </div>
            <div className="position-relative date-block">
                <DatePicker 
                    name="fromDate"
                    selectsStart
                    autoComplete="off"
                    selected={null}
                    // maxDate={
                    //     dataForSearch.toDate ? moment(dataForSearch.toDate, "YYYYMMDD").toDate() : null
                    // }
                    // minDate={
                    //     moment().subtract(6, "months").toDate()
                    // }
                    onChange={(date) => handleChangeDateFilter(date, "fromDate")}
                    showDisabledMonthNavigation
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("From")}
                    locale={"vi"}
                    shouldCloseOnSelect={true}
                    className="form-control input"
                />
                <img src={IconCalender} alt="DatePicker" className="calender-icon" />
            </div>
            <div className="position-relative date-block">
                <DatePicker 
                    name="endDate"
                    selectsEnd
                    autoComplete="off"
                    selected={null}
                    // minDate={
                    //     dataForSearch.fromDate ? moment(dataForSearch.fromDate, "YYYYMMDD").toDate() : moment().subtract(6, "months").toDate()
                    // }
                    onChange={(date) => handleChangeDateFilter(date, "toDate")}
                    showDisabledMonthNavigation
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("To")}
                    locale={"vi"}
                    shouldCloseOnSelect={true}
                    className="form-control input"
                />
                <img src={IconCalender} alt="DatePicker" className="calender-icon" />
            </div>
            <div className="btn-search-block">
                <button type="button" onClick={search} className="btn btn-warning w-100">{t("Search")}</button>
            </div>
        </div>
    )
}

export default FilterBlock
