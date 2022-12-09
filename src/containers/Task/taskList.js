import React from 'react'
// import editButton from '../../assets/img/Icon-edit.png'
import TableUtil from '../../components/Common/table'
import { OverlayTrigger, Tooltip, Popover, InputGroup, FormControl } from 'react-bootstrap'
import Select from 'react-select'
import moment from 'moment'
import _ from 'lodash'
import purify from "dompurify"
import { withTranslation } from "react-i18next"
import noteButton from '../../assets/img/icon-note.png'
import excelButton from '../../assets/img/excel-icon.svg'
import commentButton from '../../assets/img/Icon-comment.png'
import CustomPaging from '../../components/Common/CustomPaging'
import TaskDetailModal from './TaskDetailModal'
import ExportModal from './ExportModal'
import ChangeReqBtnComponent from './ChangeReqBtnComponent'
import Constants from '../../commons/Constants'
import { getRequestTypeIdsAllowedToReApproval, showRangeDateGroupByArrayDate, generateTaskCodeByCode } from "../../commons/Utils"
import { absenceRequestTypes, requestTypes } from "../Task/Constants"
import { checkIsExactPnL } from '../../commons/commonFunctions'

class TaskList extends React.Component {
    constructor() {
        super();
        this.state = {
            approveTasks: [],
            tasks: [],
            taskChecked: [],
            isShowTaskDetailModal: false,
            isShowExportModal: false,
            messageModalConfirm: "",
            pageNumber: 1,
            taskId: null,
            subId: null,
            requestUrl: "",
            requestTypeId: null,
            dataToPrepareToSAP: {},
            action: null,
            disabled: "disabled",
            query: "",
            statusSelected: null,
            checkedAll:false,
            dataForSearch: {
                pageIndex: Constants.TASK_PAGE_INDEX_DEFAULT,
                pageSize: Constants.TASK_PAGE_SIZE_DEFAULT,
                sender: '',
                status: 0,
                needRefresh: false
            }
        }

        this.manager = {
            code: localStorage.getItem('employeeNo') || "",
            fullName: localStorage.getItem('fullName') || "",
            title: localStorage.getItem('jobTitle') || "",
            department: localStorage.getItem('department') || ""
        };
        // this.handleButtonChangeSingle = this.handleButtonChange.bind(this, false);

    }
    componentDidMount()
    {
        this.setState({tasks: this.props.tasks})
    }
    
    componentWillReceiveProps(nextProps)
    {
        this.setState({tasks: nextProps.tasks, taskFiltered: nextProps.tasks})
    }

    onChangePage = index => {
        index = index < Constants.TASK_PAGE_INDEX_DEFAULT ? Constants.TASK_PAGE_INDEX_DEFAULT : index;
        index = index * this.state.dataForSearch.pageSize > this.props.total ? (1 + parseInt(this.props.total / this.state.dataForSearch.pageSize)) : index;
        this.setState({ pageNumber: index, checkedAll: false, dataForSearch: {
            ...this.state.dataForSearch,
            pageIndex: index
        }}, () => {
            this.searchRemoteData(false);
        })
    }

    onChangeStatus = (option, taskId, request, status, taskData, statusOriginal) => {
        const value = option.value
        const label = option.label
        if(value === Constants.STATUS_PENDING)
        {
            return;
        }
        const registrationDataToPrepareToSAP = {
            id: taskId,
            status: statusOriginal,
            userProfileInfo: taskData
        }
        this.setState({ taskId: taskId, requestTypeId: request, dataToPrepareToSAP: { ...registrationDataToPrepareToSAP } })
        this.showModalConfirm(value, request)
    }

    showModalTaskDetail = (tasskId, subId) => {
        this.setState({isShowTaskDetailModal: true ,taskId: tasskId, subId: subId});
        switch (this.props.page) {
            case "approval":
                this.setState({action:"approval"})
                break;
            case "consent":
                this.setState({action:"consent"})
                break;
            default:
                break;
        }
    }

    showExportModal = () => {
        this.setState({isShowExportModal: true})
    }

    onHideisShowExportModal = () => {
        this.setState({ isShowExportModal: false });
    }

