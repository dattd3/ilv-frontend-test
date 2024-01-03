import React, { useCallback, useState } from "react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import _ from "lodash";
import { ITaxMemberInfo } from "containers/Registration/TaxFinalization/TaxModel.types";
import { STATUS } from "./TaxConstants";

interface IDetailTaxMemberInfo {
  t: any;
  request: ITaxMemberInfo;
  status?: number;
  change?: any;
}

function DetailTaxMemberInfo({
  t,
  request,
  status,
  change,
}: IDetailTaxMemberInfo) {
  const renderValue = (type = STATUS.OLD, value, newValue) => {
    if (type == STATUS.UPDATE) {
      if (newValue != undefined && newValue != value) {
        return (
          <>
            <div className="detail">{value}</div>
            <div className="detail value-update">{newValue}</div>
          </>
        );
      } else {
        type = STATUS.OLD;
      }
    }
    if (type == STATUS.OLD) {
      return (
        <>
          <div className="detail">{value}</div>
        </>
      );
    } else if (type == STATUS.NEW) {
      return <div className="detail value-new">{value}</div>;
    } else if (type == STATUS.DELETE) {
      return (
        <>
          <div className="detail value-delete">{value}</div>
        </>
      );
    }
  };

  return (
    <div className="item-contain position-relative">
      <div className="request-content">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            {renderValue(status, request.fullName, change?.fullName)}
          </div>
          <div className="col-4">
            {t("Relationship")}{" "}
            {renderValue(
              status,
              request.relation?.label,
              change?.relation?.label
            )}
          </div>

          <div className="col-2">
            {t("From")}{" "}
            <div className="content input-container">
              <label>
                {renderValue(status, request.fromDate, change?.fromDate)}
                <span
                  className="input-group-addon input-img"
                  style={{ bottom: "25px" }}
                >
                  <img src={IconDatePicker} alt="Date" />
                </span>
              </label>
            </div>
          </div>
          <div className="col-2">
            {t("To")}{" "}
            <div className="content input-container">
              <label>
                {renderValue(status, request.toDate, change?.toDate)}
                <span
                  className="input-group-addon input-img"
                  style={{ bottom: "25px" }}
                >
                  <img src={IconDatePicker} alt="Date" />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailTaxMemberInfo;
