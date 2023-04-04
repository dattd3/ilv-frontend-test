import React from 'react'
import Select, { components } from 'react-select'
import { Dropdown, Button } from 'react-bootstrap'
import moment from 'moment'
import { withTranslation  } from "react-i18next"
import { formatStringByMuleValue } from "../../../commons/Utils"
import Constants from 'commons/Constants'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class ShiftTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shiftStartTimeOptionsFilter: [],
            shiftEndTimeOptionsFilter: [],
            shiftFilter: {
                isOpenInputShiftCodeFilter: false,
                shiftCodeFilter: "",
                startTimeFilter: null,
                endTimeFilter: null
            },
        }
    }

    componentDidMount() {
        this.setShiftTimeFilter()
    }

    updateShift(shift) {
        const { timesheet, updateShift } = this.props
        updateShift(timesheet.index, shift)
    }
    
    setShiftTimeFilter = () => {
        const { shifts } = this.props
        const shiftsExcludeOff = shifts.filter(item => item.shift_id !== Constants.SHIFT_CODE_OFF)
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

        this.setState({
            shiftStartTimeOptionsFilter: startTimeOptions,
            shiftEndTimeOptionsFilter: endTimeOptions
        })
    }

    handleSelectChange = (option, key) => {
        const { timesheet, filterShiftListByTimesAndShiftCode } = this.props
        const shiftFilter = {...this.state.shiftFilter}
        const startTime = key === 'startTimeFilter' ? option?.originValue : shiftFilter.startTimeFilter?.originValue
        const endTime = key === 'endTimeFilter' ? option?.originValue : shiftFilter.endTimeFilter?.originValue
        const shiftCode = shiftFilter.shiftCodeFilter

        filterShiftListByTimesAndShiftCode(timesheet.index, startTime, endTime, shiftCode)
    }

    toggleOpenInputShiftCodeFilter = status => {
        const shiftFilter = {...this.state.shiftFilter}
        shiftFilter.isOpenInputShiftCodeFilter = !status
        this.setState({shiftFilter: shiftFilter})
    }

    handleInputTextChange = e => {
        const { timesheet, filterShiftListByTimesAndShiftCode } = this.props
        const shiftFilter = {...this.state.shiftFilter}
        const val = e.target.value
        shiftFilter.shiftCodeFilter = val
        this.setState({shiftFilter: shiftFilter})
        filterShiftListByTimesAndShiftCode(timesheet.index, shiftFilter.startTimeFilter, shiftFilter.endTimeFilter, val)
    }

    render() {
        const { t, shifts, timesheet } = this.props
        const { shiftStartTimeOptionsFilter, shiftEndTimeOptionsFilter, shiftFilter } = this.state
        const index = timesheet.index
        // const shiftsExcludeFlex = shifts.filter(item => !item.shift_id?.toUpperCase().startsWith("FLE", 0))

        const DropdownIndicator = props => {
            return (
                <components.DropdownIndicator {...props}>
                    <div className="caret-down"></div>
                </components.DropdownIndicator>
            )
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
                    padding: "6px",
                    textAlign: "left",
                    "&:hover": {
                        background: isFocused ? "#D8D8D8" : "#000000"
                    }
                };
            }
        }

        return (
            <div className="shift-table mt-3">
                <table className="shift">
                    <thead>
                        <tr>
                            <th className="col-select-shift"><span className="select-shift title">{t("SelectShiftCode")}</span></th>
                            <th className="col-start-time">
                                <div className="start-time title">
                                    <Select 
                                        components={{ DropdownIndicator }}
                                        value={shiftFilter?.startTimeFilter} 
                                        onChange={startTime => this.handleSelectChange(startTime, 'startTimeFilter')} 
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
                                        value={shiftFilter?.endTimeFilter} 
                                        onChange={endTime => this.handleSelectChange(endTime, 'endTimeFilter')} 
                                        placeholder={t("Endtime")} 
                                        options={shiftEndTimeOptionsFilter}
                                        styles={customizeSelectStyles}
                                        isSearchable={false}
                                        isClearable={true} />
                                </div>
                            </th>
                            <th className="col-working-time"><span className="working-time title">{t("WorkHours")}</span></th>
                            <th className="col-shift-code">
                                <div className="shift-code title">
                                    <Dropdown onToggle={() => this.toggleOpenInputShiftCodeFilter(shiftFilter.isOpenInputShiftCodeFilter)}>
                                        <Dropdown.Toggle>
                                            <span className="shift-code">{t("ShiftCode")}</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="shift-code-popup">
                                            <div className="input-shift-code">
                                                <input type="text" placeholder="Nhập mã ca" value={shiftFilter.shiftCodeFilter || ""} onChange={e => this.handleInputTextChange(e)} />
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.map((shift, index) => {
                            return <tr key={index}>
                                        <td>
                                            <input className="form-check-input position-static" checked={shift.shift_id == timesheet.shiftId} onChange={this.updateShift.bind(this, shift)} type="radio" name={'shift' + timesheet.index} value={shift.shift_id} />
                                        </td>
                                        <td>{shift.from_time.replace("#", "") ? moment(shift.from_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : ""}</td>
                                        <td>{shift.to_time.replace("#", "") ? moment(shift.to_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : ""}</td>
                                        <td>{shift.hours}</td>
                                        <td>{shift.shift_id}</td>
                                    </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withTranslation()(ShiftTable)
