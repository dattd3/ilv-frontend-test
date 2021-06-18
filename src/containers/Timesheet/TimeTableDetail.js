import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import {OverlayTrigger,Tooltip, Popover} from 'react-bootstrap'
import Fade from 'react-bootstrap/Fade'
import moment from 'moment'
import { useTranslation } from "react-i18next"
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
    NO_EVENT: "",
    EVENT_KEHOACH: "ke_hoach",
    EVENT_KE_HOACH_CONTINUE: 'ke_hoach_dai',
    EVENT_GIOTHUCTE : "thuc_te",
    EVENT_LOICONG: 'loi_cong',
    EVENT_GIONGHI: 'gio_nghi',
    EVENT_CONGTAC: 'cong_tac',
    EVENT_OT: 'ot'
  }

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
    return <>
        {
             props.timesheets.map((item, index) => {
                return  <td key = {index}><div className="date">{item.day}</div></td>
             })
        }
    </>
}

function RenderRow1(props) {
    return <>
        {
             props.timesheets.map((item, index) => {
                 if(item.date_type == DATE_TYPE.DATE_OFF) {
                    return <td key = {index} rowSpan={4}><div style = {{fontWeight: 'bold', color: '#000000'}}>OFF</div></td>
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
        <td style={{border:'none'}}></td>
    </>
}

function RenderTooltip(props) {
    return props.item || props.timeExpand || props.shift_id ?  
    <OverlayTrigger 
    key={"td"}
    placement="right"
    overlay={
        <Popover id="popover-basic"  style={{ backgroundColor: '#6CB5F9', color: "white" }} >
        <Popover.Content>
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
                <div style={{color: '#FFFFFF'}}><strong>Mã ca:</strong></div>
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
    
    switch(type) {
        case EVENT_TYPE.EVENT_KEHOACH: 
            if(item.line1.count) {
                let times = item.line1.subtype[0] == 1 ? `${moment(item.line1.from_time1, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time1, 'HHmmss').format('HH:mm:ss')}` : '';
                times += item.line1.subtype[1] == 1 ? ` | ${moment(item.line1.from_time2, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line1.to_time2, 'HHmmss').format('HH:mm:ss')}` : '';
                return <RenderTooltip shift_id = {item.line1.shift_id}>
                        <div className={EVENT_STYLE.EVENT_KE_HOACH_CONTINUE}><div>{times} </div></div>
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
                        <RenderTooltip timeExpand = {item.line2.subtype =='11' ? `${moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss')}` : null}>
                            <div className={EVENT_STYLE.EVENT_GIOTHUCTE}>{`${moment(item.line2.start_time1_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time1_fact, 'HHmmss').format('HH:mm:ss')}` }</div>
                        </RenderTooltip> 
                        : <div className={EVENT_STYLE.EVENT_LOICONG}></div> 
                    : null
                }
                {
                    item.line2.subtype[1] == 1 ? 
                        item.line2.type1[1] == EVENT_TYPE.EVENT_GIOTHUCTE ? 
                        <RenderTooltip timeExpand = {item.line2.subtype =='11' ? `${moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss')}` : null}>
                            <div className={EVENT_STYLE.EVENT_GIOTHUCTE} style={{borderLeft: '1px solid #707070'}} >{`${moment(item.line2.start_time2_fact, 'HHmmss').format('HH:mm:ss')} - ${moment(item.line2.end_time2_fact, 'HHmmss').format('HH:mm:ss')}` }</div>
                        </RenderTooltip>
                        :<div className={EVENT_STYLE.EVENT_LOICONG} style={{borderLeft: '1px solid #707070'}} ></div>
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
function RenderRow2(props) {
    return <>
        {
            props.timesheets.map((item, index) => {
                if(item.date_type == DATE_TYPE.DATE_OFF || item.date_type == DATE_TYPE.DATE_OFFSET) {
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
        <td style={{border:'none'}}></td>
    </>
}

function RenderRow3(props) {
    return <>
    {
        props.timesheets.map((item, index) => {
            if(item.date_type == DATE_TYPE.DATE_OFF || item.date_type == DATE_TYPE.DATE_OFFSET) {
                return null;
            }
            if(item.line3.type == EVENT_TYPE.NO_EVENT) {
                return  <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><div>&nbsp;</div></td>
            } else if (item.line3.type == EVENT_TYPE.EVENT_GIONGHI || item.line3.type == EVENT_TYPE.EVENT_CONGTAC) {
                return <td style={{borderTop: 'none', borderBottom: 'none'}} key = {index}><RenderItem item= {item} type = {item.line3.type}/></td>
            }
            return null;
        })
    }
    <td style={{border:'none'}}></td>
    </>
}

function RenderRow4(props) {
    return <>
    {
        props.timesheets.map((item, index) => {
            if(item.date_type == DATE_TYPE.DATE_OFF || item.date_type == DATE_TYPE.DATE_OFFSET) {
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
    <td style={{border:'none'}}></td>
    </>
}

function Content(props) {
    const { t } = useTranslation();
    let filterType = [{title: 'Giờ kế hoạch', color: '#B7EDF1'}, {title: 'Giờ thực tế', color: '#CAF0D2'}, {title: 'Lỗi chấm công', color: '#FFA0A0'} , {title: 'Nghỉ', color: '#FFDA9A'}, {title: 'Công tác/Đào tạo/WFH', color: '#C1DCFF'}, {title: 'OT', color: '#D4B9E9'}];
  return (
    <>
        <div >
          <div className="row pr-2 pl-2 pb-4">
              <div className="col-md-12 col-xl-12 describer">
                    {
                        filterType.map( (item, index) => {
                            return <div className="item" key = {index}>
                                    <div className="box" style={{backgroundColor: item.color}}></div>
                                    <div className="title">{item.title}</div>
                                </div>
                        })
                    }
              </div>
              <div className="col-md-12 col-xl-12" style = {{marginBottom: '10px', marginTop: '10px', height: '1px', backgroundColor : '#707070'}}></div>
              <table className="col-md-12 col-xl-12 timesheet-table" >
                  <thead>
                      <tr>
                          <td>{t('Mon')}</td>
                          <td>{t('Tue')}</td>
                          <td>{t('Wed')}</td>
                          <td>{ t('Thu')}</td>
                          <td>{t('Fri')}</td>
                          <td>{t('Sat')}</td>
                          <td>{t("Sun")}</td>
                      </tr>
                      <tr className="divide"></tr>
                  </thead>
                  <tbody>
                    {
                        chunk(props.timesheets, 7).map( (timesheet, index) => {
                           
                            return <React.Fragment key = {index}>
                                 <tr>
                                    <RenderRow0 timesheets = {timesheet}/>
                                </tr>
                                <tr>
                                <RenderRow1 timesheets = {timesheet}/>
                                </tr>
                                <tr>
                                    <RenderRow2 timesheets = {timesheet}/>
                                </tr>
                                <tr>
                                    <RenderRow3 timesheets={timesheet}/>
                                </tr>
                                <tr>
                                    <RenderRow4 timesheets={timesheet}/>
                                </tr>
                                <tr className="divide"></tr>
                            </React.Fragment>
                        })
                    }
                 
                  </tbody>
              </table>
             
          </div>
        </div>
    </>
  )
}

function TimeTableDetail(props) {
  const { t } = useTranslation()
  if(!props.timesheets || props.timesheets.length == 0)
    return null;
    
  return (
    <div className="detail">
      <div className="card shadow">
        <div className="card-header bg-success text-white text-uppercase">{t("WorkingDaysDetail")}</div>
        <div className="card-body">
            <Content timesheets={props.timesheets} />
        </div>
      </div>
    </div>
  )
}

export default TimeTableDetail
