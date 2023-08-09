import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import Select from "react-select";

function ServiceItem({ t, headerTitle }) {
  return (
    <div className="item-contain">
      <div className={"card-header clearfix item-header"}>
        <div className="float-left text-uppercase">{headerTitle}</div>
      </div>
      <div className="request-content">
        <div className="row">
          <div className="col-3">
            {t("DateUse")}
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
            {t("UseDetail")}
            <div className="detail1">{""}</div>
          </div>
          <div className="col-3">
            {t("UseWelfareType")}
            <Select
              placeholder={t("option")}
              options={[]}
              isClearable={false}
              //value={data.workingCondition}
              //onChange={(e) => handleChangeSelectInputs(e, "workingCondition")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-3">
            {t("UseFor")}
            <Select
              placeholder={t("option")}
              options={[]}
              isClearable={false}
              //value={data.workingCondition}
              //onChange={(e) => handleChangeSelectInputs(e, "workingCondition")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-3">
            {t("FeePayment")}
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
          <div className="col-3">
            {t("FeeUpgrade")}
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
          <div className="col-3">
            {t("ReducePercent")}
            <div className="detail1">{"35%"}</div>
          </div>
          <div className="col-3">
            {t("PricePublish")}
            <div className="detail1">{"4 095 238"}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-3">
            {t("FeeBenefit")}
            <div className="detail1">{"100%"}</div>
          </div>
          <div className="col-3">
            {t("FeeReturn")}
            <div className="detail1">{"2 661 905"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;
