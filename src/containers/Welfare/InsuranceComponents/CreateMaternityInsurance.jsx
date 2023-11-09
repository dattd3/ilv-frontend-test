import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import ResizableTextarea from "../../Registration/TextareaComponent";
import {
  BIRTH_CONDITION,
  DECLARE_FORM_OPTIONS,
  MATERNITY_CONDITION,
  MATERNITY_PLAN,
  MATERNITY_REGIME,
  RECEIVE_TYPE,
  YES_NO,
} from "./InsuranceData";
import Constants from "../../../commons/Constants";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import ButtonComponent from "containers/Registration/ButtonComponent";
import DocumentRequired from "./DocumentRequired";

const CreateMaternityInsurance = ({
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
    formData.append('maternityRegimeInfo', data.maternityRegime ? JSON.stringify({ id: data.maternityRegime.value, name: data.maternityRegime.label }) : '');
    formData.append('pregnancyCheckUpInfo', data.maternityCondition ? JSON.stringify({ id: data.maternityCondition.value, name: data.maternityCondition.label }) : '');
    formData.append('conditionsChildbirth', data.birthCondition ? JSON.stringify({ id: data.birthCondition.value, name: data.birthCondition.label }) : '');
    formData.append('nurturerInsuranceNumber', data.raiserInsuranceNumber);
    formData.append('recommendEnjoyDate', data.dateRequest ? moment(data.dateRequest, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('solvedFirstDate', data.dateLastResolved ? moment(data.dateLastResolved, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('childcareLeaveInfo', data.dadCare ? JSON.stringify({ id: data.dadCare.value, name: data.dadCare.label }) : '');
    formData.append('planInfo', data.plan ? JSON.stringify({ id: data.plan.value, name: data.plan.label }) : '');
    formData.append('reasonRequestingAdjustment', data.reason);
    formData.append('description', data.note);
    //thong tin ca nhan
    formData.append('fullName', userInfo.fullName);
    formData.append('insuranceNumber', userInfo.socialId);
    formData.append('idNumber', userInfo.IndentifiD);
    formData.append('employeeNo', userInfo.employeeNo);
    formData.append('backToWorkDate', data.startWork ? moment(data.startWork, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('weeklyRestDay', data.leaveOfWeek)

    formData.append('certificateInsuranceBenefit', JSON.stringify({
      hospitalLine: data.hospitalLine?.label || '',
      seriNumber: data.seri,
      fromDate: data.fromDate ? moment(data.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      toDate: data.toDate ? moment(data.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      total: data.total
    }));

    //Chỉ định chế độ nghỉ hưởng của bác sĩ

    formData.append('indicationSickLeaveInfo', JSON.stringify({
      "seriNumber": data.seri,
      "fromDate": data.fromDate ? moment(data.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      toDate: data.toDate ? moment(data.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      total: data.total
    }));

    // Thông tin của con
    formData.append('childrenDataInfo', JSON.stringify({
      socialInsuranceNumber: data.childInsuranceNumber,
      "healthInsuranceNumber": data.childHealthNumber,
      "ageOfFetus": data.age,
      "childDob": data.childBirth ? moment(data.childBirth, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "childDiedDate": data.childDead ? moment(data.childDead, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "numberOfChildren": data.childNumbers,
      "numberOfDeadChildren": data.childDeadNumbers,
      "adoptionDate": data.childReceiveDate ? moment(data.childReceiveDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "dateReceivingBiologicalChild": data.childRaiseDate ? moment(data.childRaiseDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''
    }));

    //Thông tin của mẹ
    formData.append('motherDataInfo', JSON.stringify({
      "socialInsuranceNumber": data.momInsuranceNumber,
      "healthInsuranceNumber": data.momHealthNumber,
      "motherIdNumber": data.momIdNumber,
      "pregnancyVacation": data.maternityLeave ? { id: data.maternityLeave.value, name: data.maternityLeave.label } : '',
      "surrogacy": data.hasRainser ? { id: data.hasRainser.value, name: data.hasRainser.label } : '',
      "surgeryOrPregnancy": data.hasSurgery ? { id: data.hasSurgery.value, name: data.hasSurgery.label } : '',
      "motherDiedDate": data.momDeadDate ? moment(data.momDeadDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "conclusionDate": data.resultDate ? moment(data.resultDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "medicalAssessmentFee": data.assessment
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
      "maternityRegime",
      "plan",
      "leaveOfWeek",
      "seri",
      "fromDate",
      "toDate",
      "total"
    ];
    if(checkRequireAtm()) {
      requiredFields.push("accountNumber",
      "accountName",
      "bankId",
      "bankName");
    }
    //check người thẩm định
    if(supervisors?.length == 0 || !supervisors.every(sup => sup != null)) {
      _errors['supervisors'] = t('PleaseEnterInfo');
    }
    if(!approver) {
      _errors['approver'] = t('PleaseEnterInfo');
    }
    if(checkRequireGestationalAge()) {
      requiredFields.push('age');
    }
    if(checkRequireChildNumber()) {
      requiredFields.push('childBirth','childNumbers')
    }
    if(checkRequireChildDie()) {
      requiredFields.push('childDead', 'childDeadNumbers');
    }
    if(checkRequireChildReceiveDate()) {
      requiredFields.push('childReceiveDate');
    }
    if(checkRequireMomInfo()) {
      requiredFields.push('momInsuranceNumber', 'momHealthNumber', 'momIdNumber');
    }
    const optionFields = ["declareForm", "receiveType", "plan"];

    requiredFields.forEach((name) => {
      if (
        _.isEmpty(candidateInfos[name]) ||
        (!candidateInfos[name].value && optionFields.includes(name))
      ) {
        _errors[name] = t('PleaseEnterInfo');
      } else {
        _errors[name] =
          _errors[name] == t('PleaseEnterInfo') ? null : _errors[name];
      }
    });
    setErrors(_errors);

    let hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage(t('PleaseEnterInfo'), true);
    }
    //check files
    if(!hasErrors) {
      let checkfiles = (!files || files?.length === 0) ? t("Required") + ' ' + t('AttachmentFile') : null
      if(checkfiles) {
        notifyMessage(checkfiles);
        hasErrors = true;
      }
    }
    return hasErrors ? false : true;
  };

  const showError = (key) => {
    if(!key) return null;
    return errors[key] ? (
      <p className="text-danger">{errors[key]}</p>
    ) : null
  }

  //check yêu cầu tuổi thai
  const checkRequireGestationalAge = () => {
    if(data.maternityRegime?.value && ['T1', 'T2'].includes(data.maternityRegime.value)) {
      return true;
    }
    return false;
  }

  //check yeu cau ngay sinh con + so con
  const checkRequireChildNumber = () => {
    if(data.maternityRegime?.value && ['T4.1', 'T4.2', 'T8', 'T10', 'T11', 'T12', 'T13'].includes(data.maternityRegime.value)) {
      return true;
    }
    return false;
  }

  const checkRequireChildDie = () => {
    if(data.maternityRegime?.value && ['T6.1', 'T6.2', 'T6.3'].includes(data.maternityRegime.value)) {
      return true;
    }
    return false;
  }
  
  const checkRequireChildReceiveDate = () => {
    if(data.maternityRegime?.value && ['T8'].includes(data.maternityRegime.value)) {
      return true;
    }
    return false;
  }

  const checkRequireMomInfo = () => {
    if(data.maternityRegime?.value && ['T12', 'T13'].includes(data.maternityRegime.value)) {
      return true;
    }
    return false;
  }
  const checkRequireAtm = () => {
    if(data.receiveType?.value && ['2'].includes(data.receiveType.value)) {
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
              value={data.declareForm}
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
            {t('case_of_maternity_benefits')}
            <span className="required">(*)</span>
            <Select
              placeholder={t('option')}
              options={MATERNITY_REGIME}
              isClearable={false}
              value={data.maternityRegime}
              isDisabled={!isCreateMode}
              onChange={(e) => handleChangeSelectInputs(e, "maternityRegime")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {showError('maternityRegime')}
          </div>
        </div>
        <div className="row mv-10">
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
              disabled={!isCreateMode}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
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
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              disabled={!isCreateMode}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-4">
            {t('conditions_for_antenatal')}
            <Select
              placeholder={t('option')}
              options={MATERNITY_CONDITION}
              isClearable={false}
              value={data.maternityCondition}
              isDisabled={!isCreateMode}
              onChange={(e) =>
                handleChangeSelectInputs(e, "maternityCondition")
              }
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t('conditions_for_giving_birth')}
            <Select
              placeholder={t('option')}
              options={BIRTH_CONDITION}
              isClearable={false}
              value={data.birthCondition}
              isDisabled={!isCreateMode}
              onChange={(e) => handleChangeSelectInputs(e, "birthCondition")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-8">
            {t('number_of_social_of_the_caregiver')}
            <input
              type="text"
              value={data.raiserInsuranceNumber}
              disabled={!isCreateMode}
              onChange={(e) =>
                handleTextInputChange(e, "raiserInsuranceNumber")
              }
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t('father_off_take_children')}
            <Select
              placeholder={t('option')}
              options={YES_NO}
              isClearable={false}
              value={data.dadCare}
              isDisabled={!isCreateMode}
              onChange={(e) => handleChangeSelectInputs(e, "dadCare")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-8">
            {t('plan')}
            <span className="required">(*)</span>
            <Select
              placeholder={t('option')}
              options={MATERNITY_PLAN}
              isClearable={false}
              value={data.plan}
              isDisabled={!isCreateMode}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {showError('plan')}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {t('reason_for_request_adjustment')}
            <textarea
              rows={3}
              disabled={!isCreateMode}
              className="mv-10 form-control input w-100"
              value={data.reason}
              onChange={(e) => handleTextInputChange(e, "reason")}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {t('note')}
            <textarea
              rows={3}
              disabled={!isCreateMode}
              className="mv-10 form-control input w-100"
              value={data.note}
              onChange={(e) => handleTextInputChange(e, "note")}
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
            <div className="detail1">{userInfo.IndentifiD}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t('EmployeeNo')}
            <div className="detail1">{userInfo.employeeNo}</div>
          </div>

          <div className="col-4">
            {t('weekly_holiday')}
            <span className="required">(*)</span>
            <input
              type="text"
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {showError('leaveOfWeek')}
          </div>

          <div className="col-4">
            {t('start_work_real')}
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.startWork
                  ? moment(data.startWork, Constants.LEAVE_DATE_FORMAT).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "startWork")
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

      {/* CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ */}
      <h5>{t('doctor_representation')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            {t('seri_storage')}
            <span className="required">(*)</span>
            <input
              value={data.seri}
              onChange={(e) => handleTextInputChange(e, "seri")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {showError("seri")}
          </div>
          <div className="col-4">
            <div>{t('StartDate')} <span className="required">(*)</span></div>
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
              disabled={!isCreateMode}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
            {showError("fromDate")}
          </div>
          <div className="col-4">
            <div>{t('EndDate')} <span className="required">(*)</span></div>
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
            {showError("toDate")}
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
              autoComplete="off"
              disabled={!isCreateMode}
            />
            {showError("total")}
          </div>
        </div>
      </div>

      {/* THÔNG TIN CỦA CON */}
      <h5>{t('kid_information')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>{t('number_social_insurance_of_child')}</div>
            <input
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            <div>{t('number_insurance_of_child')}</div>
            <input
              value={data.childHealthNumber}
              onChange={(e) => handleTextInputChange(e, "childHealthNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            <div>{t('gestational_age')}
              {checkRequireGestationalAge() ? <span className="required">(*)</span> : null}
            </div>
            <input
              value={data.age}
              onChange={(e) => handleTextInputChange(e, "age")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
            {showError("age")}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>{t('birth_date')}
            {checkRequireChildNumber() ? <span className="required">(*)</span> : null}
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.childBirth
                  ? moment(
                    data.childBirth,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "childBirth")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              disabled={!isCreateMode}
              styles={{ width: "100%" }}
            />
            {showError('childBirth')}
          </div>
          <div className="col-4">
            <div>{t('date_son_die')}
            {checkRequireChildDie() ? <span className="required">(*)</span> : null}
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.childDead
                  ? moment(data.childDead, Constants.LEAVE_DATE_FORMAT).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "childDead")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              disabled={!isCreateMode}
              styles={{ width: "100%" }}
            />
            {showError('childDead')}
          </div>

          <div className="col-4">
            {t('number_of_children')}
            {checkRequireChildNumber() ? <span className="required">(*)</span> : null}
            <input
              value={data.childNumbers}
              onChange={(e) => handleTextInputChange(e, "childNumbers")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {showError('childNumbers')}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-8">
            <div>{t('number_of_children_stillborn')}
            {checkRequireChildDie() ? <span className="required">(*)</span> : null}</div>
            <input
              value={data.childDeadNumbers}
              onChange={(e) => handleTextInputChange(e, "childDeadNumbers")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              disabled={!isCreateMode}
              autoComplete="off"
            />
            {showError('childDeadNumbers')}
          </div>
          <div className="col-4">
            <div>{t('addoption_day')}
            {checkRequireChildReceiveDate() ? <span className="required">(*)</span> : null}
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.childReceiveDate
                  ? moment(
                    data.childReceiveDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "childReceiveDate")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              disabled={!isCreateMode}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
            {showError('childReceiveDate')}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>
              {t('addoption_date')}
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.childRaiseDate
                  ? moment(
                    data.childRaiseDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              disabled={!isCreateMode}
              onChange={(date) =>
                handleDatePickerInputChange(date, "childRaiseDate")
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

      {/* THÔNG TIN CỦA MẸ */}
      <h5>{t('mother_information')}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>{t('number_insurance_social_mother')}
            {checkRequireMomInfo() ? <span className="required">(*)</span> : null}</div>
            <input
              value={data.momInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "momInsuranceNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
            {showError('momInsuranceNumber')}
          </div>
          <div className="col-4">
            <div>{t('number_insurance_health_mother')}
            {checkRequireMomInfo() ? <span className="required">(*)</span> : null}</div>
            <input
              value={data.momHealthNumber}
              onChange={(e) => handleTextInputChange(e, "momHealthNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
            {showError('momHealthNumber')}
          </div>
          <div className="col-4">
            <div>{t('mother_id_number')}{checkRequireMomInfo() ? <span className="required">(*)</span> : null}</div>
            <input
              value={data.momIdNumber}
              onChange={(e) => handleTextInputChange(e, "momIdNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
            {showError('momIdNumber')}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>{t('pregnancy_vacation')}</div>
            <Select
              placeholder={t('option')}
              options={YES_NO}
              isClearable={false}
              isDisabled={!isCreateMode}
              value={data.maternityLeave}
              onChange={(e) => handleChangeSelectInputs(e, "maternityLeave")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-4">
            <div>{t('surrogacy')}</div>
            <Select
              placeholder={t('option')}
              options={YES_NO}
              isClearable={false}
              isDisabled={!isCreateMode}
              value={data.hasRainser}
              onChange={(e) => handleChangeSelectInputs(e, "hasRainser")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>

          <div className="col-4">
            {t('surgery_or_pregnancy_32_weeks')}
            <Select
              placeholder={t('option')}
              options={YES_NO}
              isClearable={false}
              isDisabled={!isCreateMode}
              value={data.hasSurgery}
              onChange={(e) => handleChangeSelectInputs(e, "hasSurgery")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            <div>{t('day_mother_die')}</div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.momDeadDate
                  ? moment(
                    data.momDeadDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "momDeadDate")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              disabled={!isCreateMode}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-8">
            <div>{t('conclusion_date')}</div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.resultDate
                  ? moment(
                    data.resultDate,
                    Constants.LEAVE_DATE_FORMAT
                  ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "resultDate")
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
          <div className="col-12">
            <div>{t('medical_examination_fee')}</div>
            <input
              value={data.assessment}
              onChange={(e) => handleTextInputChange(e, "assessment")}
              type="text"
              disabled={!isCreateMode}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
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
              disabled={!isCreateMode}
              autoComplete="off"
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
              dateFormat="dd/MM/yyyy"
              disabled={!isCreateMode}
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
              isDisabled={!isCreateMode}
              isClearable={false}
              value={data.receiveType}
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
              autoComplete="off"
              disabled={!isCreateMode}
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
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
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
              autoComplete="off"
              disabled={!isCreateMode}
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
        errors={errors}
      />

      {
        isCreateMode ?
        <DocumentRequired
        url={data.documentLink}
        t={t}/> : null
      }

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

export default withTranslation()(CreateMaternityInsurance);
