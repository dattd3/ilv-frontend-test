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
import { getPaymentObjects } from "../InternalPayment/PaymentData";
import { IDropdownValue } from "models/CommonModel";
import InputNumberComponent from "../InternalPayment/component/InputNumberComponent";
import {
  formatNumberSpecialCase,
  getMuleSoftHeaderConfigurations,
  getRequestConfigurations,
} from "commons/Utils";
import _ from "lodash";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { IMemberInfo } from "models/welfare/SocialContributeModel";

interface IMemberInfoProps {
  t: any;
  provinces: IDropdownValue[];
  request: IMemberInfo;
  isCreateMode: boolean;
  canDelete: boolean;
  updateRequest: Function;
  cancelRequest: Function;
}
function MemberInfo({
  t,
  provinces = [],
  request,
  isCreateMode = false,
  canDelete,
  updateRequest,
  cancelRequest,
}: IMemberInfoProps) {
  const handleChangeValue = (value, key) => {
    const newService = {
      ...request,
      [key]: value,
    };
    updateRequest(newService);
  };
  const handleChangeDatetimeValue = (value: any, key: string) => {
    value = moment(value).format("DD/MM/YYYY");
    handleChangeValue(value, key);
  };

  return (
    <div className="item-contain position-relative">
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
            if (canDelete && cancelRequest) {
              cancelRequest();
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
          <div className="col-4">
            {"Quan hệ với CBNV"}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <Select
              placeholder={isCreateMode ? t("option") : ""}
              options={[]}
              isClearable={false}
              value={request.relation}
              onChange={(e) => handleChangeValue(e, "relation")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            {"Họ tên"}
            <InputNumberComponent
              value={request.fullName || ""}
              onChange={(value) => handleChangeValue(value, "fullName")}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
              name="fullName"
              type="text"
            />
          </div>
          <div className="col-4">
            {"Giới tính"}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <Select
              placeholder={isCreateMode ? t("option") : ""}
              options={[]}
              isClearable={false}
              value={request.sex}
              onChange={(e) => handleChangeValue(e, "sex")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            {"Ngày sinh"}{" "}
            {isCreateMode && <span className="required">(*)</span>}
            <div className="content input-container">
              <label>
                <DatePicker
                  name="endDate"
                  selectsEnd
                  autoComplete="off"
                  selected={
                    request.birthDate
                      ? moment(request.birthDate, "DD/MM/YYYY").toDate()
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
          <div className="col-4">
            {"CMTND"} {isCreateMode && <span className="required">(*)</span>}
            <InputNumberComponent
              value={request.identityId || ""}
              onChange={(value) => handleChangeValue(value, "identityId")}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
              name="identityId"
              type="text"
            />
          </div>
          <div className="col-4">
            {"Chủ hộ/Thành viên"}
            <Select
              placeholder={isCreateMode ? t("option") : ""}
              options={[]}
              isClearable={false}
              value={request.type}
              onChange={(e) => handleChangeValue(e, "type")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberInfo;
