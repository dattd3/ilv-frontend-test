import React, { useEffect, useState, useRef, Fragment } from "react"
import {OverlayTrigger, Tooltip, Popover, Collapse} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import { useTranslation } from "react-i18next"
import Constants from "../../commons/Constants"
import { formatStringByMuleValue, calculateBackDateByPnLVCodeAndFormatType, isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode } from "../../commons/Utils"

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
const totalTimeSheetLines = 4
const timeSheetLinesAlwayShow = 2
const timeSheetLinesIgnoreOnceLine = 3

function WorkingDay(props) {
  const { t } = useTranslation();
  return (
    <div className="content">
      <div className="item">
        <p>{t("StartTime")} {props.index}</p>
        <p className="data"><b>{props.startTime || ""}</b>&nbsp;</p>
      </div>
      <div className="item">
        <p>{t("EndTime")} {props.index}</p>
        <p className="data"><b>{props.endTime || ""}</b>&nbsp;</p>
      </div>
    </div>
  )
}

const chunk = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

function RenderRow0(props) {
  const { t } = useTranslation()
  const PnLVCode = localStorage.getItem("companyCode")
  const backDate = calculateBackDateByPnLVCodeAndFormatType(PnLVCode, 'YYYYMMDD')
  const isEnableShiftChangeFunction = isEnableShiftChangeFunctionByPnLVCode(PnLVCode)
  const isEnableInOutTimeUpdateFunction = isEnableInOutTimeUpdateFunctionByPnLVCode(PnLVCode)

  return (props.timesheets || []).map((item, index) => {
    let dayFormatToBindElement = moment(item.day, "DD/MM/YYYY").format("DDMMYYYY")
    let isBlockActions = moment(item.day, "DD/MM/YYYY").isBefore(moment(backDate, "YYYYMMDD"))

    return <Fragment key={index}>
      <td data-tip data-for={`total-items-selected-${dayFormatToBindElement}`} className={`wrap-item-tooltip ${isBlockActions ? 'block-actions' : ''}`}>
        {
          !isBlockActions ?
          <ReactTooltip id={`total-items-selected-${dayFormatToBindElement}`} event="click" scrollHide isCapture globalEventOff="click" effect="solid" clickable place="bottom" type='light' backgroundColor="#FFFFFF" arrowColor="#FFFFFF" className="item-tooltip">
            <ul>
              <li className="action-item">
                <a href={`/registration?tab=LeaveOfAbsenceRegistration&date=${item.day}`} target="_blank" title={t('LeaveRequest')}>{t('LeaveRequest')}</a>
              </li>
              <li className="action-item">
                <a href={`/registration?tab=BusinessTripRegistration&date=${item.day}`} target="_blank" title={t('BizTrip_TrainingRequest')}>{t('BizTrip_TrainingRequest')}</a>
              </li>
              {
                isEnableShiftChangeFunction &&
                <li className="action-item">
                  <a href={`/registration?tab=SubstitutionRegistration&date=${item.day}`} target="_blank" title={t('ShiftChange')}>{t('ShiftChange')}</a>
                </li>
              }
              {
                isEnableInOutTimeUpdateFunction && 
                <li className="action-item">
                  <a href={`/registration?tab=InOutTimeUpdate&date=${item.day}`} target="_blank" title={t('InOutChangeRequest')}>{t('InOutChangeRequest')}</a>
                </li>
              }
            </ul>
          </ReactTooltip>
          : null
        }
        <div className="date">{moment(item.day, "DD/MM/YYYY").format("DD/MM")}</div>
      </td>
    </Fragment>
  })
}

function RenderRow1(props) {
  return <>
    {
      props.timesheets.map((item, index) => {
        if (item.date_type == DATE_TYPE.DATE_OFF) {
          return <td key = {index}>
                    <RenderTooltip is_holiday = {item.is_holiday}>
                      <div className="day-off">OFF</div>
                    </RenderTooltip>
                  </td>
        } else if (item.date_type == DATE_TYPE.DATE_OFFSET) {
          return <td key = {index} rowSpan={props.rowSpan}></td>
        }
        if (item.line1.type == EVENT_TYPE.NO_EVENT) {
          return  <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><div>&nbsp;</div></td>
        } else if ( item.line1.type == EVENT_TYPE.EVENT_KEHOACH) {
          return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index} colSpan={item.line1.count || 0} ><RenderItem item = {item} type = {item.line1.type}/></td>
        } 
        return null;
      })
    }
    {/* <td style={{border:'none'}}></td> */}
  </>
}