    onHideModalConfirm = () => {
        this.setState({ isShowModalConfirm: false });
    }

    onHideModalRegistrationConfirm = () => {
        this.setState({ isShowModalRegistrationConfirm: false });
    }

    onHideisShowTaskDetailModal= () => {
        if(this.state.statusSelected){
            this.setState({ tasks:  this.props.tasks.filter(req => req.processStatusId == this.state.statusSelected)});
        }
        this.setState({ isShowTaskDetailModal: false });
    }

    showStatus = (taskId, statusOriginal = 0, request, taskData, statusName, child) => {
        const { t } = this.props
        const customStylesStatus = {
            control: base => ({
                ...base,
                width: 160,
                height: 35,
                minHeight: 35
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                    ...styles
                };
            },
        }

        const status = {
            1: { label: this.props.t('Rejected'), className: 'request-status fail' },
            2: { label: this.props.t('Approved'), className: 'request-status success' },
            3: { label: this.props.t('Canceled'), className: 'request-status' },
            4: { label: this.props.t('Canceled'), className: 'request-status' },
            5: { label: this.props.t("Waiting"), className: 'request-status' },
            6: { label: this.props.t("PartiallySuccessful"), className: 'request-status warning' },
            7: { label: this.props.t("Rejected"), className: 'request-status fail' },
            8: { label: this.props.t("Waiting"), className: 'request-status' },
            20: { label: this.props.t("Consented"), className: 'request-status' },
        }

        if(request == Constants.SALARY_PROPOSE && statusName) {
            let statusLabel = this.props.t(statusName);
            let tmp = Object.keys(status).filter(key => status[key].label == statusLabel );
            statusOriginal = tmp?.length > 0 ? tmp[tmp.length - 1] : statusOriginal;
        }

        const options = [
            { value: 0, label: t("Waiting") },
            { value: 1, label: t("Rejected") },
            { value: 2, label: t("Approval") }
        ]

        //check status for ONBOARDING
        if([10, 11, 13].indexOf(statusOriginal) != -1) {
            if((child.processStatusId == 11 && child.supervisorId?.toLowerCase() == localStorage.getItem('email')?.toLowerCase()) ||
            (child.processStatusId == 10 && child.appraiserId?.toLowerCase() == localStorage.getItem('email')?.toLowerCase())) {
                statusOriginal = 8;
            } else if (child.processStatusId == 13) {
                statusOriginal = 5;
            } else if (child.processStatusId == 11) {
                statusOriginal = 5;
            }
        }

        if (this.props.page === "approval") {
            if (statusOriginal == 0) {
                return <Select defaultValue={options[0]} value = {options[0]} options={options} isSearchable={false} onChange={value => this.onChangeStatus(value, taskId, request, value, taskData, statusOriginal)} styles={customStylesStatus} />
            }
            return <span className={status[statusOriginal]?.className}>{status[statusOriginal]?.label}</span>
        }
        if(this.props.page === "consent" && statusOriginal == 5) {
            statusOriginal = 20;
        }
        return <span className={status[statusOriginal]?.className}>{status[statusOriginal]?.label}</span>
    }

    getLinkUserProfileHistory = (id) => {
        return this.props.page ? `/registration/${id}/1/${this.props.page}` : `/registration/${id}/1/request`
    }

    getLinkEvalution = (id) => {
        return this.props.page === "approval" ? `/evaluation/${id}/approval` : `/evaluation/${id}/assess`
    }

    getSalaryProposeLink = (request) => {
        let url = '';
        const typeRequest = this.props.page === "approval" ? "approval" : "access"
        if(request.parentRequestHistoryId) {
            //xu ly mot nguoi
            url = `salarypropse/${request.parentRequestHistoryId}/${request.salaryId}/${typeRequest}`
        } else {
            //xu ly nhieu nguoi
            url = `salaryadjustment/${request.salaryId}/${typeRequest}`
        }
        return url;
    }

    getLinkRegistration(id,childId) {
        return this.props.page ? `/registration/${id}/${childId}/${this.props.page}` : `/registration/${id}/${childId}/request`
    }

