import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ServiceItem from "./ServiceItem";
import { Image } from "react-bootstrap";
import { IPaymentRequest, IPaymentService } from "models/welfare/PaymentModel";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import IconAdd from "assets/img/ic-add-green.svg";
import IconCancel from "assets/img/icon/ic_x_red.svg";
import IconDownload from "assets/img/ic_download_red.svg";
import { IDropdownValue } from "models/CommonModel";
import moment from "moment";
import { formatNumberSpecialCase, formatProcessTime } from "commons/Utils";
import Constants from "commons/Constants";
interface IServiceRequestProps {
  t: any;
  headerTitle: string;
  isCreateMode: boolean;
  request: IPaymentRequest;
  cancelRequest: Function;
  updateRequest: Function;
  typeServices: IDropdownValue[];
  setLoading?: Function;
  isOpen?: boolean;
}
function ServiceRequest({
  t,
  headerTitle,
  isCreateMode = false,
  request,
  cancelRequest,
  updateRequest,
  typeServices,
  setLoading,
  isOpen = false,
}: IServiceRequestProps) {
  const [open, setOpen] = useState(isOpen);
  const handleChangeValue = (value: any, key: string) => {
    const newRequest = {
      ...request,
      [key]: value,
    };
    updateRequest(newRequest);
  };
  const handleChangeTripInfoValue = (
    key: string,
    value: any,
    tripIndex: number
  ) => {
    const newTripInfo = request.tripInfo ? [...request.tripInfo] : [];
    if (newTripInfo.length && newTripInfo[tripIndex]) {
      if (["DateCome", "DateLeave"].includes(key))
        value = moment(value).format("DD/MM/YYYY");
      newTripInfo[tripIndex] = {
        ...newTripInfo[tripIndex],
        [key]: value,
      };
    }
    handleChangeValue(newTripInfo, "tripInfo");
  };

  const addMoreSevice = () => {
    const lastRequest = { ...request };
    lastRequest.services.push({
      name: t("ServicePayment", { id: request.services.length + 1 }),
      FeeBenefit: 0,
      isCalculated: false,
    });
    updateRequest(lastRequest);
  };

  const addMoreTrip = () => {
    const newTripInfo = request.tripInfo
      ? [
          ...request.tripInfo,
          {
            TripCode: "",
            DateCome: undefined,
            DateLeave: undefined,
          },
        ]
      : [];

    handleChangeValue(newTripInfo, "tripInfo");
  };

  const removeTrip = (index: number) => {
    handleChangeValue(
      request.tripInfo?.filter((_, _index) => _index !== index),
      "tripInfo"
    );
  };

  const updateService = (index: number, service: IPaymentService) => {
    const lastRequest = { ...request };
    lastRequest.services[index] = service;
    lastRequest.TotalRefund = 0;
    lastRequest.services.map((ser) => {
      lastRequest.TotalRefund += parseInt(
        ser.FeeReturn ? ser.FeeReturn + "" : "0"
      );
    });

    updateRequest(lastRequest);
  };

  const removeService = (index: number) => {
    const lastRequest = { ...request };
    lastRequest.services.splice(index, 1);
    lastRequest.TotalRefund = 0;
    lastRequest.services = lastRequest.services.map((_it, _indx) => {
      lastRequest.TotalRefund += parseInt(
        _it.FeeReturn ? _it.FeeReturn + "" : "0"
      );
      return {
        ..._it,
        name: t("ServicePayment", { id: _indx + 1 }),
      };
    });
    updateRequest(lastRequest);
  };

  const downloadFile = (url: string) => {
    const filename = url.substring(url.lastIndexOf("/") + 1);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const showStatus = (
    statusOriginal: number | undefined,
    approverId: string | undefined
  ) => {
    if (statusOriginal == undefined) return null;
    const status = {
      1: { label: t("Rejected"), className: "request-status fail" },
      2: { label: t("Approved"), className: "request-status success" },
      3: { label: t("Canceled"), className: "request-status" },
      4: { label: t("Canceled"), className: "request-status" },
      5: { label: t("PendingApproval"), className: "request-status" },
      6: {
        label: t("PartiallySuccessful"),
        className: "request-status warning",
      },
      7: { label: t("Rejected"), className: "request-status fail" },
      8: { label: t("PendingConsent"), className: "request-status" },
      20: { label: t("Consented"), className: "request-status" },
      100: { label: t("Waiting"), className: "request-status" },
    };

    if (!approverId && statusOriginal === 5) {
      statusOriginal = 6;
    }

    return (
      <span className={status[statusOriginal]?.className}>
        {status[statusOriginal]?.label}
      </span>
    );
  };

  const getApproveFailReason = () => {
    try {
      return request.requestHistory?.comment ? request.requestHistory?.comment : JSON.parse(request.requestHistory?.responseSyncFromSap || "[]")?.[0]?.MESSAGE
    } catch (error) {
      return ""
    }
  }

  return (
    <div className="service-request position-relative mb-3">
      <div className="card">
        <div
          className={"card-header clearfix text-black"}
          onClick={() => setOpen(!open)}
        >
          <div className="float-left">{headerTitle}</div>
          <div className="float-right">
            <i className={open ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
          </div>
        </div>
        {isCreateMode ? (
          <button
            className="position-absolute d-flex align-items-center"
            style={{
              gap: "4px",
              top: 0,
              right: 0,
              backgroundColor: "#C74141",
              color: "#FFFFFF",
              fontSize: 12,
              border: "none",
              padding: "6px 11px",
              borderTopRightRadius: "4px",
              borderBottomLeftRadius: "4px",
            }}
            onClick={() => {
              if (cancelRequest) {
                cancelRequest();
              }
            }}
          >
            <i
              className="fas fa-times mr- text-white"
              style={{ fontSize: 12 }}
            ></i>
            {t("Cancel")}
          </button>
        ) : null}

        <div id="example-collapse-text" className="request-content">
          <div className="trip-contain">
            {/* thông tin hành trình */}
            {request.tripInfo?.map((trip, index) => (
              <div className="row mt-15px" key={index}>
                <div className="col-4">
                  {t("TripCode")}{" "}
                  {isCreateMode && <span className="required">(*)</span>}
                  <input
                    type="text"
                    placeholder={t("import")}
                    value={trip.TripCode || ""}
                    onChange={(e) =>
                      handleChangeTripInfoValue(
                        "TripCode",
                        e.target.value,
                        index
                      )
                    }
                    className="form-control input mv-10 w-100"
                    name="inputName"
                    autoComplete="off"
                    disabled={!isCreateMode}
                  />
                </div>
                <div className="flex-1">
                  {t("DateCome")}{" "}
                  {isCreateMode && <span className="required">(*)</span>}
                  <div className="content input-container">
                    <label>
                      <DatePicker
                        name="endDate"
                        selectsEnd
                        autoComplete="off"
                        selected={
                          trip.DateCome
                            ? moment(trip.DateCome, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        maxDate={
                          trip.DateLeave
                            ? moment(trip.DateLeave, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        onChange={(date) =>
                          handleChangeTripInfoValue("DateCome", date, index)
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("Select")}
                        locale={t("locale")}
                        className="form-control input"
                        disabled={!isCreateMode}
                      />
                      <span className="input-group-addon input-img">
                        <img src={IconDatePicker} alt="Date" />
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  {t("DateLeave")}{" "}
                  {isCreateMode && <span className="required">(*)</span>}
                  <div className="content input-container">
                    <label>
                      <DatePicker
                        name="endDate"
                        selectsEnd
                        autoComplete="off"
                        minDate={
                          trip.DateCome
                            ? moment(trip.DateCome, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        selected={
                          trip.DateLeave
                            ? moment(trip.DateLeave, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        onChange={(date) =>
                          handleChangeTripInfoValue("DateLeave", date, index)
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("Select")}
                        locale={t("locale")}
                        className="form-control input"
                        disabled={!isCreateMode}
                      />
                      <span className="input-group-addon input-img">
                        <img src={IconDatePicker} alt="Date" />
                      </span>
                    </label>
                  </div>
                </div>
                {isCreateMode && (
                  <div className="action-btn-container">
                    {request.tripInfo?.length &&
                    request.tripInfo?.length < 2 ? (
                      <button
                        className="btn btn-outline-success btn-lg w-fit-content d-flex align-items-center"
                        style={{ gap: "4px", fontSize: "14px" }}
                        onClick={addMoreTrip}
                      >
                        <Image src={IconAdd} />
                        {t("AddMore")}
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-action-trip"
                          onClick={() => removeTrip(index)}
                        >
                          <img alt="addMore" src={IconCancel} />
                        </button>
                        <button
                          className="btn btn-action-trip"
                          disabled={index !== request.tripInfo.length - 1}
                          onClick={addMoreTrip}
                        >
                          <img
                            alt="addMore"
                            src={IconAdd}
                            style={{
                              opacity:
                                index === request.tripInfo.length - 1 ? 1 : 0.2,
                            }}
                          />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="row mv-10">
              <div className="col-4">
                {t("PaymentTotal")}
                <div className="detail1">
                  {formatNumberSpecialCase(request.TotalRefund)}
                </div>
              </div>
              <div className="col-8">
                {t("TripAddress")}
                <input
                  type="text"
                  placeholder={isCreateMode ? t("import") : ""}
                  value={request.TripAddress || ""}
                  onChange={(e) =>
                    handleChangeValue(e.target.value, "TripAddress")
                  }
                  className="form-control input mv-10 w-100"
                  name="inputName"
                  autoComplete="off"
                  maxLength={255}
                  disabled={!isCreateMode}
                />
              </div>
            </div>
            {!isCreateMode && (
              <div className="row mv-10">
                <div className="col-4">
                  {t("TimeToSendRequest")}{" "}
                  <div className="detail1">
                    {formatProcessTime(
                      request.requestHistory?.createdDate || ""
                    )}
                  </div>
                </div>
                <div className="col-4">
                  {t("ApprovalDate")}{" "}
                  <div className="detail1">
                    {formatProcessTime(
                      request.requestHistory?.approvedDate || ""
                    )}
                  </div>
                </div>
                <div className="col-4">
                  {t("lyDoTuChoi")}
                  <div className="detail1">
                    {request.requestHistory?.processStatusId ==
                      Constants.STATUS_NOT_APPROVED &&
                    request.requestHistory?.approverComment
                      ? request.requestHistory?.approverComment
                      : ""}
                  </div>
                </div>

                <div className="col-12 status mv-10">
                  {showStatus(
                    request.requestHistory?.processStatusId,
                    request.requestHistory?.approverId
                  )}
                  <span style={{ width: "20px", display: "inline-block" }} />
                  {
                    request.requestHistory?.processStatusId === 6 && getApproveFailReason() && <>
                      <span className="request-status warning" style={{ width: "auto" }}>
                        {getApproveFailReason()}
                      </span>
                      <span style={{ width: "20px", display: "inline-block" }} />
                    </>
                  }
                  {request.documentFileUrl ? (
                    <span
                      className="request-status fail"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        downloadFile(request.documentFileUrl!);
                      }}
                    >
                      <Image
                        src={IconDownload}
                        style={{
                          width: "15px",
                          height: "16px",
                          marginRight: "5px",
                        }}
                      />
                      {t("DownloadFile")}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          <Collapse in={open || isCreateMode}>
            <div>
              {/* danh sách cac loại dich vu */}
              {(request?.services || []).map((service, index) => {
                return (
                  <ServiceItem
                    key={index}
                    t={t}
                    headerTitle={service.name}
                    service={service}
                    setLoading={setLoading}
                    isCreateMode={isCreateMode}
                    typeServices={typeServices}
                    canDelete={request.services.length > 1 ? true : false}
                    updateService={(ser) => updateService(index, ser)}
                    removeService={() => removeService(index)}
                  />
                );
              })}
            </div>
          </Collapse>

          {isCreateMode ? (
            <button
              className="btn btn-outline-success btn-lg w-fit-content mt-3 d-flex align-items-center"
              style={{ gap: "4px", fontSize: "14px" }}
              onClick={addMoreSevice}
            >
              <Image src={IconAdd} />
              {t("AddService")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ServiceRequest;
