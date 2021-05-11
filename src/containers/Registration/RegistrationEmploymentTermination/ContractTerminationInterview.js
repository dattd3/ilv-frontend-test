import React from 'react'
import axios from 'axios'
import { Image } from 'react-bootstrap';
import _ from 'lodash'
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import ButtonComponent from '../TerminationComponents/ButtonComponent'
import StaffInfoForContractTerminationInterviewComponent from '../TerminationComponents/StaffInfoForContractTerminationInterviewComponent'
import InterviewContentFormComponent from '../TerminationComponents/InterviewContentFormComponent'
import ResultModal from '../ResultModal'
import VinpearlLogo from '../../../assets/img/logo-vp-vt.png'

const config = {
    headers: {            
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
}

const CURRENT_JOB = 1
const MANAGER = 2
const SALARY_BONUS_REMUNERATION = 3
const PERSONAL_REASONS = 4

class ContractTerminationInterview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeJoinDefault: null,
            timeInDefault: null,
            resignationReasonOptionsChecked: [],
            comments: {},
            serveyInfos: [],
            isUpdateFiles: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            isShowStatusModal: false,
            errors: {},
            actionType: null
        }
    }

    componentDidMount() {
        const actionType = this.props.match.params.type
        this.setState({actionType: actionType})
        this.initialData()
    }

    initialData = async () => {
        const id = this.props.match.params.id
        const responses = await axios.get(`${process.env.REACT_APP_REQUEST_URL}WorkOffServey/getworkoffserveyinfo?AbsenseId=${id}`, config)
        const serveyInfos = this.prepareServeyInfos(responses)
        const userInfos = this.prepareUserInfos(responses)

        this.setState({userInfos: userInfos, serveyInfos: serveyInfos})
    }

    prepareServeyInfos = serveyResponses => {
        if (serveyResponses && serveyResponses.data) {
            const servey = serveyResponses.data.data
            const items = servey.workOffServeyItemModel

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
                    type: MANAGER,

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
                    category: "Công việc hiện tại",
                    categoryCode: CURRENT_JOB,
                    data: currentJobItems
                },
                {
                    category: "Quản lý",
                    categoryCode: MANAGER,
                    data: managerItems
                },
                {
                    category: "Lương thưởng & Chế độ đãi ngộ",
                    categoryCode: SALARY_BONUS_REMUNERATION,
                    data: salaryBonusRemunerationItems
                },
                {
                    category: "Lý do cá nhân",
                    categoryCode: PERSONAL_REASONS,
                    data: personalReasonItems
                }
            ]
        }
    }

    prepareUserInfos = (serveyResponses) => {
        if (serveyResponses && serveyResponses.data) {
            const servey = serveyResponses.data.data
            const items = servey.workOffServeyModel

            if (items && _.size(items) > 0) {
                return {
                    absenseId: items.absenseId,
                    requestHistoryId: items.requestHistoryId,
                    userId: items.userId,
                    fullName: items.fullName,
                    employeeCode: items.employeeCode,
                    positionName: items.positionName,
                    departmentName: items.departmentName,
                    contractType: items.contractType,
                    dateTermination: items.dateTermination
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
        const { t } = this.props
        const {
            timeJoinDefault,
            timeInDefault,
            resignationReasonOptionsChecked,
            userInfos,
            comments
        } = this.state

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

        // const err = this.verifyInput()
        this.setDisabledSubmitButton(true)
        // if (!err) {
        //     this.setDisabledSubmitButton(false)
        //     return
        // }

        let bodyFormData = new FormData()
        bodyFormData.append('absenseId', userInfos.absenseId)
        bodyFormData.append('requestHistoryId', userInfos.requestHistoryId)
        bodyFormData.append('userId', userInfos.userId)
        bodyFormData.append('fullName', userInfos.fullName)
        bodyFormData.append('employeeCode', userInfos.employeeCode)
        bodyFormData.append('positionName', userInfos.positionName)
        bodyFormData.append('departmentName', userInfos.departmentName)
        bodyFormData.append('contractType', userInfos.contractType)
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

        try {
            const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}WorkOffServey/fetchworkoffservey`, bodyFormData, config)

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

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status });
    }

    exportToPDF = () => {
        const elementView = document.getElementById('frame-to-export')
        const fileName = "Phieu-phong-van"

        html2canvas(elementView).then(canvas => {
            const image = canvas.toDataURL('image/jpeg', 1.0)
            const doc = new jsPDF('p', 'px', 'a2')
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
    
            const widthRatio = pageWidth / canvas.width
            const heightRatio = pageHeight / canvas.height
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio
    
            const canvasWidth = canvas.width * ratio
            const canvasHeight = canvas.height * ratio
    
            const marginX = (pageWidth - canvasWidth) / 2
            const marginY = (pageHeight - canvasHeight) / 2
    
            doc.addImage(image, 'JPEG', marginX, marginY, canvasWidth, canvasHeight)
            doc.save(`${fileName}.pdf`)
        })
    }

    render() {
        const { t } = this.props
        const {userInfos, serveyInfos, disabledSubmitButton, isShowStatusModal, titleModal, isSuccess, messageModal, actionType} = this.state

        return (
            <>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            {
                actionType === "export" ?
                <div className="export-button-block">
                    <button className="export-to-pdf" type="button" onClick={this.exportToPDF}><i className="fas fa-file-export"></i>Xuất PDF</button>
                </div>
                : null
            }
            <div id="frame-to-export" className="contract-termination-interview">
                <div className="logo-block">
                    <Image src={VinpearlLogo} alt="Vinpearl" className="logo" />
                </div>
                <h5 className="page-title">Biểu mẫu phỏng vấn thôi việc</h5>
                <StaffInfoForContractTerminationInterviewComponent userInfos={userInfos} />
                <InterviewContentFormComponent serveyInfos={serveyInfos} updateInterviewContents={this.updateInterviewContents} />
                {
                    actionType === "export" ? null : <ButtonComponent isEdit={true} updateFiles={this.updateFiles} submit={this.submit} disabledSubmitButton={disabledSubmitButton} />
                }
            </div>
            </>
        )
    }
}

export default withTranslation()(ContractTerminationInterview)
