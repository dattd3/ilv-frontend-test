import React from 'react'

function RequesterDetailComponent(props) {
    return <div className="box shadow cbnv">
    <div className="row">
      <div className="col-3">
        Họ và tên
        <div className="detail">{props.user.fullname}</div>
      </div>
      <div className="col-3">
        Mã nhân viên
        <div className="detail">{props.user.employeeNo}</div>
      </div>
      <div className="col-3">
        Chức danh
        <div className="detail">{props.user.jobTitle}</div>
      </div>
      <div className="col-3">
        Khối/Phòng/Bộ phận
        <div className="detail">{props.user.department}</div>
      </div>
    </div>
  </div>
}

export default RequesterDetailComponent