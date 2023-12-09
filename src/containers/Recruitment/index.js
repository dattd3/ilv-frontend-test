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
import RequestTab from "./RequestTab"
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
import EvaluationTab from "./EvaluationTab"
registerLocale("vi", vi)

const Recruitment = (props) => {
    const tabMapping = {
        request: 'request',
        appraisal: 'appraisal',
        approval: 'approval',
        evaluation: 'evaluation',
    }
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false) //tabActive: new URLSearchParams(props?.history?.location?.search).get('tab') || "request",
    const [activeTab, SetActiveTab] = useState(new URLSearchParams(props?.history?.location?.search).get('tab') || "evaluation")

    const handleChangeTab = (key) => {
        SetActiveTab(key)
        props.history?.push('?tab=' + key);
        // SetDataFilter(null)
    }

    return (
        <div className="recruitment-page">
            <Tabs defaultActiveKey={activeTab} className="recruitment-tabs" onSelect={key => handleChangeTab(key)}>
                {/* <Tab eventKey={tabMapping.request} title={t("Request")} className="tab-item" id={`${tabMapping.request}-tab`}>
                    <RequestTab 
                        isOpen={activeTab === tabMapping.request} 
                    />
                    </Tab>
                <Tab eventKey={tabMapping.appraisal} title={t("Consent")} className="tab-item" id={`${tabMapping.appraisal}-tab`}>

                </Tab>
                <Tab eventKey={tabMapping.approval} title={t("Approval")} className="tab-item" id={`${tabMapping.approval}-tab`}>

                </Tab> */}
                <Tab eventKey={tabMapping.evaluation} title={t("danh_gia")} className="tab-item" id={`${tabMapping.evaluation}-tab`}>
                    <EvaluationTab isOpen={activeTab == tabMapping.evaluation}/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default HOCComponent(Recruitment)
