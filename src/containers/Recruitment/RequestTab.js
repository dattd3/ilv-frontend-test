import { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Tabs, Tab } from 'react-bootstrap'
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
import IconSearch from 'assets/img/icon/Icon_Loop.svg'
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconApprove from 'assets/img/icon/Icon_Check.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import FilterBlock from "./FilterBlock"
registerLocale("vi", vi)

const RequestTab = (props) => {
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

    return (
        <div className="request-tab-content">
            <FilterBlock 
            
            />
        </div>
    )
}

export default RequestTab
