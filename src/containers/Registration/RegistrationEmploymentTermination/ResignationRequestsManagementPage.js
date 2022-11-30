import React from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Progress } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import { withTranslation } from "react-i18next"
import LoadingModal from '../../../components/Common/LoadingModal'
import Constants from '../../../commons/Constants'
import { getRequestConfigs } from '../../../commons/commonFunctions'
import ResignationRequestsManagementActionButton from '../TerminationComponents/ResignationRequestsManagementActionButton'
import ListStaffResignationComponent from '../TerminationComponents/ListStaffResignationComponent'
import ResultModal from '../ResultModal'
import CustomPaging from '../../../components/Common/CustomPaging'
import "react-toastify/dist/ReactToastify.css"
import ReactSelect from 'react-select'

const REPORT_RESIGNATION_REQUESTS = 1
const HANDOVER_STATUS = 2
const RESIGNATION = 3
const REPORT_INTERVIEW_RESULTS = 4
const LIQUIDATION_AGREEMENT = 5
const CONTRACT_TERMINATION_AGREEMENT = 6
const DECISION_CONTRACT_TERMINATION = 7

class ResignationRequestsManagementPage extends React.Component {
    pagingSize = [
        {value: 10, label: '10'},
        {value: 30, label: '30'},
        {value: 50, label: '50'},
        {value: 100, label: '100'},
    ]
    constructor(props) {
        super();
        this.state = {
            listUserTerminations: [],
            listDepartments: [],
            totalUserTerminations: 0,
            searchingDataToFilter: {
                pageIndex: Constants.PAGE_INDEX_DEFAULT,
                pageSize: Constants.PAGE_SIZE_DEFAULT,
                fullTextSearch: "",
                employeeNo: null,
                department: null,
                handoverStatus: null,
                approvalStatus: null
            },
            requestIdChecked: [],
            isCheckedAll: false,
            isShowLoadingModal: false,
            isShowStatusModal: false,
            annualLeaveSummary: null,
            files: [],
            isUpdateFiles: false,
            isEdit: false,
            titleModal: "",
            messageModal: "",
            loaded: 0,
            errors: {}
        }
    }

    componentDidMount() {
        this.fetchDeparmtData();
        this.fetchListUserTerminations()
    }

    fetchDeparmtData = async () => {
        const config = getRequestConfigs()
        config.params = {companyCode: localStorage.getItem('companyCode')};
        const responses = await axios.get(`${process.env.REACT_APP_REQUEST_URL}ReasonType/getdepartments`, config)
        if (responses && responses.data && responses.data.data) {
            const departmentData = responses.data.data.map(item => {
                return {
                    value: item.code,
                    label: item.name
                };
            }).filter(item => item.label);

            this.setState({listDepartments: departmentData});
        }
    }

    updateKeywordsToFilter = (value, advancedData) => {
        const searchingDataToFilter = {...this.state.searchingDataToFilter}
        searchingDataToFilter.fullTextSearch = value
        Object.keys(advancedData).map(key => {
            searchingDataToFilter[key] = advancedData[key];
        })
        this.setState({searchingDataToFilter: searchingDataToFilter}, () => {
            this.fetchListUserTerminations()
        })
    }

