import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import ResizableTextarea from "../../Registration/TextareaComponent";
import {
  CONVALES_PLAN,
  DECLARE_FORM_OPTIONS,
  RECEIVE_TYPE,
} from "./InsuranceData";
import Constants from "../../../commons/Constants";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import ButtonComponent from "containers/Registration/ButtonComponent";

const CreateConvalesInsurance = ({
  t,
  type,
  setType,
  data,
  userInfo,
  handleTextInputChange,
  handleChangeSelectInputs,
  handleDatePickerInputChange,
  onSend,
  notifyMessage,
  disabledSubmitButton,
  supervisors,
  setSupervisors,
  approver,
  setApprover,
  files,
  updateFiles,
  removeFile,
  isCreateMode = true
}) => {

  const [errors, setErrors] = useState({});
  const InsuranceOptions = [
    { value: 1, label: t('sick') },
    { value: 2, label: t('maternity') },
    { value: 3, label: t('convales') },
  ];

  const onSubmit = () => {
    const verify = verifyData();
    if (!verify) {
      return;
    }

    const employeeInfo = {
      employeeNo: localStorage.getItem('employeeNo'),
      username: localStorage.getItem('ad')?.toLowerCase(),
      account: localStorage.getItem('email'),
      fullName: localStorage.getItem('fullName'),
      jobTitle: localStorage.getItem('jobTitle'),
      employeeLevel: localStorage.getItem('employeeLevel'),
      department: localStorage.getItem('department')
    }
    const userEmployeeInfo = {
      employeeNo:localStorage.getItem('employeeNo'),
      fullName:localStorage.getItem('fullName'),
      jobTitle:localStorage.getItem('jobTitle'),
      department:localStorage.getItem('department'),
      company_email:localStorage.getItem('plEmail'),
      costCenter: localStorage.getItem('cost_center')
    }

    let appIndex = 1;
    const appraiserInfoLst = supervisors
        .filter((item) => item != null)
        .map((item, index) => ({
          avatar: "",
          account: item?.username.toLowerCase() + "@vingroup.net",
          fullName: item?.fullName,
          employeeLevel: item?.employeeLevel,
          pnl: item?.pnl,
          orglv2Id: item?.orglv2Id,
          current_position: item?.current_position,
          department: item?.department,
          order: appIndex++,
          company_email: item?.company_email?.toLowerCase(),
          type: Constants.STATUS_PROPOSAL.LEADER_APPRAISER,
          employeeNo: item?.uid || item?.employeeNo,
          username: item?.username.toLowerCase(),
        }));

    const approverInfoLst = [
        approver
      ].map((ele, i) => ({
        avatar: "",
        account: ele?.username?.toLowerCase() + "@vingroup.net",
        fullName: ele?.fullName,
        employeeLevel: ele?.employeeLevel,
        pnl: ele?.pnl,
        orglv2Id: ele?.orglv2Id,
        current_position: ele?.current_position,
        department: ele?.department,
        order: appIndex++,
        company_email: ele?.company_email?.toLowerCase(),
        type: Constants.STATUS_PROPOSAL.CONSENTER,
        employeeNo: ele?.uid || ele?.employeeNo,
        username: ele?.username?.toLowerCase(),
      }))

    const formData = new FormData();
    formData.append('requestType', type.value);
    formData.append('requestName', type.label);
    formData.append('formTypeInfo', JSON.stringify({ id: data.declareForm.value, name: data.declareForm.label }));
    formData.append('recommendEnjoyDate', data.dateRequest ? moment(data.dateRequest, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('solvedFirstDate', data.dateLastResolved ? moment(data.dateLastResolved, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('planInfo', data.plan ? JSON.stringify({ id: data.plan.value, name: data.plan.label }) : '');
    formData.append('description', data.note);
    //thong tin ca nhan
    formData.append('fullName', userInfo.fullName);
    formData.append('insuranceNumber', userInfo.socialId);
    formData.append('idNumber', userInfo.IndentifiD);
    formData.append('employeeNo', userInfo.employeeNo);
    formData.append('backToWorkDate', data.startWork ? moment(data.startWork, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');

    //Số ngày đề nghị hưởng chế độ tại đơn vị
    formData.append('receiveBenefitsUnitInfo', JSON.stringify({
      "seriNumber": data.seri,
      "fromDate": data.fromDate ? moment(data.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "toDate": data.toDate ? moment(data.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      total: data.total
    }));
    //Thông tin giám định 
    formData.append('inspectionDataInfo', JSON.stringify({
      "rateOfDecline": data.declineRate,
      "inspectionDate": data.assessmentDate ? moment(data.assessmentDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : ""
    }));
    formData.append(
      "receiveSubsidiesInfo",
      JSON.stringify({
        receivingForm: { id: data.receiveType.value, name: data.receiveType.label },
        bankAccountNumber: data.accountNumber,
        accountName: data.accountName,
        bankCode: data.bankId,
        bankName: data.bankName,
      })
    );

    formData.append('SettlementContent', data.resolveContent);
    formData.append('SettlementPeriod', data.resolveDate ? moment(data.resolveDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('AdditionalPhaseContent', data.addtionContent);
    formData.append('AdditionalPhasePeriod', data.addtionDate ? moment(data.addtionDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    
    formData.append("orgLv2Id", localStorage.getItem("organizationLv2"));
    formData.append("orgLv3Id", localStorage.getItem("divisionId"));
    formData.append("orgLv3Text", localStorage.getItem("division"));
    formData.append("orgLv4Id", localStorage.getItem("regionId"));
    formData.append("orgLv4Text", localStorage.getItem("region"));
    formData.append("orgLv5Id", localStorage.getItem("unitId"));
    formData.append("orgLv5Text", localStorage.getItem("unit"));
    formData.append("orgLv6Id", localStorage.getItem("partId"));
    formData.append("orgLv6Text", localStorage.getItem("part"));
    formData.append("companyCode", localStorage.getItem("companyCode"));
    formData.append('employeeInfo', JSON.stringify(employeeInfo));
    formData.append('UserInfo', JSON.stringify(userEmployeeInfo));

    formData.append("appraiserInfoLst", JSON.stringify(appraiserInfoLst));
    formData.append("approverInfoLst", JSON.stringify(approverInfoLst));
    if (files.filter(item=> item.id == undefined).length > 0) {
      files.filter(item=> item.id == undefined).forEach((file) => {
        formData.append("attachedFiles", file);
      });
    }
    onSend(formData);
  };

  const verifyData = () => {
    let _errors = {};
    const candidateInfos = { ...data };
    const requiredFields = [
      "declareForm",
      "receiveType",
      'plan',
      "seri",
      "total",
    ];
    if(checkRequireAtm()) {
      requiredFields.push("accountNumber",
      "accountName",
      "bankId",
      "bankName");
    }
    const optionFields = ['plan', "declareForm", "receiveType"];
    
    if(!approver) {
      _errors['approver'] = 'Vui lòng nhập giá trị !';
    }
    requiredFields.forEach((name) => {
      if (
        _.isEmpty(candidateInfos[name]) ||
        (!candidateInfos[name].value && optionFields.includes(name))
      ) {
        _errors[name] = "Vui lòng nhập giá trị !";
      } else {
        _errors[name] =
          _errors[name] == "Vui lòng nhập giá trị !" ? null : _errors[name];
      }
    });
    setErrors(_errors);
    const hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage('Vui lòng nhập giá trị !', true);
    }
    return hasErrors ? false : true;
  };

  const checkRequireAtm = () => {
    if(data.receiveType?.value && [2].includes(data.receiveType.value)) {
      return true;
    }
    return false;
  }

  return (
    <>
      {/* YÊU CẦU BẢO HIỂM Y TẾ */}
      <h5>{t('health_insurance_claim')}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t('TypeOfRequest')}
            <span className="required">(*)</span>
            <Select
              placeholder={t('option')}
              options={InsuranceOptions}
              isClearable={false}
              value={type}
              onChange={(e) => setType(e)}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-4">
            {t('generate_declaration_form')}
            <span className="required">(*)</span>
            <Select
              placeholder={t('option')}
              options={DECLARE_FORM_OPTIONS}
              isClearable={false}
              value={data?.declareForm}
              onChange={(e) => handleChangeSelectInputs(e, "declareForm")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["declareForm"] ? (
              <p className="text-danger">{errors["declareForm"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            {t('from_date_applies_benefits')}
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.dateRequest
                  ? moment(
                    data.dateRequest,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "dateRequest")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              disabled={!isCreateMode}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t('from_date_settlement')}
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.dateLastResolved
                  ? moment(
                    data.dateLastResolved,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "dateLastResolved")
              }
              disabled={!isCreateMode}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-8">
            {t('plan')}
            <span className="required">(*)</span>
            <Select
              placeholder={t('option')}
              options={CONVALES_PLAN}
              isClearable={false}
              value={data.plan}
              isDisabled={!isCreateMode}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["plan"] ? (
              <p className="text-danger">{errors["plan"]}</p>
            ) : null}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {t('note')}
            <textarea
              value={data.note}
              onChange={(e) => handleTextInputChange(e, "note")}
              rows={3}
              disabled={!isCreateMode}
              className="mv-10 form-control input w-100"
            />
          </div>
        </div>
      </div>

      {/* THÔNG TIN CÁ NHÂN */}
      <h5>{t('info_profile')}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <span className="required">(*)</span>
            <div className="detail1">{userInfo.fullName}</div>
          </div>
          <div className="col-4">
            {t('id_BHXH')}
            <span className="required">(*)</span>
            <div className="detail1">{userInfo.socialId}</div>
          </div>
          <div className="col-4">
            {t('indenfy_number_2')}
            <span className="required">(*)</span>
            <div className="detail1">{userInfo.personal_id_no}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t('EmployeeNo')}
            <div className="detail1">{userInfo.employeeNo}</div>
          </div>

          <div className="col-4">
            {t('back_to_work_date')}
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.startWork
                  ? moment(data.startWork, Constants.LEAVE_DATE_FORMAT).toDate()
                  : null
              }
              disabled={!isCreateMode}
              onChange={(date) =>
                handleDatePickerInputChange(date, "startWork")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* SỐ NGÀY ĐỀ NGHỊ HƯỞNG CHẾ ĐỘ TẠI ĐƠN VỊ */}
      <h5>{t('number_of_day_benifit')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            {t('seri')}
            <span className="required">(*)</span>
            <input
              value={data.seri}
              disabled={!isCreateMode}
              onChange={(e) => handleTextInputChange(e, "seri")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["seri"] ? (
              <p className="text-danger">{errors["seri"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            <div>{t('StartDate')}</div>
            <DatePicker
              selectsStart
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={data.fromDate ? moment(data.fromDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              maxDate={data.toDate ? moment(data.toDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              startDate={data.fromDate ? moment(data.fromDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              endDate={data.toDate ? moment(data.toDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              onChange={(date) => handleDatePickerInputChange(date, "fromDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              disabled={!isCreateMode}
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-4">
            <div>{t('EndDate')}</div>
            <DatePicker
              selectsEnd
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={data.toDate ? moment(data.toDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              minDate={data.fromDate ? moment(data.fromDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              startDate={data.fromDate ? moment(data.fromDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              endDate={data.toDate ? moment(data.toDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
              onChange={(date) => handleDatePickerInputChange(date, "toDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              disabled={!isCreateMode}
              styles={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {t('total')}
            <span className="required">(*)</span>
            <input
              value={data.total}
              onChange={(e) => handleTextInputChange(e, "total")}
              type="number"
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {errors["total"] ? (
              <p className="text-danger">{errors["total"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* THÔNG TIN GIÁM ĐỊNH */}
      <h5>{t('assessment_information')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{t('rate_of_decline')}</div>
            <input
              value={data.declineRate}
              onChange={(e) => handleTextInputChange(e, "declineRate")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            <div>{t('inspection_date')}</div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.assessmentDate
                  ? moment(
                    data.assessmentDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "assessmentDate")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              disabled={!isCreateMode}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ĐỢT GIẢI QUYẾT */}
      <h5>{t('resolution')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{t('content_batch')}</div>
            <input
              value={data.resolveContent}
              onChange={(e) => handleTextInputChange(e, "resolveContent")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            {t('may')}
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.resolveDate
                  ? moment(
                    data.resolveDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "resolveDate")
              }
              disabled={!isCreateMode}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ĐỢT BỔ SUNG */}
      <h5>{t('bonus_batch')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{t('content_batch')}</div>
            <input
              value={data.addtionContent}
              onChange={(e) => handleTextInputChange(e, "addtionContent")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            {t('may')}
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.addtionDate
                  ? moment(
                    data.addtionDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "addtionDate")
              }
              disabled={!isCreateMode}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* HÌNH THỨC TRỢ CẤP */}
      <h5>{t('type_support')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>
              {t('receiving_form')}
              <span className="required">(*)</span>
            </div>
            <Select
              placeholder={t('option')}
              options={RECEIVE_TYPE}
              isClearable={false}
              value={data.receiveType}
              isDisabled={!isCreateMode}
              onChange={(e) => handleChangeSelectInputs(e, "receiveType")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["receiveType"] ? (
              <p className="text-danger">{errors["receiveType"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            <div>
              {t('account_number')}
              {checkRequireAtm() ? <span className="required">(*)</span> : null}
            </div>
            <input
              value={data.accountNumber}
              onChange={(e) => handleTextInputChange(e, "accountNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {errors["accountNumber"] ? (
              <p className="text-danger">{errors["accountNumber"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            {t('account_name')}
            {checkRequireAtm() ? <span className="required">(*)</span> : null}
            <input
              value={data.accountName}
              onChange={(e) => handleTextInputChange(e, "accountName")}
              type="text"
              disabled={!isCreateMode}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["accountName"] ? (
              <p className="text-danger">{errors["accountName"]}</p>
            ) : null}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>
              {t('bank_code')}
              {checkRequireAtm() ? <span className="required">(*)</span> : null}
            </div>
            <input
              value={data.bankId}
              onChange={(e) => handleTextInputChange(e, "bankId")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
            {errors["bankId"] ? (
              <p className="text-danger">{errors["bankId"]}</p>
            ) : null}
          </div>
          <div className="col-8">
            <div>
              {t('bank_name')}
              {checkRequireAtm() ? <span className="required">(*)</span> : null}
            </div>
            <input
              value={data.bankName}
              onChange={(e) => handleTextInputChange(e, "bankName")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {errors["bankName"] ? (
              <p className="text-danger">{errors["bankName"]}</p>
            ) : null}
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
      />
      {errors["approver"] ? (
        <p className="text-danger">{errors["approver"]}</p>
      ) : null}

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
            submit={onSubmit} 
            isUpdateFiles={()=>{}} 
            disabledSubmitButton={disabledSubmitButton} 
            validating={disabledSubmitButton}/>
          : null
        }
        
      </div>
    </>
  );
};

export default withTranslation()(CreateConvalesInsurance);
