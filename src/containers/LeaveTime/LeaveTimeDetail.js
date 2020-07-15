import React, { useState } from "react"
import Fade from 'react-bootstrap/Fade'

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
                <div class="row header">
                  <div class="col-md-2">
                    {props.headers.month}
                  </div>
                  <div class="col-md-3">
                    {props.headers.annualLeaveOfArising}
                  </div>
                  <div class="col-md-2">
                    {props.headers.expiryDate}
                  </div>
                  <div class="col-md-3">
                    {props.headers.usedAnnualLeave}
                  </div>
                  <div class="col-md-2">
                    {props.headers.daysOfAnnualLeave}
                  </div>
                </div>
                <body>
                  {props.data.map((value, key) => 
                    <div class="row">
                        <div class="col-md-2">
                          {value.month}
                        </div>
                        <div class="col-md-3">
                          {value.annualLeaveOfArising}
                        </div>
                        <div class="col-md-2">
                          {value.expiryDate}
                        </div>
                        <div class="col-md-3">
                          {value.usedAnnualLeave}
                        </div>
                        <div class="col-md-2">
                        {value.daysOfAnnualLeave.map((d, k) => 
                          <p>{d}</p>
                        )}
                        </div>
                      </div>
                  )}
                </body>
                
              </div>
            </div> 
          </Fade> : null}
        </div>
    </div>
  );
}