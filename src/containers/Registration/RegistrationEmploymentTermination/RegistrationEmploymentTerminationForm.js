import React from 'react'
import axios from 'axios'
import moment from 'moment'
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
import ReasonResignationComponent from '../TerminationComponents/ReasonResignationComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import LoadingModal from '../../../components/Common/LoadingModal'
import "react-toastify/dist/ReactToastify.css"
import { getMuleSoftHeaderConfigurations } from '../../../commons/Utils'

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
            isShowLoadingModal: false,
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
        const config = {
            headers: {            
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json-patch+json'
            }  
        };

        const reasonTypesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/resignation_reason`
        const userInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/profile`
        const userContractInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/contract`
        const userContractMoreInfosEndpoint = `${process.env.REACT_APP_REQUEST_URL}ReasonType/getadditionalinfo`;
        const userDirectManagerEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/manager`;

        const requestReasonTypes = axios.get(reasonTypesEndpoint, getMuleSoftHeaderConfigurations())
        const requestUserInfos = axios.get(userInfosEndpoint, getMuleSoftHeaderConfigurations())
        //const requestUserContractInfos = axios.get(userContractInfosEndpoint, getMuleSoftHeaderConfigurations())
        const requestUserMoreInfos = axios.post(userContractMoreInfosEndpoint, localStorage.getItem('employeeNo'), config)
        const userDirectManager = axios.get(userDirectManagerEndpoint, getMuleSoftHeaderConfigurations());

        await axios.all([requestReasonTypes, requestUserInfos, requestUserMoreInfos, userDirectManager]).then(axios.spread((...responses) => {
            const reasonTypes = this.prepareReasonTypes(responses[0])
            const userInfos = this.prepareUserInfos(responses[1], responses[2])
            const directManager = this.prepareDirectManagerInfos(responses[3]);
            const errors = {...this.state.errors};
            if(directManager) {
                errors.directManager = null;
            }
            this.setState({reasonTypes: reasonTypes, userInfos: userInfos, directManager: directManager, directManagerRaw: responses[3], errors});
        })).catch(errors => {
            return null
        })
    }

    prepareDirectManagerInfos = (managerResponse) => {
        let userInfoDetail = null;
        if (managerResponse && managerResponse.data) {
            const userInfos = managerResponse.data.data;
            if(userInfos?.length > 0) {
                const res = userInfos[0];
                userInfoDetail = {
                    label: res?.fullname,
                    value: res?.username,
                    fullName: res?.fullname,
                    avatar: null,
                    employeeLevel:  res.rank_title,
                    pnl: '',
                    organizationLv2: '',
                    account: res?.username,
                    jobTitle: res?.title,
                    department:  res.department
                };
            }
        }
        return userInfoDetail;
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
                    unitName: infos.unit || "",
                    organizationLv1: localStorage.getItem('organizationLv1'),
                    organizationLv2: localStorage.getItem('organizationLv2'),
                    organizationLv6: localStorage.getItem('organizationLv6'),
                    regionId: localStorage.getItem("organizationLv4"),
                    departmentId: localStorage.getItem("organizationLv3"),
                    unitId: localStorage.getItem("organizationLv5"),
                    rankId: localStorage.getItem("employeeLevel")
                }
            }
        }

        if (contractResponses && contractResponses.data) {
            const infos = contractResponses.data.data
            if (infos) {
                userContractInfoResults = {
                    contractType: infos.lastestContractType,
                    contractName: infos.lastestContractName || ""
                }
                const dateStartWork = infos && infos.dateStartWork && moment(infos.dateStartWork).isValid() ? moment(infos.dateStartWork).format("YYYY-MM-DD") : ""
                userInfoResults = { 
                    ...userInfoResults,
                    dateStartWork: dateStartWork
                }
            }
        }

        return {...userInfoResults, ...userContractInfoResults}
    }

    prepareReasonTypes = responses => {
        if (responses && responses.data) {
            const reasonTypeCodeForEmployee = "ZG"
            const reasonTypes = responses.data.data
            const results = (reasonTypes || [])
            .filter(item => item.code01 === reasonTypeCodeForEmployee)
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

    isDirectManagerValid = async () => {
        const directManager = {...this.state.directManager}
        const userAccount = directManager.account?.toLowerCase()

        try {
            //const responses = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/manager`, getMuleSoftHeaderConfigurations())
            const realUserAccounts = this.getUserAccountDirectManagerByResponses(this.state.directManagerRaw);
            
            if (realUserAccounts.includes(userAccount)) {
                return true
            }

            return false
        } catch (errors) {
            return false
        }
    }

    getUserAccountDirectManagerByResponses = responses => {
        if (responses && responses.data && responses.data.data) {
            const listUsers = responses.data.data
            const accounts = (listUsers || []).map(item => item.userid?.toLowerCase())

            return accounts && accounts.length > 0 ? accounts : []
        }

        return []
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
        const isDirectManagerValid = await this.isDirectManagerValid()

        if (!isValid) {
            const message = this.getMessageValidation()
            toast.error(message)
            this.setDisabledSubmitButton(false)
            return
        } else if (!isDirectManagerValid) {
            toast.error("Cán bộ QLTT không có thẩm quyền")
            this.setDisabledSubmitButton(false)
            return
        } else if (_.size(fileInfoValidation) > 0 && fileInfoValidation.files) {
            toast.error(fileInfoValidation.files)
            this.setDisabledSubmitButton(false)
            return
        }
        //this.setState({isShowLoadingModal: true})
        

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
        bodyFormData.append('reasonDetailed', staffTerminationDetail.reasonDetailed || "")
        bodyFormData.append('formResignation', Constants.REGISTER_CONTRACT_TERMINATION_CODE)
        bodyFormData.append('supervisorId', `${directManager?.account.toLowerCase()}${Constants.GROUP_EMAIL_EXTENSION}`)
        bodyFormData.append('supervisorInfo', JSON.stringify(directManagerToSubmit))
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
                this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
                this.setDisabledSubmitButton(false)
                this.setState({isShowLoadingModal: false})
            }

        } catch (errors) {
            this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
            this.setDisabledSubmitButton(false)
            this.setState({isShowLoadingModal: false})
        }
    }

    validateAttachmentFile = () => {
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
                errors.files = 'Tồn tại file đính kèm không đúng định dạng'
                break
            } else if (parseFloat(file.size / 1000000) > 2) {
                errors.files = 'Dung lượng từng file đính kèm không được vượt quá 2MB'
                break
            } else {
                errors.files = null
            }
            sizeTotal += parseInt(file.size)
        }
    
        if (parseFloat(sizeTotal / 1000000) > 10) {
            errors.files = 'Tổng dung lượng các file đính kèm không được vượt quá 10MB'
        }

        return errors
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

    updateResignationReasons = infos => {
        this.setState({ staffTerminationDetail: infos })
    }

    updateApprovalInfos = (approvalType, approver, isDirectManager) => {
        const errors = { ...this.state.errors }
        errors[approvalType] = null

        if (!isDirectManager) {
            errors[approvalType] = approvalType === "directManager" ? "Cán bộ QLTT không có thẩm quyền" : this.props.t("InvalidApprover")
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
            isShowLoadingModal
        } = this.state

        return (
            <div className='registration-section'>
            <LoadingModal show={isShowLoadingModal} />
            <ToastContainer autoClose={2000} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence registration-employment-termination">
                <h5 className="page-title">{t('ProposalToTerminateContract')}</h5>
                <StaffInfoComponent userInfos={userInfos} />
                <ReasonResignationComponent isEmployee={true} reasonTypes={reasonTypes} updateResignationReasons={this.updateResignationReasons} updateErrors={this.updateErrors} />
                <DirectManagerInfoComponent directManager={directManager} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                <SeniorExecutiveInfoComponent seniorExecutive={seniorExecutive} updateApprovalInfos={this.updateApprovalInfos} updateErrors={this.updateErrors} />
                <AttachmentComponent files={files} updateFiles={this.updateFiles} />
                <ButtonComponent isEdit={isEdit} files={files} updateFiles={this.updateFiles} submit={this.submit} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
            </div>
            </div>
        )
    }
}

export default withTranslation()(RegistrationEmploymentTerminationForm)
