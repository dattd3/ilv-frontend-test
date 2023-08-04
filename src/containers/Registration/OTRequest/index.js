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
  prepareOrganization,
} from "commons/Utils";
import AssesserComponent from "../AssesserComponent";
import SearchUserComponent from "containers/SearchUserBox/index";
import { validateFileMimeType, validateTotalFileSize } from "utils/file";
import IconPlusCircle from "assets/img/icon/Icon-plus-circle.svg";
import IconRemove from "assets/img/icon-delete.svg";
import ResultModal from "../ResultModal";
import map from "containers/map.config";
import ConfirmModal from "components/Common/ConfirmModalNew";
import LoadingModal from "components/Common/LoadingModal";
import IconPlus from "assets/img/ic-add-green.svg";
import IconCancel from "assets/img/icon/ic_x_red.svg";
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconClock from 'assets/img/icon/ic_clock.svg'
import { Button } from "react-bootstrap";
import NoteModal from "./NoteModal";

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

const getHoursBetween2Times = (start, end, isOvernight) => {
  if (!start || !end) return 0;
  const endTime = isOvernight ? moment(end).add(1, "day") : end;
  return moment
    .duration(moment(endTime, "HH:mm").diff(moment(start, "HH:mm")))
    .asHours()
    .toFixed(2);
};

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

const OTRequestType = 13;
const INIT_STATUS_MODAL_MANAGEMENT = {
  isShow: false,
  isSuccess: true,
  titleModal: "",
  messageModal: "",
};
const MAX_OT_HOURS = 4;
const MAX_OT_HOURS_OFF_DAY = 12;
const MAX_OT_HOURS_MONTH = 40;

const queryString = window.location.search;

const checkIsHolidayOrOffOfCompany = (shiftId, isHoliday, companyCode) => {
  return (
    shiftId.toUpperCase() === "OFF" ||
    (companyCode != Constants.COMPANY_CODE_VINMEC && isHoliday == "1")
  );
};

const CONFIRM_TYPES = {
  OVER_OT: "WarningOverOT",
  OVER_OT_FUNDS: "WarningOverOTFunds",
};

const DEFAULT_CONFIRM_MODAL = {
  show: false,
  message: null,
};

const DEFAULT_TIME_REGISTER_RANGE = {
  startTime: null,
  endTime: null,
};

const getTotalHoursOtInRanges = (ranges = []) => {
  return ranges
    .reduce(
      (accumulator, currentValue) =>
        accumulator * 1 +
        getHoursBetween2Times(
          currentValue.startTime,
          currentValue.endTime,
          currentValue.isOvernight
        ) *
          1,
      0
    )
    ?.toFixed(2);
};

