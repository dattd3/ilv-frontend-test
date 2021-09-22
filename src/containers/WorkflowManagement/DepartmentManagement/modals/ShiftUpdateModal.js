import React, { useState, useEffect, useRef } from "react"
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
// import IconSuccess from '../../assets/img/ic-success.svg';
// import IconFailed from '../../assets/img/ic-failed.svg';
import Select, { components } from 'react-select'
import { useTranslation } from "react-i18next"
import { Modal, Image, Dropdown, Button } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import Constants from "../../../../commons/Constants"
import { formatStringByMuleValue } from "../../../../commons/Utils"
import './ShiftUpdateModal.scss'

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
                shiftList: null
            },
            reason: ""
        }
    ])

    const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState(false)

    const sendQuery = (index, query, t) => {
 
    }
    
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
            if (responses && responses.data && responses.data.data) {
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
            return (startTime ? item.from_time.trim() === startTime.trim() : true) 
            && (endTime ? item.to_time.trim() === endTime.trim() : true) 
            && (shiftCode ? item.shift_id.trim().toUpperCase() === shiftCode.trim().toUpperCase() : true)
        })

        return shifts
    }

    const toggleOpenInputShiftCodeFilter = (index, status) => {
        const newShiftInfos = [...shiftInfos]
        newShiftInfos[index].shiftFilter.isOpenInputShiftCodeFilter = !status

        SetShiftInfos(newShiftInfos)
    }

    const handleSubmit = () => {

    }

    const addNewItems = () => {

    }

    const handleShiftSelect = (indexItem, shiftIndex) => {

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
                <h6 className="text-uppercase font-14 header-body"><i className="fas fa-calendar-alt"></i>{props.dateInfo || "'"}</h6>
                <div className="wrap-items">
                    {
                        shiftInfos.map((item, index) => {

                            return <div className="item" key={index}>
                                        <div className="add-item">
                                            <span className="bg-primary add-item-button" onClick={addNewItems}><i className="fas fa-plus"></i>Thêm phân ca</span>
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
                                                                (item.shiftFilter.shiftList || shiftList).map((shift, i) => {
                                                                    const formatTime = (time) => {
                                                                        let timeResult = formatStringByMuleValue(time) 
                                                                        timeResult = timeResult ? moment(timeResult, "HHmmss").format("HH:mm:ss") : ""
                                                                        return timeResult
                                                                    }

                                                                    return <tr key={i}>
                                                                                <td>
                                                                                    <input type="radio" value={i} checked={true} onChange={() => handleShiftSelect(index, i)} />
                                                                                </td>
                                                                                <td>{formatTime(shift?.from_time)}</td>
                                                                                <td>{formatTime(shift?.to_time)}</td>
                                                                                <td>{formatStringByMuleValue(shift?.hours)}</td>
                                                                                <td className="col-shift-code">{formatStringByMuleValue(shift?.shift_id)}</td>
                                                                            </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="list-employees-block">
                                                    <div className="list-employees-header">
                                                        <h6 className="text-uppercase font-14">Danh sách nhân viên</h6>
                                                        <span>Tổng số nhân viên: <span className="font-weight-bold">06</span></span>
                                                    </div>
                                                    <div className="list-employees">
                                                        <div className="employee-item">
                                                            <div className="item">
                                                                <p className="text-truncate full-name">Trần Lan Anh</p>
                                                                <p className="text-truncate position">(Chuyên viên kỹ thuật)</p>
                                                            </div>
                                                        </div>
                                                        <div className="employee-item">
                                                            <div className="item">
                                                                <p className="text-truncate full-name">Trần Lan Anh</p>
                                                                <p className="text-truncate position">(Chuyên viên kỹ thuật)</p>
                                                            </div>
                                                        </div>
                                                        <div className="employee-item">
                                                            <div className="item">
                                                                <p className="text-truncate full-name">Trần Lan Anh</p>
                                                                <p className="text-truncate position">(Chuyên viên kỹ thuật)</p>
                                                            </div>
                                                        </div>
                                                        <div className="employee-item">
                                                            <div className="item">
                                                                <p className="text-truncate full-name">Trần Lan Anh</p>
                                                                <p className="text-truncate position">(Chuyên viên kỹ thuật)</p>
                                                            </div>
                                                        </div>
                                                        <div className="employee-item">
                                                            <div className="item">
                                                                <p className="text-truncate full-name">Trần Lan Anh</p>
                                                                <p className="text-truncate position">(Chuyên viên kỹ thuật)</p>
                                                            </div>
                                                        </div>
                                                        <div className="employee-item">
                                                            <div className="item">
                                                                <p className="text-truncate full-name">Trần Lan Anh</p>
                                                                <p className="text-truncate position">(Chuyên viên kỹ thuật)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="content-for-enter-shift-time">
                
                                            </div>
                                            <div className="reason">
                                                <label>Lý do</label>
                                                <input type="text" placeholder="Nhập lý do" value={item.reason || ""} onChange={e => handleInputTextChange(index, e, 'reason')} />
                                            </div>
                                            <div className="applicable-object">
                                                <label>Đối tượng áp dụng</label>
                                                <Select 
                                                    value={null} 
                                                    onChange={substitutionType => handleSelectChange(index, substitutionType)} 
                                                    placeholder={t("Select")} 
                                                    options={substitutionTypes} />
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
