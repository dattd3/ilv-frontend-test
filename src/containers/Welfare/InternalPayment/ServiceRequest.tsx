import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ServiceItem from "./ServiceItem";
import { Image } from "react-bootstrap";
import {
  IPaymentRequest,
  IPaymentService,
  IQuota,
} from "models/welfare/PaymentModel";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import IconAdd from "assets/img/ic-add-green.svg";
import IconDownload from "assets/img/ic_download_red.svg";
import { IDropdownValue } from "models/CommonModel";
import moment from "moment";
import { formatNumberSpecialCase } from "commons/Utils";
interface IServiceRequestProps {
  t: any;
  headerTitle: string;
  isCreateMode: boolean;
  request: IPaymentRequest;
  cancelRequest: Function;
  updateRequest: Function;
  typeServices: IDropdownValue[];
  setLoading?: Function;
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
}: IServiceRequestProps) {
  const [open, setOpen] = useState(true);

  const handleChangeValue = (value: any, key: string) => {
    const newRequest = {
      ...request,
      [key]: value,
    };
    updateRequest(newRequest);
  };
  const handleChangeDatetimeValue = (value: any, key: string) => {
    value = moment(value).format("DD/MM/YYYY");
    handleChangeValue(value, key);
  };

  const addMoreSevice = () => {
    const lastRequest = { ...request };
    lastRequest.services.push({
      name: t("ServicePayment", { id: request.services.length + 1 }),
      FeeBenefit: 0,
    });
    updateRequest(lastRequest);
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
    const filename = url.substring(url.lastIndexOf('/')+1);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }

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
        <Collapse in={open || isCreateMode}>
          <div id="example-collapse-text" className="request-content">
            <div className="trip-contain">
              {/* thông tin hành trình */}
              <div className="row">
                <div className="col-3">
                  {t("TripCode")} {isCreateMode && <span className="required">(*)</span>}
                  <input
                    type="text"
                    placeholder={t("import")}
                    value={request.TripCode || ""}
                    onChange={(e) =>
                      handleChangeValue(e.target.value, "TripCode")
                    }
                    className="form-control input mv-10 w-100"
                    name="inputName"
                    autoComplete="off"
                    disabled={!isCreateMode}
                  />
                </div>
                <div className="col-3">
                  {t("DateCome")} {isCreateMode && <span className="required">(*)</span>}
                  <div className="content input-container">
                    <label>
                      <DatePicker
                        name="endDate"
                        selectsEnd
                        autoComplete="off"
                        selected={
                          request.DateCome
                            ? moment(request.DateCome, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        maxDate={
                          request.DateLeave
                            ? moment(request.DateLeave, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        onChange={(date) =>
                          handleChangeDatetimeValue(date, "DateCome")
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
                <div className="col-3">
                  {t("DateLeave")} {isCreateMode && <span className="required">(*)</span>}
                  <div className="content input-container">
                    <label>
                      <DatePicker
                        name="endDate"
                        selectsEnd
                        autoComplete="off"
                        minDate={
                          request.DateCome
                            ? moment(request.DateCome, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        selected={
                          request.DateLeave
                            ? moment(request.DateLeave, "DD/MM/YYYY").toDate()
                            : undefined
                        }
                        onChange={(date) =>
                          handleChangeDatetimeValue(date, "DateLeave")
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
                <div className="col-3">
                  {t("PaymentTotal")}
                  <div className="detail1">
                    {formatNumberSpecialCase(request.TotalRefund)}
                  </div>
                </div>
              </div>
              <div className="row mv-10">
                <div className="col-12">
                  {t("TripAddress")}
                  <input
                    type="text"
                    placeholder={t("import")}
                    value={request.TripAddress || ""}
                    onChange={(e) =>
                      handleChangeValue(e.target.value, "TripAddress")
                    }
                    className="form-control input mv-10 w-100"
                    name="inputName"
                    autoComplete="off"
                    disabled={!isCreateMode}
                  />
                </div>
              </div>
              {!isCreateMode && (
                <div className="row mv-10">
                  <div className="col-12 status mv-10">
                    {showStatus(
                      request.requestHistory?.processStatusId,
                      request.requestHistory?.approverId
                    )}
                    <span style={{ width: "20px", display: "inline-block" }}>
                      {""}
                    </span>
                    {request.documentFileUrl ? (
                      <span className="request-status fail" style={{cursor: 'pointer'}} onClick={() => {downloadFile(request.documentFileUrl!)}}>
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
        </Collapse>
      </div>
    </div>
  );
}

export default ServiceRequest;
