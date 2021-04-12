import React from 'react'
// import editButton from '../../assets/img/Icon-edit.png'
import notetButton from '../../assets/img/icon-note.png'
import commentButton from '../../assets/img/Icon-comment.png'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap'
import Select from 'react-select'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
// import ConfirmationModal from '../PersonalInfo/edit/ConfirmationModal'
import Constants from '../../commons/Constants'
// import RegistrationConfirmationModal from '../Registration/ConfirmationModal'
import TaskDetailModal from './TaskDetailModal'
import {InputGroup, FormControl} from 'react-bootstrap'
import ChangeReqBtnComponent from './ChangeReqBtnComponent'

const TIME_FORMAT = 'HH:mm:ss'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class TaskList extends React.Component {
    constructor() {
        super();
        this.state = {
            approveTasks: [],
            tasks: [],
            taskChecked: [],
            isShowTaskDetailModal: false,
            messageModalConfirm: "",
            pageNumber: 1,
            taskId: null,
            subId: null,
            requestUrl: "",
            requestTypeId: null,
            dataToPrepareToSAP: {},
            action: null,
            disabled: "disabled",
            query: ""
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
    
    componentWillReceiveProps()
    {
        this.setState({tasks: this.props.tasks})
    }

    onChangePage = index => {
        this.setState({ pageNumber: index })
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

    // evictionRequest = id => {
    //     this.setState({
    //         modalTitle: "Xác nhận thu hồi",
    //         modalMessage: "Bạn có đồng ý thu hồi yêu cầu này ?",
    //         isShowModalConfirm: true,
    //         typeRequest: Constants.STATUS_EVICTION,
    //         taskId: id
    //     });
    // }

    onHideModalConfirm = () => {
        this.setState({ isShowModalConfirm: false });
    }

    onHideModalRegistrationConfirm = () => {
        this.setState({ isShowModalRegistrationConfirm: false });
    }

    onHideisShowTaskDetailModal= () => {
        this.setState({ isShowTaskDetailModal: false });
    }

    showStatus = (taskId, statusOriginal = 0, request, taskData) => {
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
            3: { label: this.props.t('Recalled'), className: 'request-status' },
            4: { label: this.props.t('Đã hủy'), className: 'request-status' },
            5: { label: this.props.t("Waiting"), className: 'request-status' },
            6: { label: this.props.t("Đã thẩm định"), className: 'request-status' },
            7: { label: this.props.t("Từ chối thẩm định"), className: 'request-status' },
            8: { label: this.props.t("Waiting"), className: 'request-status' },
        }

        const options = [
            { value: 0, label: t("Waiting") },
            { value: 1, label: t("Rejected") },
            { value: 2, label: t("Approval") }
        ]

        if (this.props.page === "approval") {
            if (statusOriginal == 0) {
                return <Select defaultValue={options[0]} value = {options[0]} options={options} isSearchable={false} onChange={value => this.onChangeStatus(value, taskId, request, value, taskData, statusOriginal)} styles={customStylesStatus} />
            }
            return <span className={status[statusOriginal]?.className}>{status[statusOriginal]?.label}</span>
        }
        if(this.props.page === "consent" && taskData && statusOriginal == 5) {
            statusOriginal = 6;
        }
        return <span className={status[statusOriginal]?.className}>{status[statusOriginal]?.label}</span>
    }

    getLinkUserProfileHistory = (id) => {
        return this.props.page === "approval" ? `/tasks-approval/${id}` : `/tasks-request/${id}`
    }

    getLinkRegistration(id,childId) {
        return this.props.page === "approval" ? `/registration/${id}/${childId}/approval` : `/registration/${id}/${childId}/request`
    }

    getTaskCode = code => {
        if (code > 0 && code < 10) {
            return "0000" + code;
        } else if (code >= 10 && code < 100) {
            return "000" + code;
        } else if (code >= 100 && code < 1000) {
            return "00" + code;
        } else if (code >= 1000 && code < 10000) {
            return "0" + code;
        } else {
            return code;
        }
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
        let tasks = this.props.tasks;
        // tasks.forEach((task,index) => {
            tasks.forEach((child) => {
                child.isChecked = event.target.checked;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                if(child.isChecked)
                {
                    // child.requestTypeId =  child.requestTypeId
                    this.state.taskChecked.push(child);
                }
                else
                {
                    this.state.taskChecked.splice(this.state.taskChecked.indexOf(child.id),1);
                }
            }) 
        // });
        this.setState({ approveTasks: tasks });
        this.enableBtn(this.state.taskChecked);
    };
    
    handleCheckChieldElement = event => {
        let tasks = this.props.tasks;
        
        // tasks.forEach((task,index) => {
        //     task.isAllChecked = false;
            tasks.forEach((child) => {
                let id = child.id;
                if (id == event.target.value)
                {
                    child.isChecked = event.target.checked;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                    if(child.isChecked)
                    {
                        this.state.taskChecked.push(child);
                    }
                    else
                    {
                        this.state.taskChecked.splice(this.state.taskChecked.indexOf(child.id),1);
                    }
                }
            })
               
        // });
        // this.props.handleChange(this.state.taskChecked);
        this.enableBtn(this.state.taskChecked);
    };

    enableBtn = (taskChecked) => {
        if(taskChecked.length)
        {
            this.setState({ disabled:"", dataToSap:taskChecked})
        }
        else
        {
            this.setState({ disabled:"disabled", dataToSap:[]})
        }
    }

    getTaskLink = id => {
        if (this.props.page == "approval") {
            return `/tasks-approval/${id}`;
        }
        return `/tasks-request/${id}`;
    }

    // getDataToSAP = (request, data) => {
    //     let jsonData = []
    //     switch (request) {
    //         case Constants.LEAVE_OF_ABSENCE:
    //             jsonData = this.getLeaveOfAbsenceToSAp(data)
    //             break;
    //         case Constants.BUSINESS_TRIP:
    //             jsonData = this.getBusinessTripToSAp(data)
    //             break;
    //         case Constants.SUBSTITUTION:
    //             jsonData = this.getSubstitutionToSAp(data)
    //             break;
    //         case Constants.IN_OUT_TIME_UPDATE:
    //             jsonData = this.getInOutUpdateToSAp(data)
    //             break;
    //     }
    //     return jsonData
    // }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    // getInOutUpdateToSAp = data => {
    //     let dataToSAP = []
    //     data.userProfileInfo.timesheets.filter(t => t.isEdit).forEach((timesheet, index) => {
    //         ['1', '2'].forEach(n => {
    //             const startTimeName = `start_time${n}_fact_update`
    //             const endTimeName = `end_time${n}_fact_update`
    //             const startTimeNameOld = `start_time${n}_fact`
    //             const endTimeNameOld = `end_time${n}_fact`
    //             const startPlanTimeName = `from_time${n}`
    //             const endPlanTimeName = `to_time${n}`
    //             if (!timesheet[startTimeName] && !timesheet[endTimeName]) return
    //             if (true) {
    //                 let startTime = timesheet[startTimeName] ? moment(timesheet[startTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[startTimeNameOld]) ? moment(timesheet[startTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
    //                 if (startTime) {
    //                     dataToSAP.push({
    //                         MYVP_ID: 'TEV' + '0'.repeat(7 - data.id.toString().length) + data.id + `${index}${n}`,
    //                         PERNR: data.userProfileInfo.user.employeeNo,
    //                         LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
    //                         SATZA: 'P10',
    //                         LTIME: startTime,
    //                         DALLF: '+',
    //                         ACTIO: 'INS'
    //                     })
    //                 }
    //             }

    //             if (true) {
    //                 let endTime = timesheet[endTimeName] ? moment(timesheet[endTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[endTimeNameOld]) ? moment(timesheet[endTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
    //                 if (endTime) {
    //                     dataToSAP.push({
    //                         MYVP_ID: 'TEV' + '0'.repeat(7 - data.id.toString().length) + data.id + `${index}${n}`,
    //                         PERNR: data.userProfileInfo.user.employeeNo,
    //                         LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
    //                         SATZA: 'P20',
    //                         LTIME: endTime,
    //                         DALLF: endTime > timesheet[startPlanTimeName] ? '+' : '-',
    //                         ACTIO: 'INS'
    //                     })
    //                 }
    //             }
    //         })
    //     })
    //     return dataToSAP
    // }

    // getSubstitutionToSAp = data => {
    //     return data.userProfileInfo.timesheets.filter(t => t.isEdit).map((timesheet, index) => {
    //         return {
    //             MYVP_ID: 'SUB' + '0'.repeat(8 - data.id.toString().length) + data.id + index,
    //             PERNR: data.userProfileInfo.user.employeeNo,
    //             BEGDA: moment(timesheet.date, Constants.SUBSTITUTION_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
    //             ENDDA: moment(timesheet.date, Constants.SUBSTITUTION_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
    //             TPROG: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE ? timesheet.shiftId : '',
    //             BEGUZ: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? moment(timesheet.startTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
    //             ENDUZ: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? moment(timesheet.endTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
    //             VTART: timesheet.substitutionType.value,
    //             PBEG1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime !== null ? moment(timesheet.startBreakTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
    //             PEND1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.endBreakTime !== null ? moment(timesheet.endBreakTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
    //             PBEZ1: '',
    //             PUNB1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime !== null && timesheet.endBreakTime !== null ? this.calTime(timesheet.startBreakTime, timesheet.endBreakTime) : '',
    //             TPKLA: parseFloat(timesheet.shiftHours) > 4 && timesheet.shiftType == Constants.SUBSTITUTION_SHIFT_UPDATE ? Constants.SUBSTITUTION_TPKLA_FULL_DAY : Constants.SUBSTITUTION_TPKLA_HALF_DAY
    //         }
    //     })
    // }

    calTime = (start, end) => {
        if (start == null || end == null) {
            return ""
        }
        const differenceInMs = moment(end, Constants.SUBSTITUTION_TIME_FORMAT).diff(moment(start, Constants.SUBSTITUTION_TIME_FORMAT))
        return moment.duration(differenceInMs).asHours()
    }

    // getLeaveOfAbsenceToSAp = data => {
    //     let dataToSAP = []
    //     if (data.status === 0) {
    //         dataToSAP.push(
    //             {
    //                 MYVP_ID: 'ABS' + '0'.repeat(9 - data.id.toString().length) + data.id,
    //                 PERNR: data.userProfileInfo.user ? data.userProfileInfo.user.employeeNo : "",
    //                 BEGDA: moment(data.userProfileInfo.startDate, Constants.LEAVE_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
    //                 ENDDA: moment(data.userProfileInfo.endDate, Constants.LEAVE_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
    //                 SUBTY: data.userProfileInfo.absenceType ? data.userProfileInfo.absenceType.value : "",
    //                 BEGUZ: data.userProfileInfo.startTime ? moment(data.userProfileInfo.startTime, Constants.LEAVE_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
    //                 ENDUZ: data.userProfileInfo.endTime ? moment(data.userProfileInfo.endTime, Constants.LEAVE_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
    //                 ACTIO: 'INS'
    //             }
    //         )
    //     }
    //     return dataToSAP
    // }

    // getBusinessTripToSAp(data) {
    //     let dataToSAP = []
    //     if (data.status === 0) {
    //         dataToSAP.push(
    //             {
    //                 MYVP_ID: 'ATT' + '0'.repeat(9 - data.id.toString().length) + data.id,
    //                 PERNR: data.userProfileInfo.user.employeeNo,
    //                 BEGDA: moment(data.userProfileInfo.startDate, Constants.BUSINESS_TRIP_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
    //                 ENDDA: moment(data.userProfileInfo.endDate, Constants.BUSINESS_TRIP_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
    //                 SUBTY: data.userProfileInfo.attendanceQuotaType.value,
    //                 BEGUZ: data.userProfileInfo.startTime ? moment(data.userProfileInfo.startTime, Constants.BUSINESS_TRIP_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
    //                 ENDUZ: data.userProfileInfo.endTime ? moment(data.userProfileInfo.endTime, Constants.BUSINESS_TRIP_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
    //                 ACTIO: 'INS'
    //             }
    //         )
    //     }
    //     return dataToSAP
    // }

    updateTaskStatus = (id, status) =>{
        let tasksUpdated = this.state.approveTasks.map(x => (x.id === id ? {...x, status: status, approvalDate: moment(new Date())} : x));
        this.setState({approveTasks: tasksUpdated})
    }

    handleSelectChange(name, value) {
        this.setState({ [name]: value })
        let cloneTask = this.props.tasks;
        let result = [];
        if(value && value.value)
        {
            // result = cloneTask.filter(element => {
                result = cloneTask.filter(req => req.processStatusId == value.value);
                // return ele.length > 0
            // });
            this.setState({tasks:result});
        }
        else{
            this.setState({tasks:this.props.tasks});
        }
    }
    
    handleInputChange = (event) => {
        let data = null;
        let cloneTask = this.props.tasks;
        this.setState({
            query: event.target.value
          }, () => {
            data = this.state.query ? cloneTask.filter(x => x.user?.fullName?.toLowerCase().includes(this.state.query) || x.id.toLowerCase().includes(this.state.query)) : this.props.tasks;
            this.setState({tasks:data});
          })
    }
    render() {
        const recordPerPage = 10
        let tasks = TableUtil.updateData(this.state.tasks  || this.props.tasks, this.state.pageNumber - 1, recordPerPage)
        const { t } = this.props

        const typeFeedbackMapping = {
            1: t("HrSResponse"),
            2: t("LineManagerSResponse"),
            3: t("LineManagerSResponse"),
            4: t("LineManagerSResponse"),
            5: t("LineManagerSResponse")
        }
        return (
            <>
                <TaskDetailModal key= {this.state.taskId+'.'+this.state.subId} show={this.state.isShowTaskDetailModal} onHide={this.onHideisShowTaskDetailModal} taskId = {this.state.taskId} subId = {this.state.subId} action={this.state.action}/>
                <div className="row w-75 mt-2 mb-3">
                    <div className="col-xl-6">
                        <InputGroup className="d-flex">
                        <InputGroup.Prepend className="">
                            <InputGroup.Text id="basic-addon1"><i className="fas fa-filter"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Select name="absenceType" 
                                className="w-75" 
                                value={this.state.absenceType || ""} 
                                isClearable={true}
                                onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} 
                                placeholder={t('SortByStatus')} key="absenceType" options={this.props.filterdata} 
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
                    <div className="col-xl-6">
                    <InputGroup className="">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder={t('SearchRequester')}
                        aria-label="SearchRequester"
                        aria-describedby="basic-addon2"
                        onChange={this.handleInputChange}
                        />
                    </InputGroup>
                    </div>
                </div> 
                <div className="block-title">
                    <h4 className="title text-uppercase">{this.props.title}</h4>
                </div>
                <div className="task-list">
                    <table className="table table-borderless table-hover table-striped">
                        <thead>
                            <tr className="text-center">
                                <th scope="col" className="check-box">
                                    <input type="checkbox" onClick={this.handleAllChecked}  value={"checkedall"}/>{" "}
                                </th>
                                <th scope="col" className="code">{t("RequestNo")}</th>
                                {
                                    !['V073'].includes(localStorage.getItem("companyCode"))
                                        ? <th scope="col" className="user-request">{t("Requestor")}</th>
                                        : null
                                }
                                <th scope="col" className="user-title">{t("Title")}</th>
                                <th scope="col" className="request-type">{t("TypeOfRequest")}</th>
                                <th scope="col" className="day-off">{t("DayOff")}</th>
                                <th scope="col" className="break-time">{t("TotalLeaveTime")}</th>
                                {
                                    this.props.page == "approval" ?
                                        <th scope="col" className="appraiser">{t("Consenter")}</th>
                                    : null
                                }
                                <th scope="col" className="status">{t("Status")}</th>
                                {
                                    this.props.page != "consent" ?
                                        <th scope="col" className="tool text-center">{t("Reason/Feedback/Edit")}</th>
                                    : null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ?
                                // tasks.map((task) => {
                                //     return (
                                        tasks.map((child, index) => {
                                            let totalTime = null;
                                            if (child.requestTypeId == 2 || child.requestTypeId == 3) {
                                                totalTime = child.days >= 1 ? child.days + " ngày" : child.hours + " giờ";
                                            }
                                            return (
                                                <tr key={index}>
                                                    {
                                                        ((child.processStatusId == 5 && this.props.page == "approval") || child.processStatusId == 8) ?
                                                        <td scope="col" className="check-box">
                                                            <input type="checkbox"  onChange={this.handleCheckChieldElement} checked={!!child.isChecked} value={child.id}/>
                                                        </td>
                                                        : <td scope="col" className="check-box"><input type="checkbox" disabled/></td>
                                                    }
                                                    <td className="code"><a href={child.requestType.id == 4 || child.requestType.id == 5 ? this.getLinkUserProfileHistory(child.id) : this.getLinkRegistration(child.id.split(".")[0],child.id.split(".")[1])} title={child.id} className="task-title">{this.getTaskCode(child.id)}</a></td>
                                                    {!['V073'].includes(localStorage.getItem("companyCode")) ? <td className="user-request text-center"  onClick={this.showModalTaskDetail.bind(this,child.id.split(".")[0],child.id.split(".")[1])}><a href="#" className="task-title">{child.user.fullName}</a></td> : null}
                                                    <td className="user-title">{child.user.jobTitle}</td>
                                                    <td className="request-type"><a href={child.requestType.id == 4 || child.requestType.id == 5 ? this.getLinkUserProfileHistory(child.id) : this.getLinkRegistration(child.id.split(".")[0],child.id.split(".")[1])} title={child.requestType.name} className="task-title">{child.requestType.name}</a></td>
                                                    <td className="day-off text-center">{moment(child.startDate).format("DD/MM/YYYY")}</td>
                                                    <td className="break-time text-center">{totalTime}</td>
                                                    {
                                                        this.props.page == "approval" ?
                                                            <td className="appraiser text-center">{child.appraiser?.fullname}</td>
                                                        :null
                                                    }
                                                    <td className="status">{this.showStatus(child.id, child.processStatusId, child.requestType.id, child.appraiser)}</td>
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
                                                            <img alt="Note task" src={notetButton} title={t("Reason")} />
                                                        </OverlayTrigger> : <img alt="Note task" src={notetButton} title={t("Reason")} className="disabled" />}
                                                        {child.hrComment ? <OverlayTrigger
                                                            rootClose
                                                            trigger="click"
                                                            placement="left"
                                                            overlay={<Popover id={'comment-task-' + index}>
                                                                <Popover.Title as="h3">{typeFeedbackMapping[child.requestType.id]}</Popover.Title>
                                                                <Popover.Content>
                                                                    {child.hrComment}
                                                                </Popover.Content>
                                                            </Popover>}>
                                                            <img alt="comment task" src={commentButton} title={typeFeedbackMapping[child.requestType.id]} />
                                                        </OverlayTrigger> : <img alt="Note task" src={notetButton} className="disabled" title={typeFeedbackMapping[child.requestType.id]} />}
                                                    </td>
                                                        :null
                                                    }
                                                </tr>
                                            )
                                        })
                                    // )})
                                : <tr className="text-center"><th colSpan={9}>{t("NoDataFound")}</th></tr>
                            }
                        </tbody>
                    </table>
                </div>
                {tasks.length > 0 ? <div className="row paging mt-2">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={this.state.tasks.length} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {this.state.tasks.length}</div>
                </div> : null}
                <ChangeReqBtnComponent dataToSap={this.state.taskChecked} action={this.props.page} disabled={this.state.disabled}/>
            </>)
    }
}

export default withTranslation()(TaskList)
