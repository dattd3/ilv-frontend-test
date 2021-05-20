import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Progress } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { withTranslation } from "react-i18next"
import LoadingModal from '../../../components/Common/LoadingModal'
import Constants from '../../../commons/Constants'
import ResignationRequestsManagementActionButton from '../TerminationComponents/ResignationRequestsManagementActionButton'
import ListStaffResignationComponent from '../TerminationComponents/ListStaffResignationComponent'
import ResultModal from '../ResultModal'
import "react-toastify/dist/ReactToastify.css"

const config = {
    headers: {            
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
}

const REPORT_RESIGNATION_REQUESTS = 1
const HANDOVER_STATUS = 2
const RESIGNATION = 3
const REPORT_INTERVIEW_RESULTS = 4
const LIQUIDATION_AGREEMENT = 5
const CONTRACT_TERMINATION_AGREEMENT = 6
const DECISION_CONTRACT_TERMINATION = 7

class ResignationRequestsManagementPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            listUserTerminations: [],
            searchingDataToFilter: {
                pageIndex: Constants.PAGE_INDEX_DEFAULT,
                pageSize: Constants.PAGE_SIZE_DEFAULT,
                fullTextSearch: ""
            },
            requestIdChecked: [],
            isShowLoadingModal: false,
            isShowStatusModal: false,
            approver: null,
            appraiser: null,
            annualLeaveSummary: null,
            files: [],
            isUpdateFiles: false,
            isEdit: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            loaded: 0,
            errors: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { leaveOfAbsence } = nextProps
        if (leaveOfAbsence) {
            return ({
                approver: leaveOfAbsence.approver,
                appraiser: leaveOfAbsence.appraiser
            })
        }
        return prevState
    }

    componentDidMount() {
        this.fetchListUserTerminations()
    }

    updateKeywordsToFilter = value => {
        const searchingDataToFilter = {...this.state.searchingDataToFilter}
        searchingDataToFilter.fullTextSearch = value
        this.setState({searchingDataToFilter: searchingDataToFilter}, () => {
            this.fetchListUserTerminations()
        })
    }

    fetchListUserTerminations = async () => {
        this.setState({isShowLoadingModal: true})
        const params = this.prepareParamsToFilter()
        config.params = params
        const responses = await axios.get(`${process.env.REACT_APP_REQUEST_URL}ReasonType/getlistterminal`, config)
        const listUserTerminations = this.prepareListUserTerminations(responses)
        this.setState({listUserTerminations: listUserTerminations, isShowLoadingModal: false})
    }

    prepareParamsToFilter = () => {
        return Object.entries({...this.state.searchingDataToFilter}).reduce((item, [k, v]) => (v === null || v === "" ? item : (item[k] = v, item)), {})
    }

    prepareListUserTerminations = responses => {
        if (responses && responses.data && responses.data.data && responses.data.data.data) {
            const userTerminations = responses.data.data.data
            if (userTerminations && userTerminations.length > 0) {
                return userTerminations
            }

            return []
        }

        return []
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

    removeFile(index) {
        this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    getIsUpdateStatus = (status) => {
        this.setState({ isUpdateFiles: status })
    }

    updateTerminationRequestList = (stateName, data) => {
        this.setState({[stateName]: data})
    }

    updateOptionToExport = exportOption => {
        if (exportOption && _.size(exportOption) > 0) {
            const type = exportOption.value
            this.exportFilesByType(type)
        }
    }

    exportFilesByType = async type => {
        const { t } = this.props
        const requestObj = this.getRequestObjectByType(type)
        this.setState({isShowLoadingModal: true})

        try {
            const isDataValid = this.isDataValid()

            if (!isDataValid && (type == HANDOVER_STATUS || type == RESIGNATION || type == LIQUIDATION_AGREEMENT
                || type == CONTRACT_TERMINATION_AGREEMENT || type == DECISION_CONTRACT_TERMINATION)) {
                this.setState({isShowLoadingModal: false})
                toast.error("Vui lòng chọn yêu cầu cần xuất dữ liệu!")
                return
            }

            const responses = await axios(requestObj)
            this.processResponses(type, responses)
        } catch (error) {
            this.setState({isShowLoadingModal: false})
            toast.error("Có lỗi xảy ra trong quá trình xuất báo cáo!")
            return
        }
    }

    getRequestObjectByType = (type) => {
        const {requestIdChecked, searchingDataToFilter} = this.state
        const ids = requestIdChecked.filter(item => {
            return item && item.value
        })
        .map(item => item.key)

        const requestHistoryIds = requestIdChecked.filter(item => {
            return item && item.value
        })
        .map(item => item.requestHistoryId)

        const fullTextSearch = searchingDataToFilter.fullTextSearch || ""
        const typeMethodMapping = {
            [REPORT_RESIGNATION_REQUESTS]: "GET",
            [HANDOVER_STATUS]: "POST",
            [RESIGNATION]: "POST",
            [REPORT_INTERVIEW_RESULTS]: "GET",
            [LIQUIDATION_AGREEMENT]: "POST",
            [CONTRACT_TERMINATION_AGREEMENT]: "POST",
            [DECISION_CONTRACT_TERMINATION]: "POST"
        }

        let requestObj = {}
        let requestConfig = {}

        switch (type) {
            case REPORT_RESIGNATION_REQUESTS:
                let apiPath = `${process.env.REACT_APP_REQUEST_URL}ReasonType/ExportToExcel`
                if (fullTextSearch) {
                    apiPath = `${process.env.REACT_APP_REQUEST_URL}ReasonType/ExportToExcel?fullTextSearch=${fullTextSearch}`
                }
                requestObj = this.getRequestConfig(typeMethodMapping[type], apiPath)
                break
            case HANDOVER_STATUS:
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}ReasonType/exporttowordbienbanbangiao`)
                requestObj = {...requestConfig, ...{data: {ids: ids}}}
                break
            case RESIGNATION:
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}ReasonType/exportfileterminalcontract`)
                requestObj = {...requestConfig, ...{data: {ids: ids}}}
                break
            case REPORT_INTERVIEW_RESULTS:
                requestObj = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}WorkOffServey/exportToExcel`)
                break
            case LIQUIDATION_AGREEMENT:
                // TODO
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}Template/exportword_bienban_thanhly_hopdong`)
                requestObj = {...requestConfig, ...{data: {ids: requestHistoryIds}}}
                break
            case CONTRACT_TERMINATION_AGREEMENT:
                // TODO
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}Template/exportword_thoathuan_chamdut_hopdong`)
                requestObj = {...requestConfig, ...{data: {ids: requestHistoryIds}}}
                break
            case DECISION_CONTRACT_TERMINATION:
                // TODO
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}Template/exportword_quyetdinh_chamdut_hopdong`)
                requestObj = {...requestConfig, ...{data: {ids: requestHistoryIds}}}
                break
        }

        return requestObj
    }

    getRequestConfig = (method, url) => {
        return {
            method: method || "GET",
            url: url,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            responseType: 'blob'
        }
    }

    processResponses = (type, responses) => {
        const { t } = this.props

        switch (type) {
            case REPORT_RESIGNATION_REQUESTS:
                this.setState({isShowLoadingModal: false})
                if (responses && responses.data && responses.status === 200) {
                    this.handleDownloadFiles(responses.data, "Bao-cao-yeu-cau-nghi-viec.xlsx")
                } else {
                    toast.error("Có lỗi xảy ra trong quá trình xuất báo cáo!")
                    return
                }
                break
            case HANDOVER_STATUS:
                this.handleExportResponses(responses, "Bao-cao-tinh-trang-ban-giao.zip")
                break
            case RESIGNATION:
                this.handleExportResponses(responses, "Don-xin-nghi-viec.zip")
                break
            case REPORT_INTERVIEW_RESULTS:
                this.handleExportResponses(responses, "Bao-cao-ket-qua-phong-van.xlsx")
                break
            case LIQUIDATION_AGREEMENT:
                // TODO
                this.handleExportResponses(responses, "Bien-ban-thanh-ly.zip")
                break
            case CONTRACT_TERMINATION_AGREEMENT:
                // TODO
                this.handleExportResponses(responses, "Thoa-thuan-cham-dut-hop-dong.zip")
                break
            case DECISION_CONTRACT_TERMINATION:
                // TODO
                this.handleExportResponses(responses, "Quyet-dinh-cham-dut-hop-dong.zip")
                break
        }
    }

    handleExportResponses = (responses, fileName) => {
        this.setState({isShowLoadingModal: false})
        if (responses && responses.data && responses.status === 200) {
            this.handleDownloadFiles(responses.data, fileName)
        } else {
            toast.error("Có lỗi xảy ra trong quá trình xuất báo cáo!")
        }
    }

    updateAttachedFiles = files => {
        const requestIdChecked = this.state.requestIdChecked
        const listRequestIdCheckedCanNotUpload = (requestIdChecked || [])
        .filter(item => !item.isUploadFile)
        .map(item => item.employeeNo)

        if (listRequestIdCheckedCanNotUpload && listRequestIdCheckedCanNotUpload.length > 0) {
            toast.error(`Bạn không có quyền đính kèm files cho Yêu cầu nghỉ việc của mã nhân viên: ${listRequestIdCheckedCanNotUpload.join(", ")}`)
        } else {
            this.setState({ files: files })
        }
    }

    handleDownloadFiles = (fileBlob, fileName) => {
        const url = window.URL.createObjectURL(new Blob([fileBlob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
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

    save = async () => {
        const {t} = this.props
        const {requestIdChecked, listUserTerminations, files} = this.state
        const isDataValid = this.isDataValid()
        const fileInfoValidation = this.validateAttachmentFile()

        if (!isDataValid) {
            toast.error("Xin vui lòng tích chọn thông tin cần lưu!")
            return
        } else if (_.size(fileInfoValidation) > 0 && fileInfoValidation.files) {
            toast.error(fileInfoValidation.files)
            return
        } else {
            let itemsChecked = []

            for (let i = 0, requestIdCheckedLength = requestIdChecked.length; i < requestIdCheckedLength; i++) {
                const requestIdCheckedItem = requestIdChecked[i]
                for (let j = 0, userInfosLength = listUserTerminations.length; j < userInfosLength; j++) {
                    const userTerminationItem = listUserTerminations[j]
                    if (requestIdCheckedItem && requestIdCheckedItem.key === userTerminationItem.id && requestIdCheckedItem.value) {
                        itemsChecked = itemsChecked.concat(userTerminationItem)
                    }
                }
            }

            if (itemsChecked.length > 0) {
                this.setState({isShowLoadingModal: true})
                try {
                    let bodyFormData = new FormData()
                    bodyFormData.append('models', JSON.stringify(itemsChecked))

                    if (files && files.length > 0) {
                        files.forEach(file => {
                            bodyFormData.append('attachFiles', file)
                        })
                    }

                    const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/updatecontractterminal`, bodyFormData, config)
                    this.setState({isShowLoadingModal: false, requestIdChecked: []})

                    if (responses && responses.data) {
                        const result = responses.data.result
                        if (result.code != Constants.API_ERROR_CODE) {
                            this.showStatusModal(t("Successful"), t("RequestSent"), true)
                        } else {
                            this.showStatusModal(t("Notification"), result.message, false)
                        }
                    } else {
                        this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
                    }
                } catch (error) {
                    this.setState({isShowLoadingModal: false, requestIdChecked: []})
                }
            }
        }
    }

    isDataValid = () => {
        const {requestIdChecked, listUserTerminations} = this.state
        if (!requestIdChecked || requestIdChecked.length === 0 || !listUserTerminations || listUserTerminations.length === 0) {
            return false
        }

        const itemsChecked = requestIdChecked.filter(item => item && item.value)
        if (itemsChecked && itemsChecked.length > 0) {
            return true
        }

        return false
    }

    render() {
        const { t } = this.props
        const {
            listUserTerminations,
            isEdit,
            errors,
            titleModal,
            messageModal,
            disabledSubmitButton,
            isShowStatusModal,
            isSuccess,
            isShowLoadingModal
        } = this.state

        return (
            <>
            <ToastContainer autoClose={2000} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <LoadingModal show={isShowLoadingModal} />
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence resignation-requests-management-page">
                <ResignationRequestsManagementActionButton updateKeywordsToFilter={this.updateKeywordsToFilter} updateAttachedFiles={this.updateAttachedFiles} save={this.save} updateOptionToExport={this.updateOptionToExport} />
                <ListStaffResignationComponent listUserTerminations={listUserTerminations} updateTerminationRequestList={this.updateTerminationRequestList} />
            </div>
            </>
        )
    }
}

export default withTranslation()(ResignationRequestsManagementPage)
