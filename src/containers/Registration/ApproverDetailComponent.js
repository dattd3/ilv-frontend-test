import React from 'react'

function ApproverDetailComponent(props) {
    return <div className="box shadow cbnv">
    <div className="row">
      <div className="col-4">
        Người phê duyệt
        <div className="detail">{props.approver ? props.approver.label : null}</div>
      </div>
      <div className="col-4">
        Chức danh
        <div className="detail">{props.approver ? props.approver.current_position : null}</div>
      </div>
      <div className="col-4">
        Khối/Phòng/Bộ phận
        <div className="detail">{props.approver ? props.approver.department : null}</div>
      </div>
    </div>
  </div>
}

export default ApproverDetailComponent