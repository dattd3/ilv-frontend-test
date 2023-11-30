import React, { FC, Fragment, useEffect, useState } from "react";
import _ from "lodash";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import { ISocialSupportModel } from "models/welfare/SocialContributeModel";
import ProcessHistoryComponent from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent";
import { toast } from "react-toastify";

interface IDetailSocialSupportInfoProps {
  t: any;
  data?: ISocialSupportModel;
  supervisors: any[],
  approver: any,
  files: any[],
  timeRequest: any;
  userInfo: any;
  templates: any
};

const DetailSocailSupportComponent: FC<IDetailSocialSupportInfoProps> = ({
  t,
  data,
  supervisors = [],
  timeRequest,
  approver,
  files = [],
  userInfo,
  templates
}) => {

  const onDownloadTemplate = () => {
    if(!data?.type?.value || !templates || !templates[data?.type?.value]) {
      toast.error('Không có tài liệu')
      return;
    }
    const link = document.createElement('a');
    link.href = templates[data.type?.value];
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }

  return (
    <div className="registration-insurance-section social-contribute input-style">
      <h5 className="pt-0 m-0">{'THÔNG TIN NGƯỜI TẠO YÊU CẦU'}</h5>
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

      <div className="box shadow-sm cbnv">
        {t('TypeOfRequest')} 
        <div className={`detail`}>{data?.type?.label}</div>
      </div>

      <h5 className="pt-0 m-0">{t('ListDocumentNeedSend')}</h5>
      <div className="box shadow-sm cbnv mb-0">
        <div className="row">
          <div className="col-12">
            {t('RequestDownloadDocument')}
            <a style={{color: '#007bff', cursor: 'pointer'}} onClick={() => onDownloadTemplate()}>{t('Here')}</a>
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
      <div className="timesheet-section" style={{marginBottom: '16px'}}>
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
