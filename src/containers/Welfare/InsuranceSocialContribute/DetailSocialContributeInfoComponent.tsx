import React, { FC, Fragment, useEffect, useState } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import Constants from "../../../commons/Constants";
import _ from "lodash";
import { Image } from "react-bootstrap";
import {
  DECLARE_FORM_OPTIONS,
  HOSPITAL_LINE,
  RECEIVE_TYPE,
  SICK_PLAN,
  WORKING_CONDITION,
} from "../InsuranceComponents/InsuranceData";
import { Spinner } from "react-bootstrap";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import ButtonComponent from "containers/Registration/ButtonComponent";
import DocumentRequired from "../InsuranceComponents/DocumentRequired";
import { IMemberInfo, ISocialContributeModel } from "models/welfare/SocialContributeModel";
import MemberInfo from "./MemberInfo";
import IconAdd from "assets/img/ic-add-green.svg";
import { STATUS, socialNumberType } from "./SocialContributeData";
import { IDropdownValue } from "models/CommonModel";
import { getMuleSoftHeaderConfigurations } from "commons/Utils";
import axios from "axios";
import IconClear from 'assets/img/icon/icon_x.svg'

interface IDetailSocialContributeInfoProps {
  t: any;
  data?: ISocialContributeModel;
  change: any;
  setData: Function;
  supervisors: any[],
  setSupervisors: Function,
  approver: any,
  setApprover?: Function,
  files: any[],
  updateFiles: Function,
  removeFile: Function ,
  members: IMemberInfo[], 
  setMembers: Function,
  isCreateMode: boolean,
  onSubmit: Function
};

const DetailSocailContributeComponent: FC<IDetailSocialContributeInfoProps> = ({
  t,
  data,
  change,
  setData,
  supervisors = [],
  setSupervisors=()=>{},
  approver,
  setApprover=()=>{},
  files = [],
  updateFiles=()=>{},
  removeFile=()=>{},
  members = [{}], 
  setMembers=()=>{},
  isCreateMode = false,
  onSubmit
}) => {
  const [provinces, setprovinces] = useState<IDropdownValue[]>([]);
  const [districts, setdistricts] = useState<IDropdownValue[]>([]);
  const [wards, setwards] = useState<IDropdownValue[]>([]);
  const [errors, setErrors] = useState({});

  const renderValue = (type = STATUS.OLD, value, newValue) => {
    if(type == STATUS.OLD) {
      return <>
      <div className="detail">{value}</div>
      </> 
    } else if (type == STATUS.NEW) {
      return <div className="detail value-new">{newValue}</div>
    } else if (type == STATUS.DELETE) {
      return <>
       <div className="detail value-delete">{value}</div>
      </> 
    } else if (type == STATUS.UPDATE) {
      return (
        <>
          <div className="detail">{value}</div>
          <div className="detail value-update">{newValue}</div>
        </>
      )
    }
  }

  
  return (
    <div className="registration-insurance-section social-contribute input-style">
      {
        !isCreateMode ?
        <>
          <h5 className="pt-0">{'NGÀY CHỈNH SỬA CUỐI CÙNG'}</h5>
          <div className="box shadow-sm cbnv">
            <span style={{ fontWeight: "700" }}>{"Cập nhật: "}</span>
            <span style={{ fontWeight: "100" }}>20/09/2023 10:00:00</span>
            <span style={{ fontWeight: "700" }}>
              {" | Bởi "  + ": "}
            </span>
            <span style={{ fontWeight: "100" }}>annv8</span>
          </div>
        </> : null
      }

      <div className="row">
        <div className="col-6">
          <h5 className={`${isCreateMode ? 'pt-0' : ''}`}>
            {"SỐ SỔ BHXH "}
            <span
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                fontWeight: "300",
                textTransform: "none",
              }}
            >
              (Nếu cấp mới thì để là “Đề nghị cấp sổ”)
            </span>
          </h5>
          <div className="box shadow-sm cbnv">
            {"Số sổ BHXH"}
            {renderValue(change?.data?.socialNumberType, data?.socialNumberType?.label, change?.data?.socialNumberType_value?.label)}
          </div>
        </div>

        
        <div className="col-6">
          <h5 className={`${isCreateMode ? 'pt-0' : ''}`}>{"NƠI ĐĂNG KÝ KCB"}</h5>
          <div className="box shadow-sm cbnv">
            {"Tên cơ sở đăng ký KCB"}
            {renderValue(change?.data?.facilityRegisterName, data?.facilityRegisterName?.label, change?.data?.facilityRegisterName_value?.label)}
          </div>
        </div>
      </div>

    {/* ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ */}
      <h5>{'ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-4">
            {'Số sổ hộ khẩu/số sổ tạm trú'}
            {renderValue(change?.data?.houseHoldNumber, data?.houseHoldNumber, change?.data?.houseHoldNumber_value)}
          </div>
          <div className="col-4">
            {'Tỉnh/Thành phố'}
            <span className="required">(*)</span>
            {renderValue(change?.data?.province, data?.province?.label, change?.data?.province_value?.label)}
          </div>
          <div className="col-4">
            {'Quận/Huyện'}
            <span className="required">(*)</span>
            {renderValue(change?.data?.district, data?.district?.label, change?.data?.district_value?.label)}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {'Xã/Phường'}
            {renderValue(change?.data?.ward, data?.ward?.label, change?.data?.ward_value?.label)}
          </div>

          <div className="col-8">
            {'Số nhà, đường phố, xóm'}
            {renderValue(change?.data?.street, data?.street, change?.data?.street_value)}
          </div>
        </div>
      </div>

      <h5>{'THÔNG TIN HỘ GIA ĐÌNH'}</h5>
      <div className="box shadow-sm cbnv">
        {(members || []).map((request: IMemberInfo, index: number) => {
          if(request.status == STATUS.DELETE) return null;
          return (
            <Fragment key={index}>
              <MemberInfo
                t={t}
                request={request}
                canDelete={members?.length > 0 ? true : false}
                isCreateMode={isCreateMode}
                provinces = {provinces}
                cancelRequest={() => {}}
                updateRequest={(req: IMemberInfo) => {}}
              />
              <div className="mv-10"></div>
            </Fragment>
          );
        })}
      </div>
      
      <h5>{'GHI CHÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-12">
            {'Nội dung'}
            {renderValue(change?.data?.note, data?.note, change?.data?.note_value)}
          </div>
        </div>
      </div>

      <AssessorInfoComponent
        t={t}
        isCreateMode={isCreateMode}
        setSupervisors={setSupervisors}
        supervisors={supervisors}
        approver={approver}
        setApprover={setApprover}
        errors={errors}
      />

      <div className="registration-section">
        <ul className="list-inline">
          {files.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                  <span className="file-name">
                      <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                      {
                        isCreateMode ? <i className="fa fa-times remove" aria-hidden="true" onClick={() => removeFile(index)}></i> : null
                      }
                  </span>
              </li>
          })}
        </ul>
        {
          isCreateMode ?
          <ButtonComponent
          isEdit={false} 
          files={files} 
          updateFiles={updateFiles} 
          submit={() => onSubmit()} 
          isUpdateFiles={()=>{}} 
          disabledSubmitButton={false} 
          validating={false}/> 
          : null
        }
      </div>
    </div>
  );
};

export default DetailSocailContributeComponent;
