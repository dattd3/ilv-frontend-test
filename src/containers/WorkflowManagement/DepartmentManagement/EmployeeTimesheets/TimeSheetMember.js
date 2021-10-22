import React, { useState } from "react"
import {OverlayTrigger, Popover} from 'react-bootstrap'
import moment from 'moment'
import _ from 'lodash'
import { useTranslation } from "react-i18next"
import { formatStringByMuleValue, formatNumberInteger } from "../../../../commons/Utils"
import TableUtil from '../../../../components/Common/table'
import CustomPaging from '../../../../components/Common/CustomPaging'
import ShiftUpdateModal from "../modals/ShiftUpdateModal"

const DATE_TYPE = {
    DATE_OFFSET: 0,
    DATE_NORMAL: 1,
    DATE_OFF: 2
};
const EVENT_TYPE = {
    NO_EVENT: 0,
    EVENT_KEHOACH: 1,
    EVENT_KE_HOACH_CONTINUE: 2,
    EVENT_GIOTHUCTE : 3,
    EVENT_LOICONG: 4,
    EVENT_GIONGHI: 5,
    EVENT_CONGTAC: 6,
    EVENT_OT: 7
};
const EVENT_STYLE = {
    NO_EVENT: "no-event",
    EVENT_KEHOACH: "ke_hoach",
    EVENT_KE_HOACH_CONTINUE: 'ke_hoach_dai',
    EVENT_GIOTHUCTE : "thuc_te",
    EVENT_LOICONG: 'loi_cong',
    EVENT_GIONGHI: 'gio_nghi',
    EVENT_CONGTAC: 'cong_tac',
    EVENT_OT: 'ot'
}

