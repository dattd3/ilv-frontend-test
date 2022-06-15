import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  disabledSubmitButton,
}) => {

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
            {"Từ ngày đơn vị đề nghị hưởng"}
            <div className="detail">{data.dateRequest}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {"Từ ngày giải quyết trước"}
            <div className="detail">{data.dateLastResolved}</div>
          </div>
          <div className="col-8">
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
            {"Ngày quay trở lại làm việc tại đơn vị"}
            <div className="detail">{data.startWork}</div>
          </div>
        </div>
      </div>

      {/* SỐ NGÀY ĐỀ NGHỊ HƯỞNG CHẾ ĐỘ TẠI ĐƠN VỊ */}
      <h5>SỐ NGÀY ĐỀ NGHỊ HƯỞNG CHẾ ĐỘ TẠI ĐƠN VỊ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            {"Số Seri"}
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

      {/* THÔNG TIN GIÁM ĐỊNH */}
      <h5>THÔNG TIN GIÁM ĐỊNH</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <div>{"Tỷ lệ suy giảm"}</div>
            <div className="detail">{data.declineRate}</div>
          </div>
          <div className="col-4">
            <div>{"Ngày giám định"}</div>
            <div className="detail">{data.assessmentDate}</div>
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
            <div>{"Hình thức nhận"}</div>

            <div className="detail">{data.receiveType}</div>
          </div>
          <div className="col-4">
            <div>{"Số tài khoản"}</div>
            <div className="detail">{data.accountNumber}</div>
          </div>
          <div className="col-4">
            {"Tên chủ tài khoản"}
            <div className="detail">{data.accountName}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <div>{"Mã ngân hàng"}</div>

            <div className="detail">{data.bankId}</div>
          </div>
          <div className="col-8">
            <div>{"Tên ngân hàng"}</div>
            <div className="detail">{data.bankName}</div>
          </div>
        </div>
      </div>

     
    </>
  );
};

export default withTranslation()(CreateConvalesInsurance);
