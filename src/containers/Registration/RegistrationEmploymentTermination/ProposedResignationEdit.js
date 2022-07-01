import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import { Progress } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { getRequestConfigs } from '../../../commons/commonFunctions'
import SeniorExecutiveInfoComponent from '../TerminationComponents/SeniorExecutiveInfoComponent'
import StaffInfoProposedResignationComponent from '../TerminationComponents/StaffInfoProposedResignationComponent'
import ReasonResignationComponent from '../TerminationComponents/ReasonResignationComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import "react-toastify/dist/ReactToastify.css"
import { getMuleSoftHeaderConfigurations } from '../../../commons/Utils'

class ProposedResignationEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reasonTypes: [],
            userInfos: [],
            staffTerminationDetail: {},
            directManager: null,
            seniorExecutive: null,
            employee: null,
            files: [],
            isUpdateFiles: false,
            isEdit: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            errors: {
                employees: "",
                lastWorkingDay: "",
                reason: ""
            }
        }
    }

    componentDidMount() {
        const {action, resignInfo} = this.props
        const result = {...this.state}

        if (resignInfo) {
            const requestInfo = resignInfo?.requestInfo
            result.id = resignInfo?.id
            result.userInfos = resignInfo?.requestInfo?.terminationUserInfo
            result.staffTerminationDetail = {
                reason: requestInfo?.absenceType,
                reasonDetailed: requestInfo?.reasonDetailed || "",
                dateTermination: requestInfo?.dateTermination,
                lastWorkingDay: requestInfo?.lastWorkingDay
            };
            result.files = resignInfo?.requestDocuments
            result.directManager = resignInfo?.user
            result.seniorExecutive = resignInfo?.approver
            this.setState(result);
        }

        this.initialData()
    }

    initialData = async () => {
        try {
            const reasonTypesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/resignation_reason`
            const responses = await axios.get(reasonTypesEndpoint, getMuleSoftHeaderConfigurations())
            const reasonTypes = this.prepareReasonTypes(responses)

            this.setState({reasonTypes: reasonTypes})

        } catch (error) {
            // No processing
        }
    }

    prepareReasonTypes = responses => {
        if (responses && responses.data) {
            const reasonTypeCodeForManager = "ZH"
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

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status });
    }

    isValidData = () => {
        const errors = this.state.errors
        const isEmpty = !Object.values(errors).some(item => item != null && item != "")
        return isEmpty
    }

    updateErrors = (errorObj) => {
        const errors = {...this.state.errors, ...errorObj}

        if (errorObj?.employees) {
            toast.error(errorObj?.employees)
        }

        this.setState({errors: errors})
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
        const { isEdit } = this.state;
        this.setState({ isShowStatusModal: false });
        if (isEdit) {
            window.location.replace("/tasks")
        } else {
            window.location.reload();
        }
    }

    getIsUpdateStatus = (status) => {
        this.setState({ isUpdateFiles: status })
    }

    updateFiles = files => {
        this.setState({ files: files })
    }

    updateResignationReasons = infos => {
        this.setState({ staffTerminationDetail: infos })
    }

    updateUserInfos = userInfos => {
        this.setState({ userInfos: userInfos })
    }

    render() {
        const { t } = this.props
        const {
            files,
            titleModal,
            messageModal,
            disabledSubmitButton,
            isShowStatusModal,
            isSuccess,
            userInfos,
            reasonTypes,
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
            <>
            <ToastContainer autoClose={2000} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence proposed-registration-employment-termination">
                <h5 className="page-title">{t('ProposeForEmployeesResignation')}</h5>
                <StaffInfoProposedResignationComponent isEdit={true} userInfos={userInfos} updateUserInfos={this.updateUserInfos}  updateErrors={this.updateErrors} />
                <ReasonResignationComponent reasonTypes={reasonTypes} data={staffTerminationDetail} updateResignationReasons={this.updateResignationReasons} updateErrors={this.updateErrors}/>
                <SeniorExecutiveInfoComponent isEdit={true} seniorExecutive={seniorExecutive} />
                <AttachmentComponent files={attachments} updateFiles={this.updateFiles} isEdit={true} />
                <ButtonComponent isEdit={true} files={files} updateFiles={this.updateFiles} submit={this.submit} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
            </div>
            </>
        )
    }
}

export default withTranslation()(ProposedResignationEdit)
