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
            approver: null,
            appraiser: null,
            annualLeaveSummary: null,
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

    hideNoteModal = () => {
        this.setState({ isShowNoteModal: false });
    }

    updateTerminationRequestList = data => {
        this.setState({requestIdChecked: data})
    }

    updateOptionToExport = obj => {
        console.log(obj)
        if (obj && _.size(obj) > 0) {
            const option = obj.value
            switch (option) {
                case 1:
                    this.exportFilesByType()
                    break
            }
        }
    }

    save = async () => {
        const {requestIdChecked, listUserTerminations} = this.state

        if (listUserTerminations && listUserTerminations.length > 0) {
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
                // const config = {
                //     headers: {
                //         'Authorization': `${localStorage.getItem('accessToken')}`,
                //         'Content-Type': 'multipart/form-data'
                //     }
                // }

                let bodyFormData = new FormData()
                bodyFormData.append('models', JSON.stringify(itemsChecked))
                const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/updatecontractterminal`, bodyFormData, config)
                this.setState({requestIdChecked: []})
            }
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
            isShowNoteModal,
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
