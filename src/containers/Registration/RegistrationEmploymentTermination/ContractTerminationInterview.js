import React from 'react'
import axios from 'axios'
import { Image } from 'react-bootstrap';
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import { withRouter } from 'react-router-dom'
import Constants from '../../../commons/Constants'
import {getRequestConfigs} from '../../../commons/commonFunctions'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import StaffInfoForContractTerminationInterviewComponent from '../TerminationComponents/StaffInfoForContractTerminationInterviewComponent'
import InterviewContentFormComponent from '../TerminationComponents/InterviewContentFormComponent'
import ResultModal from '../ResultModal'
import HOCComponent from '../../../components/Common/HOCComponent'
import VinpearlLogo from '../../../assets/img/LogoVingroup.svg'//assets/img/logo-vp-vt.png
import { exportToPDF, getValueParamByQueryString } from '../../../commons/Utils';
import moment from 'moment'
import { toast } from "react-toastify";
import { getUserInfo } from 'containers/Evaluation/TargetManagement/Constant';

const CURRENT_JOB = 1
const MANAGER = 2
const SALARY_BONUS_REMUNERATION = 3
const PERSONAL_REASONS = 4

const config = {
  headers: {            
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  } 
};
class ContractTerminationInterview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCreate: false,
            timeJoinDefault: null,
            timeInDefault: null,
            resignationReasonOptionsChecked: [],
            comments: {},
            serveyInfos: [],
            serveyDetail: {},
            isUpdateFiles: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            isShowStatusModal: false,
            errors: {},
            isViewOnly: false
        }
    }

    componentDidMount() {
        const actionType = this.props.match.params.type
        const id = this.props.match.params.id
        this.setState({isViewOnly: actionType === "export", isCreate: !id})
        this.initialData()
    }

    initialData = async () => {
        const id = this.props.match.params.id
        if (id) {
          const responses = await axios.get(`${process.env.REACT_APP_REQUEST_URL}WorkOffServey/getworkoffserveyinfo?requestStatusProcessId=${id}`, getRequestConfigs())
          const serveyInfos = this.prepareServeyInfos(responses.data?.data?.workOffServeyItemModel)
          const userInfos = this.prepareUserInfos(responses)
          const serveyDetail = this.prepareServeyDetail(responses)
          const questions = this.prepareAdditionData(responses);
  
          const resignationReasonOptionsChecked  = [];
          const comments = {};
          (serveyInfos || []).map((item, index) => {
              const options = item.data || [];
              const optionSelected = item.responseKeyOptionSelects ? serveyDetail[item.responseKeyOptionSelects] : ""
              const optionSelectedToArray = optionSelected ? optionSelected.split(",") : []
              options.map((option, i) => {
                  const isChecked =optionSelectedToArray.includes(option.value +'');
                  if(isChecked) {
                      resignationReasonOptionsChecked[option.value] = {key: option.value, value: isChecked, type: option.type}
                  }
                  return option;
              })
              comments[item.categoryCode] = serveyDetail[item.responseKeyDescription] || ""
          })
  
          this.setState({userInfos, serveyInfos, serveyDetail,
              timeJoinDefault: serveyDetail.worksHistoryMonths,
              timeInDefault: serveyDetail.positionCurrentsMonths,
              resignationReasonOptionsChecked: resignationReasonOptionsChecked,
              comments: comments,
              questions: questions
          })
        } else {
          this.getMoreInfoContract(getUserInfo().EmployeeNo).then(contractResponse => {
            this.setState({
              userInfos: {
                fullName: getUserInfo().fullName,
                employeeNo: getUserInfo().EmployeeNo,
                jobTitle: getUserInfo().current_position,
                department: getUserInfo().department,
                contractType: contractResponse[getUserInfo().EmployeeNo].lastestContractType,
                dateStartWork: contractResponse[getUserInfo().EmployeeNo].dateStartWork,
                contractName: contractResponse[getUserInfo().EmployeeNo].lastestContractName,
                email: localStorage.getItem("email"),
                rank: getUserInfo().employeeLevel,
                unitName: localStorage.getItem("unit")
              }
            })
          })
          this.getWorkOffReasonItems().then(res => {
            this.setState({
              serveyInfos: this.prepareServeyInfos(res?.workOffServeyItems)
            })
          })
        }
    }

    getMoreInfoContract = async (employeeId) => {
      try {
          const res = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/getadditionalinfo`, {
              "employeeCode": employeeId
          }, config)
          if(res?.data?.data) {
              let result = {};
              Object.values(res.data.data).map(item => {
                  result[item.employeeCode] = {
                      dateStartWork: item.dateStartWork,
                      lastestContractName: item.lastestContractName,
                      lastestContractType: item.lastestContractType    
                  };
              })
              return result;
          }
      } catch(err) {
          console.log(err);
          return {}
      }
  }

  getWorkOffReasonItems = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_REQUEST_URL}WorkOffServeyItem/getworkOffServeryItemAll`, config)
        return res?.data?.data;
    } catch(err) {
        console.log(err);
        return {}
    }
  }

    prepareServeyInfos = items => {
        if (items?.length > 0) {
            const currentJobItems = (items || [])
            .filter(item => item.type == CURRENT_JOB)
            .map(item => {
                return {
                    value: item.id,
                    label: item.name,
                    type: CURRENT_JOB
                }
            })

            const managerItems = (items || [])
            .filter(item => item.type == MANAGER)
            .map(item => {
                return {
                    value: item.id,
                    label: item.name,
                    type: MANAGER
                }
            })

            const salaryBonusRemunerationItems = (items || [])
            .filter(item => item.type == SALARY_BONUS_REMUNERATION)
            .map(item => {
                return {
                    value: item.id,
                    label: item.name,
                    type: SALARY_BONUS_REMUNERATION
                }
            })

            const personalReasonItems = (items || [])
            .filter(item => item.type == PERSONAL_REASONS)
            .map(item => {
                return {
                    value: item.id,
                    label: item.name,
                    type: PERSONAL_REASONS
                }
            })

            return [
                {
                    category: this.props.t('cong_viec_hien_tai'),
                    categoryCode: CURRENT_JOB,
                    data: currentJobItems,
                    responseKeyOptionSelects: "currentWorksServey",
                    responseKeyDescription: "workCurrentDescription"
                },
                {
                    category: this.props.t('quan_ly'),
                    categoryCode: MANAGER,
                    data: managerItems,
                    responseKeyOptionSelects: "managementServey",
                    responseKeyDescription: "managementDescription"
                },
                {
                    category: this.props.t('luong_thuong_va_che_do_dai_ngo'),
                    categoryCode: SALARY_BONUS_REMUNERATION,
                    data: salaryBonusRemunerationItems,
                    responseKeyOptionSelects: "salaryServey",
                    responseKeyDescription: "salaryDescription"
                },
                {
                    category: this.props.t('ly_do_ca_nhan'),
                    categoryCode: PERSONAL_REASONS,
                    data: personalReasonItems,
                    responseKeyOptionSelects: "personalReasonServey",
                    responseKeyDescription: "personalDescription"
                }
            ]
        }
    }

    prepareServeyDetail = (serveyResponses) => {
        if (serveyResponses && serveyResponses.data) {
            const servey = serveyResponses.data.data
            const items = servey.workOffServeyModel

            if (items && _.size(items) > 0) {
                return {
                    worksHistoryMonths: items.worksHistoryMonths,
                    positionCurrentsMonths: items.positionCurrentsMonths,
                    currentWorksServey: items.currentWorksServey,
                    workCurrentDescription: items.workCurrentDescription,
                    managementServey: items.managementServey,
                    managementDescription: items.managementDescription,
                    salaryServey: items.salaryServey,
                    salaryDescription: items.salaryDescription,
                    personalReasonServey: items.personalReasonServey,
                    personalDescription: items.personalDescription
                }
            }

            return {}
        }

        return {}
    }

    prepareAdditionData = (serveyResponses) => {
        const items = serveyResponses.data.data?.workOffServeyModel;
        if(items && _.size(items) > 0) {
            const additionalInfo = items.additionalInfo? JSON.parse(items.additionalInfo) : {};
            return {
                reason1: additionalInfo.text1 || '',
                reason2: additionalInfo.text2 || '',
                q1: additionalInfo.text5 || '',
                q2: additionalInfo.text6 || '',
                q3: additionalInfo.text7 || '',
                q4: additionalInfo.text8 || '',
                q5: additionalInfo.text9 || '' 
            }
        }
        return {};
    }

    prepareUserInfos = (serveyResponses) => {
        if (serveyResponses && serveyResponses.data) {
            const servey = serveyResponses.data.data
            const items = servey.workOffServeyModel
            const userInfo = items.userInfo

            if (items && _.size(items) > 0 && userInfo && _.size(userInfo) > 0) {
                return {
                    absenseId: items.absenseId,
                    requestHistoryId: items.requestHistoryId,
                    fullName: userInfo.fullName,
                    employeeNo: userInfo.employeeNo,
                    jobTitle: userInfo.jobTitle,
                    department: userInfo.department,
                    contractType: userInfo.contractType,
                    dateTermination: items.dateTermination,
                    dateStartWork: userInfo.dateStartWork,
                    contractName: userInfo.contractName,
                    email: userInfo.email,
                    rank: userInfo.rank,
                    unitName: userInfo.unitName
                }
            }

            return {}
        }

        return {}
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false })
        window.location.reload()
    }

    updateInterviewContents = (type, value) => {
        this.setState({[type]: value})
    }

    submit = async () => {
        const { t, history } = this.props
        const {
            timeJoinDefault,
            timeInDefault,
            resignationReasonOptionsChecked,
            userInfos,
            comments,
            questions,
            isCreate
        } = this.state
        if (!timeInDefault || !timeJoinDefault || !resignationReasonOptionsChecked.length || !questions) {
          toast.error(t("PleaseFillAllField"));
          return
        }
        const currentWorksServey = (resignationReasonOptionsChecked || [])
        .filter(item => item && item.type == CURRENT_JOB && item.value)
        .map(item => item.key)
        const currentWorksServeyToSubmit = currentWorksServey.length === 0 ? null : currentWorksServey.join(",")

        const managementServey = (resignationReasonOptionsChecked || [])
        .filter(item => item && item.type == MANAGER && item.value)
        .map(item => item.key)
        const managementServeyToSubmit = managementServey.length === 0 ? null : managementServey.join(",")

        const salaryServey = (resignationReasonOptionsChecked || [])
        .filter(item => item && item.type == SALARY_BONUS_REMUNERATION && item.value)
        .map(item => item.key)
        const salaryServeyToSubmit = salaryServey.length === 0 ? null : salaryServey.join(",")

        const personalReasonServey = (resignationReasonOptionsChecked || [])
        .filter(item => item && item.type == PERSONAL_REASONS && item.value)
        .map(item => item.key)
        const personalReasonServeyToSubmit = personalReasonServey.length === 0 ? null : personalReasonServey.join(",")

        const additionalSurveyInfo = {
            "text1":questions.reason1 || '',
            "text2":questions.reason2 || '',
            "text5":questions.q1 || '',
            "text6":questions.q2 || '',
            "text7":questions.q3 || '',
            "text8":questions.q4 || '',
            "text9":questions.q5 || '',
            "hasAnotherReason":true,
            "hasOtherQuestion":true
        };

        // const err = this.verifyInput()
        this.setDisabledSubmitButton(true)
        // if (!err) {
        //     this.setDisabledSubmitButton(false)
        //     return
        // }

        const requestStatusProcessId = this.props.match.params.id

        const bodyFormData = new FormData()
        bodyFormData.append('requestStatusProcessId', requestStatusProcessId)
        bodyFormData.append('contractTerminationInfoId', requestStatusProcessId);
        bodyFormData.append('requestHistoryId', userInfos.requestHistoryId)
        bodyFormData.append('userInfo', JSON.stringify(userInfos))
        bodyFormData.append('dateTermination', userInfos.dateTermination)
        bodyFormData.append('worksHistoryMonths', timeJoinDefault)
        bodyFormData.append('positionCurrentsMonths', timeInDefault)
        bodyFormData.append('currentWorksServey', currentWorksServeyToSubmit)
        bodyFormData.append('workCurrentDescription', comments[CURRENT_JOB] || "")
        bodyFormData.append('managementServey', managementServeyToSubmit)
        bodyFormData.append('managementDescription', comments[MANAGER] || "")
        bodyFormData.append('salaryServey', salaryServeyToSubmit)
        bodyFormData.append('salaryDescription', comments[SALARY_BONUS_REMUNERATION] || "")
        bodyFormData.append('personalReasonServey', personalReasonServeyToSubmit)
        bodyFormData.append('personalDescription', comments[PERSONAL_REASONS] || "")
        bodyFormData.append('additionalSurveyInfo', JSON.stringify(additionalSurveyInfo));
        bodyFormData.append('companyCode', localStorage.getItem('companyCode'));


        try {
            const url = isCreate ? `${process.env.REACT_APP_REQUEST_URL}WorkOffServey/createSeveranceSurvey` : `${process.env.REACT_APP_REQUEST_URL}WorkOffServey/fetchworkoffservey`
            const responses = await axios.post(url, bodyFormData, config)

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
                this.showStatusModal(t("Notification"), t("Error"), false)
                this.setDisabledSubmitButton(false)
            }
            const redirectURL = getValueParamByQueryString(window.location.search, "redirectURL")
            if (redirectURL) {
              history.replace(redirectURL, {
                isSubmittedInterview: true
              })
            }
        } catch (errors) {
            this.showStatusModal(t("Notification"), t("Error"), false)
            this.setDisabledSubmitButton(false)
        }
    }

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status });
    }

    exportToPDF1 = () => {
        const elementView = document.getElementById('frame-to-export')
        const fileName = "Phieu-phong-van"
        exportToPDF(elementView, fileName);
    }

    render() {
        const { t } = this.props
        const {userInfos, serveyInfos, disabledSubmitButton, isShowStatusModal, titleModal, isSuccess, messageModal, isViewOnly, serveyDetail, questions, isCreate} = this.state
        return (
            <>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            {
                isViewOnly ?
                <div className="export-button-block">
                    <button className="export-to-pdf" type="button" onClick={this.exportToPDF1}><i className="fas fa-file-export"></i>{t('export_pdf')}</button>
                </div>
                : null
            }
            <div id="frame-to-export" className="contract-termination-interview">
                <div className="logo-block">
                    <Image src={VinpearlLogo} alt="Vinpearl" className="logo" />
                </div>
                <h5 className="page-title">{t('bieu_mau_phong_van_thoi_viec')}</h5>
                <StaffInfoForContractTerminationInterviewComponent isCreate={isCreate} userInfos={userInfos} />
                <InterviewContentFormComponent serveyInfos={serveyInfos} serveyDetail={serveyDetail} timeJoinDefault={this.state.timeJoinDefault} 
                timeInDefault={this.state.timeInDefault}
                resignationReasonOptionsChecked={this.state.resignationReasonOptionsChecked}
                comments={this.state.comments}
                questions= {questions}
                isViewOnly={isViewOnly} updateInterviewContents={this.updateInterviewContents} />
                {
                    isViewOnly ? null : <ButtonComponent isEdit={true} updateFiles={this.updateFiles} submit={this.submit} disabledSubmitButton={disabledSubmitButton} />
                }
            </div>
            </>
        )
    }
}

export default HOCComponent(withTranslation()(withRouter(ContractTerminationInterview)))
