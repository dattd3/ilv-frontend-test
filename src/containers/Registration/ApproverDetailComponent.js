import React from 'react'
import Constants from '../../commons/Constants'
import { useTranslation } from "react-i18next";

function ApproverDetailComponent(props) {
  const { t } = useTranslation();
  const { manager, status, hrComment, isApprover } = props

    return <div className="box shadow cbnv">
    <div className="row group">
      <div className="col-xl-4">
        {props.title}
        <div className="detail">{ manager?.fullName || "" }</div>
      </div>
      <div className="col-xl-4">
        {t('Position')}
        <div className="detail">{ manager?.current_position || "" }</div>
      </div>
      <div className="col-xl-4">
        {t('DepartmentManage')}
        <div className="detail">{ manager?.department || "" }</div>
      </div>
      {
        // Constants.STATUS_EVICTION
        (
          (isApprover && status == Constants.STATUS_NOT_APPROVED)
          || (!isApprover && status == Constants.STATUS_NO_CONSENTED)
        ) && (
          <div className="col-xl-4" style={{ marginTop: 10 }}>
            {t('ReasonReject')}
            <div className="detail">
              <span className="hr-comments">{ hrComment || "" }</span>
            </div>
          </div>
        )
      }
    </div>
  </div>
}

export default ApproverDetailComponent