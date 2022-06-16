import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import _ from "lodash";
import { Spinner } from "react-bootstrap";

const CreateSickInsurance = ({
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
}) => {
  const [errors, setErrors] = useState({});
  const InsuranceOptions = [
    { value: 1, label: "Ốm đau" },
    { value: 2, label: "Thai sản" },
    { value: 3, label: "Dưỡng sưc" },
  ];

  return (
    <>
      {/* YÊU CẦU BẢO HIỂM Y TẾ */}
      <h5>YÊU CẦU BẢO HIỂM Y TẾ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {"Loại yêu cầu"}
             <div className="detail">{type?.label}</div>
          </div>
          <div className="col-8">
            {"Hình thức kê khai phát sinh"}
            <div className="detail">{data.declareForm}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Từ ngày đơn vị đề nghị hưởng"}
            <div className="detail">{data.dateRequest}</div>
            
          </div>
          <div className="col-4">
            {"Từ ngày giải quyết trước"}
            <div className="detail">{data.dateLastResolved}</div>
          </div>
          <div className="col-4">
            {"Phương án"}
            <div className="detail">{data.plan}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {"Ghi chú"}
            <div className="detail">{data.note}</div>
          </div>
        </div>
      </div>
      {/* THÔNG TIN CÁ NHÂN */}
      <h5>THÔNG TIN CÁ NHÂN</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <div className="detail">{data.fullName}</div>
          </div>
          <div className="col-4">
            {"Mã sổ/số sổ BHXH"}
            <div className="detail">{data.socialId}</div>
          </div>
          <div className="col-4">
            {"Số CMND/Hộ chiếu/Thẻ căn cước"}
            <div className="detail">{data.IndentifiD}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Mã nhân viên"}
            <div className="detail">{data.employeeNo}</div>
          </div>

          <div className="col-4">
            {"Điều kiện làm việc"}
            <div className="detail">{data.workingCondition}</div>
          </div>

          <div className="col-4">
            {"Ngày nghỉ hàng tuần"}
            <div className="detail">{data.leaveOfWeek}</div>
          </div>
        </div>
      </div>
      {/* GIẤY RA VIỆN/CHỨNG NHẬN NGHỈ VIỆC HƯỞNG BHXH */}
      <h5>GIẤY RA VIỆN/CHỨNG NHẬN NGHỈ VIỆC HƯỞNG BHXH</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-8">
            {"Tuyến bệnh viện"}
            <div className="detail">{data.hospitalLine}</div>
          </div>
          <div className="col-4">
            {"Số Seri"}
            <div className="detail">{data.seri}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Từ ngày"}</div>
            <div className="detail">{data.fromDate}</div>
          </div>
          <div className="col-4">
            <div>{"Đến ngày"}</div>
            <div className="detail">{data.toDate}</div>
          </div>
          <div className="col-4">
            {"Tổng số"}
            <div className="detail">{data.total}</div>
          </div>
        </div>
      </div>
      {/* TRƯỜNG HỢP CON ỐM */}
      <h5>TRƯỜNG HỢP CON ỐM</h5>{" "}
      <span className="sub-h5">
        (vui lòng điền đầy đủ thông tin để được hỗ trợ phúc lợi)
      </span>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Ngày sinh con"}</div>
            <div className="detail">{data.childBirth}</div>
          </div>
          <div className="col-4">
            <div>{"Số thẻ BHYT của con"}</div>
            <div className="detail">{data.childInsuranceNumber}</div>
          </div>
          <div className="col-4">
            {"Số con bị ốm"}
            <div className="detail">{data.childSickNumbers}</div>
          </div>
        </div>
      </div>
      {/* CHUẨN ĐOÁN BỆNH */}
      <h5>CHUẨN ĐOÁN BỆNH</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Mã bệnh dài ngày"}</div>
            <div className="detail">{data.sickId}</div>
          </div>
          <div className="col-8">
            {"Tên bệnh"}
            <div className="detail">{data.sickName}</div>
          </div>
        </div>
      </div>
      {/* ĐỢT GIẢI QUYẾT */}
      <h5>ĐỢT GIẢI QUYẾT</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{"Nội dung đợt"}</div>
            <div className="detail">{data.resolveContent}</div>
          </div>
          <div className="col-4">
            {"Tháng năm"}
            <div className="detail">{data.resolveDate}</div>
          </div>
        </div>
      </div>
      {/* ĐỢT BỔ SUNG */}
      <h5>ĐỢT BỔ SUNG</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{"Nội dung đợt"}</div>
            <div className="detail">{data.addtionContent}</div>
          </div>
          <div className="col-4">
            {"Tháng năm"}
            <div className="detail">{data.addtionDate}</div>
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
            </div>
            <div className="detail">{data.receiveType}</div>
          </div>
          <div className="col-4">
            <div>
              {"Số tài khoản"}
            </div>
            <div className="detail">{data.accountNumber}</div>
          </div>
          <div className="col-4">
            {"Tên chủ tài khoản"}
            <div className="detail">{data.accountName}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>
              {"Mã ngân hàng"}
            </div>
            <div className="detail">{data.bankId}</div>
          </div>
          <div className="col-8">
            <div>
              {"Tên ngân hàng"}
            </div>
            <div className="detail">{data.bankName}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(CreateSickInsurance);
