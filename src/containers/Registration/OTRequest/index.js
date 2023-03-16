import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import moment from "moment";
import { Form } from "react-bootstrap";
import Constants from "commons/Constants";
import "react-datepicker/dist/react-datepicker.css";
import {
  getMuleSoftHeaderConfigurations,
  getRequestConfigurations,
  getValueParamByQueryString,
} from "commons/Utils";
import AssesserComponent from "../AssesserComponent";
import SearchUserComponent from "containers/SearchUserBox/index";
import { checkFilesMimeType } from "utils/file";
import IconPlusCircle from "assets/img/icon/Icon-plus-circle.svg";
import IconRemove from "assets/img/icon-delete.svg";
import ResultModal from "../ResultModal";
import map from "containers/map.config";
const config = getRequestConfigurations();

registerLocale("vi", vi);
const timeOverviewEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/timeoverview`;

const isNullCustomize = (value) => {
  return value == null ||
    value == "null" ||
    value == "" ||
    value == undefined ||
    value == "#"
    ? true
    : false;
};

const getHoursBetween2Times = (start, end) => {
  return moment
    .duration(moment(end, "HH:mm").diff(moment(start, "HH:mm")))
    .asHours()
    .toFixed(2);
};

const OTRequestType = 13;

const checkOverlap = (timeSegments) => {
  if (timeSegments.length === 1) return false;
  timeSegments.sort((timeSegment1, timeSegment2) =>
    timeSegment1[0].localeCompare(timeSegment2[0])
  );

  for (let i = 0; i < timeSegments.length - 1; i++) {
    const currentEndTime = timeSegments[i][1];
    const nextStartTime = timeSegments[i + 1][0];

    if (currentEndTime > nextStartTime) {
      return true;
    }
  }

  return false;
};

const INIT_STATUS_MODAL_MANAGEMENT = {
  isShow: false,
  isSuccess: true,
  titleModal: "",
  messageModal: "",
};
const queryString = window.location.search;

export default function OTRequestComponent({ recentlyManagers }) {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(
    getValueParamByQueryString(queryString, "date")
  );
  const [endDate, setEndDate] = useState(
    getValueParamByQueryString(queryString, "date")
  );
  const [appraiser, setAppraiser] = useState(null);
  const [budgetApprover, setBudgetApprover] = useState(null);
  const [timeOverviewData, setTimeOverviewData] = useState([]);
  const [requestInfoData, setRequestInfoData] = useState([]);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [approvalMatrixUrl, setApprovalMatrixUrl] = useState(null);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [statusModalManagement, setStatusModalManagement] = useState(
    INIT_STATUS_MODAL_MANAGEMENT
  );
  const lang = localStorage.getItem("locale");

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
    const dayStr = moment(date, "DD-MM-YYYY").format("MM/DD/YYYY").toString();
    const d = new Date(dayStr);
    const dayName = days[d.getDay()];
    return dayName;
  };

  const searchData = async () => {
    if (startDate && endDate) {
      const muleSoftConfig = getMuleSoftHeaderConfigurations();
      muleSoftConfig["params"] = {
        from_date: moment(startDate, "DD/MM/YYYY")
          .format("YYYYMMDD")
          .toString(),
        to_date: moment(endDate, "DD/MM/YYYY").format("YYYYMMDD").toString(),
      };
      try {
        const response = await axios.get(timeOverviewEndpoint, muleSoftConfig);
        if (response?.data?.data) {
          let dataSorted = response.data.data.sort((a, b) =>
            moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") <
            moment(b.date, "DD-MM-YYYY").format("YYYYMMDD")
              ? 1
              : -1
          );
          if (dataSorted && dataSorted.length > 0) {
            const startReal = moment(
              dataSorted[dataSorted.length - 1].date,
              "DD-MM-YYYY"
            );
            const start = startReal.isAfter(moment(startDate, "DD/MM/YYYY"))
              ? startReal
              : startDate;
            const endReal = moment(dataSorted[0].date, "DD-MM-YYYY");
            const end = endReal.isBefore(moment(endDate, "DD/MM/YYYY"))
              ? endReal
              : endDate;
            setTimeOverviewData(dataSorted);
            setRequestInfoData(
              dataSorted.map((item) => ({
                ...item,
                isEdited: false,
              }))
            );
            setErrors({});
            setStartDate(start.format("DD/MM/YYYY"));
            setEndDate(end.format("DD/MM/YYYY"));
          }
        }
      } catch (error) {}
    }
  };

  const handleChangeStartDate = (date) => {
    date ? setStartDate(moment(date).format("DD/MM/YYYY")) : setStartDate(null);
  };

  const handleChangeEndDate = (date) => {
    date ? setEndDate(moment(date).format("DD/MM/YYYY")) : setEndDate(null);
  };

  const handleChangeEditRequestInfo = async (timesheet, index) => {
    const newRequestInfoData = [...requestInfoData];
    if (timesheet.isEdited) {
      newRequestInfoData[index] = {
        ...timeOverviewData[index],
        isEdited: false,
      };
    } else {
      newRequestInfoData[index].isEdited = true;
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_REQUEST_URL
          }Request/overtime-total?date=${moment(
            timesheet.date,
            "DD-MM-YYYY"
          ).format("YYYYMMDD")}`,
          config
        );
        newRequestInfoData[index].totalHoursOtInMonth = response.data?.data;
      } catch (error) {}
    }
    setRequestInfoData(newRequestInfoData);
  };

  const handleChangeRequestInfoData = (name, value, index) => {
    const newRequestInfoData = [...requestInfoData];

    if (["startTime", "endTime"].includes(name)) {
      newRequestInfoData[index] = {
        ...newRequestInfoData[index],
        [name]: moment(value).format("HH:mm"),
      };
    } else {
      newRequestInfoData[index] = {
        ...newRequestInfoData[index],
        [name]: value,
      };
    }

    setRequestInfoData(newRequestInfoData);
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

  const handleSendRequests = async () => {
    if (checkIsError()) {
      return;
    }
    setIsSendingRequest(true);
    const timesheets = [...requestInfoData]
      .filter((item) => item.isEdited)
      .map((item) => ({
        ...item,
        hours: item.hours ? parseFloat(item.hours) : null,
        date: moment(item.date, "DD-MM-YYYY").format("YYYYMMDD").toString(),
        startTime: moment(item.startTime, "HH:mm").format("HHmmss"),
        endTime: moment(item.endTime, "HH:mm").format("HHmmss"),
        overTimeType: "01",
        hoursOt: getHoursBetween2Times(item.startTime, item.endTime),
      }));

    const approver = { ...budgetApprover };
    delete approver.avatar;

    const user = {
      fullname: localStorage.getItem("fullName"),
      jobTitle: localStorage.getItem("jobTitle"),
      department: localStorage.getItem("department"),
      employeeNo: localStorage.getItem("employeeNo"),
    };

    const comments = timesheets
      .filter((item) => item.note)
      .map((item) => item.note)
      .join(" - ");

    let bodyFormData = new FormData();
    bodyFormData.append("Name", t("OTRequest"));
    bodyFormData.append("RequestTypeId", OTRequestType);
    bodyFormData.append("Comment", comments);
    bodyFormData.append("requestInfo", JSON.stringify(timesheets));
    bodyFormData.append(
      "divisionId",
      !isNullCustomize(localStorage.getItem("divisionId"))
        ? localStorage.getItem("divisionId")
        : ""
    );
    bodyFormData.append(
      "division",
      !isNullCustomize(localStorage.getItem("division"))
        ? localStorage.getItem("division")
        : ""
    );
    bodyFormData.append(
      "regionId",
      !isNullCustomize(localStorage.getItem("regionId"))
        ? localStorage.getItem("regionId")
        : ""
    );
    bodyFormData.append(
      "region",
      !isNullCustomize(localStorage.getItem("region"))
        ? localStorage.getItem("region")
        : ""
    );
    bodyFormData.append(
      "unitId",
      !isNullCustomize(localStorage.getItem("unitId"))
        ? localStorage.getItem("unitId")
        : ""
    );
    bodyFormData.append(
      "unit",
      !isNullCustomize(localStorage.getItem("unit"))
        ? localStorage.getItem("unit")
        : ""
    );
    bodyFormData.append(
      "partId",
      !isNullCustomize(localStorage.getItem("partId"))
        ? localStorage.getItem("partId")
        : ""
    );
    bodyFormData.append(
      "part",
      !isNullCustomize(localStorage.getItem("part"))
        ? localStorage.getItem("part")
        : ""
    );
    bodyFormData.append("appraiser", JSON.stringify(appraiser));
    bodyFormData.append("approver", JSON.stringify(approver));
    bodyFormData.append("user", JSON.stringify(user));
    bodyFormData.append("companyCode", localStorage.getItem("companyCode"));
    files.forEach((file) => {
      bodyFormData.append("Files", file);
    });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_REQUEST_URL}request/overtime`,
        bodyFormData,
        config
      );
      if (response.data?.result?.code !== "000000") {
        setStatusModalManagement({
          isShow: true,
          isSuccess: false,
          titleModal: t("Notification"),
          messageModal: response.data?.result?.message,
        });
      } else {
        setStatusModalManagement({
          isShow: true,
          isSuccess: true,
          titleModal: t("Successful"),
          messageModal: t("RequestSent"),
        });
      }
    } catch (error) {
      setStatusModalManagement({
        isShow: true,
        isSuccess: false,
        titleModal: t("Notification"),
        messageModal: t("Error"),
      });
    }
    setIsSendingRequest(false);
  };

  const checkIsError = () => {
    const _errors = {};
    requestInfoData.forEach((item, index) => {
      if (item.isEdited) {
        if (!item.reasonType) _errors[`reasonType_${index}`] = t("Required");
        // if (!item.overTimeType)
        //   _errors[`overTimeType_${index}`] = t("Required");
        if (!item.startTime) _errors[`startTime_${index}`] = t("Required");
        if (!item.endTime) _errors[`endTime_${index}`] = t("Required");
        if (!item.note) _errors[`note_${index}`] = t("Required");
        if (item.startTime && item.endTime) {
          if (getHoursBetween2Times(item.startTime, item.endTime) > 4) {
            _errors[`overtime_${index}`] = t("OverTimeOT");
          }
          if (getHoursBetween2Times(item.startTime, item.endTime) <= 0) {
            _errors[`invalidHour_${index}`] = t("InvalidHour");
          }
          if (
            !isNullCustomize(item.from_time1) &&
            !isNullCustomize(item.to_time1)
          ) {
            const timeSegments = [
              [
                moment(item.from_time1, "HHmmss").format("HH:mm"),
                moment(item.to_time1, "HHmmss").format("HH:mm"),
              ],
              [
                item.startTime,
                item.endTime,
              ],
            ];
            if (checkOverlap(timeSegments)) {
              _errors[`overlapTime_${index}`] = t("OverlapTimeOTWorkshift");
            }
          }
          if (
            !isNullCustomize(item.from_time2) &&
            !isNullCustomize(item.to_time1)
          ) {
            const timeSegments = [
              [
                moment(item.from_time2, "HHmmss").format("HH:mm"),
                moment(item.to_time1, "HHmmss").format("HH:mm"),
              ],
              [
                item.startTime,
                item.endTime,
              ],
            ];
            if (checkOverlap(timeSegments)) {
              _errors[`overlapTime_${index}`] = t("OverlapTimeOTWorkshift");
            }
          }
        }
      }
    });
    if (!appraiser) _errors["appraiser"] = t("Required");
    if (!budgetApprover) _errors["budgetApprover"] = t("Required");
    setErrors(_errors);
    return !!Object.keys(_errors).length;
  };

  const updateAppraiser = (value, isAppraiser) => {
    if (isAppraiser) {
      setAppraiser(value);
    }
  };

  const updateBudgetApprover = (value) => {
    setBudgetApprover(value);
  };

  const handleChangeFilesInput = (e) => {
    if (checkFilesMimeType(e, e.target.files)) {
      const filesSelected = Object.values(e.target.files);
      const fileStates = [...files, ...filesSelected];
      setFiles(fileStates);
    }
  };

  const hideStatusModal = () => {
    if (statusModalManagement.isSuccess) {
      window.location.href = `${map.Registration}?tab=OTRequest`;
    }
    setStatusModalManagement(INIT_STATUS_MODAL_MANAGEMENT);
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

  return (
    <div className="ot-request-container">
      <ResultModal
        show={statusModalManagement.isShow}
        isSuccess={statusModalManagement.isSuccess}
        title={statusModalManagement.titleModal}
        message={statusModalManagement.messageModal}
        onHide={hideStatusModal}
      />
      <div className="box shadow">
        <div className="row">
          <div className="col-4">
            <p className="title">{t("From")}</p>
            <div className="content input-container">
              <label>
                <DatePicker
                  name="startDate"
                  selectsStart
                  autoComplete="off"
                  selected={
                    startDate ? moment(startDate, "DD/MM/YYYY").toDate() : null
                  }
                  maxDate={
                    endDate ? moment(endDate, "DD/MM/YYYY").toDate() : null
                  }
                  onChange={handleChangeStartDate}
                  showDisabledMonthNavigation
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("Select")}
                  locale={"vi"}
                  shouldCloseOnSelect={true}
                  className="form-control input"
                />
                <span className="input-group-addon input-img">
                  <i className="fas fa-calendar-alt text-info"></i>
                </span>
              </label>
            </div>
          </div>

          <div className="col-4">
            <p className="title">{t("To")}</p>
            <div className="content input-container">
              <label>
                <DatePicker
                  name="endDate"
                  selectsEnd
                  autoComplete="off"
                  selected={
                    endDate ? moment(endDate, "DD/MM/YYYY").toDate() : null
                  }
                  minDate={
                    startDate ? moment(startDate, "DD/MM/YYYY").toDate() : null
                  }
                  onChange={handleChangeEndDate}
                  showDisabledMonthNavigation
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("Select")}
                  locale={"vi"}
                  className="form-control input"
                />
                <span className="input-group-addon input-img text-info">
                  <i className="fas fa-calendar-alt"></i>
                </span>
              </label>
            </div>
          </div>

          <div className="col-4">
            <p className="title">&nbsp;</p>
            <div>
              <button
                type="button"
                className="btn btn-warning btn-search-ot w-100"
                onClick={searchData}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {requestInfoData?.length > 0 &&
        requestInfoData.map((timesheet, index) => (
          <div className="box shadow pt-1 pb-1" key={timesheet.date}>
            <div className="timesheet-container">
              <p>
                <i className="fa fa-clock-o"></i>{" "}
                <b>
                  {getDayNameFromDate(timesheet.date)}&nbsp;
                  {lang === Constants.LANGUAGE_VI ? t("Day") : null}{" "}
                  {timesheet?.date?.replace(/-/g, "/")}
                </b>
              </p>
              <div
                className={timesheet.isEdited ? "cancel-btn" : "add-btn"}
                onClick={() => handleChangeEditRequestInfo(timesheet, index)}
              >
                {timesheet.isEdited ? (
                  <>
                    <img alt="cancel" src={IconRemove} />
                    &nbsp;
                    {t("CancelSearch")}
                  </>
                ) : (
                  <>
                    <img alt="addMore" src={IconPlusCircle} />
                    &nbsp;
                    {t("AddMore")}
                  </>
                )}
              </div>
            </div>
            {timesheet.isEdited && (
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
                          <div className="col-5 mr-12">
                            <div className="mb-12">{t("OTReason")}</div>
                            <Select
                              classNamePrefix="ot-reason-select"
                              options={OTReasonOptions}
                              value={OTReasonOptions.find(
                                (item) => item.value === timesheet?.reasonType
                              )}
                              onChange={(option) =>
                                handleChangeRequestInfoData(
                                  "reasonType",
                                  option.value,
                                  index
                                )
                              }
                              placeholder={t("Select")}
                            />
                            <p className="text-danger">
                              {errors[`reasonType_${index}`]}
                            </p>
                          </div>
                          <div className="form-item">
                            <div className="mb-12">{t("FromHour")}</div>
                            <DatePicker
                              selected={
                                !isNullCustomize(timesheet.startTime)
                                  ? moment(
                                      timesheet.startTime,
                                      "HH:mm"
                                    ).toDate()
                                  : null
                              }
                              onChange={(val) =>
                                handleChangeRequestInfoData(
                                  "startTime",
                                  val,
                                  index
                                )
                              }
                              autoComplete="off"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption={t("Hour")}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              format="HH:mm"
                              name="startTime"
                              className="form-control input hour-picker-input"
                              placeholderText="hh:mm"
                            />
                            <p className="text-danger">
                              {errors[`startTime_${index}`]}
                            </p>
                          </div>
                          <div className="form-item  end-time-container">
                            <div className="mb-12">{t("ToHour")}</div>
                            <DatePicker
                              selected={
                                !isNullCustomize(timesheet.endTime)
                                  ? moment(timesheet.endTime, "HH:mm").toDate()
                                  : null
                              }
                              onChange={(val) =>
                                handleChangeRequestInfoData(
                                  "endTime",
                                  val,
                                  index
                                )
                              }
                              autoComplete="off"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption={t("Hour")}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              name="endTime"
                              className="form-control input hour-picker-input"
                              placeholderText="hh:mm"
                            />
                            <p className="text-danger">
                              {errors[`endTime_${index}`]}
                            </p>
                          </div>
                        </div>
                        <p className="text-danger">
                          {errors[`overtime_${index}`]}
                        </p>
                        <p className="text-danger">
                          {errors[`invalidHour_${index}`]}
                        </p>
                        <p className="text-danger">
                          {errors[`overlapTime_${index}`]}
                        </p>
                        <div className="ot-note mb-15">{t("OTNote")}</div>
                        <div className="row mb-15">
                          <div className="col-5 mr-12">
                            <div className="form-item">
                              <div className="mb-12">{t("OTType")}</div>
                              <div className="field-view">{t("MoneyOT")}</div>
                            </div>
                          </div>
                          <div className="form-item">
                            <div className="mb-12 total-leave-time">
                              {t("TotalLeaveTime")}
                            </div>
                            <div className="field-view  hour-picker-input">
                              {timesheet.startTime &&
                              timesheet.endTime &&
                              getHoursBetween2Times(
                                timesheet.startTime,
                                timesheet.endTime
                              ) > 0
                                ? getHoursBetween2Times(
                                    timesheet.startTime,
                                    timesheet.endTime
                                  )
                                : 0}
                              &nbsp;
                              {t("HourUnit")}
                            </div>
                          </div>
                          <div className="total-in-month-container">
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
                        <div className="mb-12">{t("RegisterReason")}</div>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder={t("import")}
                          name="note"
                          maxLength={1000}
                          value={timesheet.note}
                          onChange={(e) =>
                            handleChangeRequestInfoData(
                              "note",
                              e.target?.value,
                              index
                            )
                          }
                        />
                        <p className="text-danger">{errors[`note_${index}`]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      {requestInfoData.filter((t) => t.isEdited).length > 0 && (
        <>
          <AssesserComponent
            // isEdit={t.isEdited}
            errors={errors}
            approver={budgetApprover}
            appraiser={appraiser}
            recentlyAppraiser={recentlyManagers?.appraiser}
            isShowDuplicateWarning={false}
            updateAppraiser={updateAppraiser}
          />
          <SearchUserComponent
            title={t("BudgetApprover")}
            approvalMatrixUrl={approvalMatrixUrl}
            errorText={errors["budgetApprover"]}
            updateUser={updateBudgetApprover}
          />
          <ul className="list-inline">
            {files.map((file, index) => {
              return (
                <li className="list-inline-item" key={index}>
                  <span className="file-name">
                    {file.name}{" "}
                    <i
                      className="fa fa-times remove"
                      aria-hidden="true"
                      onClick={() =>
                        setFiles(files.filter((_, idx) => idx !== index))
                      }
                    ></i>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="block-button-actions">
            <div className="block-buttons">
              <span className="btn-action btn-attachment">
                <label htmlFor="i_files" className="custom-file-upload">
                  <i className="fas fa-paperclip"></i>
                  {t("AttachFile")}
                </label>
                <input
                  id="i_files"
                  type="file"
                  name="i_files"
                  onChange={handleChangeFilesInput}
                  accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf"
                  multiple
                />
              </span>
              <button
                type="button"
                className="btn btn-primary ml-3 shadow"
                onClick={handleSendRequests}
                disabled={isSendingRequest}
              >
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                {t("Send")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
