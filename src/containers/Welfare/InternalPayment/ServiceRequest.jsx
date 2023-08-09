import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import IconAdd from "assets/img/ic-add-green.svg";
import IconRemove from "assets/img/ic-remove.svg";
import ServiceItem from "./ServiceItem";
import { Image } from "react-bootstrap";

function ServiceRequest({ t, headerTitle, isCreateMode = false, request, cancelRequest, updateRequest, addMoreSevice }) {
  const [open, setOpen] = useState(true);
  const handleTextInputChange = (e, key) => {

  };
  const handleChangeSelectInputs = (e, key) => {

  };

  return (
    <div className="service-request position-relative">
      
      <div className="card">
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
            if(cancelRequest) {
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
                    //value={request.leaveOfWeek}
                    //onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
                    className="form-control input mv-10 w-100"
                    name="inputName"
                    autoComplete="off"
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
                        // selected={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                        // startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                        // endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                        // minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate?.toDate() || null}
                        // onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem, isLeaveForMother || req[0]?.isShowHintLeaveForMother)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("Select")}
                        locale={t("locale")}
                        className="form-control input"
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
                        // selected={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                        // startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                        // endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                        // minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate?.toDate() || null}
                        // onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem, isLeaveForMother || req[0]?.isShowHintLeaveForMother)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={t("Select")}
                        locale={t("locale")}
                        className="form-control input"
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
                    //value={data.leaveOfWeek}
                    //onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
                    className="form-control input mv-10 w-100"
                    name="inputName"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            {/* danh sách cac loại dich vu */}
            {
                (request?.services || []).map((service, index) => {
                    return (
                        <ServiceItem key={index} t={t} headerTitle={service.name} service = {service} />
                    )
                })
            }

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
