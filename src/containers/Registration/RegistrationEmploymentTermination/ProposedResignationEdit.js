import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import { Progress } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import SeniorExecutiveInfoComponent from '../TerminationComponents/SeniorExecutiveInfoComponent'
import StaffInfoProposedResignationComponent from '../TerminationComponents/StaffInfoProposedResignationComponent'
import ReasonResignationComponent from '../TerminationComponents/ReasonResignationComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import "react-toastify/dist/ReactToastify.css"

const config = {
    headers: {            
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
}

class ProposedResignationPage extends React.Component {
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
        const result = {...this.state};
        if(this.props.resignInfo) {
            const parentData = this.props.resignInfo;
            result.userInfos = JSON.parse(parentData.requestInfo.UserInfo);
            result.staffTerminationDetail = {
                reason: JSON.parse(parentData.requestInfo.Reason),
                reasonDetailed: parentData.requestInfo.ReasonDetailed,
                dateTermination: parentData.requestInfo.DateTermination,
                lastWorkingDay: parentData.requestInfo.LastWorkingDay
            };
            result.directManager = parentData.requestInfo.SupervisorInfo ? JSON.parse(parentData.requestInfo.SupervisorInfo) : null;
            result.seniorExecutive = parentData.requestInfo.ApproverInfo ? JSON.parse(parentData.requestInfo.ApproverInfo) : null;
            this.setState(result);
        }
        this.initialData()
    }

    initialData = async () => {
        const reasonTypeForManager = 2
        const reasonTypesEndpoint = `${process.env.REACT_APP_REQUEST_URL}ReasonType/list?type=${reasonTypeForManager}`
        const userInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`
        const requestReasonTypes = axios.get(reasonTypesEndpoint, config)
        const requestUserInfos = axios.get(userInfosEndpoint, config)

        await axios.all([requestReasonTypes, requestUserInfos]).then(axios.spread((...responses) => {
            const reasonTypes = this.prepareReasonTypes(responses[0])
            const userInfos = this.prepareUserInfos(responses[1])

            this.setState({reasonTypes: reasonTypes, directManager: userInfos})
        })).catch(errors => {
            return null
        })
    }

    prepareUserInfos = (userResponses) => {
        if (userResponses && userResponses.data) {
            const userInfos = userResponses.data.data
            if (userInfos && userInfos.length > 0) {
                const infos = userInfos[0]
                return {
                    account: infos?.username?.toUpperCase() || "",
                    avatar: "",
                    current_position: infos?.current_position || "",
                    department: `${infos.division || ""}${infos.department ? `/${infos.department}` : ""}${infos.part ? `/${infos.part}` : ""}`,
                    employeeLevel: infos?.employee_level || "",
                    fullname: infos?.fullname || "",
                    orglv2Id: infos?.organization_lv2 || "",
                    pnl: infos?.pnl || ""
                }
            }
            return {}
        }
        return {}
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

    updateApprovalInfos = (approvalType, approver, isDirectManager) => {
        const errors = { ...this.state.errors }
        errors[approvalType] = null

        if (!isDirectManager) {
            errors[approvalType] = this.props.t("InvalidApprover")
        }

        this.setState({ [approvalType]: approver, errors: errors })
    }

    verifyInput() {
        // let { requestInfo, approver, appraiser, errors } = this.state;
        // requestInfo.forEach((req, indexReq) => {
        //     if (!req.startDate) {
        //         req.errors["startDate"] = this.props.t('Required')
        //     }
        //     if (!req.endDate) {
        //         req.errors["endDate"] = this.props.t('Required')
        //     }
        //     if (!req.startTime && !req.isAllDay && !req.isAllDayCheckbox) {
        //         req.errors["startTime"] = this.props.t('Required')
        //     }
        //     if (!req.endTime && !req.isAllDay && !req.isAllDayCheckbox) {
        //         req.errors["endTime"] = this.props.t('Required')
        //     }
        //     if (!req.absenceType) {
        //         requestInfo[indexReq].errors.absenceType = this.props.t('Required')
        //     }
        //     if (!req.comment) {
        //         requestInfo[indexReq].errors.comment = this.props.t('Required')
        //     }
        //     requestInfo[indexReq].errors['pn03'] = (requestInfo[indexReq].absenceType && requestInfo[indexReq].absenceType.value === 'PN03' && _.isNull(requestInfo[indexReq]['pn03'])) ? this.props.t('Required') : null
        // })
        // const employeeLevel = localStorage.getItem("employeeLevel")

        // this.setState({
        //     requestInfo,
        //     errors: {
        //         approver: !approver ? this.props.t('Required') : errors.approver,
        //         // appraiser: !appraiser && employeeLevel === "N0" ? this.props.t('Required') : errors.appraiser
        //     }
        // })

        // const listError = requestInfo.map(req => _.compact(_.valuesIn(req.errors))).flat()
        // if (listError.length > 0 || errors.approver) { //|| (errors.appraiser && employeeLevel === "N0")
        //     return false
        // }
        // return true
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status });
    }

    validateEmployees = () => {
        const userInfos = this.state.userInfos

        if (!userInfos || userInfos.length === 0) {
            return {
                isValid: false,
                messages: "Vui lòng chọn nhân viên đề xuất cho nghỉ!"
            }
        }
        return {
            isValid: true,
            messages: ""
        }
    }

    isValidData = () => {
        const errors = this.state.errors
        const isEmpty = !Object.values(errors).some(item => item != null && item != "")
        return isEmpty
    }

    updateErrors = (errorObj) => {
        const errors = {...this.state.errors, ...errorObj}
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
            userInfos,
            staffTerminationDetail,
        } = this.state

        const isValid = this.isValidData()
        if (!isValid) {
            const message = this.getMessageValidation()
            toast.error(message)
            return
        } else {
            const employeeValidations = this.validateEmployees()
            if (!employeeValidations.isValid) {
                toast.error(employeeValidations.messages)
                return
            }
        }

        this.setDisabledSubmitButton(true)

        const reasonToSubmit = !_.isNull(staffTerminationDetail) && !_.isNull(staffTerminationDetail.reason) ? staffTerminationDetail.reason : {}
        let bodyFormData = new FormData()

        // bodyFormData.append('userInfo', JSON.stringify(userInfos))
        // bodyFormData.append('lastWorkingDay', staffTerminationDetail.lastWorkingDay)
        // bodyFormData.append('dateTermination', staffTerminationDetail.dateTermination)
        // bodyFormData.append('reason', JSON.stringify(reasonToSubmit))
        // bodyFormData.append('reasonDetailed', staffTerminationDetail.reasonDetailed)
        // bodyFormData.append('formResignation', 2)
        // bodyFormData.append('supervisorId', localStorage.getItem('email'))
        // bodyFormData.append('supervisorInfo', JSON.stringify(directManager))
        // bodyFormData.append('approverId', `${seniorExecutive?.account.toLowerCase()}${Constants.GROUP_EMAIL_EXTENSION}`)
        // bodyFormData.append('approverInfo', JSON.stringify(seniorExecutiveToSubmit))

        // if (files && files.length > 0) {
        //     files.forEach(file => {
        //         bodyFormData.append('attachedFiles', file)
        //     })
        // }

        const requestInfo = this.props.resignInfo.requestInfo;
        requestInfo.UserInfo =  JSON.stringify(userInfos);
        requestInfo.LastWorkingDay = staffTerminationDetail.lastWorkingDay;
        requestInfo.DateTermination = staffTerminationDetail.dateTermination;
        requestInfo.Reason = JSON.stringify(reasonToSubmit);
        requestInfo.ReasonDetailed = staffTerminationDetail.reasonDetailed || '';
        bodyFormData.append('requestInfo', JSON.stringify(requestInfo));
        bodyFormData.append('id', this.props.resignInfo.id)
        const config1 = {...config, 'Content-Type': 'application/json'};

        try {
            const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}Request/edit`, bodyFormData, config1)

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

    error(name, groupId, groupItem) {
        const { requestInfo } = this.state
        let indexReq
        if (groupItem) {
            indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)
        } else {
            indexReq = requestInfo.findIndex(req => req.groupId === groupId)
        }
        const errorMsg = requestInfo[indexReq].errors[name]
        return errorMsg ? <p className="text-danger">{errorMsg}</p> : null
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
            isEdit,
            files,
            errors,
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
        return (
            <>
            <ToastContainer autoClose={2000} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence proposed-registration-employment-termination">
                <h5 className="page-title">{t('ProposeForEmployeesResignation')}</h5>
                <StaffInfoProposedResignationComponent userInfos={userInfos} updateUserInfos={this.updateUserInfos}  updateErrors={this.updateErrors}/>
                <ReasonResignationComponent reasonTypes={reasonTypes} data={staffTerminationDetail} updateResignationReasons={this.updateResignationReasons} updateErrors={this.updateErrors}/>
                <SeniorExecutiveInfoComponent isEdit={true} seniorExecutive={seniorExecutive} updateApprovalInfos={this.updateApprovalInfos} />
                <AttachmentComponent files={files} updateFiles={this.updateFiles}  isEdit={true} />
                <ButtonComponent isEdit={true} files={files} updateFiles={this.updateFiles} submit={this.submit} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
            </div>
            </>
        )
    }
}

export default withTranslation()(ProposedResignationPage)
