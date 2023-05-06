import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

const formatProcessTime = (time) => {
  if (time === "0001-01-01T00:00:00" || !time) return ""
  return `${moment(time).format("DD/MM/YYYY")} | ${moment(time).format("HH:mm:ss")}`
}


export default function ProcessHistoryComponent(props) {
  const { t } = useTranslation();

  const { createdDate, coordinatorDate, requestAppraisers, approvedDate } =
    props;
  
  const lastConsenter =  requestAppraisers?.filter(item => item.type === 0)?.toReversed()?.find(item => !!formatProcessTime(item.appraisalDate))
  const HRconsenter =  requestAppraisers?.filter(item => item.type === 1)?.[0];

  return (
    <div className="row" style={{ rowGap: 18 }}>
      <div className="col-4">
        <p className="title2">{t("TimeToSendRequest")}</p>
        <input type="text" className="form-control" value={formatProcessTime(createdDate)} readOnly />
      </div>
      <div className="col-4">
        <p className="title2">{t("SupportHRViewedSalaryDate")}</p>
        <input type="text" className="form-control" value={formatProcessTime(coordinatorDate)} readOnly />
      </div>
      {
        lastConsenter && <div className="col-4" key={lastConsenter.appraiserId}>
          <p className="title2">{`${t("ConsentDate")}`}</p>
          <input type="text" className="form-control" value={formatProcessTime(lastConsenter.appraisalDate)} readOnly />
        </div>
      }
      {
        HRconsenter && <div className="col-4">
        <p className="title2">{`${t("HRAppraiseDate")}`}</p>
        <input type="text" className="form-control" value={formatProcessTime(HRconsenter.appraisalDate)} readOnly />
      </div>
      }
      <div className="col-4">
        <p className="title2">{t("ApprovalDate")}</p>
        <input type="text" className="form-control" value={formatProcessTime(approvedDate)} readOnly />
      </div>
    </div>
  );
}
