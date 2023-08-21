import React, { useCallback, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  IPaymentService,
  IResponseCalculatePayment,
} from "models/welfare/PaymentModel";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import { getPaymentObjects } from "./PaymentData";
import { IDropdownValue } from "models/CommonModel";
import InputNumberComponent from "./component/InputNumberComponent";
import {
  formatNumberSpecialCase,
  getRequestConfigurations,
} from "commons/Utils";
import _ from "lodash";
import axios from "axios";
import { Spinner } from "react-bootstrap";

interface IServiceItem {
  t: any;
  headerTitle: string;
  service: IPaymentService;
  isCreateMode: boolean;
  canDelete: boolean;
  updateService: Function;
  removeService: Function;
  typeServices: IDropdownValue[];
  setLoading?: Function;
}
function ServiceItem({
  t,
  headerTitle,
  service,
  isCreateMode = false,
  updateService,
  removeService,
  typeServices,
  canDelete,
  setLoading = () => {},
}: IServiceItem) {
  const [canCheck, setCanCheck] = useState(false);
  const [canEditFeeUpgrade, setcanEditFeeUpgrade] = useState(false);
  const [disabledSubmitButton, setdisabledSubmitButton] = useState(false);

  const handleChangeValue = (value, key) => {
    const newService = {
      ...service,
      [key]: value,
    };
    if (key == "UseWelfareType") {
      if (value.code == "LT") {
        setcanEditFeeUpgrade(true);
      } else {
        setcanEditFeeUpgrade(false);
        newService.FeeUpgrade = 0;
      }
    }
    if (
      newService.UseWelfareType?.value &&
      newService.UseFor?.value &&
      newService.FeePayment
    ) {
      setCanCheck(true);
    } else if (canCheck) {
      setCanCheck(false);
    }
    if (key == "FeeUpgrade" && value) {
      setCanCheck(true);
    }

    updateService(newService);
  };
  const handleChangeDatetimeValue = (value: any, key: string) => {
    value = moment(value).format("DD/MM/YYYY");
    handleChangeValue(value, key);
  };
  const calculateService = async (ser: IPaymentService) => {
    if (canCheck == false || disabledSubmitButton) return;
    const benefitRefundInfoEndpoint = `${process.env.REACT_APP_REQUEST_URL}benefit-refund/calculate`;
    const config = getRequestConfigurations();
    try {
      setdisabledSubmitButton(true);
      const result = await axios.post(
        benefitRefundInfoEndpoint,
        {
          userType: ser.UseFor?.value,
          benefitRank: localStorage.getItem("benefitLevel"),
          serviceTypeId: ser.UseWelfareType?.value,
          amountPaid: ser.FeePayment || 0,
          upgradeRoomFee: ser.FeeUpgrade || 0,
        },
        config
      );
      if (result.data?.data) {
        const data: IResponseCalculatePayment = result.data.data;
        const newService: IPaymentService = {
          ...ser,
          Detail: data.detail,
          QuotedPrice: data.quotedPrice,
          PnlDiscountPercent: data.pnlDiscountPercent,
          FeeBenefit: data.benefitDiscountPercent,
          FeeReturn: data.refundAmount,
        };
        setCanCheck(false);
        updateService(newService);
      }
    } catch (err) {
      console.log("calculate error>>>", err);
    } finally {
      setdisabledSubmitButton(false);
    }
  };

  return (
    <div className="item-contain position-relative">
      <div className={"card-header clearfix item-header"}>
        <div className="float-left">{headerTitle}</div>
      </div>
      {isCreateMode && canDelete ? (
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
            if (removeService) {
              removeService();
            }
          }}
        >
          <i
            className="fas fa-times mr- text-white"
            style={{ fontSize: 12 }}
          ></i>
        </button>
      ) : null}
      <div className="request-content">
        <div className="row">
          <div className="col-3">
            {t("DateUse")}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <div className="content input-container">
              <label>
                <DatePicker
                  name="endDate"
                  selectsEnd
                  autoComplete="off"
                  selected={
                    service.DateUse
                      ? moment(service.DateUse, "DD/MM/YYYY").toDate()
                      : undefined
                  }
                  onChange={(date) =>
                    handleChangeDatetimeValue(date, "DateUse")
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
            {t("UseDetail")}
            <div className="detail1">{service.Detail}</div>
          </div>
          <div className="col-3">
            {t("UseWelfareType")}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <Select
              placeholder={t("option")}
              options={typeServices}
              isClearable={false}
              value={service.UseWelfareType}
              onChange={(e) => handleChangeValue(e, "UseWelfareType")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
          </div>
          <div className="col-3">
            {t("UseFor")}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <Select
              placeholder={t("option")}
              options={getPaymentObjects()}
              isClearable={false}
              value={service.UseFor}
              onChange={(e) => handleChangeValue(e, "UseFor")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-3">
            {t("FeePayment")}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <InputNumberComponent
              value={service.FeePayment || ""}
              onChange={(value) => handleChangeValue(value, "FeePayment")}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
              name="FeePayment"
            />
          </div>
          <div className="col-3">
            {t("FeeUpgrade")}
            <InputNumberComponent
              value={service.FeeUpgrade || ""}
              onChange={(value) => handleChangeValue(value, "FeeUpgrade")}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode || !canEditFeeUpgrade}
              name="FeeUpgrade"
            />
          </div>
          <div className="col-3">
            {t("ReducePercent")}
            <div className="detail1">
              {service.PnlDiscountPercent
                ? service.PnlDiscountPercent + "%"
                : ""}
            </div>
          </div>
          <div className="col-3">
            {t("PricePublish")}
            <div className="detail1">
              {formatNumberSpecialCase(service.QuotedPrice)}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-3">
            {t("FeeBenefit")}
            <div className="detail1">
              {service.FeeBenefit ? service.FeeBenefit + "%" : ""}
            </div>
          </div>
          <div className="col-3">
            {t("FeeReturn")}
            <div className="detail1">
              {formatNumberSpecialCase(service.FeeReturn)}
            </div>
          </div>
          {isCreateMode && (
            <div className="col-3">
              <label></label>
              <div
                className="btn detail1 btn-check"
                style={
                  canCheck ? {} : { opacity: "0.4", cursor: "not-allowed" }
                }
                onClick={() => {
                  calculateService(service);
                }}
              >
                {!disabledSubmitButton ? null : (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mr-2"
                  />
                )}
                {t("CheckPayment")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;
