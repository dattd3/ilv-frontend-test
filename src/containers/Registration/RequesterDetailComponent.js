import React from 'react'
import { useTranslation } from "react-i18next"

function RequesterDetailComponent(props) {
    const {t} = useTranslation();

    return <div className="box shadow cbnv">
    <div className="row group">
      <div className={`${props.viewPopup ? 'col-xl-4' : 'col-xl-2'}`}>
        {t("FullName")}
        <div className="detail">{props.user.fullName}</div>
      </div>
      <div className={`${props.viewPopup ? 'col-xl-4' : 'col-xl-2'}`}>
        {t("EmployeeNo")}
        <div className="detail">{props.user.employeeNo}</div>
      </div>
      <div className={`${props.viewPopup ? 'col-xl-4' : 'col-xl-3'}`}>
        {t("Title")}
        <div className="detail">{props.user.jobTitle}</div>
      </div>
      <div className={`${props.viewPopup ? 'col-xl-12 view-popup' : 'col-xl-5'}`}>
        {t("DepartmentManage")}
        <div className="detail">{props.user.department}</div>
      </div>
    </div>
  </div>
}

export default RequesterDetailComponent