import React, { FC, Fragment, useEffect, useState } from "react";
import _ from "lodash";
import ProcessHistoryComponent from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent";
import { ITaxInfoModel, ITaxMemberInfo } from "./TaxModel.types";
import moment from "moment";
import DetailTaxMemberInfo from "./DetailTaxMemberInfo";
import {
  STATUS,
  TaxAuthorizationOptions,
  getTaxAuthrizationOptions,
} from "./TaxConstants";
import AssessorInfoComponent from "containers/Welfare/InternalPayment/component/AssessorInfoComponent";

interface IDetailTaxFinalizationComponent {
  t: any;
  data?: ITaxInfoModel;
  change: any;
  supervisors: any[];
  approver: any;
  files: any[];
  members: ITaxMemberInfo[];
  isCreateMode: boolean;
  onSubmit: Function;
  lastModified?: any;
  timeRequest: any;
  userInfo: any;
  templates: any;
}

const DetailTaxFinalizationComponent: FC<IDetailTaxFinalizationComponent> = ({
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
  lastModified,
  templates = {}
}) => {
  const renderValue = (type = STATUS.OLD, value, newValue) => {
    if (typeof type == "string") type = parseInt(type);
    let showColumn = false;
    if (
      (value && typeof value != "string") ||
      (newValue && typeof newValue != "string")
    ) {
      showColumn = true;
    }
    if (type == STATUS.OLD) {
      return (
        <>
          <div className={`detail ${showColumn ? "show-column" : ""}`}>
            {value}
          </div>
        </>
      );
    } else if (type == STATUS.NEW) {
      return (
        <div className={`detail ${showColumn ? "show-column" : ""} value-new`}>
          {newValue}
        </div>
      );
    } else if (type == STATUS.DELETE) {
      return (
        <>
          <div
            className={`detail ${showColumn ? "show-column" : ""} value-delete`}
          >
            {value}
          </div>
        </>
      );
    } else if (type == STATUS.UPDATE) {
      return (
        <>
          <div className={`detail ${showColumn ? "show-column" : ""}`}>
            {value}
          </div>
          <div
            className={`detail ${showColumn ? "show-column" : ""} value-update`}
          >
            {newValue}
          </div>
        </>
      );
    }
  };
  const linkTemplate = data?.typeRequest?.value ? templates[data?.typeRequest?.value] : '';
  return (
    <div className="registration-insurance-section social-contribute input-style">
      <h5 className="pt-0">{t("RegistrationUpdateInformation")}</h5>
      <div className="box shadow-sm cbnv mb-4">
        <ul className="d-flex">
          <li className="d-flex align-items-center">
            <span className="box-color value-old"></span>
            <span>{t("Record")}</span>
          </li>
          <li className="d-flex align-items-center">
            <span className="box-color value-update"></span>
            <span>{t("UpdateInformation")}</span>
          </li>
          <li className="d-flex align-items-center">
            <span className="box-color value-new"></span>
            <span>{t("NewInformation")}</span>
          </li>
          <li className="d-flex align-items-center">
            <span className="box-color value-delete"></span>
            <span>{t("RemovedInfo")}</span>
          </li>
        </ul>
      </div>
      <h5 className="pt-0">{t("EmployeeInfomation")}</h5>
      <div className="box shadow-sm cbnv mb-4">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <div className="detail">{userInfo.fullName}</div>
          </div>
          <div className="col-4">
            {t("EmployeeNo")}
            <div className="detail">{userInfo.employeeNo}</div>
          </div>
          <div className="col-4">
            {t("PitNo")}
            {renderValue(
              change?.data?.PitNo,
              data?.PitNo,
              change?.data?.PitNo_value
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            {t("IdNo")}
            <div className="detail">{userInfo.idNumber}</div>
          </div>
          <div className="col-4">
            {t("DateIssue")}
            <div className="detail">
              {userInfo.dateOfIssue
                ? moment(userInfo.dateOfIssue, "YYYY-MM-DD").format(
                    "DD/MM/YYYY"
                  )
                : ""}
            </div>
          </div>
          <div className="col-4">
            {t("PlaceIssue")}
            <div className="detail">{userInfo.placeOfIssue}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            {t("so_nguoi_phu_thuoc")}
            {renderValue(
              change?.data?.dependentNumber,
              data?.dependentNumber,
              change?.data?.dependentNumber_value
            )}
          </div>
        </div>
      </div>

      <h5 className="pt-0">{t("so_nguoi_phu_thuoc")}</h5>
      <div className="box shadow-sm cbnv">
        {(members || []).map((request: ITaxMemberInfo, index: number) => {
          return (
            <Fragment key={index}>
              <DetailTaxMemberInfo
                t={t}
                request={request}
                status={change.member[index]?.status}
                change={change.member[index]?.value}
              />
              <div className="mv-10"></div>
            </Fragment>
          );
        })}
        {(
          change?.member
            ?.filter((mem: any) => mem?.status == STATUS.NEW)
            ?.map((mem: any) => mem.value) || []
        ).map((request: ITaxMemberInfo, index: number) => {
          return (
            <Fragment key={index}>
              <DetailTaxMemberInfo
                t={t}
                request={request}
                status={STATUS.NEW}
              />
              <div className="mv-10"></div>
            </Fragment>
          );
        })}
      </div>

      <h5 className="pt-0">{t("Request")}</h5>
      <div className="box shadow-sm cbnv">
        <div className="d-flex flex-row">
          {getTaxAuthrizationOptions(t).map((option, index) => (
            <React.Fragment key={index}>
              <span className="d-flex flex-row align-items-center">
                <input
                  type="radio"
                  id={"action_accept" + option.value}
                  name={"action" + option.value}
                  readOnly={true}
                  checked={data?.typeRequest?.value == option.value}
                />
                <label
                  htmlFor={"action_accept" + option.value}
                  className="ml-1"
                >
                  {option.label}
                </label>
              </span>
              <div className="mr-3" />
            </React.Fragment>
          ))}
        </div>
        {data?.typeRequest?.value == TaxAuthorizationOptions.EXPOSE_TAX ? (
          <>
            <div
              className="w-100 "
              style={{
                height: "1px",
                width: "100%",
                backgroundColor: "#DEE2E6",
                margin: "12px 0",
              }}
            ></div>
            <div className="row mv-10">
              <div className="col-6">
                {t('email_nhan_chung_tu')}
                {renderValue(
                  change?.data?.email,
                  data?.email,
                  change?.data?.email_value
                )}
              </div>
              <div className="col-6">
                {t("noi_nhan_chung_tu")}
                {renderValue(
                  change?.data?.address,
                  data?.address,
                  change?.data?.address_value
                )}
              </div>
            </div>
            <div className="row mv-10">
              <div className="col-4">
                {t("IdNo")}
                {renderValue(
                  change?.data?.idNumber,
                  data?.idNumber,
                  change?.data?.idNumber_value
                )}
              </div>
              <div className="col-2">
                {t("DateIssue")}
                {renderValue(
                  change?.data?.dateIssue,
                  data?.dateIssue,
                  change?.data?.dateIssue_value
                )}
              </div>
              <div className="col-6">
                {t("PlaceIssue")}
                {renderValue(
                  change?.data?.placeIssue,
                  data?.placeIssue,
                  change?.data?.placeIssue_value
                )}
              </div>
            </div>
          </>
        ) : null}
        <div
          className="w-100 "
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "#DEE2E6",
            margin: "12px 0",
          }}
        ></div>

        <div className="d-flex flex-row">
          <span>{t("tax_document_guide")} </span>
          <span style={{ width: "5px" }} />
          <a href={linkTemplate} target="_blank">{t("Here")}</a>.
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

      <h5 style={{ paddingTop: "16px" }}>
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
            return (
              <li className="list-inline-item" key={index}>
                <span className="file-name">
                  <a
                    title={file.name}
                    href={file.fileUrl}
                    download={file.name}
                    target="_blank"
                  >
                    {file.name}
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DetailTaxFinalizationComponent;
