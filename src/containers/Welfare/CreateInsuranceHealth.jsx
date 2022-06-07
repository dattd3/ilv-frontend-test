import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import Constants from "../../commons/Constants";
import BulletIcon from "../../assets/img/icon/ic_bullet.svg";
import _ from "lodash";
import {
  getMuleSoftHeaderConfigurations,
  getRequestConfigurations,
} from "../../commons/Utils";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResultModal from "../Registration/ResultModal";
import { Spinner } from "react-bootstrap";

const CreateInsuranceHealth = ({ t }) => {
  const [type, setType] = useState(null);
  const [data, setData] = useState({
    employeeNo: localStorage.getItem("employeeNo"),
    insuranceClaimant: "",
    insuranceRelation: "",
    address: "",
    phone: "",
    email: "",
    insuredName: "",
    gender: null,
    insuredId: "",
    insuredBirth: null,
    insuredUnit: "",
    insuredNumber: "",
    accidentDate: null,
    accidentAddress: "",
    examDate: null,
    hospitalizedDate: null,
    hospitalizedAddress: "",
    reason: "",
    result: "",
    fromDate: null,
    toDate: null,
    treatType: null,
    payAmount: "",
    payCase: null,
    payType: null,
    receiveName: "",
    receiveAccount: "",
    bankName: "",
    bankAddress: "",
    formDate: null,
    formAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [resultModal, setresultModal] = useState({
    isShowStatusModal: false,
    titleModal: "",
    messageModal: "",
    isSuccess: false,
  });
  const [disabledSubmitButton, setdisabledSubmitButton] = useState(false);
  const [InsuranceOptions, setInsuranceOptions] = useState([]);
  const [INSURANCE_CASE, setINSURANCE_CASE] = useState([]);
  const [PAY_TYPE, setPAY_TYPE] = useState([]); 
  const [GENDER_OPTIONS, setGENDER_OPTIONS] = useState([]);
  const [TREATMENT_OPTIONS, setTREATMENT_OPTIONS] = useState([]);

  useEffect(() => {
    const config = getRequestConfigurations();
    const payload = {
      lsStr: [
        "INSURANCEOPTION",
        "INSURANCE_CASE",
        "INSURANCEPAYTYPE",
        "INSURANCEGENDER",
        "INSURANCETREATMENT",
      ],
    };
    axios.post(
      `${process.env.REACT_APP_HRDX_URL}api/data/getcommongroup`,
      payload,
      config
    ).then((res) => {
      if(res?.data?.data) {
        const remoteData = res.data.data;
        setInsuranceOptions((remoteData.INSURANCEOPTION || []).map(item => {return {value: item.keyNumber, label: item.textValue}}));
        setINSURANCE_CASE((remoteData.INSURANCE_CASE || []).map(item => {return {value: item.keyNumber, label: item.textValue}}));
        setPAY_TYPE((remoteData.INSURANCEPAYTYPE || []).map(item => {return {value: item.keyNumber, label: item.textValue}}));
        setGENDER_OPTIONS((remoteData.INSURANCEGENDER || []).map(item => {return {value: item.keyNumber, label: item.textValue}}));
        setTREATMENT_OPTIONS((remoteData.INSURANCETREATMENT || []).map(item => {return {value: item.keyNumber, label: item.textValue}}));
      }
    });
  }, []);

  const handleTextInputChange = (e, name) => {
    const candidateInfos = { ...data };
    candidateInfos[name] = e != null ? e.target.value : "";
    setData(candidateInfos);
  };

  const handleChangeSelectInputs = (e, name) => {
    const candidateInfos = { ...data };
    candidateInfos[name] = e != null ? { value: e.value, label: e.label } : {};
    setData(candidateInfos);
  };

  const handleDatePickerInputChange = (value, name) => {
    //YYYY-MM-DD
    const candidateInfos = { ...data };
    if (moment(value, "DD/MM/YYYY").isValid()) {
      const date = moment(value).format("DD/MM/YYYY");
      candidateInfos[name] = date;
      candidateInfos[name + "_raw"] = value;
    } else {
      candidateInfos[name] = null;
      candidateInfos[name + "_raw"] = null;
    }
    setData(candidateInfos);
  };

  const onSubmit = () => {
    const verify = verifyData();
    if (!verify) {
      return;
    }

    const payload = {
      requestorFullName: data.insuranceClaimant,
      requestorRelationship: data.insuranceRelation || "",
      requestorAddress: data.address || "",
      requestorPhone: data.phone,
      requestorEmail: data.email,
      recieverFullName: data.insuredName,
      recieverSex: data.gender?.value,
      recieverIdentityCard: data.insuredId,
      recieverBirthDay: data.insuredBirth_raw,
      employeeCode: data.employeeNo,
      recieverInsurer: data.insuredUnit || "",
      insuranceNumber: data.insuredNumber,
      accidentDate: data.accidentDate_raw,
      accidentPlace: data.accidentAddress || "",
      examineDate: data.examDate_raw,
      hospitalizedDate: data.hospitalizedDate_raw,
      treatmentPlace: data.hospitalizedAddress,
      accidentalCause: data.reason || "",
      consequence: data.result || "",
      fromDate: data.fromDate_raw || "",
      toDate: data.toDate_raw || "",
      treatmentForm: data.treatType?.value,
      totalMoneyAmount: data.payAmount,
      paymentCase: data.payCase?.value,
      paymentForm: data.payType?.value,
      recieverAccountName: data.receiveName,
      recieverAccountNumber: data.receiveAccount,
      recieverBanker: data.bankName,
      recieverBankerAddress: data.bankAddress,
      signingPlace: data.formAddress || "",
      signingDate: data.formDate_raw || "",
      orgLv2Id: localStorage.getItem("organizationLv2"),
      divisionId: localStorage.getItem("divisionId"),
      division: localStorage.getItem("division"),
      regionId: localStorage.getItem("regionId"),
      region: localStorage.getItem("region"),
      unitId: localStorage.getItem("unitId"),
      unit: localStorage.getItem("unit"),
      partId: localStorage.getItem("partId"),
      part: localStorage.getItem("part"),
      companyCode: localStorage.getItem("companyCode"),
    };
    setdisabledSubmitButton(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_HRDX_URL}api/HealthInsurance/Create`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (
          response &&
          response.data &&
          response.data.result &&
          response.data.result.code == 200
        ) {
          showStatusModal(t("Successful"), t("RequestSent"), true);
          setdisabledSubmitButton(false);
        } else {
          notifyMessage(
            response.data.result.message ||
              "Có lỗi xảy ra trong quá trình cập nhật thông tin!"
          );
          setdisabledSubmitButton(false);
        }
      })
      .catch((response) => {
        notifyMessage("Có lỗi xảy ra trong quá trình cập nhật thông tin!");
        setdisabledSubmitButton(false);
      });
  };

  const verifyData = () => {
    let _errors = {};
    const candidateInfos = { ...data };
    const requiredFields = [
      "insuranceClaimant",
      "phone",
      "email",
      "insuredName",
      "gender",
      "insuredId",
      "insuredBirth",
      "insuredNumber",
      "accidentDate",
      "examDate",
      "hospitalizedDate",
      "hospitalizedAddress",
      "treatType",
      "payAmount",
      "payCase",
      "payType",
      "receiveName",
      "receiveAccount",
      "bankName",
      "bankAddress",
    ];
    const optionFields = ["treatType", "payCase", "payTypes"];

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
      notifyMessage("Vui lòng nhập giá trị !", true);
    }
    return hasErrors ? false : true;
  };

  const notifyMessage = (message, isError = true) => {
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const hideStatusModal = () => {
    setresultModal({
      isShowStatusModal: false,
    });
    window.location.reload();
  };

  const showStatusModal = (title, message, isSuccess = false) => {
    setresultModal({
      isShowStatusModal: true,
      titleModal: title,
      messageModal: message,
      isSuccess: isSuccess,
    });
  };

  return (
    <div className="registration-insurance-section">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ResultModal
        show={resultModal.isShowStatusModal}
        title={resultModal.titleModal}
        message={resultModal.messageModal}
        isSuccess={resultModal.isSuccess}
        onHide={hideStatusModal}
      />
      {/* A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM */}
      <h5>A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {"Người yêu cầu trả tiền bảo hiểm"}{" "}
            <span className="required">(*)</span>
            <input
              type="text"
              placeholder="Nhập"
              value={data.insuranceClaimant}
              onChange={(e) => handleTextInputChange(e, "insuranceClaimant")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["insuranceClaimant"] ? (
              <p className="text-danger">{errors["insuranceClaimant"]}</p>
            ) : null}
          </div>
          <div className="col-6">
            {"Mối quan hệ với Người được bảo hiểm"}
            <input
              type="text"
              placeholder="Nhập"
              value={data.insuranceRelation}
              onChange={(e) => handleTextInputChange(e, "insuranceRelation")}
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
              placeholder="Nhập"
              value={data.address}
              onChange={(e) => handleTextInputChange(e, "address")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-6">
            {"Số điện thoại"} <span className="required">(*)</span>
            <input
              type="text"
              placeholder="Nhập"
              value={data.phone}
              onChange={(e) => handleTextInputChange(e, "phone")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["phone"] ? (
              <p className="text-danger">{errors["phone"]}</p>
            ) : null}
          </div>
          <div className="col-6">
            {"Email"} <span className="required">(*)</span>
            <input
              type="text"
              placeholder="Nhập"
              value={data.email}
              onChange={(e) => handleTextInputChange(e, "email")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["email"] ? (
              <p className="text-danger">{errors["email"]}</p>
            ) : null}
          </div>
        </div>
      </div>
      {/* B. THÔNG TIN VỀ NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH) */}
      <h5>B. THÔNG TIN VỀ NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH)</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {"Họ tên NĐBH"}
            <span className="required">(*)</span>
            <input
              type="text"
              placeholder="Nhập"
              value={data.insuredName}
              onChange={(e) => handleTextInputChange(e, "insuredName")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["insuredName"] ? (
              <p className="text-danger">{errors["insuredName"]}</p>
            ) : null}
          </div>
          <div className="col-6">
            <div style={{ color: "white" }}>{"."}</div>
            <div
              className="form-control mv-10 border-0"
              style={{ color: "#000", paddingLeft: 0 }}
            >
              <div className="form-check-inline">
                Giới tính: <span className="required">(*)</span>
              </div>
              {GENDER_OPTIONS.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      placeholder="Nhập"
                      name="gender"
                      type="radio"
                      checked={data.gender?.value == item.value}
                      className="form-check-input"
                      id={`gender-${item.value}`}
                      onChange={(e) => handleChangeSelectInputs(item, "gender")}
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
              {errors["gender"] ? (
                <p className="text-danger">{errors["gender"]}</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-6">
            {"Số CMND/Hộ chiếu"} <span className="required">(*)</span>
            <input
              placeholder="Nhập"
              type="text"
              value={data.insuredId}
              onChange={(e) => handleTextInputChange(e, "insuredId")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["insuredId"] ? (
              <p className="text-danger">{errors["insuredId"]}</p>
            ) : null}
          </div>

          <div className="col-3">
            {"Ngày sinh"} <span className="required">(*)</span>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.insuredBirth
                  ? moment(
                      data.insuredBirth,
                      Constants.LEAVE_DATE_FORMAT
                    ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "insuredBirth")
              }
              showMonthDropdown={true}
              showYearDropdown={true}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
            {errors["insuredBirth"] ? (
              <p className="text-danger">{errors["insuredBirth"]}</p>
            ) : null}
          </div>
          <div className="col-3">
            {"Mã số nhân viên"} <span className="required">(*)</span>
            <div className="detail">{data.employeeNo}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            {"Đơn vị tham gia bảo hiểm"}
            <input
              type="text"
              placeholder="Nhập"
              value={data.insuredUnit}
              onChange={(e) => handleTextInputChange(e, "insuredUnit")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>

          <div className="col-6">
            {"Số GCNBH/Số thẻ BH"} <span className="required">(*)</span>
            <input
              type="text"
              placeholder="Nhập"
              value={data.insuredNumber}
              onChange={(e) => handleTextInputChange(e, "insuredNumber")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["insuredNumber"] ? (
              <p className="text-danger">{errors["insuredNumber"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* C. THÔNG TIN VỀ TAI NẠN / BỆNH VÀ KHÁM CHỮA */}
      <h5>C. THÔNG TIN VỀ TAI NẠN / BỆNH VÀ KHÁM CHỮA</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-6">
            <div>
              {"Ngày tai nạn"} <span className="required">(*)</span>
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.accidentDate
                  ? moment(
                      data.accidentDate,
                      Constants.LEAVE_DATE_FORMAT
                    ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "accidentDate")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
            {errors["accidentDate"] ? (
              <p className="text-danger">{errors["accidentDate"]}</p>
            ) : null}
          </div>
          <div className="col-6">
            <div>{"Nơi xảy ra tai nạn"}</div>
            <input
              type="text"
              placeholder="Nhập"
              value={data.accidentAddress}
              onChange={(e) => handleTextInputChange(e, "accidentAddress")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            <div>
              {"Ngày khám bệnh"} <span className="required">(*)</span>
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.examDate
                  ? moment(data.examDate, Constants.LEAVE_DATE_FORMAT).toDate()
                  : null
              }
              onChange={(date) => handleDatePickerInputChange(date, "examDate")}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
            {errors["examDate"] ? (
              <p className="text-danger">{errors["examDate"]}</p>
            ) : null}
          </div>
          <div className="col-6">
            <div>
              {"Ngày nhập viện"} <span className="required">(*)</span>
            </div>
            <DatePicker
              name="startDate"
              //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
              autoComplete="off"
              selected={
                data.hospitalizedDate
                  ? moment(
                      data.hospitalizedDate,
                      Constants.LEAVE_DATE_FORMAT
                    ).toDate()
                  : null
              }
              onChange={(date) =>
                handleDatePickerInputChange(date, "hospitalizedDate")
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={t("Select")}
              locale={t("locale")}
              className="form-control input"
              styles={{ width: "100%" }}
            />
            {errors["hospitalizedDate"] ? (
              <p className="text-danger">{errors["hospitalizedDate"]}</p>
            ) : null}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>
              {"Nơi điều trị"} <span className="required">(*)</span>
            </div>
            <input
              type="text"
              placeholder="Nhập"
              value={data.hospitalizedAddress}
              onChange={(e) => handleTextInputChange(e, "hospitalizedAddress")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["hospitalizedAddress"] ? (
              <p className="text-danger">{errors["hospitalizedAddress"]}</p>
            ) : null}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Nguyên nhân / Chẩn đoán về tai nạn/bệnh"}</div>
            <input
              type="text"
              placeholder="Nhập"
              value={data.reason}
              onChange={(e) => handleTextInputChange(e, "reason")}
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
              placeholder="Nhập"
              value={data.result}
              onChange={(e) => handleTextInputChange(e, "result")}
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
          <div className="col-3">
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
          <div className="col-6">
            <div style={{ color: "white" }}>{"."}</div>
            <div
              className="form-control mv-10 border-0"
              style={{ color: "#000", paddingLeft: 0 }}
            >
              <div className="form-check-inline">
                Hình thức điều trị:<span className="required">(*)</span>
              </div>
              {TREATMENT_OPTIONS.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="treat"
                      type="radio"
                      checked={data.treatType?.value == item.value}
                      className="form-check-input"
                      id={`treat-${item.value}`}
                      onChange={(e) =>
                        handleChangeSelectInputs(item, "treatType")
                      }
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
              {errors["treatType"] ? (
                <p className="text-danger">{errors["treatType"]}</p>
              ) : null}
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
            <div>
              {"Tổng số tiền yêu cầu chi trả"}{" "}
              <span className="required">(*)</span>
            </div>
            <input
              type="text"
              placeholder="Nhập"
              value={data.payAmount}
              onChange={(e) => handleTextInputChange(e, "payAmount")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
              checked={"checked"}
            />
            {errors["payAmount"] ? (
              <p className="text-danger">{errors["payAmount"]}</p>
            ) : null}
          </div>
        </div>

        <div className="row mv-10 mb-3">
          <div className="col-12">
            <div className="">
              <div className="form-check-inline mt-2">
                Chi trả bảo hiểm cho trường hợp:{" "}
                <span className="required">(*)</span>
              </div>

              {INSURANCE_CASE.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="case"
                      type="radio"
                      className="form-check-input"
                      checked={data.payCase?.value == item.value}
                      id={`case-${item.value}`}
                      onChange={(e) =>
                        handleChangeSelectInputs(item, "payCase")
                      }
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
              {errors["payCase"] ? (
                <p className="text-danger">{errors["payCase"]}</p>
              ) : null}
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
                Lựa chọn hình thức thanh toán:{" "}
                <span className="required">(*)</span>
              </div>

              {PAY_TYPE.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="pay"
                      type="radio"
                      checked={data.payType?.value == item.value}
                      className="form-check-input"
                      id={`pay-${item.value}`}
                      onChange={(e) =>
                        handleChangeSelectInputs(item, "payType")
                      }
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
              {errors["payType"] ? (
                <p className="text-danger">{errors["payType"]}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            <div>
              {"Người thụ hưởng"} <span className="required">(*)</span>
            </div>
            <input
              value={data.receiveName}
              onChange={(e) => handleTextInputChange(e, "receiveName")}
              type="text"
              placeholder="Nhập"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["receiveName"] ? (
              <p className="text-danger">{errors["receiveName"]}</p>
            ) : null}
          </div>

          <div className="col-6">
            <div>
              {"Số tài khoản"} <span className="required">(*)</span>
            </div>
            <input
              value={data.receiveAccount}
              onChange={(e) => handleTextInputChange(e, "receiveAccount")}
              type="text"
              placeholder="Nhập"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["receiveAccount"] ? (
              <p className="text-danger">{errors["receiveAccount"]}</p>
            ) : null}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>
              {"Ngân hàng"} <span className="required">(*)</span>
            </div>
            <input
              value={data.bankName}
              onChange={(e) => handleTextInputChange(e, "bankName")}
              type="text"
              placeholder="Nhập"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["bankName"] ? (
              <p className="text-danger">{errors["bankName"]}</p>
            ) : null}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>
              {"Địa chỉ ngân hàng"} <span className="required">(*)</span>
            </div>
            <input
              value={data.bankAddress}
              onChange={(e) => handleTextInputChange(e, "bankAddress")}
              type="text"
              placeholder="Nhập"
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["bankAddress"] ? (
              <p className="text-danger">{errors["bankAddress"]}</p>
            ) : null}
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
              <div className="col-4">
                <input
                  value={data.formAddress}
                  onChange={(e) => handleTextInputChange(e, "formAddress")}
                  type="text"
                  placeholder="Nhập"
                  className="form-control input mv-10 w-100 only-border-bottom"
                  name="inputName"
                  autoComplete="off"
                />
              </div>
              <div className="col-8">
                <DatePicker
                  name="startDate"
                  //readOnly={disableComponent.disableAll || !disableComponent.qlttSide || data.qlttOpinion.disableTime == true}
                  autoComplete="off"
                  selected={
                    data.formDate
                      ? moment(
                          data.formDate,
                          Constants.LEAVE_DATE_FORMAT
                        ).toDate()
                      : null
                  }
                  onChange={(date) =>
                    handleDatePickerInputChange(date, "formDate")
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
    </div>
  );
};

export default withTranslation()(CreateInsuranceHealth);
