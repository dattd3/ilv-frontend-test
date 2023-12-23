import React, { useCallback, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import _ from "lodash";
import InputNumberComponent from "containers/Welfare/InternalPayment/component/InputNumberComponent";
import { ITaxMemberInfo } from "./TaxModel.types";
import SelectInputComponent from "containers/Welfare/InternalPayment/component/SelectInputComponent";
import {SOCIAL_NUMBER_INPUT, getRelationshipWithInsured } from "./TaxConstants";

interface IMemberInfoProps {
  t: any;
  errors: any;
  index: number;
  request: ITaxMemberInfo;
  isCreateMode: boolean;
  canDelete: boolean;
  updateRequest: Function;
  cancelRequest: Function;
}

function TaxMemberInfo({
  t,
  request,
  isCreateMode = false,
  canDelete,
  updateRequest,
  cancelRequest,
  index,
  errors
}: IMemberInfoProps) {
  const handleChangeValue = (value, key) => {
    const newService = {
      ...request,
      [key]: value,
    };
    updateRequest(newService);
  };
  const handleChangeDatetimeValue = (value: any, key: string) => {
    if(value) {
      value = moment(value).format("DD/MM/YYYY");
    }
    handleChangeValue(value, key);
  };
  return (
    <div className="item-contain position-relative">
      <div className="request-content">
        <div className="row">
          <div className="col-4">
            {t('FullName')}<span className="required">(*)</span>
            <InputNumberComponent
              value={request.fullName || ""}
              onChange={(value) => handleChangeValue(value, "fullName")}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
              name="fullName"
              type="text"
            />
            {errors['member_' + index + '_fullName'] ? (
              <p className="text-danger">{errors['member_' + index + '_fullName']}</p>
            ) : null}
          </div>
          <div className="col-4">
            {t('Relationship')}<span className="required">(*)</span>
            <SelectInputComponent
              options={getRelationshipWithInsured(t)}
              maxLeng={255}
              otherValueDefault={SOCIAL_NUMBER_INPUT}
              name="relation"
              value={request.relation}
              onChange={(value, name) => handleChangeValue(value, name)}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
            />
            {errors['member_' + index + '_relation'] ? (
              <p className="text-danger">{errors['member_' + index + '_relation']}</p>
            ) : null}
          </div>

          <div className="col-2">
            {t('From')}<span className="required">(*)</span>
            <div className="content input-container">
              <label style={{position: 'relative'}}>
                <DatePicker
                  name="endDate"
                  selectsEnd
                  autoComplete="off"
                  selected={
                    request.fromDate
                      ? moment(request.fromDate, "DD/MM/YYYY").toDate()
                      : undefined
                  }
                  onChange={(date) =>
                    handleChangeDatetimeValue(date, "fromDate")
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
              {errors['member_' + index + '_fromDate'] ? (
              <p className="text-danger">{errors['member_' + index + '_fromDate']}</p>
            ) : null}
            </div>
          </div>

          <div className="col-2">
            {t('To')}<span className="required">(*)</span>
            <div className="content input-container">
              <label style={{position: 'relative'}}>
                <DatePicker
                  name="endDate"
                  selectsEnd
                  autoComplete="off"
                  selected={
                    request.toDate
                      ? moment(request.toDate, "DD/MM/YYYY").toDate()
                      : undefined
                  }
                  onChange={(date) =>
                    handleChangeDatetimeValue(date, "toDate")
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("Select")}
                  popperPlacement="bottom-end"
                  locale={t("locale")}
                  className="form-control input"
                  disabled={!isCreateMode}
                />
                <span className="input-group-addon input-img">
                  <img src={IconDatePicker} alt="Date" />
                </span>
              </label>
              {errors['member_' + index + '_toDate'] ? (
              <p className="text-danger">{errors['member_' + index + '_toDate']}</p>
            ) : null}
            </div>
          </div>

        </div>

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
    </div>
  );
}

export default TaxMemberInfo;
