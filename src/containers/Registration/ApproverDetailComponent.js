import React from 'react'
import Constants from '../../commons/Constants'
import { useTranslation } from "react-i18next";

function ApproverDetailComponent(props) {
  const { t } = useTranslation();
    return <div className="box shadow cbnv">
    <div className="row">
      <div className="col-4">
        {t('Approver')}
        <div className="detail">{props.approver ? props.approver.fullname : null}</div>
      </div>
      <div className="col-4">
        {t('Title')}
        <div className="detail">{props.approver ? props.approver.current_position : null}</div>
      </div>
      <div className="col-4">
        {t('DepartmentManage')}
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