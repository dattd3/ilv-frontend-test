import React from 'react'
import { useTranslation } from "react-i18next"

function RequesterDetailComponent(props) {
    const {t} = useTranslation();
    const { fullName, employeeNo, jobTitle, department } = props?.user || {};

    return <div className="box shadow cbnv">
    <div className="row group">
      <div className={`${props?.viewPopup ? 'col-xl-4' : 'col-xl-2'}`}>
        {t("FullName")}
        <div className="detail">{fullName}</div>
      </div>
      <div className={`${props.viewPopup ? 'col-xl-4' : 'col-xl-2'}`}>
        {t("EmployeeNo")}
        <div className="detail">{employeeNo}</div>
      </div>
      <div className={`${props.viewPopup ? 'col-xl-4' : 'col-xl-3'}`}>
        {t("Title")}
        <div className="detail">{jobTitle}</div>
      </div>
      <div className={`${props.viewPopup ? 'col-xl-12 view-popup' : 'col-xl-5'}`}>
        {t("DepartmentManage")}
        <div className="detail">{department}</div>
      </div>
    </div>
  </div>
}

export default RequesterDetailComponent