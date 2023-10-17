import React, { FC, Fragment, useEffect, useState } from "react";
import _ from "lodash";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import { IMemberInfo, ISocialContributeModel } from "models/welfare/SocialContributeModel";
import { STATUS, socialNumberType } from "./SocialContributeData";
import DetailMemberInfo from "./DetailMemberInfo";
import ProcessHistoryComponent from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent";

interface IDetailSocialContributeInfoProps {
  t: any;
  data?: ISocialContributeModel;
  change: any;
  supervisors: any[],
  approver: any,
  files: any[],
  members: IMemberInfo[],
  isCreateMode: boolean,
  onSubmit: Function
  lastModified?: any,
  timeRequest: any;
  userInfo: any;
};

const DetailSocailContributeComponent: FC<IDetailSocialContributeInfoProps> = ({
  t,
  data,
  change,
  supervisors = [],
  timeRequest,
  approver,
  files = [],
  members = [{}],
  isCreateMode = false,
  onSubmit,
  userInfo,
  lastModified
}) => {

  const renderValue = (type = STATUS.OLD, value, newValue) => {
    if(typeof type == 'string') type = parseInt(type);
    let showColumn = false;
    if((value && typeof value != 'string') || (newValue && typeof newValue != 'string')) {
      showColumn = true;
    }
    if(type == STATUS.OLD) {
      return <>
      <div className={`detail ${showColumn ? 'show-column' : ''}`}>{value}</div>
      </> 
    } else if (type == STATUS.NEW) {
      return <div className={`detail ${showColumn ? 'show-column' : ''} value-new`}>{newValue}</div>
    } else if (type == STATUS.DELETE) {
      return <>
       <div className={`detail ${showColumn ? 'show-column' : ''} value-delete`}>{value}</div>
      </> 
    } else if (type == STATUS.UPDATE) {
      return (
        <>
          <div className={`detail ${showColumn ? 'show-column' : ''}`}>{value}</div>
          <div className={`detail ${showColumn ? 'show-column' : ''} value-update`}>{newValue}</div>
        </>
      )
    }
  }
  return (
    <div className="registration-insurance-section social-contribute input-style">
      {
        lastModified?.date ?
        <>
          <h5 className="pt-0">{'NGÀY CHỈNH SỬA CUỐI CÙNG'}</h5>
          <div className="box shadow-sm cbnv mb-4">
            <span style={{ fontWeight: "700" }}>{"Cập nhật: "}</span>
            <span style={{ fontWeight: "100" }}>{lastModified?.date}</span>
            <span style={{ fontWeight: "700" }}>
              {" | Bởi "  + ": "}
            </span>
            <span style={{ fontWeight: "100" }}>{lastModified?.by}</span>
          </div>
        </> : null
      }

      <h5 className="pt-0">{'THÔNG TIN NGƯỜI TẠO YÊU CẦU'}</h5>
      <div className="box shadow-sm cbnv mb-4">
        <div className="row">
          <div className="col-3">
            {t('FullName')}
            <div className="detail">{userInfo.fullName}</div>
          </div>
          <div className="col-3">
            {t('EmployeeNo')}
            <div className="detail">{userInfo.employeeNo}</div>
          </div>
          <div className="col-3">
            {t('Title')}
            <div className="detail">{userInfo.jobTitle}</div>
          </div>
          <div className="col-3">
            {t('DepartmentManage')}
            <div className="detail">{userInfo.department}</div>
          </div>
        </div>
      </div>

      <h5 className="pt-0">{'THÔNG TIN ĐĂNG KÝ CHỈNH SỬA'}</h5>
      <div className="box shadow-sm cbnv mb-4">
        <ul className="d-flex">
            <li className="d-flex align-items-center"><span className="box-color value-old"></span><span>{t("Record")}</span></li>
            <li className="d-flex align-items-center"><span className="box-color value-update"></span><span>{t("UpdateInformation")}</span></li>
            <li className="d-flex align-items-center"><span className="box-color value-new"></span><span>{t("NewInformation")}</span></li>
            <li className="d-flex align-items-center"><span className="box-color value-delete"></span><span>{t("RemovedInfo")}</span></li>
        </ul>
      </div>

      <div className="row">
        <div className="col-6">
          <h5 className={`pt-0`}>
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
          <h5 className={`pt-0`}>{"NƠI ĐĂNG KÝ KCB"}</h5>
          <div className="box shadow-sm cbnv">
            {"Tên cơ sở đăng ký KCB"}
            {renderValue(change?.data?.facilityRegisterName, data?.facilityRegisterName?.label, change?.data?.facilityRegisterName_value?.label)}
          </div>
        </div>
      </div>

    {/* ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ */}
      <h5 className="pt-0">{'ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-4">
            {'Số sổ hộ khẩu/số sổ tạm trú'}
            {renderValue(change?.data?.houseHoldNumber, data?.houseHoldNumber, change?.data?.houseHoldNumber_value)}
          </div>
          <div className="col-4">
            {'Tỉnh/Thành phố'}
            {renderValue(change?.data?.province, data?.province?.label, change?.data?.province_value?.label)}
          </div>
          <div className="col-4">
            {'Quận/Huyện'}
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

      <h5 className="pt-0">{'THÔNG TIN HỘ GIA ĐÌNH'}</h5>
      <div className="box shadow-sm cbnv">
        {(members || []).map((request: IMemberInfo, index: number) => {
          return (
            <Fragment key={index}>
              <DetailMemberInfo
                t={t}
                request={request}
                status = {change.member[index]?.status}
                change={change.member[index]?.value}
              />
              <div className="mv-10"></div>
            </Fragment>
          );
        })}
        {(change?.member?.filter((mem: any) => mem?.status == STATUS.NEW)?.map((mem: any) => mem.value) || []).map((request: IMemberInfo , index: number) => {
          return (<Fragment key={index}>
              <DetailMemberInfo
                t={t}
                request={request}
                status = {STATUS.NEW}
              />
              <div className="mv-10"></div>
            </Fragment>)
        })}
      </div>
      
      <h5 className="pt-0">{'GHI CHÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-12">
            {'Nội dung'}
            {renderValue(change?.data?.note, data?.note?.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>),
            change?.data?.note_value?.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
            )}
          </div>
        </div>
      </div>

      <AssessorInfoComponent
        t={t}
        isCreateMode={false}
        setSupervisors={() => {}}
        supervisors={supervisors}
        approver={approver}
        setApprover={() => {}}
        errors={{}}
      />

      <h5 style={{paddingTop: '16px'}}>
        {t("RequestHistory").toUpperCase()}
      </h5>
      <div className="timesheet-section">
        <div className="timesheet-box1 timesheet-box shadow-sm">
          <ProcessHistoryComponent
            createdDate={timeRequest?.createDate}
            coordinatorDate={null}
            requestAppraisers={supervisors}
            approvedDate={timeRequest?.approvedDate}
          />
        </div>
      </div>

      <div className="registration-section">
        <ul className="list-inline">
          {files.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                  <span className="file-name">
                      <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                  </span>
              </li>
          })}
        </ul>
      </div>
    </div>
  );
};

export default DetailSocailContributeComponent;
