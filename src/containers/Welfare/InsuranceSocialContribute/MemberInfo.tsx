import React, { useCallback, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import { IDropdownValue } from "models/CommonModel";
import InputNumberComponent from "../InternalPayment/component/InputNumberComponent";
import _ from "lodash";
import { IMemberInfo } from "models/welfare/SocialContributeModel";
import { GENDER_LIST, IDENTITY_LIST, RELATIONSHIP_WITH_INSURED, ROLE_TYPE, SOCIAL_NUMBER_INPUT } from "./SocialContributeData";
import SelectInputComponent from "../InternalPayment/component/SelectInputComponent";

interface IMemberInfoProps {
  t: any;
  errors: any;
  index: number;
  request: IMemberInfo;
  isCreateMode: boolean;
  canDelete: boolean;
  updateRequest: Function;
  cancelRequest: Function;
}

function MemberInfo({
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
            {"Quan hệ với CBNV"}{" "}
            <span className="required">(*)</span>
            <SelectInputComponent
              options={RELATIONSHIP_WITH_INSURED}
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
          <div className="col-4">
            {"Họ tên"}<span className="required">(*)</span>
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
            {"Giới tính"}<span className="required">(*)</span>
            <Select
              placeholder={isCreateMode ? t("option") : ""}
              options={GENDER_LIST}
              isClearable={false}
              value={request.sex}
              onChange={(e) => handleChangeValue(e, "sex")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
            {errors['member_' + index + '_sex'] ? (
              <p className="text-danger">{errors['member_' + index + '_sex']}</p>
            ) : null}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            {"Ngày sinh"}<span className="required">(*)</span>
            <div className="content input-container">
              <label style={{position: 'relative'}}>
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
                    handleChangeDatetimeValue(date, "birthDate")
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
              {errors['member_' + index + '_birthDate'] ? (
              <p className="text-danger">{errors['member_' + index + '_birthDate']}</p>
            ) : null}
            </div>
          </div>
          <div className="col-4">
            {"CMND/CCCD/Định danh cá nhân"} <span className="required">(*)</span>
            <SelectInputComponent
              options={IDENTITY_LIST}
              maxLeng={12}
              otherValueDefault={SOCIAL_NUMBER_INPUT}
              name="identityId"
              handleInputChange={(text) => {return text?.replace(/[^0-9]/g, '')}}
              value={request.identityId}
              onChange={(value, name) => handleChangeValue(value, name)}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
            />
            {errors['member_' + index + '_identityId'] ? (
              <p className="text-danger">{errors['member_' + index + '_identityId']}</p>
            ) : null}
          </div>
          <div className="col-4">
            {"Chủ hộ/Thành viên"}<span className="required">(*)</span>
            <Select
              placeholder={isCreateMode ? t("option") : ""}
              options={ROLE_TYPE}
              isClearable={false}
              value={request.type}
              onChange={(e) => handleChangeValue(e, "type")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
            {errors['member_' + index + '_type'] ? (
              <p className="text-danger">{errors['member_' + index + '_type']}</p>
            ) : null}
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

export default MemberInfo;
