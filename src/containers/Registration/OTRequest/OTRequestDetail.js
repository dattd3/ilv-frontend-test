import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import axios from "axios";
import Constants from "commons/Constants";
import DetailButtonComponent from "../DetailButtonComponent";
import { formatProcessTime, getRequestConfigurations } from "commons/Utils";
import ExcelIcon from "assets/img/excel-icon.svg";
import { getOperationType } from "containers/Utils/Common";
import { Button } from "react-bootstrap";
import NoteModal from "./NoteModal";
import IconClock from 'assets/img/icon/ic_clock.svg'

const config = getRequestConfigurations();

const isNullCustomize = (value) => {
  return value == null ||
    value == "null" ||
    value == "" ||
    value == undefined ||
    value == "#"
    ? true
    : false;
};
const OTRequestType = 13;

export default function OTRequestDetailComponent({ data, action, lockReload, onHideTaskDetailModal }) {
  const { t } = useTranslation();
  const [approvalMatrixUrl, setApprovalMatrixUrl] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const lang = localStorage.getItem("locale");
  const { requestInfo, user, approver, appraiser, createDate, assessedDate, approvedDate, deletedDate, appraiserComment, approverComment } = data;

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_REQUEST_URL}user/file-suggests?type=${OTRequestType}`,
        config
      )
      .then((response) => setApprovalMatrixUrl(response.data?.data))
      .catch((err) => console.log(err));
  }, []);

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
    const dayStr = moment(date, "YYYYMMDD").format("MM/DD/YYYY").toString();
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
      value: "Z",
      label: t("OTReasonOption6"),
    },
  ];

  const showStatus = (status, appraiser) => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split("/");
    const getTypeDetail = pathNameArr[pathNameArr.length - 1];
    if (getTypeDetail == "request" && action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    }
    return action == "consent" && status == 5 && appraiser
      ? Constants.mappingStatusRequest[20].label
      : Constants.mappingStatusRequest[status].label;
  };

  const getMessageFromSap = () => {
    const mergedMessageObjArr = [];
    if (data.processStatusId === Constants.STATUS_PARTIALLY_SUCCESSFUL) {
      if (data.responseDataFromSAP && Array.isArray(data.responseDataFromSAP)) {
        const _data = data.responseDataFromSAP.filter(
          (val) => val.STATUS === "E"
        );
        if (_data) {
          const messageSAPArr = _data.map((val) => ({
            date: moment(val?.DATA?.split("|")?.[1], "YYYYMMDD").format(
              "DD/MM/YYYY"
            ),
            message: val?.MESSAGE,
          }));
          const messageSetArr = Array.from(
            new Set(messageSAPArr.map((item) => item.message))
          );
          messageSetArr.forEach((item) => {
            const datesStr = messageSAPArr
              .filter((messObj) => messObj.message === item)
              ?.map((i) => i.date)
              ?.join(", ");
            mergedMessageObjArr.push({
              datesStr,
              message: item,
            });
          });
        }
      }
    }
    return mergedMessageObjArr;
  };

  const isHasTime1 = (timesheet) => {
    return (
      !isNullCustomize(timesheet.from_time1) &&
      !isNullCustomize(timesheet.to_time1)
    );
  };

  const isHasTime2 = (timesheet) => {
    return (
      !isNullCustomize(timesheet.from_time2) &&
      !isNullCustomize(timesheet.to_time2)
    );
  };
  const operationType = getOperationType(data.requestTypeId, data.updateField, data.processStatusId)

  return (
    <div className="ot-request-container">
      <NoteModal show={showNoteModal} onHide={() => setShowNoteModal(false)} />
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
              <p className="d-flex align-items-center">
                <img src={IconClock} alt="Clock" className="ic-clock" />
                <b style={{ marginLeft: 5 }}>
                  {getDayNameFromDate(timesheet.date)}&nbsp;
                  {lang === Constants.LANGUAGE_VI ? t("Day") : null}{" "}
                  {moment(timesheet.date, "YYYYMMDD").format("DD/MM/YYYY")}
                </b>
              </p>
              <div className="request-info-container">
                <div className="row">
                  <div className="col-4">
                    <div className="request-info-card">
                      <div className="title">{t("PlannedShift")}</div>
                      <div className="row body">
                        <div className="col-6">
                          {isHasTime1(timesheet) && (
                            <div className="mb-12">
                              {t("StartTime")} 1:{" "}
                              <b>
                                {!isNullCustomize(timesheet.from_time1)
                                  ? moment(
                                      timesheet.from_time1,
                                      "HHmmss"
                                    ).format("HH:mm:ss")
                                  : null}
                              </b>
                            </div>
                          )}
                          {isHasTime2(timesheet) && (
                            <div>
                              {t("StartTime")} 2:{" "}
                              <b>
                                {!isNullCustomize(timesheet.from_time2)
                                  ? moment(
                                      timesheet.from_time2,
                                      "HHmmss"
                                    ).format("HH:mm:ss")
                                  : null}
                              </b>
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          {isHasTime1(timesheet) && (
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
                          )}
                          {isHasTime2(timesheet) && (
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
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="request-info-card">
                      <div className="title">{t("ActualTime")}</div>
                      <div className="row body">
                        <div className="col-6">
                          {isHasTime1(timesheet) && (
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
                          )}
                          {isHasTime2(timesheet) && (
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
                          )}
                        </div>
                        <div className="col-6">
                          {isHasTime1(timesheet) && (
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
                          )}
                          {isHasTime2(timesheet) && (
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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="request-info-card">
                      <div className="title">{t("OTRequest")}</div>
                      <div className="ot-registration-body">
                        <div className="row mb-15">
                          {timesheet?.startTime
                            ?.split(",")
                            ?.map((time, timeIndex) => (
                              <React.Fragment key={timeIndex}>
                                <div className="col-5 mb-12">
                                  {timeIndex === 0 && (
                                    <div className="form-item">
                                      <div className="mb-12">
                                        {t("OTReason")}
                                      </div>
                                      <div className="field-view">
                                        {
                                          OTReasonOptions.find(
                                            (item) =>
                                              item.value == timesheet.reasonType
                                          )?.label
                                        }
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="col-2 mb-12">
                                  <div className="form-item">
                                    {
                                      timeIndex === 0 &&  <div className="mb-12">{t("FromHour")}</div>
                                    }
                                    <div className="field-view">
                                      {moment(time, "HHmmss").format("HH:mm")}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-2 mb-12">
                                  <div className="form-item">
                                    {
                                      timeIndex === 0 &&  <div className="mb-12">{t("ToHour")}</div>
                                    }
                                    <div className="field-view">
                                      {moment(
                                        timesheet?.endTime?.split(",")[
                                          timeIndex
                                        ],
                                        "HHmmss"
                                      ).format("HH:mm")}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-5 mb-12" />
                                  <div className="col-6  mb-12">
                                    <div className="prev-day-container">
                                      <input
                                        type="checkbox"
                                        disabled checked={!!timesheet?.VtKen?.split(",")[
                                          timeIndex
                                      ]}
                                      />
                                      &nbsp;
                                      <label>
                                        {t("PrevDay")}
                                      </label>{" "}
                                      {timeIndex === 0 && (
                                        <Button
                                          className="information-btn"
                                          onClick={() => setShowNoteModal(true)}
                                        >
                                          <i className="fas fa-info" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                {/* <div className="col-3">
                                  <div className="form-item">
                                    {
                                      timeIndex === 0 &&  <div className="mb-12" style={{textAlign: "center"}}>{t("PrevDay")}</div>
                                    }
                                    <div style={{marginTop: timeIndex === 0 ? 25 : 15, textAlign: "center"}}>
                                      <input type="checkbox" disabled checked={!!timesheet?.VtKen?.split(",")[
                                          timeIndex
                                      ]} />
                                    </div>
                                  </div>
                                </div> */}
                              </React.Fragment>
                            ))}
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
                              <div className="mb-12 total-leave-time">
                                {t("TotalLeaveTime")}
                              </div>
                              <div className="field-view">
                                {timesheet.hoursOt}&nbsp;
                                {t("HourUnit")}
                              </div>
                            </div>
                          </div>
                          <div className="col-5">
                            <div className="form-item">
                              <div className="mb-12 total-leave-time">
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
              {
                appraiserComment && data.processStatusId == Constants.STATUS_NO_CONSENTED && 
                  <div className="col-12">
                      <p className="title">{t('reason_reject')}</p>
                      <div>
                          <div className="detail">{appraiserComment}</div>
                      </div>
                  </div>
              }
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
              {
                approverComment && data.processStatusId == Constants.STATUS_NOT_APPROVED &&
                  <div className="col-12">
                      <p className="title">{t('reason_reject')}</p>
                      <div>
                          <div className="detail">{approverComment}</div>
                      </div>
                  </div>
              }
              <div className="col-12">
                {approvalMatrixUrl && (
                  <div className="row business-type">
                    <span className="col-12 text-info smaller font-14">
                      * {t("NoteSelectApprover")}{" "}
                      <b>
                        <a href={approvalMatrixUrl} target="_blank">
                          {t("ApprovalMatrix")}
                        </a>
                      </b>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-30">
          <div className="block-title">{t("RequestHistory").toUpperCase()}</div>
          <div className="box shadow">
            <div className="row" style={{ rowGap: 20 }}>
              <div className="col-4">
                <div className="form-item">
                  <div className="mb-12">{t("operation")}</div>
                  <div className="field-view">{t(`operationType.${operationType?.toLowerCase()}`)}</div>
                </div>
              </div>
              {
                formatProcessTime(createDate) && <div className="col-4">
                  <div className="form-item">
                    <div className="mb-12">{t("TimeToSendRequest")}</div>
                    <div className="field-view">{formatProcessTime(createDate)}</div>
                  </div>
                </div>
              }
              {
                formatProcessTime(assessedDate) && <div className="col-4">
                  <div className="form-item">
                    <div className="mb-12">{t("ConsentDate")}</div>
                    <div className="field-view">{formatProcessTime(assessedDate)}</div>
                  </div>
                </div>
              }
              {
                formatProcessTime(approvedDate) && <div className="col-4">
                  <div className="form-item">
                    <div className="mb-12">{t("ApprovalDate")}</div>
                    <div className="field-view">{formatProcessTime(approvedDate)}</div>
                  </div>
                </div>
              }
              {
                formatProcessTime(deletedDate) && <div className="col-4">
                  <div className="form-item">
                    <div className="mb-12">{t("CancelDate")}</div>
                    <div className="field-view">{formatProcessTime(deletedDate)}</div>
                  </div>
                </div>
              }
              </div>
          </div>
        </div>
      </div>
      {data.requestDocuments.length > 0 ? (
        <>
          <div className="block-title">{t("Evidence").toUpperCase()}</div>
          <ul className="list-inline">
            {data.requestDocuments.map((file, index) => {
              return (
                <li className="list-inline-item" key={index}>
                  <a
                    className="file-name"
                    href={file.fileUrl}
                    title={file.fileName}
                    target="_blank"
                    download={file.fileName}
                  >
                    {file.fileType == "xls" ? (
                      <img
                        src={ExcelIcon}
                        className="mr-1 mb-1"
                        alt="excel-icon"
                      />
                    ) : null}
                    {file.fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      <div className="block-status">
        <span
          className={`status ${
            Constants.mappingStatusRequest[data.processStatusId].className
          }`}
        >
          {t(showStatus(data.processStatusId, data.appraiser))}
        </span>
        {
          data.processStatusId == Constants.STATUS_REVOCATION && data.comment && <span
            className="status"
          >
            {data.comment}
          </span>
        }
        {getMessageFromSap().length > 0 && (
          <div className={`d-flex status fail`}>
            <i className="fas fa-times pr-2 text-danger align-self-center"></i>
            <div>
              {getMessageFromSap().map((item, index) => {
                return (
                  <div key={index}>
                    {item.datesStr}: {item.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
        isShowApproval={
          data.processStatusId === Constants.STATUS_WAITING ||
          data.processStatusId === Constants.STATUS_PARTIALLY_SUCCESSFUL
        }
        isShowRevocationOfApproval={false}
        isShowConsent={
          data.processStatusId === Constants.STATUS_WAITING_CONSENTED
        }
        isShowRevocationOfConsent={false}
        isShowReject={operationType !== Constants.OPERATION_TYPES.DEL}
        urlName={"otrequest"}
        requestTypeId={data.requestTypeId}
        action={action}
        haveOverOTFund={data?.requestInfo?.some((item) => item.isOverOTFund)}
        operationType={operationType}
        lockReload={lockReload}
        onHideTaskDetailModal={onHideTaskDetailModal}
      />
    </div>
  );
}
