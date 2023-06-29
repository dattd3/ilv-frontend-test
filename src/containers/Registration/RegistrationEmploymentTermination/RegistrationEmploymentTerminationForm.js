import React from 'react'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import { Progress } from "reactstrap"
import { toast } from "react-toastify"
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import { checkIsExactPnL, getRequestConfigs } from '../../../commons/commonFunctions'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import DirectManagerInfoComponent from '../TerminationComponents/DirectManagerInfoComponent'
import SeniorExecutiveInfoComponent from '../TerminationComponents/SeniorExecutiveInfoComponent'
import StaffInfoComponent from '../TerminationComponents/StaffInfoComponent'
import ReasonResignationComponent from '../TerminationComponents/ReasonResignationComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import ResultModal from '../ResultModal'
import LoadingModal from '../../../components/Common/LoadingModal'
import { getMuleSoftHeaderConfigurations, getRequestConfigurations, getResignResonsMasterData } from '../../../commons/Utils'
import ConfirmModal from 'components/Common/ConfirmModalNew'

class RegistrationEmploymentTerminationForm extends React.Component {
    constructor(props) {
        super(props);
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
            isShowWarningModal: false,
            errors: {
                lastWorkingDay: props.t('resign_error_lastWorkingDay'),
                reason: props.t('resign_error_reason'),
                directManager: props.t('resign_error_directManager'),
                seniorExecutive: props.t('resign_error_seniorExecutive')
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
        const requestUserMoreInfos = axios.post(userContractMoreInfosEndpoint, {"employeeCode": localStorage.getItem('employeeNo')}, config);
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
            console.log(errors);
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
                    department:  res.department || res.division
                };
            }
        }
        return userInfoDetail;
    }

    prepareManagerSuggestion = (response) => {
        if (response && response.data) {
            const result = response.data.result
            if (result && result.code == Constants.API_SUCCESS_CODE) {
              const data = response.data?.data
              const { appraiserInfo, approverInfo } = data
              const approver = approverInfo && _.size(approverInfo) > 0 
              ?  [{
                value: approverInfo?.account?.toLowerCase() || "",
                label: approverInfo?.fullName || "",
                fullName: approverInfo?.fullName || "",
                avatar: approverInfo?.avatar || "",
                employeeLevel: approverInfo?.employeeLevel || "",
                pnl: approverInfo?.pnl || "",
                orglv2Id: approverInfo?.orglv2Id || "",
                account: approverInfo?.account?.toLowerCase() || "",
                jobTitle: approverInfo?.jobTitle || "",
                department: approverInfo?.department || "",
              }]
              : []
              if(approver?.length > 0) return approver[0];
            }
        }
        return null;
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
                    department: `${infos.division || ""}${infos.department ? `/${infos.department}` : ""}${infos.unit ? `/${infos.unit}` : ""}`,
                    departmentName: infos.division || "",
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
                    rankId: localStorage.getItem("employeeLevel"),
                    master_code: localStorage.getItem("master_code"),
                    costCenter: infos.cost_center || ''
                }
            }
        }

        if (contractResponses && contractResponses.data) {
            const infos = contractResponses?.data?.data[localStorage.getItem('employeeNo')] ? contractResponses.data.data[localStorage.getItem('employeeNo')] : {};
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
            const reasonMasterData = getResignResonsMasterData();
            const results = (reasonTypes || [])
            .filter(item => item.code01 === reasonTypeCodeForEmployee && !Constants.RESIGN_REASON_EMPLOYEE_INVALID.includes(item.code02))
            .map(item => {
                return {value: item.code02, label: reasonMasterData[item.code02]}
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

    submit = async (ignoreCheckEnoughDay = false) => {
        const { t } = this.props
        const {
            userInfos,
            staffTerminationDetail,
            directManager,
            seniorExecutive,
            files
        } = this.state
        this.setDisabledSubmitButton(true)
        this.closeWarningModal()
        const isValid = this.isValidData()
        // const fileInfoValidation = this.validateAttachmentFile()
        //const isDirectManagerValid = await this.isDirectManagerValid()

        if (!isValid) {
            const message = this.getMessageValidation()
            toast.error(message)
            this.setDisabledSubmitButton(false)
            return
        // } else if (!isDirectManagerValid) {
        //     toast.error("Cán bộ QLTT không có thẩm quyền")
        //     this.setDisabledSubmitButton(false)
        //     return
        } 
        // else if (_.size(fileInfoValidation) > 0 && fileInfoValidation.files) {
        //     toast.error(fileInfoValidation.files)
        //     this.setDisabledSubmitButton(false)
        //     return
        // }
        //this.setState({isShowLoadingModal: true})
        
        if (!ignoreCheckEnoughDay) {
          const isNotEnoughTime = ((userInfos.contractType === "VA" && moment(staffTerminationDetail.dateTermination, "YYYY-MM-DD").diff(moment(), "days") < 30) ||
            (userInfos.contractType === "VB" && moment(staffTerminationDetail.dateTermination, "YYYY-MM-DD").diff(moment(), "days") < 45)) && !checkIsExactPnL(Constants.pnlVCode.VinHome)
          if (isNotEnoughTime) {
            this.setDisabledSubmitButton(false)
            return this.setState({
              isShowWarningModal: true
            })
          }
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

    closeWarningModal = () => {
      this.setState({
        isShowWarningModal: false
      })
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
            isShowLoadingModal,
            isShowWarningModal
        } = this.state
        return (
            <div className='registration-section'>
            <LoadingModal show={isShowLoadingModal} />
            <ConfirmModal
              show={isShowWarningModal}
              confirmHeader={t("ConfirmSend")}
              confirmContent={t("WarningNotEnoughTimeResign")}
              onHide={this.closeWarningModal}
              onCancelClick={this.closeWarningModal}
              onAcceptClick={() => this.submit(true)}
              tempButtonLabel={t("Cancel")}
              mainButtonLabel={t("Confirm")}
              // modalClassName,
            />
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