    fetchListUserTerminations = async () => {
        this.setState({isShowLoadingModal: true})
        const params = this.prepareParamsToFilter()
        const config = getRequestConfigs()
        //config.params = params
        const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/getlistterminal`, params, config)
        const listUserTerminations = this.prepareListUserTerminations(responses)
        this.setState({listUserTerminations: listUserTerminations.data, totalUserTerminations: listUserTerminations.total, isCheckedAll: listUserTerminations.isCheckedAll, isShowLoadingModal: false})
    }

    prepareParamsToFilter = () => {
        const params =  Object.entries({...this.state.searchingDataToFilter}).reduce((item, [k, v]) => (v === null || v === "" ? item : (item[k] = v, item)), {})
        if(params.employeeNo) {
            params.employeeNo = (params.employeeNo|| '').trim().replace(/\s\s+/g, ",").replace(/\s/g, ',').replace(/\,\,+/g, ",");
        }
        return params;
    }

    prepareListUserTerminations = responses => {
        if (responses && responses.data && responses.data.data) {
            const total = responses.data.data.totalRecord
            const userTerminations = responses.data.data.data
            let isCheckedAll = true;
            if (userTerminations && userTerminations.length > 0) {
                const itemsChecked = (this.state.requestIdChecked || []).filter(item => item?.value).map(item => item.requestStatusProcessId);
                userTerminations.map(item => {
                    if(!itemsChecked.includes(item.requestStatusProcessId)) {
                        isCheckedAll = false;
                    }
                });
                return {
                    data: userTerminations,
                    total: total,
                    isCheckedAll: isCheckedAll
                }
            }

            return {
                data: [],
                total: 0,
                isCheckedAll: false
            }
        }

        return {
            data: [],
            total: 0,
            isCheckedAll: false
        }
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
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

    updateTerminationRequestList = (stateName, data, isCheckedAll) => {
        this.setState({[stateName]: data, isCheckedAll: isCheckedAll})
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

            if (!isDataValid && (type == LIQUIDATION_AGREEMENT 
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

        const requestStatusProcessIds = requestIdChecked.filter(item => {
            return item && item.value
        })
        .map(item => item.key)

        const fullTextSearch = searchingDataToFilter.fullTextSearch || ""
        const typeMethodMapping = {
            [REPORT_RESIGNATION_REQUESTS]: "POST",
            [HANDOVER_STATUS]: "POST",
            [RESIGNATION]: "POST",
            [REPORT_INTERVIEW_RESULTS]: "POST",
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
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}WorkOffDeliver/exporttowordbienbanbangiao`)
                requestObj = {...requestConfig, ...{data: {}}}
                break
            case RESIGNATION:
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}ReasonType/exportfileterminalcontract`)
                requestObj = {...requestConfig, ...{data: {}}}
                break
            case REPORT_INTERVIEW_RESULTS:
                requestObj = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}WorkOffServey/exportToExcel`)
                break
            case LIQUIDATION_AGREEMENT:
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}Template/exportword_bienban_thanhly_hopdong`)
                requestObj = {...requestConfig, ...{data: {ids: requestStatusProcessIds}}}
                break
            case CONTRACT_TERMINATION_AGREEMENT:
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}Template/exportword_thoathuan_chamdut_hopdong`)
                requestObj = {...requestConfig, ...{data: {ids: requestStatusProcessIds}}}
                break
            case DECISION_CONTRACT_TERMINATION:
                requestConfig = this.getRequestConfig(typeMethodMapping[type], `${process.env.REACT_APP_REQUEST_URL}Template/exportword_quyetdinh_chamdut_hopdong`)
                requestObj = {...requestConfig, ...{data: {ids: requestStatusProcessIds}}}
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
                this.handleExportResponses(responses, "Bien-ban-thanh-ly.zip")
                break
            case CONTRACT_TERMINATION_AGREEMENT:
                this.handleExportResponses(responses, "Thoa-thuan-cham-dut-hop-dong.zip")
                break
            case DECISION_CONTRACT_TERMINATION:
                this.handleExportResponses(responses, "Quyet-dinh-cham-dut-hop-dong.zip")
                break
        }
    }

    handleExportResponses = async (responses, fileName) => {
        this.setState({isShowLoadingModal: false})
        if (responses && responses.data && responses.status === 200) {
            try {
                let message = ''
                const blobText = new Blob([responses.data], { type: "application/json" });
                let dataerr = JSON.parse(await blobText.text());
                message = dataerr?.result?.message || 'Có lỗi xảy ra trong quá trình xuất báo cáo!';
                toast.error(message)
            } catch(err) {
                this.handleDownloadFiles(responses.data, fileName)
            }
            
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

    massUpdate = async (type, key, value) => {
        const {t} = this.props
        const {requestIdChecked, files} = this.state
        const isDataValid = this.isDataValid()
        if (!isDataValid) {
            toast.error("Xin vui lòng tích chọn thông tin cần lưu!")
            return
        } else {
            const itemsChecked = (requestIdChecked || []).filter(item => item?.value).filter(item => item?.item[type] == true).map(item => {
                const _item = item.item;
                _item[key] = value;
                return _item;
            });
            if (itemsChecked.length > 0) {
                this.setState({isShowLoadingModal: true})
                try {
                    let bodyFormData = new FormData()
                    bodyFormData.append('models', JSON.stringify(itemsChecked))
                    bodyFormData.append('type', key);

                    const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/updatecontractterminal`, bodyFormData, getRequestConfigs())
                    this.setState({isShowLoadingModal: false, requestIdChecked: [], isCheckedAll: false})

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
                    this.setState({isShowLoadingModal: false, requestIdChecked: [], isCheckedAll: false})
                }
            } else {
                toast.error("Không có quyền trên thay đổi trên những bản ghi đã chọn!")
            }
        }
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
            const itemsChecked = (requestIdChecked || []).filter(item => item?.value).map(item => item?.item)
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

                    const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}ReasonType/updatecontractterminal`, bodyFormData, getRequestConfigs())
                    this.setState({isShowLoadingModal: false, requestIdChecked: [], isCheckedAll: false})

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
                    this.setState({isShowLoadingModal: false, requestIdChecked: [], isCheckedAll: false})
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

    onChangePage = page => {
        const searchingDataToFilter = this.state.searchingDataToFilter
        searchingDataToFilter.pageIndex = page
        this.setState({searchingDataToFilter: searchingDataToFilter}, () => {
            this.fetchListUserTerminations()
        })
    }

    handlePageSizeChange = (e) => {
        const searchingDataToFilter = this.state.searchingDataToFilter
        searchingDataToFilter.pageSize = e.value;
        searchingDataToFilter.pageIndex = 1;
        this.setState({searchingDataToFilter: searchingDataToFilter}, () => {
            this.fetchListUserTerminations()
        })
    }

    render() {
        const { t } = this.props
        const {
            listUserTerminations,
            totalUserTerminations,
            listDepartments,
            titleModal,
            messageModal,
            isShowStatusModal,
            isSuccess,
            isShowLoadingModal,
            searchingDataToFilter,
            isCheckedAll
        } = this.state

        return (
            <>
            <ToastContainer autoClose={2000} />
            <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
            </Progress>
            <LoadingModal show={isShowLoadingModal} />
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="block-title" >
                <h4 className="title text-uppercase">Quản lý yêu cầu nghỉ việc</h4>
            </div>
            <div className="leave-of-absence resignation-requests-management-page">
                <ResignationRequestsManagementActionButton listDepartments ={listDepartments} updateKeywordsToFilter={this.updateKeywordsToFilter} updateAttachedFiles={this.updateAttachedFiles} save={this.save} massUpdate={this.massUpdate} updateOptionToExport={this.updateOptionToExport} />
                <ListStaffResignationComponent listUserTerminations={listUserTerminations} isCheckedAll ={isCheckedAll} updateTerminationRequestList={this.updateTerminationRequestList} />
            </div>
            <div className='row'>
                <div className='col-sm d-flex flex-row align-items-center'>
                Hiển thị: <div style={{width: '100px', marginLeft: '5px'}}>
                    <ReactSelect options={this.pagingSize} value = {this.pagingSize.filter(item => item.value == searchingDataToFilter.pageSize)} 
                        onChange={e => this.handlePageSizeChange(e)} isClearable={false}  />
                    </div>
                </div>
                <div className='col-sm'></div>
                <div className='col-sm'> <CustomPaging pageSize={searchingDataToFilter.pageSize} onChangePage={this.onChangePage} totalRecords={totalUserTerminations} /></div>
                <div className='col-sm'></div>
                <div className='col-sm'></div>
            </div>
           
            </>
        )
    }
}

export default withTranslation()(ResignationRequestsManagementPage)
