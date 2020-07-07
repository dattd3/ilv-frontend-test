import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import Fade from 'react-bootstrap/Fade'

function TimesheetDetail() {
  const [open, setOpen] = useState(false);

  return (
    <div className="detail">
        <div className="card">
          <div className="card-header bg-success text-white">CHI TIẾT NGÀY CÔNG</div>
          <div className="card-body">
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="timesheet-detail-1"
              aria-expanded={open}
              variant="link"
              className="text-left"
              block
            >
              <div className="row">
                <div className="col-3">
                  <i className={!open ? 'fa fa-plus-circle' : 'fa fa-minus-circle'}>&nbsp;</i>26/06/202
                </div>
                <div className="col-2">
                    <Fade in={!open}>
                      <div id="timesheet-detail-1">Giờ kế hoạch</div>
                    </Fade>
                </div>
                <div className="col-2">
                    <Fade in={!open}>
                      <div id="timesheet-detail-1">Giờ thực tế</div>
                    </Fade>
                </div>
              </div>
          </Button>
          
          {open ? <Fade in={open}>
            <div id="timesheet-detail-1" className="content">
            <div className="row">
              <div className="col-md-5 box">
                <div className="title text-center">Giờ kế hoạch</div>
                <div className="content">
                  <span className="float-left">Bắt đầu 1: <b>09:00:00</b></span>
                  <span className="float-right">Kết thúc 1: <b>14:00:00</b></span>
                </div>
              </div>
              <div className="col-md-5 box">
                <div className="title text-center">Giờ thực tế</div>
                <div className="content">
                  <span className="float-left">Bắt đầu 1: <b>09:00:00</b></span>
                  <span className="float-right">Kết thúc 1: <b>14:00:00</b></span>
                </div>
              </div>
            </div>
            </div> 
          </Fade>: null}
          <hr/>
        </div>
        </div>
      </div>
  )
}

export default TimesheetDetail