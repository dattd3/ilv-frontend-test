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
import { toast } from "react-toastify";
import ResultModal from "../Registration/ResultModal";
import { Spinner } from "react-bootstrap";
import HOCComponent from '../../components/Common/HOCComponent'
import Select from "react-select";
import CurrencyInput from 'react-currency-input-field';
import { replaceAll } from '../Utils/Common';

const RELATIONSHIP_WITH_INSURED = [
  { value: 'V000', label: 'Bản thân' },
  { value: 'V001', label: 'Cha ruột' },
  { value: 'V002', label: 'Mẹ ruột' },
  { value: 'V005', label: 'Vợ' },
  { value: 'V006', label: 'Cha chồng' },
  { value: 'V007', label: 'Mẹ chồng' },
  { value: 'V008', label: 'Cha vợ' },
  { value: 'V009', label: 'Mẹ vợ' },
  { value: 'V013', label: 'Chồng' },
  { value: 'V014', label: 'Con trai' },
  { value: 'V015', label: 'Con gái' },
];

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
  let GENDER_OPTIONS_TMP = [];

  useEffect(() => {
    getCommonGroupData()
  }, []);

  const getCommonGroupData = async () => {
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
    await axios.post(
      `${process.env.REACT_APP_HRDX_URL}api/data/getcommongroup`,
      payload,
      config
    ).then((res) => {
      if (res?.data?.data) {
        const remoteData = res.data.data;
        setInsuranceOptions((remoteData.INSURANCEOPTION || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setINSURANCE_CASE((remoteData.INSURANCE_CASE || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setPAY_TYPE((remoteData.INSURANCEPAYTYPE || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setGENDER_OPTIONS((remoteData.INSURANCEGENDER || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setTREATMENT_OPTIONS((remoteData.INSURANCETREATMENT || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        GENDER_OPTIONS_TMP = (remoteData.INSURANCEGENDER || []).map(item => { return { value: item.keyNumber, label: item.textValue } });
      }
    }).finally(() => {
      getPersonalInfo()
    });
  }

  const getPersonalInfo = async () => {
    const config = getMuleSoftHeaderConfigurations()
    await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/personalinfo`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let profile = res.data.data[0];
          const candidateInfos = { ...data };
          candidateInfos["insuranceClaimant"] = profile?.fullname // Nguoi yeu cau tra BHXH
          candidateInfos["insuranceRelation"] = RELATIONSHIP_WITH_INSURED[0].label // Moi quan he voi nguoi duoc bao hiem
          // Địa chỉ thường trú
          const compiledAddress = _.template('<%= street_name %>,<%= wards %>,<%= district %>,<%= province %>');
          candidateInfos["address"] = compiledAddress({ street_name: profile?.street_name, wards: profile?.wards, district: profile?.district, province: profile?.province })
          candidateInfos["phone"] = profile?.cell_phone_no // So dien thoai
          candidateInfos["email"] = profile?.personal_email.toLowerCase() // email
          candidateInfos["gender"] = GENDER_OPTIONS_TMP.find(u => u?.value == profile?.gender) // Giới tính
          candidateInfos["insuredName"] = profile?.fullname // Ho ten NDBH
          candidateInfos["insuredId"] = profile?.personal_id_no ? profile?.personal_id_no : profile?.passport_id_no // So CMND/ Ho chieu
          candidateInfos["insuredBirth"] = replaceAll(profile.birthday, '-', '/') // Ngay sinh
          candidateInfos["insuredNumber"] = profile?.insurance_number // So GCNBH/So the BH
          setData(candidateInfos);
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });
  }

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

  const handleChangeSelect = (e, name) => {
    const candidateInfos = { ...data };
    candidateInfos[name] = e != null ? e.label : "";
    setData(candidateInfos);
  }

  const handleChangeInputCurrency = (e, name) => {
    const candidateInfos = { ...data };
    candidateInfos[name] = e != null ? e : "";
    setData(candidateInfos);
  }

  const handleDatePickerInputChange = (value, name) => {
    //YYYY-MM-DD
    const candidateInfos = { ...data };
    if (moment(value, "DD/MM/YYYY").isValid()) {
      if (moment(value).year() > 9999) {
        const year = (moment(value).year() + '').substring(0, 4);
        value = moment(value).set('year', year).format("DD/MM/YYYY")
      }
      const date = moment(value, "DD/MM/YYYY").format("DD/MM/YYYY");
      candidateInfos[name] = date;
      candidateInfos[name + "_raw"] = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
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
            t("Error")
          );
          setdisabledSubmitButton(false);
        }
      })
      .catch((response) => {
        notifyMessage(t("Error"));
        setdisabledSubmitButton(false);
      });
  };

  const verifyData = () => {
    let _errors = {};
    const candidateInfos = { ...data };
    const requiredFieldsFull = [
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
    const requiredFieldsNotFull = [
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
    ]
    const optionFields = ["treatType", "payCase", "payTypes"];

    let requiredFieldsCheck = []
    if (candidateInfos.payType?.value === 1) {
      requiredFieldsCheck = requiredFieldsNotFull
    } else {
      requiredFieldsCheck = requiredFieldsFull
    }

    requiredFieldsCheck.forEach((name) => {
      if (
        _.isEmpty(candidateInfos[name]) ||
        (!candidateInfos[name].value && optionFields.includes(name))
      ) {
        _errors[name] = t('PleaseEnterInfo');
      } else {
        _errors[name] =
          _errors[name] == t('PleaseEnterInfo') ? null : _errors[name];
      }

      if (name === 'email') {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(candidateInfos[name])) {
        } else {
          _errors.email = 'Sai định dạng email. Xin vui lòng nhập lại !'
        }
      }

      if (name === 'phone') {
        if (/^\d+$/.test(candidateInfos[name])) {
        } else {
          _errors.phone = 'Sai định dạng số điện thoại. Xin vui lòng nhập lại !'
        }
      }
    });
    setErrors(_errors);

    const hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage(t('PleaseEnterInfo'), true);
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
      <ResultModal
        show={resultModal.isShowStatusModal}
        title={resultModal.titleModal}
        message={resultModal.messageModal}
        isSuccess={resultModal.isSuccess}
        onHide={hideStatusModal}
      />
      {/* A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM */}
      <h5>A. {t("welfare_heath_insurance_title1")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {t("insurance_claimant")}{" "}
            <span className="required">(*)</span>
            <input
              type="text"
              placeholder={t('import')}
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
            {t("relationship_with_insured")}
            <Select
              placeholder={t('option')}
              options={RELATIONSHIP_WITH_INSURED}
              isClearable={false}
              value={RELATIONSHIP_WITH_INSURED.find(u => u.label === data.insuranceRelation)}
              onChange={(value) => handleChangeSelect(value, "insuranceRelation")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
          {t("Address")}
            <input
              type="text"
              placeholder={t('import')}
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
          {t("number_phone")} <span className="required">(*)</span>
            <input
              type="text"
              placeholder={t('import')}
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
              placeholder={t('import')}
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
      <h5>B. {t("welfare_heath_insurance_title2")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {t("name_of_patient")}
            <span className="required">(*)</span>
            <input
              type="text"
              placeholder={t('import')}
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
                {t("sex")}: <span className="required">(*)</span>
              </div>
              {GENDER_OPTIONS.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      placeholder={t('import')}
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
            {t("indenfy_number_3")} <span className="required">(*)</span>
            <input
              placeholder={t('import')}
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
            {t("birthday")} <span className="required">(*)</span>
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
            {t("employee_number")} <span className="required">(*)</span>
            <div className="detail">{data.employeeNo}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            {t("participating_in_insurance")}
            <input
              type="text"
              placeholder={t('import')}
              value={data.insuredUnit}
              onChange={(e) => handleTextInputChange(e, "insuredUnit")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>

          <div className="col-6">
            {t("insurance_certificate_card_number")} <span className="required">(*)</span>
            <input
              type="text"
              placeholder={t('import')}
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
      <h5>C. {t("welfare_heath_insurance_title3")}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-6">
            <div>
            {t("day_of_accident")}<span className="required">(*)</span>
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
            <div>{t("place_where_accident")}</div>
            <input
              type="text"
              placeholder={t('import')}
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
            {t("medical_examination_day")}<span className="required">(*)</span>
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
            {t("hospitalized_day")} <span className="required">(*)</span>
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
            {t("place_of_treatment")} <span className="required">(*)</span>
            </div>
            <input
              type="text"
              placeholder={t('import')}
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
            <div>{t("cause_diagnosis_accident")}</div>
            <input
              type="text"
              placeholder={t('import')}
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
            <div> {t("consequence")}</div>
            <input
              type="text"
              placeholder={t('import')}
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
            <div>{t("StartDate")}</div>
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
              styles={{ width: "100%" }}
            />
          </div>
          <div className="col-3">
            <div>{t("EndDate")}</div>
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
              {t("treatment_form")}<span className="required">(*)</span>
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
      <h5>D. {t("welfare_heath_insurance_title4")}</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="pay-title">
            1. {t("contents_claim_insurance_payment")}
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>
            {t("total_amount_requested_pay")}{" "}
              <span className="required">(*)</span>
            </div>

            <CurrencyInput
              intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
              className="form-control input mv-10 w-100"
              value={data.payAmount}
              placeholder={t('import')}
              onValueChange={(value) => handleChangeInputCurrency(value, "payAmount")}
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
              {t("insurance_payment_for_case")}{" "}
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
            2. {t("payment_method_beneficiary_information")}
          </div>
        </div>

        <div className="row mb-3 mt-2">
          <div className="col-12">
            <div>
              <div className="form-check-inline">
              {t("select_payment_method")}{" "}
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
            {t("beneficiary")} <span className="required">(*)</span>
            </div>
            <input
              value={data.receiveName}
              onChange={(e) => handleTextInputChange(e, "receiveName")}
              type="text"
              placeholder={t('import')}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
            {errors["receiveName"] ? (
              <p className="text-danger">{errors["receiveName"]}</p>
            ) : null}
          </div>

          {data.payType?.value !== 1 &&
            <div className="col-6">
              <div>
              {t("account_number")} <span className="required">(*)</span>
              </div>
              <input
                value={data.receiveAccount}
                onChange={(e) => handleTextInputChange(e, "receiveAccount")}
                type="text"
                placeholder={t('import')}
                className="form-control input mv-10 w-100"
                name="inputName"
                autoComplete="off"
              />
              {errors["receiveAccount"] ? (
                <p className="text-danger">{errors["receiveAccount"]}</p>
              ) : null}
            </div>
          }
        </div>
        {data.payType?.value !== 1 &&
          <>
            <div className="row mv-10">
              <div className="col-12">
                <div>
                {t("bank")} <span className="required">(*)</span>
                </div>
                <input
                  value={data.bankName}
                  onChange={(e) => handleTextInputChange(e, "bankName")}
                  type="text"
                  placeholder={t('import')}
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
                {t("bank_address")} <span className="required">(*)</span>
                </div>
                <input
                  value={data.bankAddress}
                  onChange={(e) => handleTextInputChange(e, "bankAddress")}
                  type="text"
                  placeholder={t('import')}
                  className="form-control input mv-10 w-100"
                  name="inputName"
                  autoComplete="off"
                />
                {errors["bankAddress"] ? (
                  <p className="text-danger">{errors["bankAddress"]}</p>
                ) : null}
              </div>
            </div>
          </>
        }
      </div>

      {/* E. CAM KẾT VÀ ỦY QUYỀN */}
      <h5>E. {t("welfare_heath_insurance_title5")}</h5>
      <div className="box shadow cbnv" style={{ padding: "10px 20px" }}>
        <p className="policy">
          {" "}
          <img src={BulletIcon} style={{ paddingRight: "7px" }} />
          {t("welfare_heath_insurance_title_note1")}
        </p>
        <p className="policy">
          {" "}
          <img src={BulletIcon} style={{ paddingRight: "7px" }} />
          {t("welfare_heath_insurance_title_note2")}
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
                  placeholder={t('import')}
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
            <div className="sign-title">{t("confirm")}</div>
            <div className="sign-subtitle">
              ({t("welfare_heath_insurance_title_note4")})
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5 sign-contain">
            <div className="sign-title">{t("petitioner")}</div>
            <div className="sign-subtitle">({t("sign_and_write_name")})</div>
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

export default HOCComponent(withTranslation()(CreateInsuranceHealth))
