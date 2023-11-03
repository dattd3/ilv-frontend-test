import React, { FC, Fragment, useEffect, useState } from "react";
import _ from "lodash";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import { ISocialSupportModel } from "models/welfare/SocialContributeModel";
import ProcessHistoryComponent from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent";

interface IDetailSocialSupportInfoProps {
  t: any;
  data?: ISocialSupportModel;
  supervisors: any[],
  approver: any,
  files: any[],
  timeRequest: any;
  userInfo: any;
};

const DetailSocailSupportComponent: FC<IDetailSocialSupportInfoProps> = ({
  t,
  data,
  supervisors = [],
  timeRequest,
  approver,
  files = [],
  userInfo
}) => {

  return (
    <div className="registration-insurance-section social-contribute input-style">
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

      <div className="row">
        <div className="col-12">
          <div className="box shadow-sm cbnv">
            {t('TypeOfRequest')} 
            <div className={`detail`}>{data?.type?.label}</div>
          </div>
        </div>
      </div>

      <h5 className="pt-0">{t('ListDocumentNeedSend')}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-12">
            {t('RequestDownloadDocument')}
            <a style={{color: '#007bff'}}>{t('Here')}</a>
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

export default DetailSocailSupportComponent;
