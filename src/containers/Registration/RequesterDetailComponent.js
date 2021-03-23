import React from 'react'
import { useTranslation } from "react-i18next"

function RequesterDetailComponent(props) {
    const {t} = useTranslation(); 
    return <div className="box shadow cbnv">
    <div className="row">
      <div className="col-3">
        {t("FullName")}
        <div className="detail">{props.user.fullname}</div>
      </div>
      <div className="col-3">
        {t("EmployeeCode")}
        <div className="detail">{props.user.employeeNo}</div>
      </div>
      <div className="col-3">
        {t("Title")}
        <div className="detail">{props.user.jobTitle}</div>
      </div>
      <div className="col-3">
        {t("DepartmentManage")}
        <div className="detail">{props.user.department}</div>
      </div>
    </div>
  </div>
}

export default RequesterDetailComponent