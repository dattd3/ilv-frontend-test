import React from 'react'
import axios from 'axios'
import { registerLocale } from 'react-datepicker'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import LoadingModal from '../../../components/Common/LoadingModal'
import Constants from '../../../commons/Constants'
import ResignationRequestsManagementActionButton from '../TerminationComponents/ResignationRequestsManagementActionButton'
import ListStaffResignationComponent from '../TerminationComponents/ListStaffResignationComponent'
import ResultModal from '../ResultModal'
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'

const config = {
    headers: {            
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
}

const REPORT_RESIGNATION_REQUESTS = 1
const HANDOVER_STATUS = 2
const RESIGNATION = 3
const REPORT_INTERVIEW_RESULTS = 4

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

    // initialData = async () => {
    //     const listUserTerminationEndpoint = `${process.env.REACT_APP_REQUEST_URL}ReasonType/getlistterminal?pageIndex=1&pageSize=10`
    //     const requestListUserTerminations = axios.get(listUserTerminationEndpoint, config)

    //     await axios.all([requestListUserTerminations]).then(axios.spread((...responses) => {
    //         const listUserTerminations = this.prepareListUserTerminations(responses[0])
    //         this.setState({listUserTerminations: listUserTerminations})
    //     })).catch(errors => {
    //         return null
    //     })
    // }

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

    updateFiles(files) {
        this.setState({ files: files })
    }

    handleInputChange(event, groupId) {
        // event.target.value
    }

    handleSelectChange(name, value, groupId) {
        
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

    submit() {
        const { t } = this.props
        const {
            files,
            isEdit,
            requestInfo
        } = this.state

        const err = this.verifyInput()
        this.setDisabledSubmitButton(true)
        if (!err) {
            this.setDisabledSubmitButton(false)
            return
        }

        const dataRequestInfo = requestInfo.map(req => {
            let reqItem = {
                startDate: moment(req.startDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
                startTime: !req.isAllDay && !req.isAllDayCheckbox ? moment(req.startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null,
                endDate: moment(req.endDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
                endTime: !req.isAllDay && !req.isAllDayCheckbox ? moment(req.endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null,
                comment: req.comment,
                hours: req.totalTimes,
                days: req.totalDays,
                absenceType: req.absenceType,
                isAllDay: req.isAllDay,
                funeralWeddingInfo: req.funeralWeddingInfo,
                groupId: req.groupId,
            }
            if (isEdit) {
                reqItem = {
                    ...reqItem,
                    processStatusId: req.processStatusId,
                    id: req.id
                }
            }
            return reqItem
        })

        const approver = { ...this.state.approver }
        const appraiser = { ...this.state.appraiser }
        delete approver.avatar
        delete appraiser.avatar

        let bodyFormData = new FormData();
        bodyFormData.append('companyCode', localStorage.getItem("companyCode"))
        bodyFormData.append('fullName', localStorage.getItem('fullName'))
        bodyFormData.append('jobTitle', localStorage.getItem('jobTitle'))
        bodyFormData.append('department', localStorage.getItem('department'))
        bodyFormData.append('employeeNo', localStorage.getItem('employeeNo'))
        bodyFormData.append("divisionId", !this.isNullCustomize(localStorage.getItem('divisionId')) ? localStorage.getItem('divisionId') : "")
        bodyFormData.append("division", !this.isNullCustomize(localStorage.getItem('division')) ? localStorage.getItem('division') : "")
        bodyFormData.append("regionId", !this.isNullCustomize(localStorage.getItem('regionId')) ? localStorage.getItem('regionId') : "")
        bodyFormData.append("region", !this.isNullCustomize(localStorage.getItem('region')) ? localStorage.getItem('region') : "")
        bodyFormData.append("unitId", !this.isNullCustomize(localStorage.getItem('unitId')) ? localStorage.getItem('unitId') : "")
        bodyFormData.append("unit", !this.isNullCustomize(localStorage.getItem('unit')) ? localStorage.getItem('unit') : "")
        bodyFormData.append("partId", !this.isNullCustomize(localStorage.getItem('partId')) ? localStorage.getItem('partId') : "")
        bodyFormData.append("part", !this.isNullCustomize(localStorage.getItem('part')) ? localStorage.getItem('part') : "")
        bodyFormData.append('approver', JSON.stringify(approver))
        bodyFormData.append('appraiser', JSON.stringify(appraiser))
        bodyFormData.append('RequestType', JSON.stringify({
            id: 2,
            name: "Đăng ký nghỉ"
        }))
        bodyFormData.append('requestInfo', JSON.stringify(dataRequestInfo))
        if (isEdit) {
            bodyFormData.append('id', this.props.leaveOfAbsence.id)
        }

        if(!isEdit)
        {
            files.forEach(file => {
                bodyFormData.append('Files', file)
            })
        }
       
        axios({
            method: 'POST',
            url: isEdit ? `${process.env.REACT_APP_REQUEST_URL}Request/edit` : `${process.env.REACT_APP_REQUEST_URL}Request/absence/register`,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response && response.data.data && response.data.result) {
                    this.showStatusModal(t("Successful"), t("RequestSent"), true)
                    this.setDisabledSubmitButton(false)
                }
                else
                {
                    this.showStatusModal(t("Notification"), response.data.result.message, false)
                    this.setDisabledSubmitButton(false)
                }
            })
            .catch(response => {
                this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
                this.setDisabledSubmitButton(false)
            })
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

    removeFile(index) {
        this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    getIsUpdateStatus = (status) => {
        this.setState({ isUpdateFiles: status })
    }

    updateTerminationRequestList = data => {
        this.setState({requestIdChecked: data})
    }

    updateOptionToExport = obj => {
        if (obj && _.size(obj) > 0) {
            const type = obj.value
            this.exportFilesByType(type)
        }
    }

    exportFilesByType = async type => {
        const { t } = this.props
        const requestObj = this.getRequestObjectByType(type)
        this.setState({isShowLoadingModal: true})
        try {
            const isDataValid = this.isDataValid()

            if (!isDataValid.isValid && (type == HANDOVER_STATUS || type == RESIGNATION || type == REPORT_INTERVIEW_RESULTS)) {
                this.showStatusModal(t("Notification"), "Vui lòng chọn những yêu cầu cần xuất dữ liệu!", false)
                return
            } else if (isDataValid.isValid && isDataValid.total > 1 && type == REPORT_INTERVIEW_RESULTS) {
                this.showStatusModal(t("Notification"), "Vui lòng chọn duy nhất một yêu cầu cần xuất dữ liệu!", false)
                return
            }

            const responses = await axios(requestObj)
            this.processResponses(type, responses)
        } catch (error) {
            this.setState({isShowLoadingModal: false})
            this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình xuất báo cáo!", false)
        }
    }

    getRequestObjectByType = (type) => {
        const {requestIdChecked, searchingDataToFilter} = this.state
        const ids = requestIdChecked.filter(item => {
            return item && item.value
        })
        .map(item => item.key)

        const fullTextSearch = searchingDataToFilter.fullTextSearch || ""
        const typeMethodMapping = {
            [REPORT_RESIGNATION_REQUESTS]: "GET",
            [HANDOVER_STATUS]: "POST",
            [RESIGNATION]: "POST",
            [REPORT_INTERVIEW_RESULTS]: "GET"
        }

        let requestObj = {}

        switch (type) {
            case REPORT_RESIGNATION_REQUESTS:
                let apiPath = `${process.env.REACT_APP_REQUEST_URL}ReasonType/ExportToExcel`
                if (fullTextSearch) {
                    apiPath = `${process.env.REACT_APP_REQUEST_URL}ReasonType/ExportToExcel?fullTextSearch=${fullTextSearch}`
                }
                requestObj = {
                    method: typeMethodMapping[type] || "GET",
                    url: apiPath,
                    headers: {            
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    responseType: 'blob'
                }
                break
            case HANDOVER_STATUS:
                requestObj = {
                    method: typeMethodMapping[type] || "GET",
                    url: `${process.env.REACT_APP_REQUEST_URL}ReasonType/exporttowordbienbanbangiao`,
                    headers: {            
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    responseType: 'blob',
                    data: {ids: ids}
                }
                break
            case RESIGNATION:
                requestObj = {
                    method: typeMethodMapping[type] || "GET",
                    url: `${process.env.REACT_APP_REQUEST_URL}ReasonType/exportfileterminalcontract`,
                    headers: {            
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    responseType: 'blob',
                    data: {ids: ids}
                }
                break
            case REPORT_INTERVIEW_RESULTS: 
                requestObj = {
                    method: typeMethodMapping[type] || "GET",
                    url: `${process.env.REACT_APP_REQUEST_URL}WorkOffServey/getworkoffserveyinfo?AbsenseId=${ids[0]}`,
                    headers: {            
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    responseType: 'blob'
                }
                break
        }

        return requestObj
    }

    processResponses = (type, responses) => {
        const { t } = this.props

        switch (type) {
            case REPORT_RESIGNATION_REQUESTS:
                this.setState({isShowLoadingModal: false})
                if (responses && responses.data && responses.status === 200) {
                    this.handleDownloadFiles(responses.data, "Bao-cao-yeu-cau-nghi-viec.xlsx")
                } else {
                    this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình xuất báo cáo!", false)
                }
                break
            case HANDOVER_STATUS:
                this.setState({isShowLoadingModal: false})
                if (responses && responses.data && responses.status === 200) {
                    this.handleDownloadFiles(responses.data, "Bao-cao-tinh-trang-ban-giao.zip")
                } else {
                    this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình xuất báo cáo!", false)
                }
                break
            case RESIGNATION:
                this.setState({isShowLoadingModal: false})
                if (responses && responses.data && responses.status === 200) {
                    this.handleDownloadFiles(responses.data, "Don-xin-nghi-viec.zip")
                } else {
                    this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình xuất báo cáo!", false)
                }
                break
            case REPORT_INTERVIEW_RESULTS:
                this.setState({isShowLoadingModal: false})
                if (responses && responses.data && responses.status === 200) {
                    this.handleDownloadFiles(responses.data, "Don-xin-nghi-viec.zip")
                } else {
                    this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình xuất báo cáo!", false)
                }
                break
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

    save = async () => {
        const {t} = this.props
        const {requestIdChecked, listUserTerminations} = this.state
        const isDataValid = this.isDataValid()

        if (!isDataValid.isValid) {
            this.showStatusModal(t("Notification"), "Xin vui lòng tích chọn thông tin cần lưu!", false)
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
                    const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/updatecontractterminal`, JSON.stringify(itemsChecked), config)
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
            return {
                isValid: false,
                total: 0
            }
        }

        const itemsChecked = requestIdChecked.filter(item => item && item.value)
        if (itemsChecked && itemsChecked.length > 0) {
            return {
                isValid: true,
                total: itemsChecked.length
            }
        }

        return {
            isValid: false,
            total: 0
        }
    }

    render() {
        const { t } = this.props
        const {
            listUserTerminations,
            isEdit,
            files,
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
            <LoadingModal show={isShowLoadingModal} />
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence resignation-requests-management-page">
                <ResignationRequestsManagementActionButton updateKeywordsToFilter={this.updateKeywordsToFilter} save={this.save} updateOptionToExport={this.updateOptionToExport} />
                <ListStaffResignationComponent listUserTerminations={listUserTerminations} updateTerminationRequestList={this.updateTerminationRequestList} />
            </div>
            </>
        )
    }
}

export default withTranslation()(ResignationRequestsManagementPage)
