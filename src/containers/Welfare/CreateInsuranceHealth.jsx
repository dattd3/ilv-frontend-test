import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { Form } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import ResizableTextarea from "../Registration/TextareaComponent";
import Constants from "../../commons/Constants";
import BulletIcon from "../../assets/img/icon/ic_bullet.svg";
import _ from "lodash";
import {
  DECLARE_FORM_OPTIONS,
  HOSPITAL_LINE,
  RECEIVE_TYPE,
  SICK_PLAN,
  WORKING_CONDITION,
} from "./InsuranceComponents/InsuranceData";

const CreateInsuranceHealth = ({ t }) => {
  const [type, setType] = useState(null);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const InsuranceOptions = [
    { value: 1, label: "Ốm đau" },
    { value: 2, label: "Thai sản" },
    { value: 3, label: "Dưỡng sưc" },
  ];

  const INSURANCE_CASE = [
    { value: 1, label: "Tử vong" },
    { value: 2, label: "Thương tật" },
    { value: 3, label: "Chi phí y tế" },
    { value: 4, label: "Vận chuyển cấp cứu" },
    { value: 5, label: "Trợ cấp" },
  ];

  const PAY_TYPE = [
    { value: 1, label: "Tiền mặt" },
    { value: 2, label: "Chuyển khoản" },
  ];

  const GENDER_OPTIONS = [
    { value: 1, label: "Nam" },
    { value: 2, label: "Nữ" },
  ];

  const TREATMENT_OPTIONS = [
    { value: 1, label: "Ngoại trú" },
    { value: 2, label: "Nội trú" }
  ];

  const handleTextInputChange = (e, name, subName) => {
    const candidateInfos = { ...data };
    candidateInfos[name][subName] = e != null ? e.target.value : "";
    setData(candidateInfos);
  };

  const handleChangeSelectInputs = (e, name, subName) => {
    const candidateInfos = { ...data };
    candidateInfos[name][subName] =
      e != null ? { value: e.value, label: e.label } : {};
    setData(candidateInfos);
  };

  const handleDatePickerInputChange = (value, name, subname) => {
    const candidateInfos = { ...data };
    if (moment(value, "DD/MM/YYYY").isValid()) {
      const date = moment(value).format("DD/MM/YYYY");
      candidateInfos[name][subname] = date;
    } else {
      candidateInfos[name][subname] = null;
    }
    setData(candidateInfos);
  };

  const onSubmit = () => {
    const verify = verifyData();
    if (!verify) {
      return;
    }
  };

  const verifyData = () => {
    let _errors = {};
    const candidateInfos = { ...data };
    const requiredFields = [
      "declareForm",
      "seri",
      "total",
      "receiveType",
      "accountNumber",
      "accountName",
      "bankId",
      "bankName",
    ];
    const optionFields = ["declareForm", "receiveType"];

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
    return hasErrors ? false : true;
  };

  return (
    <div className="registration-insurance-section">
      {/* A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM */}
      <h5>A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {"Người yêu cầu trả tiền bảo hiểm"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-6">
            {"Mối quan hệ với Người được bảo hiểm"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {"Địa chỉ"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-6">
            {"Số điện thoại"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-6">
            {"Email"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      {/* B. THÔNG TIN VỀ NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH) */}
      <h5>B. THÔNG TIN VỀ NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH)</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {"Họ tên NĐBH"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-6">
            <div style={{ color: "white" }}>{"."}</div>
            <div
              className="form-control mv-10 border-0"
              style={{ color: "#000", paddingLeft: 0 }}
            >
              <div className="form-check-inline">Giới tính:</div>
              {GENDER_OPTIONS.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="gender"
                      type="radio"
                      className="form-check-input"
                      id={`gender-${item.value}`}
                      onChange={(e) => console.log(item)}
                    />
                    <label
                      title=""
                      className="form-check-label"
                      htmlFor={`gender-${item.value}`}
                    >
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-6">
            {"Số CMND/Hộ chiếu"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>

          <div className="col-6">
            {"Ngày sinh"}
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
        </div>

        <div className="row mv-10">
          <div className="col-6">
            {"Đơn vị tham gia bảo hiểm"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>

          <div className="col-6">
            {"Số GCNBH/Số thẻ BH"}
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* C. THÔNG TIN VỀ TAI NẠN / BỆNH VÀ KHÁM CHỮA */}
      <h5>C. THÔNG TIN VỀ TAI NẠN / BỆNH VÀ KHÁM CHỮA</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-6">
            <div>{"Ngày tai nạn"}</div>
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
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-6">
            <div>{"Nơi xảy ra tai nạn"}</div>
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            <div>{"Ngày khám bệnh"}</div>
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
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-6">
            <div>{"Ngày nhập viện"}</div>
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
              styles={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Nơi điều trị"}</div>
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Nguyên nhân / Chẩn đoán về tai nạn/bệnh"}</div>
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Hậu quả"}</div>
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-3">
            <div>{"Từ ngày"}</div>
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
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-3">
            <div>{"Đến ngày"}</div>
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
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-6">
            <div style={{ color: "white" }}>{"."}</div>
            <div
              className="form-control mv-10 border-0"
              style={{ color: "#000", paddingLeft: 0 }}
            >
              <div className="form-check-inline">Hình thức điều trị:</div>           
              {TREATMENT_OPTIONS.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="treat"
                      type="radio"
                      className="form-check-input"
                      id={`treat-${item.value}`}
                      onChange={(e) => console.log(item)}
                    />
                    <label
                      title=""
                      className="form-check-label"
                      htmlFor={`treat-${item.value}`}
                    >
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/*D. THÔNG TIN THANH TOÁN */}
      <h5>D. THÔNG TIN THANH TOÁN</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="pay-title">
            {"1. Nội dung yêu cầu chi trả bảo hiểm"}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Tổng số tiền yêu cầu chi trả"}</div>
            <input
              type="text"
              value={data.childInsuranceNumber}
              onChange={(e) => handleTextInputChange(e, "childInsuranceNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              checked={"checked"}
            />
          </div>
        </div>

        <div className="row mv-10 mb-3">
          <div className="col-12">
            <div className="">
              <div className="form-check-inline">
                Chi trả bảo hiểm cho trường hợp:
              </div>

              {INSURANCE_CASE.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="case"
                      type="radio"
                      className="form-check-input"
                      id={`case-${item.value}`}
                      onChange={(e) => console.log(item)}
                    />
                    <label
                      title=""
                      className="form-check-label"
                      htmlFor={`case-${item.value}`}
                    >
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="pay-title">
            {"2. Hình thức thanh toán thông tin người thụ hưởng"}
          </div>
        </div>

        <div className="row mb-3 mt-2">
          <div className="col-12">
            <div>
              <div className="form-check-inline">
                Lựa chọn hình thức thanh toán:
              </div>

              {PAY_TYPE.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="pay"
                      type="radio"
                      className="form-check-input"
                      id={`pay-${item.value}`}
                      onChange={(e) => console.log(item)}
                    />
                    <label
                      title=""
                      className="form-check-label"
                      htmlFor={`pay-${item.value}`}
                    >
                      {item.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            <div>{"Người thụ hưởng"}</div>
            <input
              value={data.sickId}
              onChange={(e) => handleTextInputChange(e, "sickId")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>

          <div className="col-6">
            <div>{"Số tài khoản"}</div>
            <input
              value={data.sickId}
              onChange={(e) => handleTextInputChange(e, "sickId")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Ngân hàng"}</div>
            <input
              value={data.sickId}
              onChange={(e) => handleTextInputChange(e, "sickId")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Địa chỉ ngân hàng"}</div>
            <input
              value={data.sickId}
              onChange={(e) => handleTextInputChange(e, "sickId")}
              type="text"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* E. CAM KẾT VÀ ỦY QUYỀN */}
      <h5>E. CAM KẾT VÀ ỦY QUYỀN</h5>
      <div className="box shadow cbnv" style={{ padding: "10px 20px" }}>
        <p className="policy">
          {" "}
          <img src={BulletIcon} style={{ paddingRight: "7px" }} />
          Tôi cam đoan những thông tin kê khai trên đây là chính xác và đầy đủ.
          Tôi xin hoàn toàn chịu trách nhiệm trước pháp luật nếu có bất cứ sự
          sai lệch nào về thông tin đã cung cấp và bất cứ tranh chấp nào về
          quyền thụ hưởng số tiền được chi trả bảo hiểm.
        </p>
        <p className="policy">
          {" "}
          <img src={BulletIcon} style={{ paddingRight: "7px" }} />
          Tôi cũng đồng ý rằng, bằng Giấy yêu cầu trả tiền bảo hiểm này, tôi cho
          phép đại diện của Bảo hiểm PVI được quyền tiếp xúc với các bên thứ ba
          để thu thập thông tin cần thiết cho việc xét bồi thường này, bao gồm
          nhưng không giới hạn ở việc tiếp xúc với (các) bác sĩ đã và đang điều
          trị cho tôi.
        </p>
      </div>
      {/* ĐỢT BỔ SUNG */}

      <div className="box shadow cbnv mv-10" style={{ padding: "10px 20px" }}>
        <div className="row ">
          <div className="col-7"></div>
          <div className="col-5">
            <div className="row">
              <div className="col-6">
                <input
                  value={data.accountName}
                  onChange={(e) => handleTextInputChange(e, "accountName")}
                  type="text"
                  placeholder="Nhập"
                  className="form-control input mv-10 w-100 only-border-bottom"
                  name="inputName"
                  autoComplete="off"
                />
              </div>
              <div className="col-6">
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
                  className="form-control input only-border-bottom"
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6 sign-contain">
            <div className="sign-title">{"XÁC NHẬN"}</div>
            <div className="sign-subtitle">
              {
                "(Chữ ký và dấu của đơn vị tham gia bảo hiểm/cơ quan chủ quản\nhoặc chính quyền, công an nơi xảy ra tai nạn)"
              }
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5 sign-contain">
            <div className="sign-title">{"NGƯỜI YÊU CẦU"}</div>
            <div className="sign-subtitle">{"(Ký và ghi rõ họ tên)"}</div>
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
          <i className="fa fa-paper-plane" aria-hidden="true"></i> {t("Send")}
        </button>
      </div>
    </div>
  );
};

export default withTranslation()(CreateInsuranceHealth);
