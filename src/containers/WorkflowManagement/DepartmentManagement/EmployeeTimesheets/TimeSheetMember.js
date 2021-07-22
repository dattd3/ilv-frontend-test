import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import {OverlayTrigger,Tooltip, Popover} from 'react-bootstrap'
import moment from 'moment'
import { useTranslation } from "react-i18next"
import TableUtil from '../../../../components/Common/table'
import CustomPaging from '../../../../components/Common/CustomPaging'
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
    placement="right"
    overlay={
        <Popover id="popover-basic"  style={{ backgroundColor: '#6CB5F9', color: "white" }} >
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
                  <span>
                    {item.fullname}
                </span>
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
            props.member.timesheets.map((item, index) => {
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
            if( item.date_type == DATE_TYPE.DATE_OFFSET) {
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
    const onChangePage = index => {
        setPageNumber(index)
    }
    const memberTimeData = TableUtil.updateData(props.timeTables, pageNumber - 1, 5)
    const { t } = useTranslation();
    let filterType = [{title: t('TimePlan'), color: '#00B3FF'}, {title: t('TimeActual'), color: '#39B54A'}, {title: t('Miss'), color: '#E44235'} , {title: t('Leave'), color: '#F7931E'}, {title: t('Biztrip'), color: '#93278F'}, {title: 'OT', color: '#808000'}];
  return (
    <>
        <div >
          <div className="row pr-2 pl-2 pb-4">
              <div className="col-md-12 col-xl-12 describer mb-2">
                {
                    filterType.map( (item, index) => {
                        return <div className="item" key = {index}>
                            <div className="box" style={{backgroundColor: item.color}}></div>
                            <div className="title">{item.title}</div>
                        </div>
                    })
                }   
              </div>
              <div className="table-responsive">
                <table className="employee-time-sheets">
                  <thead>
                  <tr className="">
                          <td className="">Họ và tên</td>
                          {props.dayList.map((item, index) => {
                            return (
                              <td key={index}>
                                {moment(item).format("dddd")}
                                <br/>
                                <span style={{fontWeight: 'normal' }}>{moment(item).format("DD/MM")}</span>
                              </td>
                            );
                          })}
                        </tr>
                      <tr className="divide"></tr>
                  </thead>
                  <tbody >
                  { memberTimeData.map( (timesheet, index) => {
                    return  <React.Fragment key = {index}>
                        <tr style={{borderTop: ' 0.5px solid #707070'}}>
                            <td rowSpan="4" className="">{timesheet.name}</td>
                            <RenderRow1 member = {timesheet}/>
                        </tr>
                        <tr>
                            <RenderRow2 member = {timesheet}/>
                        </tr>
                        <tr>
                            <RenderRow3 member={timesheet}/>
                        </tr>
                        <tr>
                            <RenderRow4 member={timesheet}/>
                        </tr>
                        <tr className="divide"></tr>
                      </React.Fragment>     
                    })}
                  </tbody>
              </table>
             </div>
          </div>
          {memberTimeData.length > 0 ? <div className="row paging mt-2">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={5} onChangePage={onChangePage} totalRecords={props.timeTables.length} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {props.timeTables.length}</div>
                </div> : null}
        </div>
    </>
  )
}

function TimeSheetMember(props) {
//   const { t } = useTranslation()
  if(!props.timesheets || props.timesheets.length == 0)
    return null;
    
  return (
    <div className="detail">
      <div className="card shadow">
        {/* <div className="card-header bg-success text-white text-uppercase">{t("WorkingDaysDetail")}</div> */}
        <div className="card-body">
            <Content timeTables={props.timesheets} dayList={props.dayList}/>
        </div>
      </div>
    </div>
  )
}

export default TimeSheetMember