function RenderTooltip(props) {
  const { t } = useTranslation();

  return props.item || props.timeExpand || props.shift_id || props.is_holiday == 1 ?  
  <OverlayTrigger 
    key={"td"}
    placement="top"
    overlay={
      <Popover id="popover-basic"  style={{ backgroundColor: '#6CB5F9', color: "white" }} >
      <Popover.Content>
        {
          props.is_holiday == 1 
          ? <div style={{color: '#FFFFFF'}}><strong>{t('Holiday')}</strong></div>
          : null
        }
        {
          props.timeExpand 
          ? <div style={{color: '#FFFFFF'}}><strong>{props.timeExpand}</strong></div>
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
  const {item, type, rowSpan} = props;
  
  switch(type) {
    case EVENT_TYPE.EVENT_KEHOACH: 
      if(item.line1.count) {
        let times = item.line1.subtype[0] == 1 ? `${moment(item.line1.from_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time1, 'HHmmss').format('HH:mm:ss')}` : '';
        times += item.line1.subtype[1] == 1 ? ` | ${moment(item.line1.from_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time2, 'HHmmss').format('HH:mm:ss')}` : '';
        return <RenderTooltip shift_id = {item.line1.shift_id}>
                  <div className={EVENT_STYLE.EVENT_KE_HOACH_CONTINUE}><div>{times}</div></div>
                </RenderTooltip>
      }
      return <div className="d-flex">
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
      return <div className="d-flex">
          {
            item.line3.subtype[0] == 1 ?
            <RenderTooltip item = {item.line3.trip_start_time1_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.trip_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.trip_end_time1, 'HHmmss').format('HH:mm:ss')}` : null}>
                <div className={EVENT_STYLE.EVENT_CONGTAC}>{`${moment(item.line3.trip_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.trip_end_time1, 'HHmmss').format('HH:mm:ss')}` }</div> 
            </RenderTooltip>
            : null
          }
          {
            item.line3.subtype[1] == 1 ?
            <RenderTooltip item = {item.line3.trip_start_time2_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.trip_start_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.trip_end_time2, 'HHmmss').format('HH:mm:ss')}` : null}>
                <div className={EVENT_STYLE.EVENT_CONGTAC} style={{borderLeft: '1px solid #707070'}}>{`${item.line3.trip_start_time2} - ${item.line3.trip_end_time2}` }</div>
            </RenderTooltip>
            : null
          }
        </div>
      
    case EVENT_TYPE.EVENT_GIONGHI:
      return <div className="d-flex">
          {
            item.line3.subtype[0] == 1 ?
            <RenderTooltip item = {item.line3.leave_start_time1_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.leave_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.leave_end_time1, 'HHmmss').format('HH:mm:ss')}` : null}>
                <div className={EVENT_STYLE.EVENT_GIONGHI}>{`${moment(item.line3.leave_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.leave_end_time1, 'HHmmss').format('HH:mm:ss')}` }</div> 
            </RenderTooltip>
            : null
          }
          {
            item.line3.subtype[1] == 1 ?
            <RenderTooltip item = {item.line3.leave_start_time2_comment} timeExpand = {item.line3.subtype =='11' ? `${moment(item.line3.leave_start_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line3.leave_end_time2, 'HHmmss').format('HH:mm:ss')}` : null}>
                <div className={EVENT_STYLE.EVENT_GIONGHI} style={{borderLeft: '1px solid #707070'}}>{`${item.line3.leave_start_time2} - ${item.line3.leave_end_time2}` }</div>
            </RenderTooltip>
            : null
          }
        </div>
      
    case EVENT_TYPE.EVENT_GIOTHUCTE:
      return <div className="d-flex">
        {
          item.line2.subtype[0] == 1 ?
              item.line2.type1[0] == EVENT_TYPE.EVENT_GIOTHUCTE ?
              <RenderTooltip timeExpand = {item.line2.subtype =='11' ? `${item.line2.start_time1_fact != '#' ? moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time1_fact != '#' ? moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss') : ''}` : null}>
                  <div className={`${EVENT_STYLE.EVENT_GIOTHUCTE} ${rowSpan == timeSheetLinesAlwayShow ? 'none-border-bottom' : ''}`}>{`${item.line2.start_time1_fact != '#' ? moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time1_fact != '#' ? moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss') : ''}`  }</div>
              </RenderTooltip> 
              : item.line2.type1[0] == EVENT_TYPE.EVENT_LOICONG ? <div className={EVENT_STYLE.EVENT_LOICONG}>{`${item.line2.start_time1_fact != '#' ? moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time1_fact != '#' ? moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss') : ''}` }</div> 
              : <div className={EVENT_STYLE.NO_EVENT}>&nbsp;</div> 
          : null
        }
        {
          item.line2.subtype[1] == 1 ? 
              item.line2.type1[1] == EVENT_TYPE.EVENT_GIOTHUCTE ? 
              <RenderTooltip timeExpand = {item.line2.subtype =='11' ? `${item.line2.start_time2_fact != '#' ? moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time2_fact != '#' ? moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss') : ''}` : null}>
                  <div className={EVENT_STYLE.EVENT_GIOTHUCTE} style={{borderLeft: '1px solid #707070'}} >{`${item.line2.start_time2_fact != '#' ? moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time2_fact != '#' ? moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss') : ''}` }</div>
              </RenderTooltip>
              :  item.line2.type1[1] == EVENT_TYPE.EVENT_LOICONG ? <div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} >{`${item.line2.start_time2_fact != '#' ? moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss') : ''} - ${item.line2.end_time2_fact != '#' ? moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss') : ''}` }</div>
              : <div style={{borderLeft: '1px solid #707070'}} className={EVENT_STYLE.NO_EVENT}>&nbsp;</div>
          : null
        }
        {/* {
            item.line2.subtype[2] == 1 ? 
            <div className={EVENT_STYLE.EVENT_GIOTHUCTE} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time3_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time3_fact, 'HHmmss').format('HH:mm:ss')}` }</div> : null
        } */}
        </div>
    case EVENT_TYPE.EVENT_LOICONG:
      return <div className="d-flex">
          {
            item.line2.subtype[0] == 1 
            ? <div className={EVENT_STYLE.EVENT_LOICONG}>{`${moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss')}` }</div> 
            : null
          }
          {
            item.line2.subtype[1] == 1 ? 
            <div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss')}` }</div> 
            : null
          }
          {
            item.line2.subtype[2] == 1 
            ? <div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time3_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time3_fact, 'HHmmss').format('HH:mm:ss')}` }</div> 
            : null
          }
      </div>
    case EVENT_TYPE.EVENT_OT:
      return <div className="d-flex">
        {
          item.line4.subtype[0] == 1 ?
          <RenderTooltip >
            <div className={EVENT_STYLE.EVENT_OT}>{`${moment(item.line4.ot_start_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line4.ot_end_time1, 'HHmmss').format('HH:mm:ss')}`}</div>
          </RenderTooltip>
          : null
        }
        {
          item.line4.subtype[1] == 1 ? 
          <RenderTooltip>
            <div className={EVENT_STYLE.EVENT_OT} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line4.ot_start_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line4.ot_end_time2, 'HHmmss').format('HH:mm:ss')}`}</div>
          </RenderTooltip>
          : null
        }
        {
          item.line4.subtype[2] == 1 ? 
          <RenderTooltip>
            <div className={EVENT_STYLE.EVENT_OT} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line4.ot_start_time3, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line4.ot_end_time3, 'HHmmss').format('HH:mm:ss')}`}</div>    
          </RenderTooltip>
          : null
        }
      </div>
  }
  return null;
}

function RenderRow2(props) {
  const { timesheets, rowSpan } = props

  return (timesheets || []).map((item, index) => {
    if (item.date_type == DATE_TYPE.DATE_OFFSET) {
      return null;
    }

    if (item.line2.type == EVENT_TYPE.NO_EVENT) { // Ngày OFF
      return <td className={`none-border-top ${rowSpan == timeSheetLinesAlwayShow ? 'border-bottom' : 'none-border-bottom'}`} key={index}><div>&nbsp;</div></td>
    } else if (item.line2.type == EVENT_TYPE.EVENT_GIOTHUCTE) {
      if (rowSpan == timeSheetLinesAlwayShow) {
        return <td className="none-border-top" key={index}><RenderItem item={item} type={item.line2.type} rowSpan={rowSpan} /></td>
      }
      return <td className="none-border-top none-border-bottom" key={index}><RenderItem item={item} type={item.line2.type} rowSpan={rowSpan} /></td>
    } else if (item.line2.type == EVENT_TYPE.EVENT_LOICONG) {
      return <td className="none-border-top none-border-bottom" key={index}><RenderItem item={item} type={item.line2.type} /></td>
    }
    return null;
  })
}

function RenderRow3(props) {
  const { timesheets, rowSpan } = props

  return (timesheets || []).map((item, index) => {
    if (item.date_type == DATE_TYPE.DATE_OFFSET) {
        return null;
    }
    if (item.line3.type == EVENT_TYPE.NO_EVENT) {
        return <td className={`none-border-top ${rowSpan == timeSheetLinesIgnoreOnceLine ? 'border-bottom' : 'none-border-bottom'}`} key={index}><div>&nbsp;</div></td>
    } else if (item.line3.type == EVENT_TYPE.EVENT_GIONGHI || item.line3.type == EVENT_TYPE.EVENT_CONGTAC) {
        return <td className="none-border-top none-border-bottom" key={index}><RenderItem item={item} type={item.line3.type} /></td>
    }
    return null;
  })
}

function RenderRow4(props) {
  return props.timesheets.map((item, index) => {
    if (item.date_type == DATE_TYPE.DATE_OFFSET) {
      return null;
    }
    if (item.line4.type == EVENT_TYPE.NO_EVENT) {
      return  <td className="none-border-top" key={index}><div>&nbsp;</div></td>
    } else if (item.line4.type == EVENT_TYPE.EVENT_OT) {
      return <td className="none-border-top" key={index}><RenderItem item={item} type={item.line4.type} /></td>
    }
    return null;
  })
}

function Content(props) {
  const { t } = useTranslation();
  const filterType = [{title: t('TimePlan'), color: '#00B3FF'}, {title: t('TimeActual'), color: '#FFFFFF'}, {title: t('Miss'), color: '#E44235'}, 
  {title: t('Leave'), color: '#F7931E'}, {title: t('Biztrip'), color: '#93278F'}, {title: 'OT', color: '#808000'}];

  return (
    <div className="row pr-2 pl-2 pb-4">
      <div className="col-md-12 col-xl-12 describer">
        {
          filterType.map( (item, index) => {
            return <div className="item" key={index}>
                      <div className="box-op1" style={{backgroundColor: item.color}}></div>
                      <div className="title">{item.title}</div>
                    </div>
          })
        }
      </div>
      <hr className="bulkhead" />
      <table className="col-md-12 col-xl-12 timesheet-table employee-time-sheets">
        <thead>
          <tr>
            <td>{t('Mon')}</td>
            <td>{t('Tue')}</td>
            <td>{t('Wed')}</td>
            <td>{t('Thu')}</td>
            <td>{t('Fri')}</td>
            <td>{t('Sat')}</td>
            <td>{t("Sun")}</td>
          </tr>
          <tr className="divide"></tr>
        </thead>
        <tbody>
          {
            chunk(props.timesheets, 7).map((timeSheet, index) => {
              let timeSheetFiltered = (timeSheet || []).filter(item => item.date_type === DATE_TYPE.DATE_NORMAL)

              let isShowLineOT = timeSheetFiltered
              .some(item => (formatStringByMuleValue(item.line4?.ot_start_time1) && formatStringByMuleValue(item.line4?.ot_end_time1)) 
              || (formatStringByMuleValue(item.line4?.ot_start_time2) && formatStringByMuleValue(item.line4?.ot_end_time2)) 
              || (formatStringByMuleValue(item.line4?.ot_start_time3) && formatStringByMuleValue(item.line4?.ot_end_time3)))

              let hasTrip = timeSheetFiltered
              .some(item => (formatStringByMuleValue(item.line3?.trip_start_time1) && formatStringByMuleValue(item.line3?.trip_end_time1))
              || (formatStringByMuleValue(item.line3?.trip_start_time2) && formatStringByMuleValue(item.line3?.trip_end_time2)))

              let hasLeave = timeSheetFiltered
              .some(item => (formatStringByMuleValue(item.line3?.leave_start_time1) && formatStringByMuleValue(item.line3?.leave_end_time1)) 
              || (formatStringByMuleValue(item.line3?.leave_start_time2) && formatStringByMuleValue(item.line3?.leave_end_time2)))

              let isShowLine3 = (!hasTrip && !hasLeave) ? false: true
              let rowSpan = totalTimeSheetLines

              if ((isShowLine3 && !isShowLineOT) || (!isShowLine3 && isShowLineOT)) {
                rowSpan = timeSheetLinesIgnoreOnceLine
              } else if (!isShowLine3 && !isShowLineOT) {
                rowSpan = timeSheetLinesAlwayShow
              }

              return <React.Fragment key={index}>
                      <tr className="divide"></tr>
                      <tr>
                        <RenderRow0 timesheets={timeSheet} />
                      </tr>
                      <tr className="divide sub"></tr>
                      <tr style={{background: '#F2F2F2'}} className="line1 border-top">
                        <RenderRow1 timesheets={timeSheet} rowSpan={rowSpan} />
                      </tr>
                      <tr className="none-border-left" className="line2">
                        <RenderRow2 timesheets={timeSheet} rowSpan={rowSpan} />
                      </tr>
                      {
                        isShowLine3 ?
                        <tr className="none-border-left" className="line3">
                          <RenderRow3 timesheets={timeSheet} rowSpan={rowSpan} />
                        </tr>
                        : null
                      }
                      {
                        isShowLineOT ? 
                        <tr>
                          <RenderRow4 timesheets={timeSheet} />
                        </tr>
                        : null
                      }
                      <tr className="divide"></tr>
              </React.Fragment>
            })
          }
        </tbody>
      </table>
    </div>
  )
}

function TimeTableDetail(props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(props.isOpen);
  //const [isSearch, setIsSearch] = useState(props.isSearch);
  const isSearch = useRef(props.isSearch)
  const [timesheets, setTimesheets] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [member, setMember] = useState(null);
  const checkExist = (text) => {
    return text && text != '#';
  }

  useEffect(() => {
      if(props.isSearch)
        isSearch.current = props.isSearch //setIsSearch(props.isSearch);
  }, [props.isSearch])

  const isHoliday = (item) => {
    return item.shift_id == 'OFF' || (item.is_holiday == 1 && localStorage.getItem("companyCode") != "V060")
  }

  const getDayOffset = (currentDate, offset) => {
    const tomorrow = new Date(currentDate.getTime());
    tomorrow.setDate(currentDate.getDate()+ offset);
    return tomorrow;
  }

  const getDatetimeForCheckFail = (startTime, endTime, currentDay, nextDay) => {
    //const currentDay = moment(dateString, "DD-MM-YYYY").format("YYYYMMDD");
    //const nextDay = moment( getDayOffset( moment(dateString, 'DD-MM-YYYY').toDate(), 1)).format('YYYYMMDD');
   
    return {
      start: currentDay + startTime,
      end: startTime < endTime ? currentDay + endTime : nextDay + endTime
    };
  }
  
  const getComment = (dateString, line1,  line2, reasonData) => {
    const reasonForCurrentDaty = reasonData.filter( item => (item.startDate <= dateString && item.endDate >= dateString) || (item.startDate == dateString && item.endDate == dateString))

    if (reasonForCurrentDaty.length == 0) {
      return line2;  
    }

    for(let i = 0; i < reasonForCurrentDaty.length; i++) {
      const item = reasonForCurrentDaty[i];
      let startTime = null, endTime = null;
      if(item.startTime && item.endTime) {
        startTime = item.startTime
        endTime = item.endTime;
        if(startTime == line2.trip_start_time1 && endTime == line2.trip_end_time1) {
          line2.trip_start_time1_comment = item;
        } else if ( startTime == line2.trip_start_time2 && endTime == line2.trip_end_time2) {
          line2.trip_start_time2_comment = item;
        } else if( startTime == line2.leave_start_time1 && endTime == line2.leave_end_time1) {
          line2.leave_start_time1_comment = item;
        } else if( startTime == line2.leave_start_time2 && endTime == line2.leave_end_time2) {
          line2.leave_start_time2_comment = item;
        } 
      } else if( checkExist(line1.from_time1) &&  checkExist(line1.to_time1)) {
        if( checkExist(line2.trip_start_time1) &&  checkExist(line2.trip_end_time1)) { 
          line2.trip_start_time1_comment = item;
        } else if(  checkExist(line2.leave_start_time1) &&  checkExist(line2.leave_end_time1) ) {
          line2.leave_start_time1_comment = item;
        }
      } else if( checkExist(line1.from_time2) &&  checkExist(line1.to_time2)) {
        if( checkExist(line2.trip_start_time2) &&  checkExist(line2.trip_end_time2)) {
          line2.trip_start_time2_comment = item;
        } else if(  checkExist(line2.leave_start_time2) &&  checkExist(line2.leave_end_time2) ) {
          line2.leave_start_time2_comment = item;
        }
      }
    }
    return line2;
    
  }

const processDataForTable = (data1, fromDateString, toDateString, reasonData) => {
    const data = [...data1];
    const fromDate = moment(fromDateString, 'YYYYMMDD').toDate();
    const toDate = moment(toDateString, 'YYYYMMDD').toDate();
    
     // Lấy số thứ tự của ngày hiện tại
    const fromDate_day = fromDate.getDay() == 0 ? 7 : fromDate.getDay();
    const toDate_day = toDate.getDay() == 0 ? 7 : toDate.getDay();
    const firstArray = Array.from({length:fromDate_day - 1}).map((x, index) => {
      return {
        day: moment( getDayOffset(fromDate, -1 *(fromDate_day - index - 1))).format('DD/MM/YYYY'),
        date_type : DATE_TYPE.DATE_OFFSET, //ngay trắng,
        date: index + 1  // thu 2
      }
    })
    const lastArray = Array.from({length:7 - toDate_day}).map((x, index) => {
      return {
          date_type : DATE_TYPE.DATE_OFFSET, //ngay trắng,
          date: toDate_day + index + 1,  // thu 2
          day: moment( getDayOffset(toDate, index + 1)).format('DD/MM/YYYY')
        }
    })
    const today = moment(new Date()).format("YYYYMMDD")
    for(let index = 0; index < data.length; index++) {
      const item = data[index];
      const currentDay = moment(item.date, "DD-MM-YYYY").format("YYYYMMDD");
      const nextDay = moment( getDayOffset( moment(item.date, 'DD-MM-YYYY').toDate(), 1)).format('YYYYMMDD');
      
      const timeSteps = [];
      //gio ke hoach  type( 0:khong co event , 1:  co 1 event, 2: event dang tiep tu,), subtype (0, khong co, 1 : etime 1, 2 time 2, 3 ca 2 time)
      const line1 = {type : EVENT_TYPE.NO_EVENT,
         subtype: '00', 
         count: item.count,
          shift_id : item.shift_id != '****' ? item.shift_id : null,
          to_time1: item.to_time1,
          to_time2: item.to_time2, 
          from_time2: item.from_time2, 
          from_time1: item.from_time1 };
      if( checkExist(item.from_time1) && ! isHoliday(item)) {
        line1.type = EVENT_TYPE.EVENT_KEHOACH;
        line1.subtype =  1 + line1.subtype[0]
        
      }
      if( checkExist(item.from_time2) && ! isHoliday(item)) {
        line1.type = EVENT_TYPE.EVENT_KEHOACH;
        line1.subtype = line1.subtype[0] + 1
        //timeSteps.push({start: item.from_time2, end: item.from_time2});
      }
      const nextItem = index + 1 < data.length ? data[index + 1 ] : null;
      if(nextItem &&  moment(item.date, 'DD-MM-YYYY').toDate().getDay() != 1 &&  checkExist(item.from_time1) && nextItem.from_time1 == item.from_time1 && nextItem.to_time1 == item.to_time1 && nextItem.from_time2 == item.from_time2 && nextItem.to_time2 == item.to_time2 && ! isHoliday(data[index + 1]) && ! isHoliday(item)) {
        line1.type = EVENT_TYPE.EVENT_KE_HOACH_CONTINUE;
        line1.subtype = '00';
        nextItem.count = line1.count ? line1.count + 1 : 2;
        data[index + 1] = nextItem;
      }        

      //gio thuc te  // khong co event , 1 : gio thuc te, 2 : loi cham cong
      let line2 = {type: EVENT_TYPE.NO_EVENT, 
      type1: '00', 
      subtype: '000', 
      "start_time1_fact": item.start_time1_fact, //gio thuc te
      "end_time1_fact": item.end_time1_fact, //gio thuc te
      "end_time2_fact": item.end_time2_fact, //gio thuc te
      "start_time2_fact": item.start_time2_fact, //gio thuc te
      "start_time3_fact": item.start_time3_fact, //gio thuc te
      "end_time3_fact": item.end_time3_fact, //gio thuc te 
      };
      if( checkExist(item.start_time1_fact)) {
        line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
        
        if( checkExist(item.end_time1_fact)) {
          line2.type1 = EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1];
          line2.subtype = 1 + line2.subtype[1];
          timeSteps.push( getDatetimeForCheckFail(item.start_time1_fact, item.end_time1_fact, currentDay, nextDay));
        } else {
          line2.type1 =   isHoliday(item) ? EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1] : EVENT_TYPE.EVENT_LOICONG + line2.type1[1];
          line2.subtype = '1' + line2.subtype[1];
        }
      }
      if( checkExist(item.start_time2_fact)) {
        line2.type =  EVENT_TYPE.EVENT_GIOTHUCTE;
        if( checkExist(item.end_time2_fact)) {
          line2.type1 = line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE;
          line2.subtype = line2.subtype[0] + 1
          timeSteps.push( getDatetimeForCheckFail(item.start_time2_fact, item.end_time2_fact, currentDay, nextDay));
        } else {
          line2.type1 =  isHoliday(item) ? line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE : line2.type1[0] + EVENT_TYPE.EVENT_LOICONG;
          line2.subtype = line2.subtype[0] + 1
        }
        
      }
      // if( checkExist(item.start_time3_fact)) {
      //   line2.type =  EVENT_TYPE.EVENT_GIOTHUCTE;
      //   line2.subtype = line2.subtype.replace(2, 1)
      //   //timeSteps.push({start: item.start_time3_fact, end: item.end_time3_fact});
      //   timeSteps.push( getDatetimeForCheckFail(item.start_time3_fact, item.end_time3_fact, currentDay, nextDay));
      // }

      //gio nghi : //0: khong co event, 1 : nghi, 2 : cong tac
      let line3 = {
          type: 0, 
          subtype: '00', 
         "leave_start_time2": item.leave_start_time2, //nghi
         "leave_end_time2": item.leave_end_time2, //nghi
         "leave_end_time1": item.leave_end_time1, //nghi
         "leave_start_time1":item.leave_start_time1, //nghi
         "trip_end_time1": item.trip_end_time1, //cong tac
         "trip_end_time2": item.trip_end_time2, //cong tac
         "trip_start_time2": item.trip_start_time2,  //cong tac
         "trip_start_time1": item.trip_start_time1, //cong tac
      }
      if( checkExist(item.leave_start_time1)) {
        line3.type =  EVENT_TYPE.EVENT_GIONGHI;
        line3.subtype = 1 + line3.subtype[1]
        timeSteps.push( getDatetimeForCheckFail(item.leave_start_time1, item.leave_end_time1, currentDay, nextDay));
      }
      if( checkExist(item.leave_start_time2)) {
        line3.type = EVENT_TYPE.EVENT_GIONGHI;
        line3.subtype = line3.subtype[0] + 1
        timeSteps.push( getDatetimeForCheckFail(item.leave_start_time2, item.leave_end_time2, currentDay, nextDay));
      }
      if( checkExist(item.trip_start_time1)) {
        line3.type = EVENT_TYPE.EVENT_CONGTAC;
        line3.subtype =1 + line3.subtype[1]
        
        timeSteps.push( getDatetimeForCheckFail(item.trip_start_time1, item.trip_end_time1, currentDay, nextDay));
      }
      if( checkExist(item.trip_start_time2)) {
        line3.type = EVENT_TYPE.EVENT_CONGTAC;
        line3.subtype = line3.subtype[0] + 1
        timeSteps.push( getDatetimeForCheckFail(item.trip_start_time2, item.trip_end_time2, currentDay, nextDay));
      }

      //gio OT
      const line4 = {
        type: 0,
        subtype: '000', 
        "ot_end_time3": item.ot_end_time3,//ot
        "ot_end_time2": item.ot_end_time2, //ot
        "ot_end_time1": item.ot_end_time1,//ot
        "ot_start_time1":item.ot_start_time1,//ot
        "ot_start_time2": item.ot_start_time2,//ot
        "ot_start_time3": item.ot_start_time3//ot
      }
      if( checkExist(item.ot_start_time1)) {
        line4.type =  EVENT_TYPE.EVENT_OT;
        line4.subtype = 1 + line4.subtype[1] + line4.subtype[2]
      }
      if( checkExist(item.ot_start_time2)) {
        line4.type =  EVENT_TYPE.EVENT_OT;
        line4.subtype =line4.subtype[0] + 1 + line4.subtype[2]
      }
      if( checkExist(item.ot_start_time3)) {
        line4.type = EVENT_TYPE.EVENT_OT;
        line4.subtype = line4.subtype[0] + line4.subtype[1] + 1
      }
      
     //check loi
     
     //check betwwen step time
      let timeStepsSorted = timeSteps.sort((a, b) => a.start > b.start ? 1 : -1);
      let isValid1 = true;
      let isValid2 = true;
      let isShift1 = true;
      let minStart = 0, maxEnd = 0, minStart2 = null, maxEnd2 = null;  
      const kehoach1 =  getDatetimeForCheckFail(item.from_time1, item.to_time1, currentDay, nextDay)
      const kehoach2 =  getDatetimeForCheckFail(item.from_time2, item.to_time2, currentDay, nextDay);
      if(timeSteps && timeSteps.length > 0) {
        minStart = timeStepsSorted[0].start;
        maxEnd = timeStepsSorted[0].end
        minStart2 = timeStepsSorted[0].start;;
        maxEnd2 = timeStepsSorted[0].end;
        for(let i = 0, j = 1; j < timeStepsSorted.length; i++, j++) {
          minStart = isShift1 && timeStepsSorted[i].start < minStart ? timeStepsSorted[i].start : minStart;
          minStart2 = (timeStepsSorted[i].start < minStart2) ? timeStepsSorted[i].start : minStart2;

          if(timeStepsSorted[j].start > kehoach1.end) {
            isShift1 = false;
          }
          maxEnd = isShift1 && timeStepsSorted[j].end >  maxEnd ? timeStepsSorted[j].end : maxEnd; 
          maxEnd2 =  (timeStepsSorted[j].end > maxEnd2) ? timeStepsSorted[j].end : maxEnd2;

          if(timeStepsSorted[i].end < timeStepsSorted[j].start) {

            if(line1.subtype == '11' && (timeStepsSorted[i].end >= kehoach1.end && timeStepsSorted[j].start <= kehoach2.start)) {
              isShift1 = false;
              maxEnd = timeStepsSorted[i].end;
              minStart2 = timeStepsSorted[j].start;
              maxEnd2 = timeStepsSorted[j].end;
            } else {
              minStart2 = timeStepsSorted[j].start;
              maxEnd2 = timeStepsSorted[j].end;
              if(timeStepsSorted[i].end < kehoach1.end) {
                isValid1 = false;
              }
             
              if(timeStepsSorted[j].start > kehoach2.start) {
                isValid2 = false;
              }
            }
            
          }
        }
        
      }
      //check with propose time
      if( checkExist(item.from_time1) && ! isHoliday(item)) {
        isValid1 = minStart <= kehoach1.start && maxEnd >= kehoach1.end && isValid1 ? true : false;
        
        line2.type1 = isValid1 == false && currentDay <= today  ?  EVENT_TYPE.EVENT_LOICONG + line2.type1[1] : line2.type1;
        line2.type1 = isValid1 == true && line2.type1[0] == EVENT_TYPE.EVENT_LOICONG ? EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1] : line2.type1;
        if(line2.type1[0] == EVENT_TYPE.EVENT_LOICONG) {
          line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
          line2.subtype = '1' + line2.subtype[1];
        }
        if(line2.type1[0] == 0) {
          line2.subtype = '1' + line2.subtype[1];
        }
      }
      if( checkExist(item.from_time2) && ! isHoliday(item)) {
        isValid2 = minStart2 <= kehoach2.start && maxEnd2 >= kehoach2.end && isValid2 ? true : false;
        line2.type1 = isValid2 == false && currentDay <= today ?  line2.type1[0] + EVENT_TYPE.EVENT_LOICONG : line2.type1;
        line2.type1 = isValid2 == true && line2.type1[1] == EVENT_TYPE.EVENT_LOICONG ? line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE : line2.type1;
        if(line2.type1[1] == EVENT_TYPE.EVENT_LOICONG) {
          line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
          line2.subtype = line2.subtype[0] + '1';
        }
        if( line2.type1[1] == 0) {
          line2.subtype = line2.subtype[0] + '1';
        }
      }
      //get Comment

      line3 =  getComment(moment(item.date, 'DD-MM-YYYY').format('YYYYMMDD'), line1, line3, reasonData);

      data[index] = {
          day: moment(item.date, 'DD-MM-YYYY').format('DD/MM/YYYY'),
          date_type :  isHoliday(item) ? DATE_TYPE.DATE_OFF : DATE_TYPE.DATE_NORMAL, // ngày bt
          is_holiday: item.is_holiday,
        //date: 1,  // thu 3
        line1 : { // type( 0:khong co event , 1:  co 1 event, 2: event dang tiep tu,), subtype (0, khong co, 1 : etime 1, 2 time 2, 3 ca 2 time)
          ...line1
        },
        line2: {
          ...line2
        },
        line3: {
          ...line3
        },
        line4: {
          ...line4
        }
      }
      
    }
    return [...firstArray, ...(data.reverse()), ...lastArray];
  }
  
  if(isSearch.current && props.timesheetData) {
    const {dataSorted, start, end, mem, reason} = props.timesheetData;
    if(!(start == startTime && end == endTime && mem == member)) {
        const timesheets =  dataSorted && dataSorted.length > 0 ?  processDataForTable(dataSorted,start, end, reason) : []; 
        setTimesheets(timesheets);
        setStartTime(start);
        setEndTime(end);
        setMember(mem);
        //setIsSearch(false);
        isSearch.current = false;
    }
  }

  return (
    <div className="detail mb-2">
      <div className="card shadow">
        <div className="card-header card-header-text" onClick={() => setOpen(!open)}>
          <div className="text-uppercase">{t("WorkingDaysDetail")}</div>
          {
            props.showCavet ? 
            <div className="float-right">
                <i className={open ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
            </div>
            : null
          }
        </div>
        <Collapse in={open || !props.showCavet}>
        <div className="card-body">
          {
            !timesheets || timesheets.length == 0 ?
            <div className="alert alert-warning shadow" role="alert" style={{marginBottom: 0}}>{t("NoDataFound")}</div> 
            : <Content timesheets={timesheets} />
          }
        </div>
        </Collapse>
      </div>
    </div>
  )
}

export default TimeTableDetail
