import React from 'react'
import Constants from '../../commons/Constants'
import { useTranslation } from "react-i18next";

function ApproverDetailComponent(props) {
  const { t } = useTranslation();
    return <div className="box shadow cbnv">
    <div className="row group">
      <div className="col-xl-4 auto-height">
        {props.title}
        <div className="detail">{props.approver ? props.approver.fullName : null}</div>
      </div>
      <div className="col-xl-4 auto-height">
        {t('Position')}
        <div className="detail">{props.approver ? props.approver.current_position : null}</div>
      </div>
      <div className="col-xl-4 auto-height">
        {t('DepartmentManage')}
        <div className="detail">{props.approver ? props.approver.department : null}</div>
      </div>
      {
      props.status == Constants.STATUS_NOT_APPROVED || props.status == Constants.STATUS_NO_CONSENTED || props.status == Constants.STATUS_EVICTION ?
      <div className="col-xl-4 auto-height">
        {t('ReasonReject')}
        <div className="detail">
          <span className="hr-comments">{props.hrComment ? props.hrComment : ""}</span>
        </div>
      </div>
      : null
      }
    </div>
  </div>
}

export default ApproverDetailComponent