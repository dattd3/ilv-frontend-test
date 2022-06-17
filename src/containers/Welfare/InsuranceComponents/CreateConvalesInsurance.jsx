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
  disabledSubmitButton
}) => {
  
  const [errors, setErrors] = useState({});
  const InsuranceOptions = [
    { value: 1, label: "Ốm đau" },
    { value: 2, label: "Thai sản" },
    { value: 3, label: "Dưỡng sưc" },
  ];

  const onSubmit = () => {
    const verify = verifyData();
    if (!verify) {
      return;
    }

    const formData = new FormData();
    formData.append('requestType', type.value);
    formData.append('requestName', type.label);
    formData.append('formTypeInfo', JSON.stringify({id: data.declareForm.value, name: data.declareForm.label}));
    formData.append('recommendEnjoyDate', data.dateRequest ? moment(data.dateRequest, 'DD/MM/YYYY').format('YYYY-MM-DD') : '' );
    formData.append('solvedFirstDate', data.dateLastResolved ?  moment(data.dateLastResolved, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('planInfo', data.plan ?  JSON.stringify({id: data.plan.value, name: data.plan.label}) : '');
    formData.append('description', data.note);
    //thong tin ca nhan
    formData.append('fullName', userInfo.fullName);
    formData.append('insuranceNumber', userInfo.socialId);
    formData.append('idNumber', userInfo.IndentifiD);
    formData.append('employeeNo', userInfo.employeeNo);
    formData.append('backToWorkDate', data.startWork ?  moment(data.startWork, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');

    //Số ngày đề nghị hưởng chế độ tại đơn vị
    formData.append('receiveBenefitsUnitInfo', JSON.stringify({
      "seriNumber": data.seri,
      "fromDate":  data.fromDate ? moment(data.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
      "toDate":  data.toDate ? moment(data.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
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
        receivingForm: data.receiveType?.label || "",
        bankAccountNumber: data.accountNumber,
        accountName: data.accountName,
        bankCode: data.bankId,
        bankName: data.bankName,
      })
    );

    formData.append('SettlementContent', data.resolveContent);
    formData.append('SettlementPeriod', data.resolveDate ? moment(data.resolveDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '') ;
    formData.append('AdditionalPhaseContent',data.addtionContent );
    formData.append('AdditionalPhasePeriod', data.addtionDate ? moment(data.addtionDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '');
    formData.append('orgLv2Id', localStorage.getItem('organizationLv2'));
    formData.append('divisionId', localStorage.getItem('divisionId'));
    formData.append('division', localStorage.getItem('division'));
    formData.append('regionId', localStorage.getItem('regionId'));
    formData.append('region', localStorage.getItem('region'));
    formData.append('unitId', localStorage.getItem('unitId'));
    formData.append('unit', localStorage.getItem('unit'));
    formData.append('partId', localStorage.getItem('partId'));
    formData.append('part', localStorage.getItem('part'));
    formData.append('companyCode', localStorage.getItem('companyCode'));
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
      "accountNumber",
      "accountName",
      "bankId",
      "bankName",
    ];
    const optionFields = ['plan', "declareForm", "receiveType"];

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
    if(hasErrors) {
      notifyMessage('Vui lòng nhập giá trị !', true);
    }
    return hasErrors ? false : true;
  };

  return (
    <>
      {/* YÊU CẦU BẢO HIỂM Y TẾ */}
      <h5>YÊU CẦU BẢO HIỂM Y TẾ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {"Loại yêu cầu"}
            <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={InsuranceOptions}
              isClearable={false}
              value={type}
              onChange={(e) => setType(e)}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-4">
            {"Hình thức kê khai phát sinh"}
            <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={DECLARE_FORM_OPTIONS}
              isClearable={false}
              value={data?.declareForm}
              onChange={(e) => handleChangeSelectInputs(e, "declareForm")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["declareForm"] ? (
              <p className="text-danger">{errors["declareForm"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            {"Từ ngày đơn vị đề nghị hưởng"}
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
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Từ ngày giải quyết trước"}
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
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-8">
            {"Phương án"}
            <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={CONVALES_PLAN}
              isClearable={false}
              value={data.plan}
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
            {"Ghi chú"}
            <textarea
              value={data.note}
              onChange={(e) => handleTextInputChange(e, "note")}
              rows={3}
              className="mv-10 form-control input w-100"
            />
          </div>
        </div>
      </div>

      {/* THÔNG TIN CÁ NHÂN */}
      <h5>THÔNG TIN CÁ NHÂN</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <span className="required">(*)</span>
            <div className="detail">{userInfo.fullName}</div>
          </div>
          <div className="col-4">
            {"Mã sổ/số sổ BHXH"}
            <span className="required">(*)</span>
            <div className="detail">{userInfo.socialId}</div>
          </div>
          <div className="col-4">
            {"Số CMND/Hộ chiếu/Thẻ căn cước"}
            <span className="required">(*)</span>
            <div className="detail">{userInfo.personal_id_no}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Mã nhân viên"}
            <div className="detail">{userInfo.employeeNo}</div>
          </div>

          <div className="col-4">
            {"Ngày quay trở lại làm việc tại đơn vị"}
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
      <h5>SỐ NGÀY ĐỀ NGHỊ HƯỞNG CHẾ ĐỘ TẠI ĐƠN VỊ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            {"Số Seri"}
            <span className="required">(*)</span>
            <input
              value={data.seri}
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
            <div>{"Từ ngày"}</div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.fromDate
                  ? moment(data.fromDate, Constants.LEAVE_DATE_FORMAT).toDate()
                  : null
              }
              onChange={(date) => handleDatePickerInputChange(date, "fromDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-4">
            <div>{"Đến ngày"}</div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.toDate
                  ? moment(data.toDate, Constants.LEAVE_DATE_FORMAT).toDate()
                  : null
              }
              onChange={(date) => handleDatePickerInputChange(date, "toDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {"Tổng số"}
            <span className="required">(*)</span>
            <input
              value={data.total}
              onChange={(e) => handleTextInputChange(e, "total")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["total"] ? (
              <p className="text-danger">{errors["total"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* THÔNG TIN GIÁM ĐỊNH */}
      <h5>THÔNG TIN GIÁM ĐỊNH</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{"Tỷ lệ suy giảm"}</div>
            <input
              value={data.declineRate}
              onChange={(e) => handleTextInputChange(e, "declineRate")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            <div>{"Ngày giám định"}</div>
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
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ĐỢT GIẢI QUYẾT */}
      <h5>ĐỢT GIẢI QUYẾT</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{"Nội dung đợt"}</div>
            <input
              value={data.resolveContent}
              onChange={(e) => handleTextInputChange(e, "resolveContent")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {"Tháng năm"}
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
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ĐỢT BỔ SUNG */}
      <h5>ĐỢT BỔ SUNG</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{"Nội dung đợt"}</div>
            <input
              value={data.addtionContent}
              onChange={(e) => handleTextInputChange(e, "addtionContent")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {"Tháng năm"}
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
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* HÌNH THỨC TRỢ CẤP */}
      <h5>HÌNH THỨC TRỢ CẤP</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>
              {"Hình thức nhận"}
              <span className="required">(*)</span>
            </div>
            <Select
              placeholder={"Lựa chọn"}
              options={RECEIVE_TYPE}
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
              {"Số tài khoản"}
              <span className="required">(*)</span>
            </div>
            <input
              value={data.accountNumber}
              onChange={(e) => handleTextInputChange(e, "accountNumber")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["accountNumber"] ? (
              <p className="text-danger">{errors["accountNumber"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            {"Tên chủ tài khoản"}
            <span className="required">(*)</span>
            <input
              value={data.accountName}
              onChange={(e) => handleTextInputChange(e, "accountName")}
              type="text"
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
              {"Mã ngân hàng"}
              <span className="required">(*)</span>
            </div>
            <input
              value={data.bankId}
              onChange={(e) => handleTextInputChange(e, "bankId")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["bankId"] ? (
              <p className="text-danger">{errors["bankId"]}</p>
            ) : null}
          </div>
          <div className="col-8">
            <div>
              {"Tên ngân hàng"}
              <span className="required">(*)</span>
            </div>
            <input
              value={data.bankName}
              onChange={(e) => handleTextInputChange(e, "bankName")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["bankName"] ? (
              <p className="text-danger">{errors["bankName"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="clearfix mb-5 mt-4">
        {/* <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.showConfirm.bind(this, 'isConfirm')}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button> */}
        <button
          type="button"
          className="btn btn-primary float-right ml-3 shadow"
          onClick={() => onSubmit()}
        >
          {!disabledSubmitButton ? (
            <>
              <i className="fa fa-paper-plane mr-2" aria-hidden="true"></i>
            </>
          ) : (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-2"
            />
          )}
          {t("Send")}
        </button>
      </div>
    </>
  );
};

export default withTranslation()(CreateConvalesInsurance);
