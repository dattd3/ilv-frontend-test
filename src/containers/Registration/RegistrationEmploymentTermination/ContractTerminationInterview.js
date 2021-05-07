import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { Image } from 'react-bootstrap';
import _ from 'lodash'
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

class ContractTerminationInterview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeJoinDefault: null,
            timeInDefault: null,
            serveyInfos: {},
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

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     const { leaveOfAbsence } = nextProps
    //     if (leaveOfAbsence) {
    //         return ({
    //             approver: leaveOfAbsence.approver,
    //             appraiser: leaveOfAbsence.appraiser
    //         })
    //     }
    //     return prevState
    // }

    componentDidMount() {
        this.initialData()
    }

    initialData = async () => {
        const serveyInfosEndpoint = `${process.env.REACT_APP_REQUEST_URL}getworkoffserveyinfo`
        const userInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`
        const userContractInfosEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/contract`
        const requestServeyInfos = axios.get(serveyInfosEndpoint, config)
        const requestUserInfos = axios.get(userInfosEndpoint, config)
        const requestUserContractInfos = axios.get(userContractInfosEndpoint, config)

        await axios.all([requestServeyInfos, requestUserInfos, requestUserContractInfos]).then(axios.spread((...responses) => {
            const serveyInfos = this.prepareServeyInfos(responses[0])
            const userInfos = this.prepareUserInfos(responses[1], responses[2])

            this.setState({userInfos: userInfos, serveyInfos: serveyInfos})
        })).catch(errors => {
            return null
        })
    }

    prepareServeyInfos = serveyResponses => {
        if (serveyResponses && serveyResponses.data) {
            const servey = serveyResponses.data.data
            const items = servey.workOffServeyItemModel

            const categoryMapping = {
                1: {code: "CURRENT_JOB", label: "Công việc hiện tại"},
                2: {code: "MANAGER", label: "Quản lý"},
                3: {code: "SALARY_BONUS_REMUNERATION", label: "Lương thưởng & Chế độ đãi ngộ"},
                4: {code: "PERSONAL_REASONS", label: "Lý do cá nhân"}
            }

            console.log("kkkkkkkkkkk")
            console.log(items)

            const CURRENT_JOB = 1
            const MANAGER = 2
            const SALARY_BONUS_REMUNERATION = 3
            const PERSONAL_REASONS = 4

            const currentJobItems = (items || [])
            .filter(item => item.type == CURRENT_JOB)
            .map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })

            const managerItems = (items || [])
            .filter(item => item.type == MANAGER)
            .map(item => {
                return {
                    value: item.id,
                    label: item.name
                }
            })



            // [
            //     {
            //         code: "CURRENT_JOB",
            //         data: [
            //             {
            //                 value: 1,
            //                 label: "Địa điểm làm việc"
            //             }
            //         ]
            //     }
            // ]
        }
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

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        const { isEdit } = this.state
        this.setState({ isShowStatusModal: false })
        if (isEdit) {
            window.location.replace("/tasks")
        }

        window.location.reload()
    }

    updateInterviewContents = (type, value) => {
        this.setState({[type]: value})
    }

    render() {
        const { t } = this.props
        const isShowStatusModal = false
        const titleModal = ""
        const messageModal = ""
        const isSuccess = true

        const {userInfos, serveyInfos} = this.state

        return (
            <>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="contract-termination-interview">
                <div className="logo-block">
                    <Image src={VinpearlLogo} alt="Vinpearl" className="logo" />
                </div>
                <h5 className="page-title">Biểu mẫu phỏng vấn thôi việc</h5>
                <StaffInfoForContractTerminationInterviewComponent userInfos={userInfos} />
                <InterviewContentFormComponent updateInterviewContents={this.updateInterviewContents} />
                <ButtonComponent />
            </div>
            </>
        )
    }
}

export default withTranslation()(ContractTerminationInterview)