    isShowEditButton = status => {
        let isShow = true;
        if (this.props.page == "approval") {
            isShow = false;
        } else {
            if (status == 0 || status == 2 || status == 3) {
                isShow = false;
            } else {
                isShow = true;
            }
        }
        return isShow;
    }

    isShowEvictionButton = status => {
        let isShow = true;
        if (this.props.page == "approval") {
            isShow = false;
        } else {
            if (status == 0) {
                isShow = true;
            } else {
                isShow = false;
            }
        }
        return isShow;
    }

    handleAllChecked = event => {
        const { page } = this.props
        let tasks = this.props.tasks;
        const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()

        tasks.forEach((child) => {
            if ((child.requestTypeId == Constants.SALARY_PROPOSE && child.isEdit == true) || (child.processStatusId == 8 && child.requestTypeId != Constants.SALARY_PROPOSE) || (child.processStatusId == 11 && child.supervisorId?.toLowerCase() == localStorage.getItem('email')?.toLowerCase()) || (child.processStatusId == 10 && child.appraiserId?.toLowerCase() == localStorage.getItem('email')?.toLowerCase()) || (page == "approval" && (child.processStatusId == 5  || child.processStatusId == 13 || (child.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(child.requestTypeId))))) {
                child.isChecked = event.target.checked;
                if (child.isChecked) {
                    // child.canChecked = true
                    // console.log(this.state.taskChecked.findIndex(x => x.id == child.id))
                    if (this.state.taskChecked.findIndex(x => x.id == child.id) == -1) {
                        this.state.taskChecked.push(child);
                    }
                } else {
                    this.state.taskChecked.splice(this.state.taskChecked.findIndex(x => x.id == child.id),1);
                }
            }
        })
        this.setState({ approveTasks: tasks, checkedAll: event.target.checked });
        this.enableBtn(this.state.taskChecked);
    };
    
    handleCheckChildElement = event => {
        let tasks = this.props.tasks;
        tasks.forEach((child) => {
            let id = child.id;
            if (id == event.target.value)
            {
                child.isChecked = event.target.checked;
                if (child.isChecked) {
                    this.state.taskChecked.push(child);
                }
                else {
                    this.state.taskChecked.splice(this.state.taskChecked.findIndex(x => x.id == child.id),1);
                }
            }
        })

        let taskCheckedList = tasks.filter(t => t.isChecked);
        this.setState({checkedAll: taskCheckedList.length == tasks.length ? true : false})

        this.enableBtn(this.state.taskChecked);
    };

    enableBtn = (taskChecked) => {
        if (taskChecked.length) {
            this.setState({ disabled:"", dataToSap:taskChecked})
        } else {
            this.setState({ disabled:"disabled", dataToSap:[]})
        }
    }

