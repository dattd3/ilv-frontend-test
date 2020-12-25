import React, { useState } from "react"
import Fade from 'react-bootstrap/Fade'

function sumDays(days) {
  return days.reduce((sum, day) => sum + day)
}

export default function LeaveTimeDetail(props) {
  const [open, setOpen] = useState(false);
  return (
  
    <div className="leave-time-detail">
      <div className="card shadow">
          <div className={'card-header clearfix text-white ' + 'bg-' + props.bg } onClick={() => setOpen(!open)}>
            <div className="float-left">{props.headerTitle}</div>
            <div className="float-right"><i className={open ? 'fas fa-caret-up' : 'fas fa-caret-down' }></i></div>
          </div>
          {open ? <Fade in={open}>
            <div className="content">
              <div className="card-body">
                <div className="row header text-left">
                  <div className="col-md-2">
                    {props.headers.month}
                  </div>
                  <div className="col-md-3">
                    {props.headers.annualLeaveOfArising}
                  </div>
                  <div className="col-md-3">
                    {props.headers.usedAnnualLeave}
                  </div>
                  <div className="col-md-4">
                    {props.headers.daysOfAnnualLeave}
                  </div>
                </div>
                <body>
                  {props.data.map((value, key) =>  
                    {return value.arisingLeave.length > 0 || value.usedLeave.length> 0 ? <div className="row text-left">
                        <div className="col-md-2">
                          {value.month}
                        </div>
                        <div className="col-md-3">
                          {value.arisingLeave.length > 0 ? sumDays(value.arisingLeave.map(al => al.days)) : 0}
                        </div>
                        <div className="col-md-3">
                          {value.usedLeave.length > 0 ? sumDays(value.usedLeave.map(ul => ul.days)) : 0}
                        </div>
                        <div className="col-md-4">
                        {value.usedLeave.length > 0 ? value.usedLeave.map((d, k) => 
                          <p>{d.date.replace(/-/g, '/')} - {d.days} Ngày</p>
                        ) : ''}
                        </div>
                      </div> :  null}
                  )}
                </body>
                
              </div>
            </div> 
          </Fade> : null}
        </div>
    </div>
  );
}