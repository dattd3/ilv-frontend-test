import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import BulletIcon from "../../assets/img/icon/ic_bullet.svg";
import _ from "lodash";
import { getRequestConfigurations } from "../../commons/Utils";
import axios from "axios";
import moment from 'moment';
import "react-toastify/dist/ReactToastify.css";

const DetailInsuranceHealth = (props) => {
  const { t } = props;
  const [InsuranceOptions, setInsuranceOptions] = useState([]);
  const [INSURANCE_CASE, setINSURANCE_CASE] = useState([]);
  const [PAY_TYPE, setPAY_TYPE] = useState([]);
  const [GENDER_OPTIONS, setGENDER_OPTIONS] = useState([]);
  const [TREATMENT_OPTIONS, setTREATMENT_OPTIONS] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    getCommonGroup()
    getDetailInsuranceHealth()
  }, []);

  const getCommonGroup = () => {
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
      if (res?.data?.data) {
        const remoteData = res.data.data;
        setInsuranceOptions((remoteData.INSURANCEOPTION || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setINSURANCE_CASE((remoteData.INSURANCE_CASE || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setPAY_TYPE((remoteData.INSURANCEPAYTYPE || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setGENDER_OPTIONS((remoteData.INSURANCEGENDER || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
        setTREATMENT_OPTIONS((remoteData.INSURANCETREATMENT || []).map(item => { return { value: item.keyNumber, label: item.textValue } }));
      }
    });
  }

  const getDetailInsuranceHealth = () => {
    const requestId = props.match.params.id;
    const requestConfig = getRequestConfigurations();
    const getInfoDetail = axios.get(`${process.env.REACT_APP_HRDX_URL}api/HealthInsurance/detail?id=${requestId}`, requestConfig)
    Promise.allSettled([getInfoDetail]).then(res => {
      if (res && res[0].value) {
        let infoDetail = res[0].value.data.data;
        setData(infoDetail);
      }
    })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="registration-insurance-section">
      {/* A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM */}
      <h5>A. THÔNG TIN VỀ NGƯỜI YÊU CẦU TRẢ TIỀN BẢO HIỂM</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {"Người yêu cầu trả tiền bảo hiểm"}{" "}
            <div className="detail">{data?.requestorFullName}</div>
          </div>
          <div className="col-6">
            {"Mối quan hệ với Người được bảo hiểm"}
            <div className="detail">{data?.requestorRelationship}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {"Địa chỉ"}
            <div className="detail">{data?.requestorAddress}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-6">
            {"Số điện thoại"}
            <div className="detail">{data?.requestorPhone}</div>
          </div>
          <div className="col-6">
            {"Email"}
            <div className="detail">{data?.requestorEmail}</div>
          </div>
        </div>
      </div>
      {/* B. THÔNG TIN VỀ NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH) */}
      <h5>B. THÔNG TIN VỀ NGƯỜI ĐƯỢC BẢO HIỂM (NĐBH)</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-6">
            {"Họ tên NĐBH"}
            <div className="detail">{data.recieverFullName}</div>
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
                      checked={data?.recieverSex === item.value}
                      className="form-check-input"
                      id={`gender-${item.value}`}
                      disabled={true}
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
            <div className="detail">{data?.recieverIdentityCard}</div>
          </div>
          <div className="col-3">
            {"Ngày sinh"}
            <div className="detail">
              {data?.recieverBirthDay ? moment(data?.recieverBirthDay).format('DD/MM/YYYY') : ''}
            </div>
          </div>
          <div className="col-3">
            {"Mã số nhân viên"}
            <div className="detail">{data?.employeeCode}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            {"Đơn vị tham gia bảo hiểm"}
            <div className="detail">{data?.recieverInsurer}</div>
          </div>

          <div className="col-6">
            {"Số GCNBH/Số thẻ BH"}
            <div className="detail">{data?.insuranceNumber}</div>
          </div>
        </div>
      </div>

      {/* C. THÔNG TIN VỀ TAI NẠN / BỆNH VÀ KHÁM CHỮA */}
      <h5>C. THÔNG TIN VỀ TAI NẠN / BỆNH VÀ KHÁM CHỮA</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-6">
            <div>{"Ngày tai nạn"}</div>
            <div className="detail">
              {data?.accidentDate ? moment(data?.accidentDate).format('DD/MM/YYYY') : ''}
            </div>
          </div>
          <div className="col-6">
            <div>{"Nơi xảy ra tai nạn"}</div>
            <div className="detail">{data?.accidentPlace}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-6">
            <div>{"Ngày khám bệnh"}</div>
            <div className="detail">
              {data?.examineDate ? moment(data?.examineDate).format('DD/MM/YYYY') : ''}
            </div>
          </div>
          <div className="col-6">
            <div>{"Ngày nhập viện"}</div>
            <div className="detail">
              {data?.hospitalizedDate ? moment(data?.hospitalizedDate).format('DD/MM/YYYY') : ''}
            </div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Nơi điều trị"}</div>
            <div className="detail">{data?.treatmentPlace}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Nguyên nhân / Chẩn đoán về tai nạn/bệnh"}</div>
            <div className="detail">{data?.accidentalCause}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Hậu quả"}</div>
            <div className="detail">{data?.consequence}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-3">
            <div>{"Từ ngày"}</div>
            <div className="detail">
              {data?.fromDate ? moment(data?.fromDate).format('DD/MM/YYYY') : ''}
            </div>
          </div>
          <div className="col-3">
            <div>{"Đến ngày"}</div>
            <div className="detail">
              {data?.toDate ? moment(data?.toDate).format('DD/MM/YYYY') : ''}
            </div>
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
                      checked={data?.treatmentForm === item.value}
                      className="form-check-input"
                      id={`treat-${item.value}`}
                      disabled={true}
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
            <div className="detail">{data?.totalMoneyAmount}</div>
          </div>
        </div>

        <div className="row mv-10 mb-3">
          <div className="col-12">
            <div className="">
              <div className="form-check-inline mt-2">
                Chi trả bảo hiểm cho trường hợp:
              </div>
              {INSURANCE_CASE.map((item, index) => {
                return (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      name="case"
                      type="radio"
                      className="form-check-input"
                      checked={data?.paymentCase === item.value}
                      id={`case-${item.value}`}
                      disabled={true}
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
                      checked={data?.paymentForm === item.value}
                      className="form-check-input"
                      id={`pay-${item.value}`}
                      disabled={true}
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
            <div className="detail">{data?.recieverAccountName}</div>
          </div>

          <div className="col-6">
            <div>{"Số tài khoản"}</div>
            <div className="detail">{data?.recieverAccountNumber}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Ngân hàng"}</div>
            <div className="detail">{data?.recieverBanker}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Địa chỉ ngân hàng"}</div>
            <div className="detail">{data?.recieverBankerAddress}</div>
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
                <div className="detail">{data?.signingPlace}</div>
              </div>
              <div className="col-8">
                <div className="detail">
                  {data?.signingDate ? moment(data?.signingDate).format('DD/MM/YYYY') : ''}
                </div>
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
    </div>
  );
};

export default withTranslation()(DetailInsuranceHealth);
