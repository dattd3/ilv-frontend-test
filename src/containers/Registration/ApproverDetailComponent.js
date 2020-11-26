import React from 'react'
import Constants from '../../commons/Constants'

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
    <div className="row">
      <div className="col-4">
        Tình trạng
        <div className="detail">{props.status != null ? Constants.mappingStatus[props.status].label : ""}</div>
      </div>
      {
        props.status == Constants.STATUS_NOT_APPROVED ?
        <div className="col-8">
          Lý do không duyệt
          <div className="detail">{props.hrComment ? props.hrComment : ""}</div>
        </div>
        : null
      }
    </div>
  </div>
}

export default ApproverDetailComponent