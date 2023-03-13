import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Progress } from "reactstrap"
import { toast } from "react-toastify"
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import { getRequestConfigs } from '../../../commons/commonFunctions'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import SeniorExecutiveInfoComponent from '../TerminationComponents/SeniorExecutiveInfoComponent'
import StaffInfoProposedResignationComponent from '../TerminationComponents/StaffInfoProposedResignationComponent'
import ReasonResignationComponent from '../TerminationComponents/ReasonResignationComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import LoadingModal from '../../../components/Common/LoadingModal'
import { getMuleSoftHeaderConfigurations } from '../../../commons/Utils'

class ProposedResignationPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            subordinateInfos: [],
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
            loaded: 0,
            isShowLoadingModal: false,
            errors: {
                employees: props.t('require_choose_employee_resign'),
                lastWorkingDay: props.t('resign_error_lastWorkingDay'),
                reason: props.t('resign_error_reason'),
                seniorExecutive: props.t('resign_error_seniorExecutive')
            }
        }
    }

    componentDidMount() {
        this.initialData()
    }

    initialData = async () => {
        const reasonTypesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/resignation_reason`
        const userInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/profile`
        const subordinateInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/subordinate`;
        const requestReasonTypes = axios.get(reasonTypesEndpoint, getMuleSoftHeaderConfigurations())
        const requestUserInfos = axios.get(userInfosEndpoint, getMuleSoftHeaderConfigurations())
        const subordinateInfos = axios.get(subordinateInfosEndpoint, getMuleSoftHeaderConfigurations());

        await axios.all([requestReasonTypes, requestUserInfos, subordinateInfos]).then(axios.spread((...responses) => {
            const reasonTypes = this.prepareReasonTypes(responses[0])
            const directManagerInfos = this.prepareDirectManagerInfos(responses[1])
            const subordinateInfos = this.prepareSubodinateInfos(responses[2]);
            this.setState({reasonTypes: reasonTypes, directManager: directManagerInfos, subordinateInfos})
        })).catch(errors => {
            return null
        })
    }


    prepareSubodinateInfos = (responses) => {
        let result = [];
        if (responses && responses.data) {
            const employees = responses.data.data

            if (employees && employees.length > 0) {
                result = employees.map(res => {
                    return {
                        uid: res.uid,
                        label: res.fullname,
                        value: res.uid,
                        fullname: res.fullname,
                        avatar: res.avatar,
                        account: res.username,
                        username: res.username,
                        employee_no: res.uid, // need update
                        job_title: res.position_name,
                        job_name: res.position_name,
                        company_email: res.username,
                        department: res.division + (res.department ? '/' + res.department : '') + (res.unit ? '/' + res.unit : ''),
                        date_start_work: null,
                        contract_type: null, // need update
                        contract_name: null, // need update
                        email: `${res.username?.toLowerCase()}${Constants.GROUP_EMAIL_EXTENSION}`, // need check
                        unit_name: null, // need update
                        orglv1_id: null, // need update
                        orglv2_id: res.organization_lv2, // need check
                        orglv3_id: res.organization_lv3, // need check
                        orglv4_id: res.organization_lv4, // need check
                        orglv5_id: res.organization_lv5, // need check
                        orglv6_id: res.organization_lv6, // need update
                        rank_id: res.rank, // need update
                        rank_name: res.rank_title && res.rank_title != '#' ? res.rank_title : res.rank,// need update
                        costCenter: res.cost_center || ''
                    }
                })
            }
        }
        return result;
    }
    prepareDirectManagerInfos = (userResponses) => {
        if (userResponses && userResponses.data) {
            const userInfos = userResponses.data.data
            if (userInfos && userInfos.length > 0) {
                const infos = userInfos[0]
                return {
                    account: infos?.username?.toUpperCase() || "",
                    avatar: "",
                    jobTitle: infos?.current_position || "",
                    department: `${infos.division || ""}${infos.department ? `/${infos.department}` : ""}${infos.unit ? `/${infos.unit}` : ""}`,
                    employeeLevel: infos?.employee_level || "",
                    fullName: infos?.fullname || "",
                    organizationLv2: infos?.organization_lv2 || "",
                    pnl: infos?.pnl || ""
                }
            }
            return {}
        }
        return {}
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

    updateApprovalInfos = (approvalType, approver, isDirectManager) => {
        const errors = { ...this.state.errors }
        errors[approvalType] = null

        if (!isDirectManager) {
            errors[approvalType] = this.props.t("InvalidApprover")
        }

        this.setState({ [approvalType]: approver, errors: errors })
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
        this.setDisabledSubmitButton(true)
        const isValid = this.isValidData()
        const fileInfoValidation = this.validateAttachmentFile()

        if (!isValid) {
            const message = this.getMessageValidation()
            toast.error(message)
            this.setDisabledSubmitButton(false)
            return
        } else if (_.size(fileInfoValidation) > 0 && fileInfoValidation.files) {
            toast.error(fileInfoValidation.files)
            this.setDisabledSubmitButton(false)
            return
        } else {
            const subordinates = this.state.subordinateInfos;
            const directManagerValidation = this.validateDirectManager(subordinates)
            if (!directManagerValidation.isValid) {
                toast.error(directManagerValidation.messages)
                this.setDisabledSubmitButton(false)
                return
            }
        }

        //this.setState({isShowLoadingModal: true})

        const reasonToSubmit = !_.isNull(staffTerminationDetail) && !_.isNull(staffTerminationDetail.reason) ? staffTerminationDetail.reason : {}

        if (!_.isNull(seniorExecutive) && _.size(seniorExecutive) > 0) {
            delete seniorExecutive.value
            delete seniorExecutive.label
        }
        const seniorExecutiveToSubmit = !_.isNull(seniorExecutive) && _.size(seniorExecutive) > 0 ? seniorExecutive : {}
        let bodyFormData = new FormData()
        bodyFormData.append('userInfo', JSON.stringify(userInfos))
        bodyFormData.append('lastWorkingDay', staffTerminationDetail.lastWorkingDay)
        bodyFormData.append('dateTermination', staffTerminationDetail.dateTermination)
        bodyFormData.append('reason', JSON.stringify(reasonToSubmit))
        bodyFormData.append('reasonDetailed', staffTerminationDetail.reasonDetailed || "")
        bodyFormData.append('formResignation', Constants.PROPOSED_CONTRACT_TERMINATION_CODE)
        bodyFormData.append('supervisorId', localStorage.getItem('email'))
        bodyFormData.append('supervisorInfo', JSON.stringify(directManager))
        bodyFormData.append('approverId', `${seniorExecutive?.account.toLowerCase()}@vingroup.net`)
        bodyFormData.append('approverInfo', JSON.stringify(seniorExecutiveToSubmit))
        bodyFormData.append('companyCode', localStorage.getItem('companyCode'));
        bodyFormData.append('fullName', localStorage.getItem('fullName'));
        bodyFormData.append('jobTitle', localStorage.getItem('jobTitle'));
        bodyFormData.append('department', localStorage.getItem('department'));
        bodyFormData.append('employeeNo', localStorage.getItem('employeeNo'));
        bodyFormData.append('rank', localStorage.getItem('benefitLevel'));
        bodyFormData.append('organizationLv1', localStorage.getItem('organizationLv1'));
        bodyFormData.append('organizationLv2', localStorage.getItem('organizationLv2'));
        bodyFormData.append('divisionId', localStorage.getItem('divisionId'));
        bodyFormData.append('division', localStorage.getItem('division'));
        bodyFormData.append('regionId', localStorage.getItem('regionId'));
        bodyFormData.append('region', localStorage.getItem('region'));
        bodyFormData.append('unitId', localStorage.getItem('unitId'));
        bodyFormData.append('unit', localStorage.getItem('unit') && localStorage.getItem('unit') != 'null' ? localStorage.getItem('unit') : '');
        bodyFormData.append('partId', localStorage.getItem('partId'));
        bodyFormData.append('part', localStorage.getItem('part') && localStorage.getItem('part') != 'null' ? localStorage.getItem('part') : '');

        if (files && files.length > 0) {
            files.forEach(file => {
                bodyFormData.append('attachedFiles', file)
            })
        }

        try {
            const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/createresignation`, bodyFormData, getRequestConfigs())

            if (responses && responses.data && responses.data.result) {
                const result = responses.data.result
                if (result.code != Constants.API_ERROR_CODE) {
                    this.showStatusModal(t("Successful"), t("RequestSent"), true)
                    this.setDisabledSubmitButton(false)
                    this.setState({isShowLoadingModal: false})
                } else {
                    this.showStatusModal(t("Notification"), result.message, false)
                    this.setDisabledSubmitButton(false)
                    this.setState({isShowLoadingModal: false})
                }
            } else {
                this.showStatusModal(t("Notification"), t("Error"), false)
                this.setDisabledSubmitButton(false)
                this.setState({isShowLoadingModal: false})
            }

        } catch (errors) {
            this.showStatusModal(t("Notification"), t("Error"), false)
            this.setDisabledSubmitButton(false)
            this.setState({isShowLoadingModal: false})
        }
    }

    validateAttachmentFile = () => {
        const { t } = this.props
        const files = this.state.files
        const errors = {}
        const fileExtension = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/pdf',
            'image/png',
            'image/jpeg'
        ]
    
        let sizeTotal = 0
        for (let index = 0, lenFiles = files.length; index < lenFiles; index++) {
            const file = files[index]
            if (!fileExtension.includes(file.type)) {
                errors.files = t('Request_error_file_format')
                break
            } else if (parseFloat(file.size / 1000000) > 2) {
                errors.files = t('Request_error_file_size')
                break
            } else {
                errors.files = null
            }
            sizeTotal += parseInt(file.size)
        }
    
        if (parseFloat(sizeTotal / 1000000) > 10) {
            errors.files = t('Request_error_file_oversize')
        }

        return errors
    }

    validateDirectManager = (subordinates) => {
        const userInfos = this.state.userInfos

        if (!userInfos || userInfos.length === 0) {
            return {
                isValid: false,
                messages: this.props.t('require_choose_employee_resign')
            }
        }
        if (!subordinates || subordinates.length === 0) {
            return {
                isValid: false,
                messages: this.props.t('resign_error_permission')
            }
        }

        const subordinateAds = subordinates.map(item => item.username?.toLowerCase())
        const userNotInSubordinates = userInfos.filter(item => !subordinateAds.includes(item.ad.toLowerCase()))
        .map(item => item.fullName)

        const objValid = {
            isValid: true,
            messages: ""
        }
        if (userNotInSubordinates && userNotInSubordinates.length > 0) {
            objValid.isValid = false
            objValid.messages = `Nhân viên (${userNotInSubordinates.join(', ')}) đề xuất cho nghỉ không thuộc thẩm quyền của QLTT`
        } else {
            objValid.isValid = true
            objValid.messages = ""
        }

        return objValid
    }

    getSubordinates = async () => {
        try {
            const responses = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/subordinate`, getMuleSoftHeaderConfigurations())

            if (responses && responses.data) {
                const employees = responses.data.data

                if (employees && employees.length > 0) {
                    return employees
                }

                return []
            }
        } catch (error) {
            return []
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

    updateErrors = (errorObj) => {
        const errors = {...this.state.errors, ...errorObj}

        if (errorObj?.employees) {
            toast.error(errorObj?.employees)
            return
        }

        this.setState({errors: errors})
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
            isShowLoadingModal,
            subordinateInfos
        } = this.state

        return (
            <div className='registration-section'>
            <LoadingModal show={isShowLoadingModal} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence proposed-registration-employment-termination">
                <h5 className="page-title">{t('ProposeForEmployeesResignation')}</h5>
                <StaffInfoProposedResignationComponent loading={isShowLoadingModal} userInfos={userInfos} subordinateInfos={subordinateInfos} updateUserInfos={this.updateUserInfos} updateErrors={this.updateErrors} />
                <ReasonResignationComponent reasonTypes={reasonTypes} updateResignationReasons={this.updateResignationReasons} updateErrors={this.updateErrors} />
                <SeniorExecutiveInfoComponent seniorExecutive={seniorExecutive} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                <AttachmentComponent files={files} updateFiles={this.updateFiles} />
                <ButtonComponent isEdit={isEdit} files={files} updateFiles={this.updateFiles} submit={this.submit} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
            </div>
            </div>
        )
    }
}

export default withTranslation()(ProposedResignationPage)
