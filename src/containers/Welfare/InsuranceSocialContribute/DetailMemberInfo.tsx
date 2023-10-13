import React, { useCallback, useState } from "react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import { IDropdownValue } from "models/CommonModel";
import _ from "lodash";
import { IMemberInfo } from "models/welfare/SocialContributeModel";
import {STATUS } from "./SocialContributeData";

interface IMemberInfoProps {
  t: any;
  request: IMemberInfo;
  status?: number
  change?: any;
}

function DetailMemberInfo({
  t,
  request,
  status,
  change
}: IMemberInfoProps) {

  const renderValue = (type = STATUS.OLD, value, newValue) => {
    if (type == STATUS.UPDATE) {
        if(newValue != undefined && newValue != value) {
            return (
                <>
                  <div className="detail">{value}</div>
                  <div className="detail value-update">{newValue}</div>
                </>
              )
        } else {
            type = STATUS.OLD;
        }
    }
    if(type == STATUS.OLD) {
      return <>
      <div className="detail">{value}</div>
      </> 
    } else if (type == STATUS.NEW) {
      return <div className="detail value-new">{value}</div>
    } else if (type == STATUS.DELETE) {
      return <>
       <div className="detail value-delete">{value}</div>
      </> 
    }
  }

  return (
    <div className="item-contain position-relative">
      <div className="request-content">
        <div className="row">
          <div className="col-4">
            {"Quan hệ với CBNV"}{" "}
            {renderValue(status, request.relation?.label, change?.relation?.label)}
          </div>
          <div className="col-4">
            {"Họ tên"}
            {renderValue(status, request.fullName, change?.fullName)}
          </div>
          <div className="col-4">
            {"Giới tính"}{" "}
            {renderValue(status, request.sex?.label, change?.sex?.label)}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            {"Ngày sinh"}{" "}
            <div className="content input-container" >
              <label>
                {renderValue(status, request.birthDate , change?.birthDate)}
                <span className="input-group-addon input-img" style={{bottom: '22px'}}>
                  <img src={IconDatePicker} alt="Date" />
                </span>
              </label>
            </div>
          </div>
          <div className="col-4">
            {"CMND/CCCD/Định danh cá nhân"}
            {renderValue(status, request.identityId?.label, change?.identityId?.label)}

          </div>
          <div className="col-4">
            {"Chủ hộ/Thành viên"}
            {renderValue(status, request.type?.label, change?.type?.label)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailMemberInfo;
