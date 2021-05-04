import React from 'react'
import { useTranslation } from "react-i18next"

function RequesterDetailComponent(props) {
    const {t} = useTranslation(); 
    return <div className="box shadow cbnv">
    <div className="row group">
      <div className="col-xl-3">
        {t("FullName")}
        <div className="detail auto-height">{props.user.fullName}</div>
      </div>
      <div className="col-xl-3">
        {t("EmployeeNo")}
        <div className="detail auto-height">{props.user.employeeNo}</div>
      </div>
      <div className="col-xl-3">
        {t("Title")}
        <div className="detail auto-height">{props.user.jobTitle}</div>
      </div>
      <div className="col-xl-3">
        {t("DepartmentManage")}
        <div className="detail auto-height">{props.user.department}</div>
      </div>
    </div>
  </div>
}

export default RequesterDetailComponent