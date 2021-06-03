import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Progress } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import { getRequestConfigs } from '../../../commons/commonFunctions'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import DirectManagerInfoComponent from '../TerminationComponents/DirectManagerInfoComponent'
import SeniorExecutiveInfoComponent from '../TerminationComponents/SeniorExecutiveInfoComponent'
import StaffInfoComponent from '../TerminationComponents/StaffInfoComponent'
import StaffTerminationDetailComponent from '../TerminationComponents/StaffTerminationDetailComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import "react-toastify/dist/ReactToastify.css"

class RegistrationEmploymentTerminationForm extends React.Component {
    constructor(props) {
        super();
        this.state = {
            reasonTypes: [],
            userInfos: {},
            staffTerminationDetail: {},
            directManager: null,
            seniorExecutive: null,
            files: [],
            isUpdateFiles: false,
            isEdit: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            loaded: 0,
            errors: {
                employees: "",
                lastWorkingDay: "",
                reason: ""
            },
            remoteData: null
        }
    }

    componentDidMount() {
        const {action, resignInfo} = this.props
        const result = {...this.state}

        if (resignInfo) {
            const requestInfo = resignInfo?.requestInfo
            result.id = resignInfo?.id
            result.userInfos = requestInfo?.terminationUserInfo[0]
            result.staffTerminationDetail = {
                reason: requestInfo?.absenceType,
                reasonDetailed: requestInfo?.comment,
                dateTermination: requestInfo?.dateTermination,
                lastWorkingDay: requestInfo?.lastWorkingDay
            };
            result.files = resignInfo?.requestDocuments
            result.directManager = resignInfo?.appraiser
            result.seniorExecutive = resignInfo?.approver
            this.setState(result);
        }

        this.initialData()
    }

    initialData = async () => {
        try {
            const reasonTypesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/resignation_reason`
            const responses = await axios.get(reasonTypesEndpoint, getRequestConfigs())
            const reasonTypes = this.prepareReasonTypes(responses)

            this.setState({reasonTypes: reasonTypes})

        } catch (error) {
            // No processing
        }
    }

    prepareReasonTypes = responses => {
        if (responses && responses.data) {
            const reasonTypeCodeForManager = "ZG"
            const reasonTypes = responses.data.data
            const results = (reasonTypes || [])
            .filter(item => item.code01 === reasonTypeCodeForManager)
            .map(item => {
                return {value: item.code02, label: item.text}
            })
            return results
        }

        return []
    }

    updateFiles = files => {
        this.setState({ files: files })
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status });
    }

    isValidData = () => {
        const errors = this.state.errors
        const isEmpty = !Object.values(errors).some(item => item != null && item != "")
        return isEmpty
    }

    getMessageValidation = () => {
        const errors = this.state.errors
        const listMessages = Object.values(errors).filter(item => item != null && item != "")

        return listMessages[0]
    }

    submit = async () => {
        const { t } = this.props
        const {
            id,
            staffTerminationDetail
        } = this.state
        const isValid = this.isValidData()

        if (!isValid) {
            const message = this.getMessageValidation()
            toast.error(message)
            return
        }

        this.setDisabledSubmitButton(true)

        const reasonToSubmit = !_.isNull(staffTerminationDetail) && !_.isNull(staffTerminationDetail.reason) ? staffTerminationDetail.reason : {}
        let bodyFormData = new FormData()
        bodyFormData.append('requestHistoryId', id)
        bodyFormData.append('lastWorkingDay', staffTerminationDetail.lastWorkingDay)
        bodyFormData.append('dateTermination', staffTerminationDetail.dateTermination)
        bodyFormData.append('reason', JSON.stringify(reasonToSubmit))
        bodyFormData.append('reasonDetailed', staffTerminationDetail.reasonDetailed || "")

        try {
            const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/createresignation`, bodyFormData, getRequestConfigs())

            if (responses && responses.data && responses.data.result) {
                const result = responses.data.result
                if (result.code != Constants.API_ERROR_CODE) {
                    this.showStatusModal(t("Successful"), t("RequestSent"), true)
                    this.setDisabledSubmitButton(false)
                } else {
                    this.showStatusModal(t("Notification"), result.message, false)
                    this.setDisabledSubmitButton(false)
                }
            } else {
                this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
                this.setDisabledSubmitButton(false)
            }

        } catch (errors) {
            this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
            this.setDisabledSubmitButton(false)
        }
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        const { isEdit } = this.state
        this.setState({ isShowStatusModal: false })
        if (isEdit) {
            window.location.replace("/tasks")
        } else {
            window.location.reload()
        }
    }

    getIsUpdateStatus = (status) => {
        this.setState({ isUpdateFiles: status })
    }

    updateStaffTerminationDetail = infos => {
        this.setState({ staffTerminationDetail: infos })
    }

    updateApprovalInfos = (approvalType, approver, isDirectManager) => {
        const errors = { ...this.state.errors }
        errors[approvalType] = null

        if (!isDirectManager) {
            errors[approvalType] = this.props.t("InvalidApprover")
        }

        this.setState({ [approvalType]: approver, errors: errors })
    }

    updateErrors = (errorObj) => {
        const errors = {...this.state.errors, ...errorObj}
        this.setState({errors: errors})
    }

    render() {
        const { t } = this.props;
        const {
            isEdit,
            files,
            titleModal,
            messageModal,
            disabledSubmitButton,
            isShowStatusModal,
            isSuccess,
            reasonTypes,
            userInfos,
            directManager,
            seniorExecutive,
            staffTerminationDetail
        } = this.state

        const attachments = (files || []).map(item => {
            return {
                name: item.fileName,
                fileUrl: item.fileUrl || ""
            }
        })

        return (
            <div className="registration-section justify-content-between">
                <ToastContainer autoClose={2000} />
                <Progress max="100" color="success" value={this.state.loaded}>
                    {Math.round(this.state.loaded, 2)}%
                </Progress>
                <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
                <div className="leave-of-absence registration-employment-termination">
                    <h5 className="page-title">{t('ProposalToTerminateContract')}</h5>
                    <StaffInfoComponent userInfos={userInfos} />
                    <StaffTerminationDetailComponent reasonTypes={reasonTypes} data={staffTerminationDetail} updateStaffTerminationDetail={this.updateStaffTerminationDetail} updateErrors={this.updateErrors} />
                    <DirectManagerInfoComponent isEdit={true} directManager={directManager} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                    <SeniorExecutiveInfoComponent isEdit={true} seniorExecutive={seniorExecutive} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                    <AttachmentComponent isEdit={true} files={attachments} updateFiles={this.updateFiles} />
                    <ButtonComponent isEdit={true} files={attachments} updateFiles={this.updateFiles} submit={this.submit} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
                </div>
            </div>
        )
    }
}

export default withTranslation()(RegistrationEmploymentTerminationForm)
