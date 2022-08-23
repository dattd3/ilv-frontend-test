import React from 'react'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import { Progress } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import DirectManagerInfoComponent from '../TerminationComponents/DirectManagerInfoComponent'
import SeniorExecutiveInfoComponent from '../TerminationComponents/SeniorExecutiveInfoComponent'
import StaffInfoComponent from '../TerminationComponents/StaffInfoComponent'
import StaffTerminationDetailComponent from '../TerminationComponents/StaffTerminationDetailComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import "react-toastify/dist/ReactToastify.css"
import { getMuleSoftHeaderConfigurations } from '../../../commons/Utils'

const config = {
    headers: {            
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
}

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
                lastWorkingDay: "Vui lòng nhập ngày làm việc cuối cùng!",
                reason: "Vui lòng chọn lý do chấm dứt hợp đồng!",
                directManager: "Vui lòng chọn CBQL trực tiếp!",
                seniorExecutive: "Vui lòng chọn CBLĐ phê duyệt!"
            }
        }
    }

    componentDidMount() {
        this.initialData()
    }

    initialData = async () => {
        const reasonTypeForEmployee = 1
        const reasonTypesEndpoint = `${process.env.REACT_APP_REQUEST_URL}ReasonType/list?type=${reasonTypeForEmployee}`
        const userInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`
        const userContractInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/contract`
        const requestReasonTypes = axios.get(reasonTypesEndpoint, config)
        const requestUserInfos = axios.get(userInfosEndpoint, getMuleSoftHeaderConfigurations())
        const requestUserContractInfos = axios.get(userContractInfosEndpoint, getMuleSoftHeaderConfigurations())

        await axios.all([requestReasonTypes, requestUserInfos, requestUserContractInfos]).then(axios.spread((...responses) => {
            const reasonTypes = this.prepareReasonTypes(responses[0])
            const userInfos = this.prepareUserInfos(responses[1], responses[2])

            this.setState({reasonTypes: reasonTypes, userInfos: userInfos})
        })).catch(errors => {
            return null
        })
    }

    prepareUserInfos = (userResponses, contractResponses) => {
        let userInfoResults = {}
        let userContractInfoResults = {}
        if (userResponses && userResponses.data) {
            const userInfos = userResponses.data.data
            if (userInfos && userInfos.length > 0) {
                const infos = userInfos[0]
                const dateStartWork = infos && infos.starting_date_co && moment(infos.starting_date_co, "DD-MM-YYYY").isValid() ? moment(infos.starting_date_co, "DD-MM-YYYY").format("YYYY-MM-DD") : ""
                userInfoResults = {
                    employeeNo: localStorage.getItem("employeeNo") || "",
                    fullName: infos.fullname || "",
                    jobTitle: infos.job_name || "",
                    department: `${infos.division || ""}${infos.department ? `/${infos.department}` : ""}${infos.part ? `/${infos.part}` : ""}`,
                    dateStartWork: dateStartWork,
                    email: localStorage.getItem("email") || "",
                    rank: infos.rank_name || "",
                    unitName: infos.unit || ""
                }
            }
        }

        if (contractResponses && contractResponses.data) {
            const contractInfos = contractResponses.data.data
            if (contractInfos && contractInfos.length > 0) {
                const infos = contractInfos[0]
                userContractInfoResults = {
                    contractType: infos.contract_number,
                    contractName: infos.contract_type || ""
                }
            }
        }

        return {...userInfoResults, ...userContractInfoResults}
    }

    prepareReasonTypes = responses => {
        if (responses && responses.data) {
            const reasonTypes = responses.data.data
            const results = (reasonTypes || []).map(item => {
                return {value: item.code, label: item.name}
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
            userInfos,
            staffTerminationDetail,
            directManager,
            seniorExecutive,
            files
        } = this.state
        const isValid = this.isValidData()

        if (!isValid) {
            const message = this.getMessageValidation()
            toast.error(message)
            return
        }

        const userInfoToSubmit = !_.isNull(userInfos) && _.size(userInfos) > 0 ? [userInfos] : []
        const reasonToSubmit = !_.isNull(staffTerminationDetail) && !_.isNull(staffTerminationDetail.reason) ? staffTerminationDetail.reason : {}

        if (!_.isNull(directManager) && _.size(directManager) > 0) {
            delete directManager.value
            delete directManager.label
        }

        if (!_.isNull(seniorExecutive) && _.size(seniorExecutive) > 0) {
            delete seniorExecutive.value
            delete seniorExecutive.label
        }

        const directManagerToSubmit = !_.isNull(directManager) && _.size(directManager) > 0 ? directManager : {}
        const seniorExecutiveToSubmit = !_.isNull(seniorExecutive) && _.size(seniorExecutive) > 0 ? seniorExecutive : {}

        let bodyFormData = new FormData()
        bodyFormData.append('userInfo', JSON.stringify(userInfoToSubmit))
        bodyFormData.append('lastWorkingDay', staffTerminationDetail.lastWorkingDay)
        bodyFormData.append('dateTermination', staffTerminationDetail.dateTermination)
        bodyFormData.append('reason', JSON.stringify(reasonToSubmit))
        bodyFormData.append('reasonDetailed', staffTerminationDetail.reasonDetailed)
        bodyFormData.append('formResignation', 1)
        bodyFormData.append('supervisorId', `${directManager?.account.toLowerCase()}@vingroup.net`)
        bodyFormData.append('supervisorInfo', JSON.stringify(directManagerToSubmit))
        bodyFormData.append('approverId', `${seniorExecutive?.account.toLowerCase()}@vingroup.net`)
        bodyFormData.append('approverInfo', JSON.stringify(seniorExecutiveToSubmit))

        if (files && files.length > 0) {
            files.forEach(file => {
                bodyFormData.append('attachedFiles', file)
            })
        }

        try {
            const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/createresignation`, bodyFormData, config)

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
            seniorExecutive
        } = this.state

        return (
            <>
            <ToastContainer autoClose={2000} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence registration-employment-termination">
                <h5 className="page-title">{t('ProposalToTerminateContract')}</h5>
                <StaffInfoComponent userInfos={userInfos} />
                <StaffTerminationDetailComponent reasonTypes={reasonTypes} updateStaffTerminationDetail={this.updateStaffTerminationDetail} updateErrors={this.updateErrors} />
                <DirectManagerInfoComponent directManager={directManager} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                <SeniorExecutiveInfoComponent seniorExecutive={seniorExecutive} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                <AttachmentComponent files={files} updateFiles={this.updateFiles} />
                <ButtonComponent isEdit={isEdit} files={files} updateFiles={this.updateFiles} submit={this.submit} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
            </div>
            </>
        )
    }
}

export default withTranslation()(RegistrationEmploymentTerminationForm)
