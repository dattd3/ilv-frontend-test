import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ServiceItem from "./ServiceItem";
import { Image } from "react-bootstrap";
import {
  IPaymentRequest,
  IPaymentService,
} from "models/welfare/PaymentModel";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import logo from "assets/img/myvp-logo.png";
import IconAdd from "assets/img/ic-add-green.svg";
interface IServiceRequestProps {
  t: any;
  headerTitle: string;
  isCreateMode: boolean;
  request: IPaymentRequest;
  cancelRequest: Function;
  updateRequest: Function;
}
function ServiceRequest({
  t,
  headerTitle,
  isCreateMode = false,
  request,
  cancelRequest,
  updateRequest,
}: IServiceRequestProps) {
  const [open, setOpen] = useState(true);

  const handleChangeValue = (value: any, key: string) => {
    const newRequest = {
      ...request,
      [key]: value,
    };
    updateRequest(newRequest);
  };

  const addMoreSevice = () => {
    const lastRequest = { ...request };
    lastRequest.services.push({
      name: "Dich vu " + (lastRequest.services.length + 1),
    });
    updateRequest(lastRequest);
  };

  const updateService = (index: number, service: IPaymentService) => {
    const lastRequest = { ...request };
    lastRequest.services[index] = service;
    updateRequest(lastRequest);
  };

  return (
    <div className="service-request position-relative">
      <div className="card">
        <img src={logo} />
        <div
          className={"card-header clearfix text-black"}
          onClick={() => setOpen(!open)}
        >
          <div className="float-left text-uppercase">{headerTitle}</div>
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
        <Collapse in={open}>
          <div id="example-collapse-text" className="request-content">
            <div className="trip-contain">
              {/* thông tin hành trình */}
              <div className="row">
                <div className="col-3">
                  {t("TripCode")}
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
                  {t("DateCome")}
                  <div className="content input-container">
                    <label>
                      <DatePicker
                        name="endDate"
                        selectsEnd
                        autoComplete="off"
                        selected={request.DateCome}
                        maxDate={request.DateLeave}
                        onChange={(date) => handleChangeValue(date, "DateCome")}
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
                  {t("DateLeave")}
                  <div className="content input-container">
                    <label>
                      <DatePicker
                        name="endDate"
                        selectsEnd
                        autoComplete="off"
                        minDate={request.DateCome}
                        selected={request.DateLeave}
                        onChange={(date) =>
                          handleChangeValue(date, "DateLeave")
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
                  <div className="detail1">{""}</div>
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
            </div>
            {/* danh sách cac loại dich vu */}
            {(request?.services || []).map((service, index) => {
              return (
                <ServiceItem
                  key={index}
                  t={t}
                  headerTitle={service.name}
                  service={service}
                  isCreateMode={isCreateMode}
                  updateService={(ser) => updateService(index, ser)}
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
