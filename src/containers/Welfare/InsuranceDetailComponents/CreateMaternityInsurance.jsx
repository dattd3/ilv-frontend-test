import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import _ from "lodash";
import { Spinner } from "react-bootstrap";

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
  disabledSubmitButton
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
          <div className="col-4">
            {"Hình thức kê khai phát sinh"}
            <div className="detail">{data.declareForm}</div>
          </div>
          <div className="col-4">
            {"Trường hợp hưởng chế độ thai sản"}
            <div className="detail">{data.maternityRegime}</div>
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
            {"Điều kiện khám thai"}
            <div className="detail">{data.maternityCondition}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Điều kiện sinh con"}
            <div className="detail">{data.birthCondition}</div>
          </div>
          <div className="col-8">
            {"Số sổ BHXH của người nuôi dưỡng (trường hợp mẹ chết)"}
            <div className="detail">{data.raiserInsuranceNumber}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Cha nghỉ chăm con"}
            <div className="detail">{data.dadCare}</div>
          </div>
          <div className="col-8">
            {"Phương án"}
            <div className="detail">{data.plan}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {"Lý do đề nghị điều chỉnh"}
            <div className="detail">{data.reason}</div>
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
            <div className="detail">{data.personal_id_no}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Mã nhân viên"}
            <div className="detail">{data.employeeNo}</div>
          </div>

          <div className="col-4">
            {"Ngày nghỉ hàng tuần"}
            <div className="detail">{data.leaveOfWeek}</div>
          </div>

          <div className="col-4">
            {"Ngày bắt đầu đi làm lại thực tế"}
            <div className="detail">{data.startWork}</div>
          </div>
        </div>
      </div>

      {/* CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ */}
      <h5>CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            {"Số Seri/Số lưu trữ"}
            <div className="detail">{data.seri}</div>
          </div>
          <div className="col-4">
            <div>{"Từ ngày"}</div>
            <div className="detail">{data.fromDate}</div>
          </div>
          <div className="col-4">
            <div>{"Đến ngày"}</div>
            <div className="detail">{data.toDate}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            {"Tổng số"}
            <div className="detail">{data.total}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CỦA CON */}
      <h5>THÔNG TIN CỦA CON</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Mã số BHXH của con"}</div>
            <div className="detail">{data.childInsuranceNumber}</div>
          </div>
          <div className="col-4">
            <div>{"Số thẻ BHYT của con"}</div>
            <div className="detail">{data.childHealthNumber}</div>
          </div>
          <div className="col-4">
            <div>{"Tuổi thai"}</div>
            <div className="detail">{data.age}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Ngày sinh con"}</div>
            <div className="detail">{data.childBirth}</div>
          </div>
          <div className="col-4">
            <div>{"Ngày con chết"}</div>
            <div className="detail">{data.childDead}</div>
          </div>

          <div className="col-4">
            {"Số con"}
            <div className="detail">{data.childNumbers}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-8">
            <div>{"Số con chết hoặc số thai chết lưu khi sinh"}</div>
            <div className="detail">{data.childDeadNumbers}</div>
          </div>
          <div className="col-4">
            <div>{"Ngày nhận nuôi con nuôi"}</div>
            <div className="detail">{data.childReceiveDate}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>
              {"Ngày nhận nuôi (Đối với người mẹ nhờ mang thai hộ nhận con)"}
            </div>
            <div className="detail">{data.childRaiseDate}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CỦA MẸ */}
      <h5>THÔNG TIN CỦA MẸ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Mã số BHXH của mẹ"}</div>
            <div className="detail">{data.momInsuranceNumber}</div>
          </div>
          <div className="col-4">
            <div>{"Số thẻ BHYT của mẹ"}</div>
            <div className="detail">{data.momHealthNumber}</div>
          </div>
          <div className="col-4">
            <div>{"Số CMTND của mẹ"}</div>
            <div className="detail">{data.momIdNumber}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Nghỉ dưỡng thai"}</div>
            <div className="detail">{data.maternityLeave}</div>
          </div>
          <div className="col-4">
            <div>{"Mang thai hộ"}</div>
            <div className="detail">{data.hasRainser}</div>
          </div>

          <div className="col-4">
            {"Phẫu thuật hoặc thai dưới 32 tuần"}
            <div className="detail">{data.hasSurgery}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            <div>{"Ngày mẹ chết"}</div>
            <div className="detail">{data.momDeadDate}</div>
          </div>
          <div className="col-8">
            <div>{"Ngày kết luận (mẹ không đủ điều kiện chăm con)"}</div>
            <div className="detail">{data.resultDate}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <div>{"Phí giám định y khoa"}</div>
            <div className="detail">{data.assessment}</div>
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

export default withTranslation()(CreateMaternityInsurance);