    getTaskLink = id => {
        if (this.props.page == "approval") {
            return `/tasks-approval/${id}`;
        }
        return `/tasks-request/${id}`;
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    calTime = (start, end) => {
        if (start == null || end == null) {
            return ""
        }
        const differenceInMs = moment(end, Constants.SUBSTITUTION_TIME_FORMAT).diff(moment(start, Constants.SUBSTITUTION_TIME_FORMAT))
        return moment.duration(differenceInMs).asHours()
    }

    updateTaskStatus = (id, status) =>{
        let tasksUpdated = this.state.approveTasks.map(x => (x.id === id ? {...x, status: status, approvalDate: moment(new Date())} : x));
        this.setState({approveTasks: tasksUpdated})
    }

    handleSelectChange(name, value) {
        this.setState({ [name]: value, dataForSearch: {
            ...this.state.dataForSearch,
            status: value,
            pageIndex: 1
        }});
    }
    
    handleInputChange = (event) => {
        this.setState({  query: event.target.value, dataForSearch: {
            ...this.state.dataForSearch,
            sender: event.target.value,
            pageIndex: 1
        }});
    }

    searchRemoteData = (isSearch) => {
        const dataForSearch = this.state.dataForSearch;
        let needRefresh = false;
        if(isSearch){
            dataForSearch.pageIndex = 1;
            needRefresh = true;
        }

        let params = `pageIndex=${dataForSearch.pageIndex}&pageSize=${dataForSearch.pageSize}&`;
        params += dataForSearch.sender ? `sender=${dataForSearch.sender}&` : '';
        // params += dataForSearch.status && dataForSearch.status.value ? `status=${dataForSearch.status.value}&` : '';
        if(dataForSearch.status == 0){
            params += `status=${(this.props.page == 'consent' ? Constants.STATUS_WAITING_CONSENTED : Constants.STATUS_WAITING )}&`;
        }else{
            params += dataForSearch.status && dataForSearch.status.value ? `status=${dataForSearch.status.value}&` : '';
        }
        this.setState({
            approveTasks: [],
            tasks: [],
            taskChecked: [],
            dataToPrepareToSAP: {},
            checkedAll:false,
            dataForSearch: {
            ...dataForSearch,
            needRefresh: needRefresh
        }})
        this.enableBtn([]);
        this.props.requestRemoteData(params);
    }

    render() {
        const { t, tasks, total, page} = this.props
        const typeFeedbackMapping = {
            1: t("HrSResponse"),
            2: t("LineManagerSResponse"),
            3: t("LineManagerSResponse"),
            4: t("LineManagerSResponse"),
            5: t("LineManagerSResponse")
        }
        const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
        const fullDay = 1

        const getRequestTypeLabel = (requestType, absenceTypeValue) => {
            if (requestType.id == Constants.LEAVE_OF_ABSENCE) {
                const absenceType = absenceRequestTypes.find(item => item.value == absenceTypeValue)
                return absenceType ? t(absenceType.label) : ""
            } else {
                const requestTypeObj = requestTypes.find(item => item.value == requestType.id)
                return requestTypeObj ? t(requestTypeObj.label) : ""
            }
        }
        return (
            <>
                <ExportModal show={this.state.isShowExportModal} onHide={this.onHideisShowExportModal} statusOptions={this.props.filterdata} exportType={this.props.page}/>
                <TaskDetailModal key= {this.state.taskId+'.'+this.state.subId} show={this.state.isShowTaskDetailModal} onHide={this.onHideisShowTaskDetailModal} taskId = {this.state.taskId} subId = {this.state.subId} action={this.state.action}/>
                <div className="d-flex justify-content-between w-100 mt-2 mb-3 search-block">
                    <div className="row w-100">
                        <div className="col-xl-4">
                            <InputGroup className="d-flex">
                            <InputGroup.Prepend className="">
                                <InputGroup.Text id="basic-addon1"><i className="fas fa-filter"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Select name="absenceType"
                                    className="w-75"
                                    // defaultValue={this.props.filterdata[0]}
                                    value={this.state.absenceType || { label: t("Waiting"), value: this.props.page == 'consent' ? Constants.STATUS_WAITING_CONSENTED : Constants.STATUS_WAITING }}
                                    isClearable={false}
                                    onChange={absenceType => this.handleSelectChange('absenceType', absenceType)}
                                    // selectedValue={{ label: t("All"), value: 0 }}
                                    placeholder={t('SortByStatus')}
                                    key="absenceType" options={this.props.filterdata}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    theme={theme => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#F9C20A',
                                        primary: '#F9C20A',
                                    },
                                    })}/>
                            </InputGroup>
                        </div>
                        <div className="col-xl-4">
                            <InputGroup className="">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder={t('SearchRequester')}
                                aria-label="SearchRequester"
                                aria-describedby="basic-addon2"
                                className="request-user"
                                onChange={this.handleInputChange}
                            />
                        </InputGroup>
                        </div>
                        <div className="col-4">
                            <button type="button" onClick={() => this.searchRemoteData(true)} className="btn btn-warning w-100">{t("Search")}</button>
                        </div>
                    </div>

