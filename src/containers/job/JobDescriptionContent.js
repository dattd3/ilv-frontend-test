import React, { useState } from "react"
import Fade from 'react-bootstrap/Fade'

export default function JobDescriptionContent(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="job-description">
      <div className="card shadow">
          <div className={open ? 'card-header clearfix text-white ' + 'bg-' + props.bg : 'card-header clearfix jd-border border-left-' + props.bg } onClick={() => setOpen(!open)}>
            <div className="float-left">{props.headerTitle}</div>
            <div className="float-right"><i className={open ? 'fas fa-caret-up' : 'fas fa-caret-down' }></i></div>
          </div>
          {open ? <Fade in={open}>
            <div className="content">
              <div className="card-body multiline">
               {props.content}
              </div>
            </div> 
          </Fade> : null}
        </div>
    </div>
  );
}
