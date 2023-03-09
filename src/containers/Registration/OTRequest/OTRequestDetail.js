import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Constants from "commons/Constants";
import DetailButtonComponent from "../DetailButtonComponent";

const isNullCustomize = (value) => {
  return value == null ||
    value == "null" ||
    value == "" ||
    value == undefined ||
    value == "#"
    ? true
    : false;
};
export default function OTRequestDetailComponent({ data, action }) {
  const { t } = useTranslation();
  const lang = localStorage.getItem("locale");
  console.log(action);
  const { requestInfo, user, approver, appraiser } = data;

  const getDayNameFromDate = (date) => {
    const days = [
      t("Sun"),
      t("Mon"),
      t("Tue"),
      t("Wed"),
      t("Thu"),
      t("Fri"),
      t("Sat"),
    ];
    const dayStr = moment(date, "YYYMMDD").format("MM/DD/YYYY").toString();
    const d = new Date(dayStr);
    const dayName = days[d.getDay()];
    return dayName;
  };

  const OTReasonOptions = [
    {
      value: "1",
      label: t("OTReasonOption1"),
    },
    {
      value: "2",
      label: t("OTReasonOption2"),
    },
    {
      value: "3",
      label: t("OTReasonOption3"),
    },
    {
      value: "4",
      label: t("OTReasonOption4"),
    },
    {
      value: "5",
      label: t("OTReasonOption5"),
    },
    {
      value: "6",
      label: t("OTReasonOption6"),
    },
  ];

  return (
    <div className="ot-request-container">
      <div className="ot-request-detail-container">
        <div className="block-title">
          {t("EmployeeInfomation").toUpperCase()}
        </div>
        <div className="box shadow mb-30">
          <div className="row mb-20">
            <div className="col-4">
              <div className="form-item">
                <div className="mb-12">{t("FullName")}</div>
                <div className="field-view">{user.fullName}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="form-item">
                <div className="mb-12">{t("EmployeeNo")}</div>
                <div className="field-view">{user.employeeNo}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="form-item">
                <div className="mb-12">{t("Position")}</div>
                <div className="field-view">{user.jobTitle}</div>
              </div>
            </div>
          </div>
          <div className="mb-12">{t("DepartmentManage")}</div>
          <div className="field-view">{user.department}</div>
        </div>
        <div className="block-title">{t("OTInformation").toUpperCase()}</div>
        <div className="mb-30">
          {requestInfo.map((timesheet, index) => (
            <div className="box shadow mb-15" key={index}>
              <p>
                <i className="fa fa-clock-o"></i>{" "}
                <b>
                  {getDayNameFromDate(timesheet.date)}&nbsp;
                  {lang === Constants.LANGUAGE_VI ? t("Day") : null}{" "}
                  {moment(timesheet.date, "YYYYMMDD").format("MM/DD/YYYY")}
                </b>
              </p>
              <div className="request-info-container">
                <div className="row">
                  <div className="col-4">
                    <div className="request-info-card">
                      <div className="title">{t("PlannedShift")}</div>
                      <div className="row body">
                        <div className="col-6">
                          <div className="mb-12">
                            {t("StartTime")} 1:{" "}
                            <b>
                              {!isNullCustomize(timesheet.from_time1)
                                ? moment(timesheet.from_time1, "HHmmss").format(
                                    "HH:mm:ss"
                                  )
                                : null}
                            </b>
                          </div>
                          <div>
                            {t("StartTime")} 2:{" "}
                            <b>
                              {!isNullCustomize(timesheet.from_time2)
                                ? moment(timesheet.from_time2, "HHmmss").format(
                                    "HH:mm:ss"
                                  )
                                : null}
                            </b>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-12">
                            {t("EndTime")} 1:{" "}
                            <b>
                              {!isNullCustomize(timesheet.to_time1)
                                ? moment(timesheet.to_time1, "HHmmss").format(
                                    "HH:mm:ss"
                                  )
                                : null}
                            </b>
                          </div>
                          <div>
                            {t("EndTime")} 2:{" "}
                            <b>
                              {!isNullCustomize(timesheet.to_time2)
                                ? moment(timesheet.to_time2, "HHmmss").format(
                                    "HH:mm:ss"
                                  )
                                : null}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="request-info-card">
                      <div className="title">{t("ActualTime")}</div>
                      <div className="row body">
                        <div className="col-6">
                          <div className="mb-12">
                            {t("StartTime")} 1:{" "}
                            <b>
                              {!isNullCustomize(timesheet.start_time1_fact)
                                ? moment(
                                    timesheet.start_time1_fact,
                                    "HHmmss"
                                  ).format("HH:mm:ss")
                                : null}
                            </b>
                          </div>
                          <div>
                            {t("StartTime")} 2:{" "}
                            <b>
                              {!isNullCustomize(timesheet.start_time2_fact)
                                ? moment(
                                    timesheet.start_time2_fact,
                                    "HHmmss"
                                  ).format("HH:mm:ss")
                                : null}
                            </b>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-12">
                            {t("EndTime")} 1:{" "}
                            <b>
                              {!isNullCustomize(timesheet.end_time1_fact)
                                ? moment(
                                    timesheet.end_time1_fact,
                                    "HHmmss"
                                  ).format("HH:mm:ss")
                                : null}
                            </b>
                          </div>
                          <div>
                            {t("EndTime")} 2:{" "}
                            <b>
                              {!isNullCustomize(timesheet.end_time2_fact)
                                ? moment(
                                    timesheet.end_time2_fact,
                                    "HHmmss"
                                  ).format("HH:mm:ss")
                                : null}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="request-info-card">
                      <div className="title">{t("OTRequest")}</div>
                      <div className="ot-registration-body">
                        <div className="row mb-15">
                          <div className="col-5">
                            <div className="form-item">
                              <div className="mb-12">{t("OTReason")}</div>
                              <div className="field-view">
                                {
                                  OTReasonOptions.find(
                                    (item) => item.value == timesheet.reasonType
                                  ).label
                                }
                              </div>
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="form-item">
                              <div className="mb-12">{t("FromHour")}</div>
                              <div className="field-view">
                                {moment(timesheet.startTime, "HHmmss").format(
                                  "HH:mm"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="form-item">
                              <div className="mb-12">{t("ToHour")}</div>
                              <div className="field-view">
                                {moment(timesheet.endTime, "HHmmss").format(
                                  "HH:mm"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-15">
                          <div className="col-5">
                            <div className="form-item">
                              <div className="mb-12">{t("OTType")}</div>
                              <div className="field-view">{t("MoneyOT")}</div>
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="form-item">
                              <div className="mb-12 total-leave-time">{t("TotalLeaveTime")}</div>
                              <div className="field-view">
                                {timesheet.hoursOt}&nbsp;
                                {t("HourUnit")}
                              </div>
                            </div>
                          </div>
                          <div className="col-5">
                            <div className="form-item">
                              <div className="mb-12">
                                {t("TotalTimePerMonth")}
                              </div>
                              <div className="field-view">
                                {timesheet.totalHoursOtInMonth || 0}&nbsp;
                                {t("HourUnit")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-item">
                          <div className="mb-12">{t("RegisterReason")}</div>
                          <div className="field-view">{timesheet.note}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-30">
          <div className="block-title">{t("CONSENTER").toUpperCase()}</div>
          <div className="box shadow">
            <div className="row">
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("FullName")}</div>
                  <div className="field-view">{appraiser.fullName}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("Position")}</div>
                  <div className="field-view">{appraiser.current_position}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("DepartmentManage")}</div>
                  <div className="field-view">{appraiser.department}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-30">
          <div className="block-title">{t("BudgetApprover").toUpperCase()}</div>
          <div className="box shadow">
            <div className="row">
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("FullName")}</div>
                  <div className="field-view">{approver.fullName}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("Position")}</div>
                  <div className="field-view">{approver.current_position}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("DepartmentManage")}</div>
                  <div className="field-view">{approver.department}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DetailButtonComponent
        dataToSap={[
          {
            id: data.id,
            requestTypeId: Constants.OT_REQUEST,
            sub: [
              {
                id: data.id,
              },
            ],
          },
        ]} //this.dataToSap()
        id={data.id}
        isShowApproval={data.processStatusId === Constants.STATUS_WAITING}
        isShowRevocationOfApproval={false}
        isShowConsent={
          data.processStatusId === Constants.STATUS_WAITING_CONSENTED
        }
        isShowRevocationOfConsent={false}
        urlName={"otrequest"}
        requestTypeId={data.requestTypeId}
        action={action}
      />
    </div>
  );
}