                </div>
                <div className="block-title d-flex">
                    <h4 className="content-page-header">{this.props.title}</h4>
                    <div className="export-btn">
                       <button type="button" className="btn" onClick={this.showExportModal.bind(this)}><span className="mr-2"><img alt="excel" src={excelButton}/></span>Xuất báo báo</button>
                   </div>
                </div>
                <div className={`task-list shadow ${page}`}>
                    {
                        tasks.length > 0 ?
                        <div className="wrap-table-request">
                            <table className="table table-borderless">
                                <thead>
                                    <tr>
                                        <th scope="col" className="check-box text-left sticky-col">
                                            <input type="checkbox" onChange={this.handleAllChecked} checked={!!this.state.checkedAll}  value={"checkedall"}/>{" "}
                                        </th>
                                        <th scope="col" className="code sticky-col">{t("RequestNo")}</th>
                                        {
                                            !['V073'].includes(localStorage.getItem("companyCode"))
                                                ? <th scope="col" className="sticky-col user-request">{t("Requestor")}</th>
                                                : null
                                        }
                                        <th scope="col" className="user-title">{t("Title")}</th>
                                        <th scope="col" className="request-type">{t("TypeOfRequest")}</th>
                                        <th scope="col" className="day-off">{t("Times")}</th>
                                        <th scope="col" className="break-time text-center">{t("TotalLeaveTime")}</th>
                                        {
                                            this.props.page == "approval" ?
                                                <th scope="col" className="appraiser">{t("Consenter")}</th>
                                            : null
                                        }
                                        <th scope="col" className="status text-center">{t("Status")}</th>
                                        {
                                            this.props.page != "consent" ?
                                                <th scope="col" className="tool text-center">{t("Reason/Feedback/Edit")}</th>
                                            : null
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.map((child, index) => {
                                            let totalTime = null;
                                            let reId = [Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.CHANGE_DIVISON_SHIFT, Constants.ONBOARDING].includes(child.requestTypeId) ? child.id : child.id.split(".")[0]
                                            let childId = [Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.CHANGE_DIVISON_SHIFT, Constants.ONBOARDING].includes(child.requestTypeId) ? 1 : child.id.split(".")[1]
                                            if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                totalTime = child.days >= 1 ? child.days + " ngày" : child.hours + " giờ";
                                            }
                                            let dateChanged = showRangeDateGroupByArrayDate(child.startDate)

                                            return (
                                                <tr key={index}>
                                                    {
                                                        (((child.processStatusId == 5 || child.processStatusId == 13 || (child.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(child.requestTypeId)))
                                                        && this.props.page == "approval") || (child.processStatusId == 8 && child.requestTypeId != Constants.SALARY_PROPOSE ) || (child.processStatusId == 11 && child.supervisorId?.toLowerCase() == localStorage.getItem('email')?.toLowerCase()) || (child.processStatusId == 10 && child.appraiserId?.toLowerCase() == localStorage.getItem('email')?.toLowerCase()) || (child.requestTypeId == Constants.SALARY_PROPOSE && child.isEdit == true)) ?
                                                        <td scope="col" className="check-box text-left sticky-col">
                                                            <input type="checkbox"  onChange={this.handleCheckChildElement} checked={!!child.isChecked} value={child.id || ''}/>
                                                        </td>
                                                        : <td scope="col" className="check-box text-left sticky-col"><input type="checkbox" disabled checked={false}/></td>
                                                    }
                                                    {
                                                        child.requestType?.id == 6 ?
                                                        <td className="code sticky-col">
                                                            <a href={this.getLinkEvalution(child.id)}
                                                             title={child.id} className="task-title">
                                                                 {generateTaskCodeByCode(child.id)}
                                                            </a>
                                                        </td>
                                                        : child.requestType?.id == Constants.SALARY_PROPOSE ?
                                                        <td className="code sticky-col">
                                                            <a href={this.getSalaryProposeLink(child)}
                                                             title={child.id} className="task-title">
                                                                 {generateTaskCodeByCode(child.id)}
                                                            </a>
                                                        </td>
                                                        :
                                                       <td className="code sticky-col" onClick={this.showModalTaskDetail.bind(this, reId, childId)}>
                                                            <a href="#" title={child.id} className="task-title">{generateTaskCodeByCode(child.id)}</a>
                                                       </td>
                                                    }

                                                    {/* {child.requestType.id == 4 || child.requestType.id == 5 ? this.getLinkUserProfileHistory(child.id) : this.getLinkRegistration(child.id.split(".")[0],child.id.split(".")[1])} */}
                                                    {!['V073'].includes(localStorage.getItem("companyCode")) ? <td className="sticky-col user-request">{child.user?.fullName??''}</td> : null}
                                                    <td className="user-title">{child.user?.jobTitle || ''}</td>

                                                    {
                                                        <td className="request-type">{getRequestTypeLabel(child.requestType, child.absenceType?.value)}</td>
                                                    }

                                                    <td className="day-off">
                                                        <div dangerouslySetInnerHTML={{
                                                            __html: purify.sanitize(dateChanged || ''),
                                                        }} />
                                                        {
                                                            (child?.newItem || []).map((item, itemIndex) => {
                                                                let subDateChanged = ''
                                                                if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                                    subDateChanged = showRangeDateGroupByArrayDate([moment(item?.startDate, 'YYYYMMDD').format('DD/MM/YYYY'), moment(item?.endDate, 'YYYYMMDD').format('DD/MM/YYYY')])
                                                                }
                                                                return (
                                                                    <div key={`sub-date-${itemIndex}`} dangerouslySetInnerHTML={{
                                                                        __html: purify.sanitize(subDateChanged || ''),
                                                                    }}  style={{marginTop: 5}} />
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    <td className="break-time text-center">
                                                        <div>{totalTime}</div>
                                                        {
                                                            (child?.newItem || []).map((item, itemIndex) => {
                                                                let subTotalTime = ''
                                                                if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                                    subTotalTime = item?.days >= fullDay ? `${item?.days} ${t('DayUnit')}` : `${item?.hours} ${t('HourUnit')}`
                                                                }
                                                                return (
                                                                    <div key={`sub-break-time-${itemIndex}`} style={{marginTop: 5}}>{subTotalTime}</div>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    {
                                                        this.props.page == "approval"
                                                        ? <td className="appraiser text-center">{child.appraiser?.fullName}</td>
                                                        : null
                                                    }
                                                    <td className="status text-center">{this.showStatus(child.id, child.processStatusId, child.requestType.id, child.appraiser, child.statusName, child)}</td>
                                                    {
                                                        this.props.page != "consent" ?
                                                            <td className="tool">
                                                                {child.comment ? <OverlayTrigger
                                                                    rootClose
                                                                    trigger="click"
                                                                    placement="left"
                                                                    overlay={<Popover id={'note-task-' + index}>
                                                                        <Popover.Title as="h3">{t("Reason")}</Popover.Title>
                                                                        <Popover.Content>
                                                                            {child.comment}
                                                                        </Popover.Content>
                                                                    </Popover>}>
                                                                    <img alt="Note task" src={noteButton} title={t("Reason")} />
                                                                </OverlayTrigger> : <img alt="Note task" src={noteButton} title={t("Reason")} className="disabled" />}
                                                                {child.approverComment ? <OverlayTrigger
                                                                    rootClose
                                                                    trigger="click"
                                                                    placement="left"
                                                                    overlay={<Popover id={'comment-task-' + index}>
                                                                        <Popover.Title as="h3">{typeFeedbackMapping[child.requestType.id]}</Popover.Title>
                                                                        <Popover.Content>
                                                                            {child.approverComment}
                                                                        </Popover.Content>
                                                                    </Popover>}>
                                                                    <img alt="comment task" src={commentButton} title={typeFeedbackMapping[child.requestType.id]} />
                                                                </OverlayTrigger> : <img alt="Note task" src={noteButton} className="disabled" title={typeFeedbackMapping[child.requestType.id]} />}
                                                            </td>
                                                        :null
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        : <div className="data-not-found">{t("NoDataFound")}</div>
                    }
                </div>
                {tasks.length > 0 ? <div className="row paging mt-2 mb-4">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={this.state.dataForSearch.pageSize} onChangePage={this.onChangePage.bind(this)} totalRecords={total} needRefresh={this.state.dataForSearch.needRefresh}/>
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {total}</div>
                </div> : null}
                <ChangeReqBtnComponent dataToSap={this.state.taskChecked} action={this.props.page} disabled={this.state.disabled}/>
            </>)
    }
}

export default withTranslation()(TaskList)
