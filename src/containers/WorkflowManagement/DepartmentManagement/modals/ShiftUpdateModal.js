import React, { useState, useEffect, useRef } from "react"
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
// import IconSuccess from '../../assets/img/ic-success.svg';
// import IconFailed from '../../assets/img/ic-failed.svg';
import Select, { components } from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import { Modal, Image, Dropdown, Button } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import Constants from "../../../../commons/Constants"
import { formatStringByMuleValue, formatNumberInteger } from "../../../../commons/Utils"
import DropdownCustomize from "../../../LeaveFund/DropdownCustomize"
import './ShiftUpdateModal.scss'
import 'react-datepicker/dist/react-datepicker.css'

function ShiftUpdateModal(props) {
    const { t } = useTranslation()
    const shiftSelectCode = 0
    const enterShiftTimeCode = 1
    const shiftCodeOFF = 'OFF'
    const substitutionTypes = [
        { value: '01', label: t("Shiftchange") },
        { value: '02', label: t("IntermittenShift") },
        { value: '03', label: t("CoastShoreShiftChange") }
    ]
    const [shiftStartTimeOptionsFilter, SetShiftStartTimeOptionsFilter] = useState([])
    const [shiftEndTimeOptionsFilter, SetShiftEndTimeOptionsFilter] = useState([])
    const [subordinateTimeOverviews, SetSubordinateTimeOverviews] = useState([])
    const [shiftList, SetShiftList] = useState([])
    const [shiftInfos, SetShiftInfos] = useState([
        {
            shiftUpdateType: shiftSelectCode,
            shiftType: null,
            shiftFilter: {
                isOpenInputShiftCodeFilter: false,
                shiftCodeFilter: "",
                startTimeFilter: null,
                endTimeFilter: null,
                shiftList: null,
                shiftSelected: {}
            },
            startTime: null,
            endTime: null,
            totalTime: null,
            employees: [],
            reason: ""
        }
    ])
    const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState(false)

    const sendQuery = (index, query, t) => {}
    // const delayedQuery = useRef(_.debounce((i, q) => sendQuery(i, q), 800)).current

    const setShiftTimeFilter = shifts => {
        const shiftsExcludeOff = shifts.filter(item => item.shift_id !== shiftCodeOFF)
        let startTimes = []
        let endTimes = []

        for (let index = 0, len = shiftsExcludeOff.length; index < len; index++) {
            let item = shiftsExcludeOff[index]
            if (formatStringByMuleValue(item.from_time) && startTimes.indexOf(item.from_time) === -1) {
                startTimes.push(item.from_time)
            }
            if (formatStringByMuleValue(item.to_time) && endTimes.indexOf(item.to_time) === -1) {
                endTimes.push(item.to_time)
            }
        }

        startTimes = startTimes.sort((previous, next) =>  previous < next ? -1 : 1)
        endTimes = endTimes.sort((previous, next) =>  previous < next ? -1 : 1)
        const startTimeOptions = startTimes.map(item => ({value: moment(item, "HHmmss").format("HH:mm:ss"), label: moment(item, "HHmmss").format("HH:mm:ss"), originValue: item}))
        const endTimeOptions = endTimes.map(item => ({value: moment(item, "HHmmss").format("HH:mm:ss"), label: moment(item, "HHmmss").format("HH:mm:ss"), originValue: item}))

        SetShiftStartTimeOptionsFilter(startTimeOptions)
        SetShiftEndTimeOptionsFilter(endTimeOptions)
    }
    

    useEffect(() => {
        function prepareShifts(responses) {
            if (responses && responses.data) {
                const result = responses.data.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    const data = responses.data?.data
                    const shifts = data.filter((shift, index, arr) => arr.findIndex(a => a.shift_id === shift.shift_id) === index)
                    .sort((a,b) =>  a.shift_id.includes(shiftCodeOFF) ? -1 : 1 ).sort((a,b) => a.shift_id < b.shift_id ? (a.shift_id.includes(shiftCodeOFF) ? -1 : 0) : 1)
                    return shifts
                }
                return []
            }
            return []
        }

        async function getShiftList() {
            try {
                const config = {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
                const responses = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/shifts`, config)
                const shifts = prepareShifts(responses)
                SetShiftList(shifts)
                setShiftTimeFilter(shifts)
            } catch (e) {
                console.error(e)
            }
        }

        getShiftList()
    }, [])

    useEffect(() => {
        function prepareSubordinateTimeOverviews(responses) {
            if (responses && responses.data) {
                const result = responses.data.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    const data = responses.data?.data
                    return data
                }
                return []
            }
            return []
        }

        async function getSubordinateTimeOverview() {
            try {
                const config = {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
                const data = {
                    from_date: moment(props.dateInfo.date, 'YYYY-MM-DD').format("YYYYMMDD"),
                    to_date: moment(props.dateInfo.date, 'YYYY-MM-DD').format("YYYYMMDD"),
                    personal_no_list: [],
                    page_no: 1,
                    page_size: 10000
                }

                const responses = await axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate/timeoverview`, data, config)
                const timeOverviews = prepareSubordinateTimeOverviews(responses)
                SetSubordinateTimeOverviews(timeOverviews)
            } catch (e) {
                console.error(e)
            }
        }

        getSubordinateTimeOverview()
    }, [props.dateInfo.date])

    const handleShiftUpdateType = (index, type) => {
        const newShiftInfos = [...shiftInfos]
        newShiftInfos[index].shiftUpdateType = type
        SetShiftInfos(newShiftInfos)
    }

    const handleSelectChange = (index, option, key) => {
        const newShiftInfos = [...shiftInfos]
        newShiftInfos[index][key] = option
        if (key === 'startTimeFilter' || key === 'endTimeFilter') {
            newShiftInfos[index].shiftFilter[key] = option
            const startTime = key === 'startTimeFilter' ? option?.originValue : newShiftInfos[index].shiftFilter.startTimeFilter?.originValue
            const endTime = key === 'endTimeFilter' ? option?.originValue : newShiftInfos[index].shiftFilter.endTimeFilter?.originValue
            const shiftCode = newShiftInfos[index].shiftFilter.shiftCodeFilter
            const shifts = filterShiftListByTimesAndShiftCode(startTime, endTime, shiftCode)
            newShiftInfos[index].shiftFilter.shiftList = shifts
        }
        SetShiftInfos(newShiftInfos)
    }

    const handleInputTextChange = (index, e, key) => {
        const newShiftInfos = [...shiftInfos]
        const val = e.target.value
        newShiftInfos[index][key] = val
        if (key === 'shiftCodeFilter') {
            newShiftInfos[index].shiftFilter[key] = val
            const shifts = filterShiftListByTimesAndShiftCode(newShiftInfos[index].shiftFilter.startTimeFilter?.originValue, newShiftInfos[index].shiftFilter.endTimeFilter?.originValue, val)
            newShiftInfos[index].shiftFilter.shiftList = shifts
            // delayedQuery(index, val)
        }
        SetShiftInfos(newShiftInfos)
    }

    const filterShiftListByTimesAndShiftCode = (startTime, endTime, shiftCode) => {
        const shifts = shiftList.filter(item => {
            return (startTime ? item.from_time?.trim() === startTime?.toString().trim() : true) 
            && (endTime ? item.to_time?.trim() === endTime?.toString().trim() : true) 
            && (shiftCode ? item.shift_id?.trim().toUpperCase() === shiftCode?.trim().toUpperCase() : true)
        })
        return shifts
    }

    const toggleOpenInputShiftCodeFilter = (index, status) => {
        const newShiftInfos = [...shiftInfos]
        newShiftInfos[index].shiftFilter.isOpenInputShiftCodeFilter = !status
        SetShiftInfos(newShiftInfos)
    }

    const handleSubmit = () => {
        // TODO
    }

    const addNewItems = () => {
        const newItem = {
            shiftUpdateType: shiftSelectCode,
            shiftType: null,
            shiftFilter: {
                isOpenInputShiftCodeFilter: false,
                shiftCodeFilter: "",
                startTimeFilter: null,
                endTimeFilter: null,
                shiftList: null,
                shiftSelected: {}
            },
            startTime: null,
            endTime: null,
            totalTime: null,
            employees: [],
            reason: ""
        }
        
        let newShiftInfos = [...shiftInfos]
        newShiftInfos = newShiftInfos.concat(newItem)
        SetShiftInfos(newShiftInfos)
    }

    const removeItems = index => {
        const shiftInfosClone = [...shiftInfos]
        const newShiftInfos = shiftInfosClone.filter((item, i) => i !== index)
        SetShiftInfos(newShiftInfos)
    }

    const handleShiftSelect = (indexItem, shiftIndex, shift) => {
        const newShiftInfos = [...shiftInfos]
        newShiftInfos[indexItem].shiftFilter.shiftSelected = {...{index: shiftIndex}, ...shift}
        const employees = getEmployeesByShift(shift)
        newShiftInfos[indexItem].employees = employees
        SetShiftInfos(newShiftInfos)
    }

    const getEmployeesByShift = shift => {
        // console.log("fetch employees")
        // console.log(shift)
        // console.log(props.employeesForFilter)
        // console.log(subordinateTimeOverviews)

        let employees = []
        _.forEach(subordinateTimeOverviews, function(itemParent) {
            _.forEach(props.employeesForFilter, function(itemChild) {
                if (itemParent.shift_id == shift.shift_id && itemParent.pernr == itemChild.uid && employees.findIndex(item => item?.employeeCode == itemParent.pernr) === -1) {
                    employees.push({
                        employeeCode: itemParent.pernr || "",
                        fullName: itemParent.fullname || "",
                        jobTitle: itemChild.job_name || ""
                    })
                }
            })
        })
        return employees
    }

    const handleTimeInputChange = (index, time, stateName) => {
        const newShiftInfos = [...shiftInfos]
        let totalTime = 0

        if (stateName === "startTime" && time) {
            totalTime = getDuration(time, newShiftInfos[index].endTime)
        } else if (stateName === "endTime" && time) {
            totalTime = getDuration(newShiftInfos[index].startTime, time)
        }
        newShiftInfos[index].totalTime = totalTime
        newShiftInfos[index][stateName] = moment(time).format('HHmmss')
        SetShiftInfos(newShiftInfos)
    }

    const getDuration = (start, end) => {
        if (start && end) {
            const startTime = moment(start, "HH:mm:ss")
            const endTime = moment(end, "HH:mm:ss")
            const duration = moment.duration(endTime.diff(startTime))
            return duration.asHours().toFixed(2)
        }
        return 0
    }

    const customizeSelectStyles = {
        control: (base, state) => ({
            ...base,
            background: "#4e73df",
            color: "#FFFFFF",
            borderRadius: 0,
            borderColor: "transparent",
            boxShadow: state.isFocused ? null : null,
            cursor: "pointer",
            "&:hover": {
                borderColor: "transparent",
                color: "#000000"
            }
        }),
        input: (base, state) => ({
            ...base,
            color: '#FFFFFF'
        }),
        placeholder: base => {
            return {
                ...base,
                color: '#FFFFFF'
            }
        },
        indicatorSeparator: base => ({
            ...base,
            display: "none",
        }),
        indicatorsContainer: base => ({
            ...base,
            padding: 0,
            svg : {
                display: 'none'
            }
        }),
        dropdownIndicator: base => ({
            ...base,
            color: "#FFFFFF",
            "&:hover": {
                color: "#FFFFFF"
            }
        }),
        singleValue: base => ({
            ...base,
            color: "#FFFFFF",
            caretColor: "#FFFFFF"
        }),
        valueContainer: base => ({
            padding: 0
        }),
        menu: (base, state) => ({
            ...base,
            borderRadius: 0,
            marginTop: 0
        }),
        menuList: (base, state) => ({
            ...base,
            padding: 0,
            fontSize: '12px',
            "::-webkit-scrollbar": {
                backgroundColor: "#F5F5F5",
                width: "8px",
                height: "8px"
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: "#a4afb7",
                borderLeft: "1px solid white",
                borderRight: "1px solid white",
                borderTop: "1px solid white",
                borderBottom: "1px solid white",
                borderRadius: "4px"
            },
            "::-webkit-scrollbar-track" : {
                backgroundColor: "#d3d3d3",
                borderLeft: "3.5px solid white",
                borderRight: "3.5px solid white",
                borderTop: "3.5px solid white",
                borderBottom: "3.5px solid white"
            }
        }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected ? "#D8D8D8" : "#FFFFFF",
                color: "#000000",
                cursor: "pointer",
                padding: "5px",
                textAlign: "left",
                "&:hover": {
                    background: isFocused ? "#D8D8D8" : "#000000"
                }
            };
        }
    }

    // Trả về dữ liệu sau sau khi chọn Người áp dụng về modal
    const updateParent = data => {
        console.log("=============")
        console.log(data)
    }

    const DropdownIndicator = props => {
        return (
            <components.DropdownIndicator {...props}>
                <div className="caret-down"></div>
            </components.DropdownIndicator>
        )
    }

    return (
        <>
        <Modal backdrop="static" keyboard={false} size="xl" className='shift-update-modal' centered show={props.show} onHide={props.onHideShiftUpdateModal}>
            <Modal.Body className='shift-update-modal-body'>
                <h6 className="text-uppercase font-14 header-body"><i className="fas fa-calendar-alt"></i>{`${props.dateInfo?.day} ${t("Day")} ${moment(props.dateInfo?.date, 'YYYYMMDD').format("DD/MM/YYYY")}`}</h6>
                <div className="wrap-items">
                    {
                        shiftInfos.map((item, index) => {
                            let shifts = item.shiftFilter.shiftList || shiftList
                            return <div className="item" key={index}>
                                        <div className="add-item">
                                            {
                                                index === 0 
                                                ? <span className="bg-primary add-item-button" onClick={addNewItems}><i className="fas fa-plus"></i>Thêm phân ca</span>
                                                : <span className="bg-danger add-item-button" onClick={() => removeItems(index)}><i className="fas fa-times"></i>Hủy phân ca</span>
                                            }
                                        </div>
                                        <div className="main-content-item">
                                            <h6 className="text-uppercase font-14 font-weight-bold">Lựa chọn hình thức thay đổi phân ca</h6>
                                            <div className="btn-group btn-group-toggle shift-update-type-group" data-toggle="buttons">
                                                <label onClick={() => handleShiftUpdateType(index, shiftSelectCode)} className={item.shiftUpdateType == shiftSelectCode ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                                    Lựa chọn ca
                                                </label>
                                                <label onClick={() => handleShiftUpdateType(index, enterShiftTimeCode)} className={item.shiftUpdateType == enterShiftTimeCode ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                                    Nhập giờ thay đổi phân ca
                                                </label>
                                            </div>
                                            <div className="shift-type">
                                                <label>Loại phân ca</label>
                                                <div className="wrap-shift-type-select">
                                                    <Select 
                                                        value={item.shiftType} 
                                                        onChange={shiftType => handleSelectChange(index, shiftType, 'shiftType')} 
                                                        placeholder={t("Select")} 
                                                        options={substitutionTypes} />
                                                </div>
                                                {/* {this.error(index, 'substitutionType')} */}
                                            </div>
                                            {
                                                item.shiftUpdateType == shiftSelectCode ?
                                                <div className="content-for-shift-select">
                                                    <div className="shift-table">
                                                        <table className="shift">
                                                            <thead>
                                                                <tr>
                                                                    <th className="col-select-shift"><span className="select-shift title">Lựa chọn ca</span></th>
                                                                    <th className="col-start-time">
                                                                        <div className="start-time title">
                                                                            <Select 
                                                                                components={{ DropdownIndicator }}
                                                                                value={item.shiftFilter.startTimeFilter} 
                                                                                onChange={startTime => handleSelectChange(index, startTime, 'startTimeFilter')} 
                                                                                placeholder={t("StartHour")} 
                                                                                options={shiftStartTimeOptionsFilter}
                                                                                styles={customizeSelectStyles}
                                                                                isSearchable={false}
                                                                                isClearable={true} />
                                                                        </div>
                                                                    </th>
                                                                    <th className="col-end-time">
                                                                        <div className="end-time title">
                                                                            <Select 
                                                                                components={{ DropdownIndicator }}
                                                                                value={item.shiftFilter.endTimeFilter} 
                                                                                onChange={endTime => handleSelectChange(index, endTime, 'endTimeFilter')} 
                                                                                placeholder={t("Endtime")} 
                                                                                options={shiftEndTimeOptionsFilter}
                                                                                styles={customizeSelectStyles}
                                                                                isSearchable={false}
                                                                                isClearable={true} />
                                                                        </div>
                                                                    </th>
                                                                    <th className="col-working-time"><span className="working-time title">Giờ làm việc</span></th>
                                                                    <th className="col-shift-code">
                                                                        <div className="shift-code title">
                                                                            <Dropdown onToggle={() => toggleOpenInputShiftCodeFilter(index, item.shiftFilter.isOpenInputShiftCodeFilter)}>
                                                                                <Dropdown.Toggle>
                                                                                    <span className="shift-code">Mã ca</span>
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu className="shift-code-popup">
                                                                                    <div className="input-shift-code">
                                                                                        <input type="text" placeholder="Nhập mã ca" value={item.shiftFilter.shiftCodeFilter || ""} onChange={e => handleInputTextChange(index, e, "shiftCodeFilter")} />
                                                                                    </div>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </div>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    shifts && shifts.length > 0 ?
                                                                    (item.shiftFilter.shiftList || shiftList).map((shift, i) => {
                                                                        const formatTime = (time) => {
                                                                            let timeResult = formatStringByMuleValue(time) 
                                                                            timeResult = timeResult ? moment(timeResult, "HHmmss").format("HH:mm:ss") : ""
                                                                            return timeResult
                                                                        }

                                                                        return <tr key={i}>
                                                                                    <td>
                                                                                        <input type="radio" value={i} checked={item.shiftFilter.shiftSelected?.index === i} onChange={() => handleShiftSelect(index, i, shift)} />
                                                                                    </td>
                                                                                    <td>{formatTime(shift?.from_time)}</td>
                                                                                    <td>{formatTime(shift?.to_time)}</td>
                                                                                    <td>{formatStringByMuleValue(shift?.hours)}</td>
                                                                                    <td className="col-shift-code">{formatStringByMuleValue(shift?.shift_id)}</td>
                                                                                </tr>
                                                                    })
                                                                    :
                                                                    <tr>
                                                                        <td colSpan="5">Không tồn tại dữ liệu</td>
                                                                    </tr>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {
                                                        item.employees && item.employees.length > 0 ?
                                                        <div className="list-employees-block">
                                                            <div className="list-employees-header">
                                                                <h6 className="text-uppercase font-14">Danh sách nhân viên</h6>
                                                                <span>Tổng số nhân viên: <span className="font-weight-bold">{formatNumberInteger(item.employees.length)}</span></span>
                                                            </div>
                                                            <div className="list-employees">
                                                                {
                                                                    item.employees.map((employee, ii) => {
                                                                        return <div className="employee-item" key={ii}>
                                                                                    <div className="item">
                                                                                        <p className="text-truncate full-name">{employee.fullName}</p>
                                                                                        <p className="text-truncate position">({employee.jobTitle})</p>
                                                                                    </div>
                                                                                </div>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                                :
                                                <div className="content-for-enter-shift-time">
                                                    <div className="time-configuration">
                                                        <div className="time-planing">
                                                            <div className="time-data">
                                                                <div className="start-time">
                                                                    <label>Bắt đầu 1 - Thay đổi</label>
                                                                    <DatePicker
                                                                        selected={item.startTime ? moment(item.startTime, 'HHmmss').toDate() : null}
                                                                        onChange={startTime => handleTimeInputChange(index, startTime, "startTime")}
                                                                        autoComplete="off"
                                                                        showTimeSelect
                                                                        showTimeSelectOnly
                                                                        timeIntervals={15}
                                                                        timeCaption={t("Hour")}
                                                                        dateFormat="HH:mm:ss"
                                                                        timeFormat="HH:mm:ss"
                                                                        placeholderText={t("Select")}
                                                                        className="form-control input" />
                                                                </div>
                                                                <div className="end-time">
                                                                    <label>Kết thúc 1 - Thay đổi</label>
                                                                    <DatePicker
                                                                        selected={item.endTime ? moment(item.endTime, 'HHmmss').toDate() : null}
                                                                        onChange={endTime => handleTimeInputChange(index, endTime, "endTime")}
                                                                        autoComplete="off"
                                                                        showTimeSelect
                                                                        showTimeSelectOnly
                                                                        timeIntervals={15}
                                                                        timeCaption={t("Hour")}
                                                                        dateFormat="HH:mm:ss"
                                                                        timeFormat="HH:mm:ss"
                                                                        placeholderText={t("Select")}
                                                                        className="form-control input" />
                                                                </div>
                                                            </div>
                                                            {/* <p>Lỗi</p> */}
                                                        </div>
                                                        <div className="time-total">
                                                            <label>Tổng thời gian</label>
                                                            <p className="total">{item.totalTime || 0}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div className="reason">
                                                <label>Lý do</label>
                                                <input type="text" placeholder="Nhập lý do" value={item.reason || ""} onChange={e => handleInputTextChange(index, e, 'reason')} />
                                            </div>
                                            <div className="applicable-object">
                                                <DropdownCustomize 
                                                    label="Đối tượng áp dụng"
                                                    employeeSelectedFilter={props.employeeSelectedFilter}
                                                    getSelecteMembers={updateParent} 
                                                    resetSelectedMember={updateParent}
                                                    onCloseTabEvent={updateParent} 
                                                    onCloseAllEvent={updateParent} />
                                            </div>
                                        </div>
                                    </div>
                        })
                    }
                </div>
                <div className="buttons-block">
                    <Button type="button" variant="secondary" className="btn-cancel" onClick={props.onHideShiftUpdateModal}>{t("CancelSearch")}</Button>
                    <Button type="button" variant="primary" className="btn-submit" onClick={handleSubmit} disabled={false}>
                        {!isDisabledSubmitButton ? t("Save") :
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ShiftUpdateModal
