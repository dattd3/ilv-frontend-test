import React, { FC, useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import Constants from "../../../commons/Constants";
import _ from "lodash";
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

const CreateSocialContributeInfo: FC<any> = ({
  t,
  type,
  setType,
  data = {},
  userInfo = {},
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
  isCreateMode = true,
}) => {
  const [errors, setErrors] = useState({});
  const InsuranceOptions = [
    { value: 1, label: t("sick") },
    { value: 2, label: t("maternity") },
    { value: 3, label: t("convales") },
  ];

  const onSubmit = () => {
    const verify = verifyData();
    if (!verify) {
      return;
    }

    const employeeInfo = {
      employeeNo: localStorage.getItem("employeeNo"),
      username: localStorage.getItem("ad")?.toLowerCase(),
      account: localStorage.getItem("email"),
      fullName: localStorage.getItem("fullName"),
      jobTitle: localStorage.getItem("jobTitle"),
      employeeLevel: localStorage.getItem("employeeLevel"),
      department: localStorage.getItem("department"),
    };
    const userEmployeeInfo = {
      employeeNo: localStorage.getItem("employeeNo"),
      fullName: localStorage.getItem("fullName"),
      jobTitle: localStorage.getItem("jobTitle"),
      department: localStorage.getItem("department"),
      company_email: localStorage.getItem("plEmail"),
      costCenter: localStorage.getItem("cost_center"),
    };

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

    const approverInfoLst = [approver].map((ele, i) => ({
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
    }));

    const formData = new FormData();
    formData.append("requestType", type.value);
    formData.append("requestName", type.label);
    formData.append(
      "formTypeInfo",
      JSON.stringify({
        id: data.declareForm.value,
        name: data.declareForm.label,
      })
    );
    formData.append(
      "recommendEnjoyDate",
      data.dateRequest
        ? moment(data.dateRequest, "DD/MM/YYYY").format("YYYY-MM-DD")
        : ""
    );
    formData.append(
      "solvedFirstDate",
      data.dateLastResolved
        ? moment(data.dateLastResolved, "DD/MM/YYYY").format("YYYY-MM-DD")
        : ""
    );
    formData.append(
      "planInfo",
      data.plan
        ? JSON.stringify({ id: data.plan.value, name: data.plan.label })
        : ""
    );
    formData.append("description", data.note);
    //thong tin ca nhan
    formData.append("fullName", userInfo.fullName);
    formData.append("insuranceNumber", userInfo.socialId);
    formData.append("idNumber", userInfo.IndentifiD);
    formData.append("employeeNo", userInfo.employeeNo);
    formData.append(
      "workingConditionInfo",
      data.workingCondition
        ? JSON.stringify({
            id: data.workingCondition.value,
            name: data.workingCondition.label,
          })
        : ""
    );
    formData.append("weeklyRestDay", data.leaveOfWeek);

    formData.append(
      "certificateInsuranceBenefit",
      JSON.stringify({
        hospitalLine: data.hospitalLine
          ? { id: data.hospitalLine.value, name: data.hospitalLine.label }
          : "",
        seriNumber: data.seri,
        fromDate: data.fromDate
          ? moment(data.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : "",
        toDate: data.toDate
          ? moment(data.toDate, "DD/MM/YYYY").format("YYYY-MM-DD")
          : "",
        total: data.total,
      })
    );
    formData.append(
      "sickChildrenInfo",
      JSON.stringify({
        childDob: data.childBirth
          ? moment(data.childBirth, "DD/MM/YYYY").format("YYYY-MM-DD")
          : "",
        healthInsuranceNumber: data.childInsuranceNumber,
        sickChildrenNumber: data.childSickNumbers,
      })
    );
    formData.append(
      "diagnosisDiseaseInfo",
      JSON.stringify({
        diseaseCode: data.sickId,
        diseaseName: data.sickName,
      })
    );
    formData.append(
      "receiveSubsidiesInfo",
      JSON.stringify({
        receivingForm: {
          id: data.receiveType.value,
          name: data.receiveType.label,
        },
        bankAccountNumber: data.accountNumber,
        accountName: data.accountName,
        bankCode: data.bankId,
        bankName: data.bankName,
      })
    );

    formData.append("SettlementContent", data.resolveContent);
    formData.append(
      "SettlementPeriod",
      data.resolveDate
        ? moment(data.resolveDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : ""
    );
    formData.append("AdditionalPhaseContent", data.addtionContent);
    formData.append(
      "AdditionalPhasePeriod",
      data.addtionDate
        ? moment(data.addtionDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : ""
    );
    formData.append("employeeInfo", JSON.stringify(employeeInfo));
    formData.append("UserInfo", JSON.stringify(userEmployeeInfo));

    formData.append("appraiserInfoLst", JSON.stringify(appraiserInfoLst));
    formData.append("approverInfoLst", JSON.stringify(approverInfoLst));
    if (files.filter((item) => item.id == undefined).length > 0) {
      files
        .filter((item) => item.id == undefined)
        .forEach((file) => {
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
      "plan",
      "seri",
      "fromDate",
      "toDate",
      "total",
      "sickName",
      "receiveType",
    ];
    //check người thẩm định
    if (supervisors?.length == 0 || !supervisors.every((sup) => sup != null)) {
      _errors["supervisors"] = t("PleaseEnterInfo");
    }
    if (!approver) {
      _errors["approver"] = t("PleaseEnterInfo");
    }
    if (checkRequireAtm()) {
      requiredFields.push("accountNumber", "accountName", "bankId", "bankName");
    }
    if (checkRequireChildInfo()) {
      requiredFields.push(
        "childBirth",
        "childInsuranceNumber",
        "childSickNumbers"
      );
    }
    if (checkRequireSickCode()) {
      requiredFields.push("sickId");
    }
    const optionFields = ["declareForm", "plan", "receiveType"];

    requiredFields.forEach((name) => {
      if (
        _.isEmpty(candidateInfos[name]) ||
        (!candidateInfos[name].value && optionFields.includes(name))
      ) {
        _errors[name] = t("PleaseEnterInfo");
      } else {
        _errors[name] =
          _errors[name] == t("PleaseEnterInfo") ? null : _errors[name];
      }
    });
    setErrors(_errors);

    let hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage(t("PleaseEnterInfo"), true);
    }
    //check files
    if (!hasErrors) {
      let checkfiles =
        !files || files?.length === 0
          ? t("Required") + " " + t("AttachmentFile")
          : null;
      if (checkfiles) {
        notifyMessage(checkfiles);
        hasErrors = true;
      }
    }
    return hasErrors ? false : true;
  };

  const checkRequireAtm = () => {
    if (data.receiveType?.value && ["2"].includes(data.receiveType.value)) {
      return true;
    }
    return false;
  };

  const checkRequireChildInfo = () => {
    if (data.plan?.value && ["O2"].includes(data.plan.value)) {
      return true;
    }
    return false;
  };

  const checkRequireSickCode = () => {
    if (data.plan?.value && ["O3"].includes(data.plan.value)) {
      return true;
    }
    return false;
  };

  return (
    <div className="registration-insurance-section social-contribute">
      <h5>{t("lastUpdateDate")}</h5>
      <div className="box shadow-sm cbnv">
        <span style={{ fontWeight: "700" }}>{t("Update") + ": "}</span>
        <span style={{ fontWeight: "100" }}>20/09/2023 10:00:00</span>
        <span style={{ fontWeight: "700" }}>
          {" | " + t("Notification_Created_By") + ": "}
        </span>
        <span style={{ fontWeight: "100" }}>annv8</span>
      </div>

      <div className="row">
        <div className="col-6">
          <h5>
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
            <input
              type="text"
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
        </div>

        
        <div className="col-6">
          <h5>{"NƠI ĐĂNG KÝ KCB"}</h5>
          <div className="box shadow-sm cbnv">
            {"Tên cơ sở đăng ký KCB"}
            <Select
              placeholder={t("option")}
              options={SICK_PLAN}
              isClearable={false}
              value={data.plan}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>

    {/* ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ */}
      <h5>{'ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-4">
            {'Số sổ hộ khẩu/số sổ tạm trú'}
            <input
              type="text"
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            {'Tỉnh/Thành phố'}
            <span className="required">(*)</span>
            <Select
              placeholder={t("option")}
              options={SICK_PLAN}
              isClearable={false}
              value={data.plan}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-4">
            {'Quận/Huyện'}
            <span className="required">(*)</span>
            <Select
              placeholder={t("option")}
              options={SICK_PLAN}
              isClearable={false}
              value={data.plan}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {'Xã/Phường'}
            <Select
              placeholder={t("option")}
              options={SICK_PLAN}
              isClearable={false}
              value={data.plan}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>

          <div className="col-8">
            {'Số nhà, đường phố, xóm'}
            <input
              type="text"
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              disabled={!isCreateMode}
            />
          </div>
        </div>
      </div>

      <h5>{'THÔNG TIN HỘ GIA ĐÌNH'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row mv-10">
          <div className="col-4">
            {t("from_date_applies_benefits")}
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
          <div className="col-4">
            {t("from_date_settlement")}
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
              locale={t("locale")}
              disabled={!isCreateMode}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-4">
            {t("plan")}
            <span className="required">(*)</span>
            <Select
              placeholder={t("option")}
              options={SICK_PLAN}
              isClearable={false}
              value={data.plan}
              onChange={(e) => handleChangeSelectInputs(e, "plan")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["plan"] ? (
              <p className="text-danger">{errors["plan"]}</p>
            ) : null}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {t("note")}
            <textarea
              rows={3}
              value={data.note}
              disabled={!isCreateMode}
              onChange={(e) => handleTextInputChange(e, "note")}
              className="mv-10 form-control input w-100"
            />
          </div>
        </div>
      </div>
      
      <h5>{'GHI CHÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-12">
            {'Nội dung'}
            <Select
              placeholder={t("option")}
              options={HOSPITAL_LINE}
              isClearable={false}
              value={data.hospitalLine}
              onChange={(e) => handleChangeSelectInputs(e, "hospitalLine")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>

      {/* <AssessorInfoComponent
        t={t}
        isCreateMode={isCreateMode}
        setSupervisors={setSupervisors}
        supervisors={supervisors}
        approver={approver}
        setApprover={setApprover}
        errors={errors}
      /> */}

      {/* <div className="registration-section">
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
      </div> */}
    </div>
  );
};

export default withTranslation()(CreateSocialContributeInfo);
