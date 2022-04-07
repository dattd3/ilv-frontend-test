import React from 'react'
import axios from 'axios'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import { Image } from 'react-bootstrap';
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import ButtonComponent from '../ButtonComponent'
import StaffInfoForContractTerminationInterviewComponent from '../TerminationComponents/StaffInfoForContractTerminationInterviewComponent'
import InterviewContentFormComponent from '../TerminationComponents/InterviewContentFormComponent'
import ResultModal from '../ResultModal'
import VinpearlLogo from '../../../assets/img/logo-vp-vt.png'

import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'

class ContractTerminationInterview extends React.Component {
    constructor(props) {
        super();
        this.state = {
            approver: null,
            appraiser: null,
            annualLeaveSummary: null,
            files: [],
            isUpdateFiles: false,
            isEdit: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            isShowNoteModal: false,
            errors: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { leaveOfAbsence } = nextProps
        if (leaveOfAbsence) {
            return ({
                approver: leaveOfAbsence.approver,
                appraiser: leaveOfAbsence.appraiser
            })
        }
        return prevState
    }

    componentDidMount() {
       
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        const { isEdit } = this.state;
        this.setState({ isShowStatusModal: false });
        if (isEdit) {
            window.location.replace("/tasks")
        } else {
            window.location.reload();
        }
    }

    render() {
        const { t } = this.props
        const isShowStatusModal = false
        const titleModal = ""
        const messageModal = ""
        const isSuccess = true

        return (
            <>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="contract-termination-interview">
                <div className="logo-block">
                    <Image src={VinpearlLogo} alt="Vinpearl" className="logo" />
                </div>
                <h5 className="page-title">Biểu mẫu phỏng vấn thôi việc</h5>
                <StaffInfoForContractTerminationInterviewComponent />
                <InterviewContentFormComponent />
                <ButtonComponent />
            </div>
            </>
        )
    }
}

export default withTranslation()(ContractTerminationInterview)