function RenderTooltip(props) {
    const { t } = useTranslation();
    return props.item || props.timeExpand || props.shift_id || props.is_holiday == 1 ?  
    <OverlayTrigger 
    key={"td"}
    placement="top"
    overlay={
        <Popover id="popover-basic"  style={{ backgroundColor: '#6CB5F9', color: "white", fontSize: '12px', fontFamily: 'Helvetica, Arial, sans-serif'}} >
        <Popover.Content>
            {
                props.is_holiday == 1 ? 
                <div style={{color: '#FFFFFF'}}><strong>{t('Holiday')}</strong></div>
                : null
            }
            {
                props.timeExpand ? 
                <div style={{color: '#FFFFFF'}}><strong>{props.timeExpand}</strong></div>
                : null
            }
            {
                props.item ? 
                    <>
                    <div style={{color: '#FFFFFF'}}><strong>{props.item.baseTypeModel.label}</strong>:</div>
                    <span style={{color: '#FFFFFF'}}>{props.item.user_Comment}</span>
                    </>
                : null
            }
            {
                props.shift_id ? 
                <>
                <div style={{color: '#FFFFFF'}}><strong>{t('ShiftCode')}:</strong></div>
                <span style={{color: '#FFFFFF'}}>{props.shift_id}</span>
                </>
                : null

            }
        </Popover.Content>
      </Popover>
    }>
        {props.children}
    </OverlayTrigger>
    : props.children;
}
function RenderItem(props) {
    const {item, type} = props;
    
    // eslint-disable-next-line default-case
    switch(type) {
        case EVENT_TYPE.EVENT_KEHOACH: 
            if (item.line1.count) {
                let times = item.line1.subtype[0] == 1 ? `${moment(item.line1.from_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time1, 'HHmmss').format('HH:mm:ss')}` : '';
                times += item.line1.subtype[1] == 1 ? ` | ${moment(item.line1.from_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time2, 'HHmmss').format('HH:mm:ss')}` : '';
                return <RenderTooltip shift_id = {item.line1.shift_id}>
                        <div className={EVENT_STYLE.EVENT_KE_HOACH_CONTINUE}><div>{times}</div></div>
                    </RenderTooltip>
            }
            return <div style={{display: 'flex'}}>
                {
                    item.line1.subtype[0] == 1 ?
                    <RenderTooltip shift_id = {item.line1.shift_id} timeExpand = {item.line1.subtype =='11' ? `${moment(item.line1.from_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time1, 'HHmmss').format('HH:mm:ss')}` : null}>
                        <div className={EVENT_STYLE.EVENT_KEHOACH}>{`${moment(item.line1.from_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time1, 'HHmmss').format('HH:mm:ss')}` }</div> 
                    </RenderTooltip>
                    : null 
                }
                {
                    item.line1.subtype[1] == 1 ?
                    <RenderTooltip shift_id = {item.line1.shift_id} timeExpand = {item.line1.subtype =='11' ? `${moment(item.line1.from_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time2, 'HHmmss').format('HH:mm:ss')}` : null}>
                        <div className={EVENT_STYLE.EVENT_KEHOACH}  style={{borderLeft: '1px solid #707070'}}>{`${moment(item.line1.from_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time2, 'HHmmss').format('HH:mm:ss')}` }</div> 
                    </RenderTooltip>
                    : null 
                }
            </div>
             
        case EVENT_TYPE.EVENT_CONGTAC: 
            return <div style={{display: 'flex'}}>
                { item.line3.subtype[0] == 1 ?
                    <RenderTooltip item = {item.line3.trip_start_time1_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.trip_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.trip_end_time1, 'HHmmss').format('HH:mm:ss')}` : null}>
                        <div className={EVENT_STYLE.EVENT_CONGTAC}>{`${moment(item.line3.trip_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.trip_end_time1, 'HHmmss').format('HH:mm:ss')}` }</div> 
                    </RenderTooltip>
                    : null
                }
                { item.line3.subtype[1] == 1 ?
                    <RenderTooltip item = {item.line3.trip_start_time2_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.trip_start_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.trip_end_time2, 'HHmmss').format('HH:mm:ss')}` : null}>
                        <div className={EVENT_STYLE.EVENT_CONGTAC} style={{borderLeft: '1px solid #707070'}}>{`${item.line3.trip_start_time2} - ${item.line3.trip_end_time2}` }</div>
                    </RenderTooltip>
                     : null
                } 
                </div>
        
        case EVENT_TYPE.EVENT_GIONGHI: 
            return <div style={{display: 'flex'}}>
                { item.line3.subtype[0] == 1 ?
                    <RenderTooltip item = {item.line3.leave_start_time1_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.leave_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.leave_end_time1, 'HHmmss').format('HH:mm:ss')}` : null}>
                        <div className={EVENT_STYLE.EVENT_GIONGHI}>{`${moment(item.line3.leave_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.leave_end_time1, 'HHmmss').format('HH:mm:ss')}` }</div> 
                    </RenderTooltip>
                    : null
                }
                { item.line3.subtype[1] == 1 ?
                    <RenderTooltip item = {item.line3.leave_start_time2_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.leave_start_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.leave_end_time2, 'HHmmss').format('HH:mm:ss')}` : null}>
                        <div className={EVENT_STYLE.EVENT_GIONGHI} style={{borderLeft: '1px solid #707070'}}>{`${item.line3.leave_start_time2} - ${item.line3.leave_end_time2}` }</div>
                    </RenderTooltip>
                     : null
                } 
                </div>
        
        case EVENT_TYPE.EVENT_GIOTHUCTE:
            return <div style = {{display: 'flex'}}>
                {
                    item.line2.subtype[0] == 1 ?
                        item.line2.type1[0] == EVENT_TYPE.EVENT_GIOTHUCTE ?
                        <RenderTooltip timeExpand = {item.line2.subtype =='11' ? `${item.line2.start_time1_fact != '#' ? moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time1_fact != '#' ? moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss') : ''}` : null}>
                            <div className={EVENT_STYLE.EVENT_GIOTHUCTE}>{`${item.line2.start_time1_fact != '#' ? moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time1_fact != '#' ? moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss') : ''}`  }</div>
                        </RenderTooltip> 
                        : item.line2.type1[0] == EVENT_TYPE.EVENT_LOICONG ?  <div className={EVENT_STYLE.EVENT_LOICONG}>{`${item.line2.start_time1_fact != '#' ? moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time1_fact != '#' ? moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss') : ''}` }</div> 
                        : <div className={EVENT_STYLE.NO_EVENT}>&nbsp;</div> 
                    : null
                }
                {
                    item.line2.subtype[1] == 1 ? 
                        item.line2.type1[1] == EVENT_TYPE.EVENT_GIOTHUCTE ? 
                        <RenderTooltip timeExpand = {item.line2.subtype =='11' ? `${item.line2.start_time2_fact != '#' ? moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time2_fact != '#' ? moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss') : ''}` : null}>
                            <div className={EVENT_STYLE.EVENT_GIOTHUCTE} style={{borderLeft: '1px solid #707070'}} >{`${item.line2.start_time2_fact != '#' ? moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time2_fact != '#' ? moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss') : ''}` }</div>
                        </RenderTooltip>
                        :  item.line2.type1[1] == EVENT_TYPE.EVENT_LOICONG ?   <div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} >{`${item.line2.start_time2_fact != '#' ? moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time2_fact != '#' ? moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss') : ''}` }</div>
                        : <div style={{borderLeft: '1px solid #707070'}} className={EVENT_STYLE.NO_EVENT}>&nbsp;</div>
                    : null
                }
                {/* {
                    item.line2.subtype[2] == 1 ? 
                    <div className={EVENT_STYLE.EVENT_GIOTHUCTE} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time3_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time3_fact, 'HHmmss').format('HH:mm:ss')}` }</div> : null
                } */}
            </div>
        case EVENT_TYPE.EVENT_LOICONG:
            return <div style = {{display: 'flex'}}>
                {
                    item.line2.subtype[0] == 1 ?
                    <div className={EVENT_STYLE.EVENT_LOICONG}>{`${moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss')}` }</div> : null
                }
                {
                    item.line2.subtype[1] == 1 ? 
                    <div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss')}` }</div> : null
                }
                {
                    item.line2.subtype[2] == 1 ? 
                    <div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time3_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time3_fact, 'HHmmss').format('HH:mm:ss')}` }</div> : null
                }
            </div>
        case EVENT_TYPE.EVENT_OT: 
            return <div style = {{display: 'flex'}}>
                {
                    item.line4.subtype[0] == 1 ?
                        <RenderTooltip >
                            <div className={EVENT_STYLE.EVENT_OT}>{`${moment(item.line4.ot_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line4.ot_end_time1, 'HHmmss').format('HH:mm:ss')}` }</div>
                        </RenderTooltip>
                     : null
                }
                {
                    item.line4.subtype[1] == 1 ? 
                    <RenderTooltip>
                        <div className={EVENT_STYLE.EVENT_OT} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line4.ot_start_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line4.ot_end_time2, 'HHmmss').format('HH:mm:ss')}` }</div>
                    </RenderTooltip>
                     : null
                }
                {
                    item.line4.subtype[2] == 1 ? 
                    <RenderTooltip>
                        <div className={EVENT_STYLE.EVENT_OT} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line4.ot_start_time3, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line4.ot_end_time3, 'HHmmss').format('HH:mm:ss')}` }</div>    
                    </RenderTooltip>
                     : null
                }
            </div>
    }
    return null;
}

function RenderRow1(props) {
    return <>
        {
            (props?.member?.timesheets || []).map((item, index) => {
                if(item.date_type == DATE_TYPE.DATE_OFF) {
                    return <td key = {index}>
                        <RenderTooltip is_holiday = {item.is_holiday}>
                            <div>OFF</div>
                        </RenderTooltip>
                        </td>
                } else if (item.date_type == DATE_TYPE.DATE_OFFSET) {
                    return <td key = {index} rowSpan={4} style={{backgroundColor: '#FFA2001A'}}></td>
                }
                if(item.line1.type == EVENT_TYPE.NO_EVENT) {
                    return  <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><div>&nbsp;</div></td>
                } else if( item.line1.type == EVENT_TYPE.EVENT_KEHOACH) {
                    return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index} colSpan={item.line1.count || 0} ><RenderItem item = {item} type = {item.line1.type}/></td>
                } 
                return null;
            })
        }
    </>
}

function RenderRow2(props) {
    return <>
        {
            props.member.timesheets.map((item, index) => {
                if(item.date_type == DATE_TYPE.DATE_OFFSET) {
                    return null;
                 }
                 if(item.line2.type == EVENT_TYPE.NO_EVENT) {
                    return  <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><div>&nbsp;</div></td>
                    //return <td style={{borderTop: 'none', borderBottom: 'none'}}  key = {index}><div className={EVENT_STYLE.EVENT_GIOTHUCTE}>{`${item.line2.start_time1_fact} - ${item.line2.end_time1_fact}` }</div></td>
                 } else if( item.line2.type == EVENT_TYPE.EVENT_GIOTHUCTE) {
                     return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><RenderItem item = {item} type = {item.line2.type}/></td>
                 } else if (item.line2.type == EVENT_TYPE.EVENT_LOICONG) {
                    return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><RenderItem item = {item} type = {item.line2.type}/></td>
                 }
                 return null;
            })
        }
    </>
}

function RenderRow3(props) {
    return <>
    {
        props.member.timesheets.map((item, index) => {
            if ( item.date_type == DATE_TYPE.DATE_OFFSET) {
                return null
            }

            if (props.isShowLineOT) {
                if (item.line3.type == EVENT_TYPE.NO_EVENT) {
                    return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><div>&nbsp;</div></td>
                } else if (item.line3.type == EVENT_TYPE.EVENT_GIONGHI || item.line3.type == EVENT_TYPE.EVENT_CONGTAC) {
                    return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><RenderItem item= {item} type = {item.line3.type}/></td>
                }
            } else {
                if (item.line3.type == EVENT_TYPE.NO_EVENT) {
                    return <td style={{borderTop: 'none'}} key = {index}><div>&nbsp;</div></td>
                } else if (item.line3.type == EVENT_TYPE.EVENT_GIONGHI || item.line3.type == EVENT_TYPE.EVENT_CONGTAC) {
                    return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><RenderItem item= {item} type = {item.line3.type}/></td>
                }
            }
            return null
        })
    }
    </>
}

function RenderRow4(props) {
    return <>
    {
        props.member.timesheets.map((item, index) => {
            if(item.date_type == DATE_TYPE.DATE_OFFSET) {
                return null;
            }
            if(item.line4.type == EVENT_TYPE.NO_EVENT) {
                return  <td style={{borderTop: 'none'}} key = {index}><div>&nbsp;</div></td>
            } else if (item.line4.type == EVENT_TYPE.EVENT_OT) {
                return <td style={{borderTop: 'none'}} key = {index}><RenderItem item = {item} type = {item.line4.type}/></td>
            } 
            return null;
        })
    }
    </>
}

function Content(props) {
    const [pageNumber, setPageNumber] = useState(1);
    const [isShowShiftUpdateModal, SetIsShowShiftUpdateModal] = useState(false)
    const [dateInfo, SetDateInfo] = useState({})
    const [totalEmployeesUpdating, SetTotalEmployeesUpdating] = useState(0)

    const onChangePage = index => {
        setPageNumber(index)
    }

    const memberTimeData = TableUtil.updateData(props.timeTables, pageNumber - 1, 50)
    const { t } = useTranslation();
    const filterType = [{title: t('TimePlan'), color: '#00B3FF'}, {title: t('TimeActual'), color: '#FFFFFF'}, {title: t('Miss'), color: '#E44235'} , {title: t('Leave'), color: '#F7931E'}, {title: t('Biztrip'), color: '#93278F'}, {title: 'OT', color: '#808000'}];

    const handleShowModalShiftChange = (date, day) => {
        const isUpdatable = isShiftUpdatable(date)
        if (!isUpdatable) {
            return
        }
        SetIsShowShiftUpdateModal(true)
        SetDateInfo({day: day, date: date})
    }

    const isShiftUpdatable = (date) => {
        const backDateConfig = 1
        const duration = moment().diff(date, 'days')
        if (duration > backDateConfig) {
            return false
        }
        return true
    }

    const onHideShiftUpdateModal = () => {
        SetIsShowShiftUpdateModal(false)
    }

    const updateParentData = dataChanged => {
        onHideShiftUpdateModal()
        const dateChanged = dateInfo?.date
        const uniqueApplicableObjects = dataChanged.reduce(function(arr, item) {
            arr = _.unionWith(arr, item.applicableObjects, _.isEqual)
            return arr
        }, [])
        SetTotalEmployeesUpdating(uniqueApplicableObjects.length)
        props.updateTimeSheetsParent(dateChanged, dataChanged, uniqueApplicableObjects)
    }

    const handleViewDetail = () => {
        SetIsShowShiftUpdateModal(true)
    }

    let employeeSelectedFilter = []
    let isUpdating = false
    if (props.timeTables.length > 0) {
        employeeSelectedFilter = (props.employeeSelectedFilter || []).map(item => ({...item, checked: false}))
        if (props.timeTables.some(item => item.isUpdating)) {
            isUpdating = true
        }
    }

    return (
        <>
            <ShiftUpdateModal 
                show={isShowShiftUpdateModal} 
                dateInfo={dateInfo} 
                isUpdating={isUpdating}
                employeesForFilter={props.employeesForFilter} 
                employeeSelectedFilter={employeeSelectedFilter} 
                onHideShiftUpdateModal={onHideShiftUpdateModal}
                updateParentData={updateParentData} />
            <div className="row pr-2 pl-2 pb-4">
                <div className="col-md-12 col-xl-12 describer mb-2">
                    {
                        filterType.map((item, index) => {
                            return <div className="item" key={index}>
                                <div className="box-op1" style={{backgroundColor: item.color}}></div>
                                <div className="title">{item.title}</div>
                            </div>
                        })
                    }   
                </div>
                <div className="table-responsive">
                    <table className="employee-time-sheets">
                        <thead>
                            <tr>
                                <td className="text-uppercase fixed-col full-name"><span className="title">{t('FullName')}</span></td>
                                <td className="text-uppercase fixed-col room-part-group"><span className="title">{t('RoomPartGroup')}</span></td>
                                {props.dayList.map((item, index) => {
                                    let thisDate = moment(item).format("YYYYMMDD")
                                    let isUpdatable = isShiftUpdatable(thisDate)
                                    return (
                                    <td className={`text-uppercase ${isUpdatable ? 'updatable' : ''} ${props.dateChanged == moment(item).format("YYYYMMDD") ? 'updating' : ''}`} key={index} onClick={() => handleShowModalShiftChange(thisDate, moment(item).format("dddd"))} style={{cursor: 'pointer'}}>
                                        <span className="title">{moment(item).format("dddd")}</span>
                                        <br/>
                                        <span className="date">{moment(item).format("DD/MM")}</span>
                                    </td>
                                    );
                                })}
                            </tr>
                            <tr className="divide"></tr>
                        </thead>
                    <tbody>
                    { memberTimeData.map((timeSheet, index) => {
                        let isShowLineOT = (timeSheet?.timesheets || [])
                        .every(item => formatStringByMuleValue(item.line4?.ot_end_time1) && formatStringByMuleValue(item.line4?.ot_end_time2) 
                        && formatStringByMuleValue(item.line4?.ot_end_time3) && formatStringByMuleValue(item.line4?.ot_start_time1) && 
                        formatStringByMuleValue(item.line4?.ot_start_time2) && formatStringByMuleValue(item.line4?.ot_start_time3))
                        return <React.Fragment key={index}>
                            <tr style={{borderTop: '1px solid #707070'}} className="line1">
                                <td rowSpan={isShowLineOT ? 4 : 3} className="fixed-col full-name"><span className={timeSheet.isUpdating === true ? 'updating' : ''}>{timeSheet.name || ""}</span></td>
                                <td rowSpan={isShowLineOT ? 4 : 3} className="fixed-col room-part-group"><span>{timeSheet.departmentPartGroup || ""}</span></td>
                                <RenderRow1 member = {timeSheet} />
                            </tr>
                            <tr className="no-border-left" className="line2">
                                <RenderRow2 member = {timeSheet} />
                            </tr>
                            <tr className="no-border-left" className="line3">
                                <RenderRow3 member={timeSheet} isShowLineOT={isShowLineOT} />
                            </tr>
                            {
                                isShowLineOT ? 
                                <tr className="no-border-left" className="line4">
                                    <RenderRow4 member={timeSheet} />
                                </tr>
                                : null
                            }
                            <tr className="divide"></tr>
                        </React.Fragment>     
                        })}
                    </tbody>
                </table>
                </div>
            </div>
            {
                totalEmployeesUpdating && totalEmployeesUpdating > 0 ?
                <div className="report-employees-updating">
                    <span className="message">Tổng số nhân viên thay đổi Giờ kế hoạch: <span className="total-employees-updating">{formatNumberInteger(totalEmployeesUpdating)}</span></span>
                    <span className="detail" onClick={handleViewDetail}>{"Xem chi tiết"}<i className="fas fa-angle-double-right"></i></span>
                </div>
                : null
            }
            {/* {
                memberTimeData.length > 0 
                ?   <div className="row paging mt-2">
                        <div className="col-sm"></div>
                        <div className="col-sm"></div>
                        <div className="col-sm">
                            <CustomPaging pageSize={50} onChangePage={onChangePage} totalRecords={props.timeTables.length} />
                        </div>
                        <div className="col-sm"></div>
                        <div className="col-sm text-right">{t("Total")}: {props.timeTables.length}</div>
                    </div>
                : null
            } */}
        </>
    )
}

function TimeSheetMember(props) {
    if (!props.timesheets || props.timesheets.length == 0) return null

    const updateTimeSheetsParent = (dateChanged, dataChanged, uniqueApplicableObjects) => {
        props.updateTimeSheetsParent(dateChanged, dataChanged, uniqueApplicableObjects)
    }

    return (
        <div className="detail-timesheet">
            <div className="card shadow">
                {/* <div className="card-header bg-success text-white text-uppercase">{t("WorkingDaysDetail")}</div> */}
                <div className="card-body">
                    <Content timeTables={props.timesheets} dayList={props.dayList} dateChanged={props.dateChanged} employeesForFilter={props.employeesForFilter} employeeSelectedFilter={props.employeeSelectedFilter} updateTimeSheetsParent={updateTimeSheetsParent} />
                </div>
            </div>
        </div>
    )
}

export default TimeSheetMember