const VFSX_LV3_ORG = "45005034";

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
  const [confirmModal, setConfirmModal] = useState(DEFAULT_CONFIRM_MODAL);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const lang = localStorage.getItem("locale");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_REQUEST_URL}user/file-suggests?type=${OTRequestType}`,
        config
      )
      .then((response) => setApprovalMatrixUrl(response.data?.data))
      .catch((err) => console.log(err));
    loadDefaultAppraiser();
  }, []);

  const loadDefaultAppraiser = async () => {
    try {
      const config = getMuleSoftHeaderConfigurations();
      const response = await axios.get(
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/manager`,
        config
      );
      if (response && response.data) {
        const result = response.data.result;
        if (result && result.code == Constants.API_SUCCESS_CODE) {
          const data = response.data?.data[0];
          setAppraiser({
            value: data?.userid?.toLowerCase() || "",
            label: data?.fullname || "",
            fullName: data?.fullname || "",
            avatar: data?.avatar || "",
            employeeLevel: data?.rank_title,
            pnl: "",
            orglv2Id: "",
            account: data?.userid?.toLowerCase() || "",
            current_position: data?.title || "",
            department: prepareOrganization(
              data?.division,
              data?.department,
              data?.unit,
              data?.part
            ),
          });
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

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

  const addTimeRange = (dayIndex) => {
    setRequestInfoData(
      requestInfoData.map((item, index) => {
        return index === dayIndex
          ? {
              ...item,
              timeRanges: [...item.timeRanges, DEFAULT_TIME_REGISTER_RANGE],
            }
          : item;
      })
    );
  };

  const deleteTimeRange = (dayIndex, rangeIndex) => {
    if (requestInfoData?.[dayIndex]) {
      setRequestInfoData(
        requestInfoData.map((item, index) => {
          return index === dayIndex
            ? {
                ...item,
                timeRanges: item.timeRanges.filter((_, i) => i !== rangeIndex),
              }
            : item;
        })
      );
    }
    if (Object.keys(errors).length) {
      const newErrorKeys = Object.keys(errors).filter((key) => {
        const keyArr = key.split("_");
        return !(
          keyArr.length > 1 &&
          key.startsWith("range_") &&
          keyArr[keyArr.length - 1] * 1 === rangeIndex &&
          keyArr[keyArr.length - 2] * 1 === dayIndex
        );
      });
      const newErrors = {};
      newErrorKeys.forEach((k) => (newErrors[k] = errors[k]));
      setErrors(newErrors);
    }
  };

  const handleChangeTimeValue = (
    dayIndex,
    rangeIndex,
    value,
    field = "startTime"
  ) => {
    if (requestInfoData?.[dayIndex]) {
      const newRanges = requestInfoData?.[dayIndex].timeRanges?.map((item, i) =>
        i === rangeIndex
          ? {
              ...requestInfoData?.[dayIndex]?.timeRanges?.[rangeIndex],
              [field]: value,
            }
          : item
      );
      if (newRanges[rangeIndex]?.startTime && newRanges[rangeIndex]?.endTime) {
        newRanges[rangeIndex].isOvernight =
          newRanges[rangeIndex]?.endTime?.getTime() <
          newRanges[rangeIndex]?.startTime?.getTime();
      }
      setRequestInfoData(
        requestInfoData.map((item, index) => {
          return index === dayIndex
            ? {
                ...item,
                hoursOt: getTotalHoursOtInRanges(newRanges),
                timeRanges: newRanges,
              }
            : item;
        })
      );
    }
  };

  const handleChangeIsPrevDayIndicator = (dayIndex, rangeIndex, value) => {
    if (requestInfoData?.[dayIndex]) {
      const newRanges = requestInfoData?.[dayIndex].timeRanges?.map((item, i) =>
        i === rangeIndex
          ? {
              ...requestInfoData?.[dayIndex]?.timeRanges?.[rangeIndex],
              isPrevDayIndicator: value,
            }
          : item
      );
      setRequestInfoData(
        requestInfoData.map((item, index) => {
          return index === dayIndex
            ? {
                ...item,
                timeRanges: newRanges,
              }
            : item;
        })
      );
    }
  };

  const searchData = async () => {
    if (startDate && endDate) {
      setIsSendingRequest(true)
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
          const dataSorted = response.data.data.sort((a, b) =>
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
                timeRanges: [DEFAULT_TIME_REGISTER_RANGE],
                isEdited: false,
              }))
            );
            setErrors({});
            setStartDate(start.format("DD/MM/YYYY"));
            setEndDate(end.format("DD/MM/YYYY"));
          }
        }
      } catch (error) {}
      finally {
        setIsSendingRequest(false)
      }
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
        timeRanges: [DEFAULT_TIME_REGISTER_RANGE],
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
        newRequestInfoData[index].totalHoursOtInMonth =
          response.data?.data?.totalOtMonth || 0;
        newRequestInfoData[index].totalHoursOtInDay =
          response.data?.data?.totalOtDay || 0;
        newRequestInfoData[index].monthSalary =
          response.data?.data?.monthSalary;
      } catch (error) {}
    }
    setRequestInfoData(newRequestInfoData);
  };

  const handleChangeRequestInfoData = (name, value, index) => {
    const newRequestInfoData = [...requestInfoData];
    newRequestInfoData[index] = {
      ...newRequestInfoData[index],
      [name]: value,
    };

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

  const handleSendButtonClick = () => {
    if (checkIsError()) {
      return;
    }
    const haveDayOverOt = [...requestInfoData]
      .filter((item) => item.isEdited)
      .some((item) => {
        const totalRegisterInMonth = [...requestInfoData]
          .filter(
            (_item) =>
              _item.isEdited &&
              item.monthSalary &&
              _item.monthSalary === item.monthSalary
          )
          .reduce((acc, currValue) => acc + currValue.hoursOt * 1, 0);
        const isOverOTNormalDay =
          item?.shift_id !== "OFF" &&
          item.hoursOt + item.totalHoursOtInDay > MAX_OT_HOURS;
        const isOverOTOffDay =
          checkIsHolidayOrOffOfCompany(
            item?.shift_id,
            item.is_holiday,
            localStorage.getItem("companyCode")
          ) && item.hoursOt + item.totalHoursOtInDay > MAX_OT_HOURS_OFF_DAY;
        const isOverOTInMonth =
          totalRegisterInMonth + item.totalHoursOtInMonth > MAX_OT_HOURS_MONTH;

        return isOverOTNormalDay || isOverOTOffDay || isOverOTInMonth;
      });
    if (haveDayOverOt) {
      return setConfirmModal({
        show: true,
        message: CONFIRM_TYPES.OVER_OT,
      });
    }
    sendRequest();
  };

  const sendRequest = async (ignoreCheckOTFund = false) => {
    // setDaysOverOT([]);
    setIsSendingRequest(true);
    let requestData = [...requestInfoData];
    if (!ignoreCheckOTFund) {
      try {
        const otFundResponse = await axios.get(
          `${process.env.REACT_APP_REQUEST_URL}otuploads/funds/list`,
          {
            ...config,
            params: {
              orgLvId: localStorage.getItem("organizationLvId"),
              rank: localStorage.getItem("actualRank"),
            },
          }
        );
        const otFunds = otFundResponse?.data?.data;

        requestData = requestData.map((item) => {
          if (item.isEdited) {
            const otFund = otFunds.find(
              (fundItem) =>
                fundItem.monthSalary * 1 ===
                  item.monthSalary.substring(4, 6) * 1 &&
                fundItem.yearsSalary === item.monthSalary.substring(0, 4)
            );
            if (otFund?.hours) {
              const totalRegisterInMonth = [...requestInfoData]
                .filter(
                  (_item) =>
                    _item.isEdited &&
                    item.monthSalary &&
                    _item.monthSalary === item.monthSalary
                )
                .reduce((acc, currValue) => acc + currValue.hoursOt * 1, 0);
              return {
                ...item,
                isOverOTFund:
                  totalRegisterInMonth + item.totalHoursOtInMonth >
                  otFund.hours * 1,
              };
            }
          }
          return item;
        });
        setRequestInfoData(requestData);

        if (requestData.some((item) => item.isOverOTFund)) {
          setIsSendingRequest(false);
          return setConfirmModal({
            show: true,
            message: CONFIRM_TYPES.OVER_OT_FUNDS,
          });
        }
      } catch (error) {}
    }
    setConfirmModal(DEFAULT_CONFIRM_MODAL);
    const timesheets = [...requestData]
      .filter((item) => item.isEdited)
      .map((item) => ({
        ...item,
        timeRanges: undefined,
        hours: item.hours ? parseFloat(item.hours) : null,
        date: moment(item.date, "DD-MM-YYYY").format("YYYYMMDD").toString(),
        startTime: item.timeRanges
          ?.map((range) => moment(range.startTime).format("HHmmss"))
          ?.join(","),
        endTime: item.timeRanges
          ?.map((range) => moment(range.endTime).format("HHmmss"))
          ?.join(","),
        VtKen: item.timeRanges
          ?.map((range) => (range.isPrevDayIndicator ? "X" : ""))
          ?.join(","),
        overTimeType: "01",
      }));

    const approver = { ...budgetApprover };
    delete approver.avatar;

    const user = {
      fullname: localStorage.getItem("fullName"),
      jobTitle: localStorage.getItem("jobTitle"),
      department: localStorage.getItem("department"),
      employeeNo: localStorage.getItem("employeeNo"),
    };

    const bodyFormData = new FormData();
    bodyFormData.append("Name", t("OTRequest"));
    bodyFormData.append("RequestTypeId", OTRequestType);
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
    bodyFormData.append(
      "appraiser",
      JSON.stringify({
        ...appraiser,
        avatar: "",
      })
    );
    bodyFormData.append(
      "approver",
      JSON.stringify({
        ...approver,
        avatar: "",
      })
    );
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
        const currOrgLv3 = localStorage.getItem("organizationLv3");
        if (!item.reasonType) _errors[`reasonType_${index}`] = t("Required");
        if (!item.note) _errors[`note_${index}`] = t("Required");
        if (item.hoursOt <= 0) {
          _errors[`invalidHour_${index}`] = t("InvalidHour");
        }
        if (!appraiser) _errors["appraiser"] = t("Required");
        if (!budgetApprover) _errors["budgetApprover"] = t("Required");
        // eslint-disable-next-line no-unused-expressions
        item.timeRanges?.forEach((range, rangeIndex) => {
          const { startTime, endTime, isOvernight, isPrevDayIndicator } = range;
          if (!startTime)
            _errors[`range_startTime_${index}_${rangeIndex}`] = t("Required");
          if (!endTime)
            _errors[`range_endTime_${index}_${rangeIndex}`] = t("Required");
          if (startTime && endTime) {
            if (getHoursBetween2Times(startTime, endTime, isOvernight) <= 0) {
              _errors[`invalidHour_${index}_${rangeIndex}`] = t("InvalidHour");
            }
            if (
              currOrgLv3 === VFSX_LV3_ORG &&
              getHoursBetween2Times(startTime, endTime, isOvernight) < 0.5
            ) {
              _errors[`range_minimum_hours_${index}_${rangeIndex}`] =
                t("OTMinimumHours");
            } else if (
              currOrgLv3 !== VFSX_LV3_ORG &&
              getHoursBetween2Times(startTime, endTime, isOvernight) < 1
            ) {
              _errors[`range_minimum_hours_${index}_${rangeIndex}`] =
                t("OTMinimumHours");
            }
            // Check not overlap 1h each other item range
            for (let i = rangeIndex + 1; i < item.timeRanges?.length; i++) {
              const nextTime = item.timeRanges[i];
              if (!isPrevDayIndicator && !nextTime.isPrevDayIndicator) {
                if (
                  i === item.timeRanges ||
                  !nextTime.startTime ||
                  !nextTime.endTime
                )
                  break;
                const nextTimeIsAfter = moment(
                  item.timeRanges[i].startTime
                ).isAfter(range.endTime);

                if (
                  Math.abs(
                    getHoursBetween2Times(
                      nextTimeIsAfter ? range.endTime : range.startTime,
                      nextTimeIsAfter ? nextTime.startTime : nextTime.endTime,
                      false
                    )
                  ) < 0.75
                ) {
                  _errors[`range_space_hours_${index}_${i}`] = t(
                    "OTInvalidSpaceHours"
                  );
                }

                const timeSegments = [
                  [
                    moment(startTime).format("HH:mm"),
                    moment(endTime).format("HH:mm"),
                  ],
                  [
                    moment(item.timeRanges[i]?.startTime).format("HH:mm"),
                    moment(item.timeRanges[i]?.endTime).format("HH:mm"),
                  ],
                ];
                if (checkOverlap(timeSegments)) {
                  _errors[`range_overlapTime_${index}_${i}`] =
                    t("OTOverlapEachOther");
                }
              }
            }
          }
          if (
            !isNullCustomize(item.from_time1) &&
            !isNullCustomize(item.to_time1) &&
            !isPrevDayIndicator
          ) {
            const timeSegments = [
              [
                moment(item.from_time1, "HHmmss").format("HH:mm"),
                moment(item.to_time1, "HHmmss").format("HH:mm"),
              ],
              [
                moment(startTime).format("HH:mm"),
                moment(endTime).format("HH:mm"),
              ],
            ];
            if (item.is_holiday != 1 && checkOverlap(timeSegments)) {
              _errors[`range_overlapTime_${index}_${rangeIndex}`] = t(
                "OverlapTimeOTWorkshift"
              );
            }
          }
          if (
            !isNullCustomize(item.from_time2) &&
            !isNullCustomize(item.to_time2) &&
            !isPrevDayIndicator
          ) {
            const timeSegments = [
              [
                moment(item.from_time2, "HHmmss").format("HH:mm"),
                moment(item.to_time2, "HHmmss").format("HH:mm"),
              ],
              [
                moment(startTime).format("HH:mm"),
                moment(endTime).format("HH:mm"),
              ],
            ];
            if (item.is_holiday != 1 && checkOverlap(timeSegments)) {
              _errors[`range_overlapTime_${index}_${rangeIndex}`] = t(
                "OverlapTimeOTWorkshift"
              );
            }
          }
        });
      }
    });
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
    if (validateFileMimeType(e, e.target.files, t)) {
      const filesSelected = Object.values(e.target.files);
      const fileStates = [...files, ...filesSelected];
      if (validateTotalFileSize(e, fileStates, t)) {
        setFiles(fileStates);
      }
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

  const hideConfirmModal = () => {
    setConfirmModal(DEFAULT_CONFIRM_MODAL);
    // setDaysOverOT([]);
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
      <ConfirmModal
        show={confirmModal?.show}
        confirmHeader={t("ConfirmSend")}
        confirmContent={t(confirmModal?.message)}
        onHide={hideConfirmModal}
        onCancelClick={hideConfirmModal}
        onAcceptClick={() =>
          sendRequest(confirmModal?.message === CONFIRM_TYPES.OVER_OT_FUNDS)
        }
        tempButtonLabel={t("Cancel")}
        mainButtonLabel={t("Confirm")}
      />
      <NoteModal show={showNoteModal} onHide={() => setShowNoteModal(false)} />
      <LoadingModal show={isSendingRequest} />
      <div className="box shadow">
        <div className="row search-form">
          <div className="col-4">
            <p className="title">{t("From")}</p>
            <div className="content input-container">
              <label className="wrap-date-input">
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
                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
              </label>
            </div>
          </div>

          <div className="col-4">
            <p className="title">{t("To")}</p>
            <div className="content input-container">
              <label className="wrap-date-input">
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
                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
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
              <p className="d-inline-flex">
                <img src={IconClock} className="ic-clock" />
                <b style={{ marginLeft: 5 }}>
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
                        <div className="ot-note">{t("OTNote")}</div>
                        {timesheet?.timeRanges?.map((range, rangeIndex) => (
                          <div className="row mb-30" key={rangeIndex}>
                            <div className="col-6">
                              {rangeIndex === 0 && (
                                <>
                                  <div className="mb-12">{t("OTReason")}</div>
                                  <Select
                                    classNamePrefix="ot-reason-select"
                                    options={OTReasonOptions}
                                    value={OTReasonOptions.find(
                                      (item) =>
                                        item.value === timesheet?.reasonType
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
                                </>
                              )}
                            </div>
                            {/* <div className="time-registration-container"> */}
                            <div className="col-2 form-item padding-left-0">
                              {rangeIndex === 0 && (
                                <div className="mb-12">{t("FromHour")}</div>
                              )}
                              <DatePicker
                                selected={
                                  !isNullCustomize(range.startTime)
                                    ? moment(range.startTime, "HH:mm").toDate()
                                    : null
                                }
                                onChange={(val) =>
                                  handleChangeTimeValue(
                                    index,
                                    rangeIndex,
                                    val,
                                    "startTime"
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
                              {errors[
                                `range_startTime_${index}_${rangeIndex}`
                              ] && (
                                <p className="text-danger">
                                  {
                                    errors[
                                      `range_startTime_${index}_${rangeIndex}`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div className="col-2 form-item padding-left-0">
                              {rangeIndex === 0 && (
                                <div className="mb-12">{t("ToHour")}</div>
                              )}
                              <DatePicker
                                selected={
                                  !isNullCustomize(range.endTime)
                                    ? moment(range.endTime, "HH:mm").toDate()
                                    : null
                                }
                                onChange={(val) =>
                                  handleChangeTimeValue(
                                    index,
                                    rangeIndex,
                                    val,
                                    "endTime"
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
                              {errors[
                                `range_endTime_${index}_${rangeIndex}`
                              ] && (
                                <p className="text-danger">
                                  {
                                    errors[
                                      `range_endTime_${index}_${rangeIndex}`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                            <div className="col-2 padding-left-0">
                              {timesheet?.timeRanges?.length === 1 ? (
                                <button
                                  className="add-time-block-btn"
                                  onClick={() => addTimeRange(index)}
                                >
                                  <img alt="addMore" src={IconPlus} />
                                  &nbsp;
                                  {t("AddMore")}
                                </button>
                              ) : (
                                <div
                                  style={{
                                    marginTop: rangeIndex === 0 ? 29 : 0,
                                  }}
                                >
                                  <button
                                    className="action-time-range-btn cancel-time-range-btn"
                                    onClick={() =>
                                      deleteTimeRange(index, rangeIndex)
                                    }
                                  >
                                    <img alt="addMore" src={IconCancel} />
                                  </button>
                                  <button
                                    className="action-time-range-btn"
                                    disabled={
                                      rangeIndex !==
                                      timesheet?.timeRanges?.length - 1
                                    }
                                    onClick={() => addTimeRange(index)}
                                  >
                                    <img
                                      alt="addMore"
                                      src={IconPlus}
                                      style={{
                                        opacity:
                                          rangeIndex ===
                                          timesheet?.timeRanges?.length - 1
                                            ? 1
                                            : 0.2,
                                      }}
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="col-6" />
                            <div className="col-6 padding-left-0" style={{ marginTop: rangeIndex === 0 ? 0 : 15}}>
                              <div className="prev-day-container">
                                <input
                                  type="checkbox"
                                  id={`prevDayCheckbox_${index}_${rangeIndex}`}
                                  onChange={(e) => handleChangeIsPrevDayIndicator(index, rangeIndex, e.target.checked)}
                                  value={range.isPrevDayIndicator}
                                />
                                &nbsp;
                                <label
                                  htmlFor={`prevDayCheckbox_${index}_${rangeIndex}`}
                                >
                                  {t("PrevDay")}
                                </label>{" "}
                                &nbsp;
                                {rangeIndex === 0 && (
                                  <Button
                                    className="information-btn"
                                    onClick={() => setShowNoteModal(true)}
                                  >
                                    <i className="fas fa-info" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="col-6" />
                            <div className="col-6 padding-left-0 line-break">
                              {errors[`invalidHour_${index}_${rangeIndex}`] && (
                                <p className="text-danger">
                                  {errors[`invalidHour_${index}_${rangeIndex}`]}
                                </p>
                              )}
                              {errors[
                                `range_overlapTime_${index}_${rangeIndex}`
                              ] && (
                                <p className="text-danger">
                                  {
                                    errors[
                                      `range_overlapTime_${index}_${rangeIndex}`
                                    ]
                                  }
                                </p>
                              )}
                              {errors[
                                `range_minimum_hours_${index}_${rangeIndex}`
                              ] && (
                                <p className="text-danger">
                                  {
                                    errors[
                                      `range_minimum_hours_${index}_${rangeIndex}`
                                    ]
                                  }
                                </p>
                              )}
                              {errors[
                                `range_space_hours_${index}_${rangeIndex}`
                              ] && (
                                <p className="text-danger">
                                  {
                                    errors[
                                      `range_space_hours_${index}_${rangeIndex}`
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        <p className="text-danger">
                          {errors[`invalidHour_${index}`]}
                        </p>
                        <div className="row mb-20">
                          <div className="col-6">
                            <div className="form-item">
                              <div className="mb-12">{t("OTType")}</div>
                              <div className="field-view">{t("MoneyOT")}</div>
                            </div>
                          </div>
                          <div className="col-2 form-item padding-left-0">
                            <div className="mb-12 total-leave-time">
                              {t("TotalLeaveTime")}
                            </div>
                            <div className="field-view  hour-picker-input">
                              {timesheet.hoursOt > 0 ? timesheet.hoursOt : 0}
                              &nbsp;
                              {t("HourUnit")}
                            </div>
                          </div>
                          <div className="col-4 total-in-month-container  padding-left-0">
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
            recentlyAppraiser={appraiser ? null : recentlyManagers?.appraiser}
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
                onClick={handleSendButtonClick}
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
