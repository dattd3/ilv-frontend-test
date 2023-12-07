import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import { UPDATE_KEYS_MAP } from "../InsuranceComponents/InsuranceData";

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

  const checkHasChange = (key) => {
    const actualKey = 'convalesData.' + key;
    const mappkey = UPDATE_KEYS_MAP[actualKey];
    return data.updatedKeys?.includes(mappkey) ? 'updated' : '';
  }

  return (
    <>
      {/* YÊU CẦU BẢO HIỂM Y TẾ */}
      <h5>YÊU CẦU BẢO HIỂM Y TẾ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{"Loại yêu cầu"}</strong>
            <div className={`detail ${checkHasChange('type')}`}>{type?.label}</div>
          </div>
          <div className="col-4">
            <strong>{"Hình thức kê khai phát sinh"}</strong>
            <div className={`detail ${checkHasChange('declareForm')}`}>{data.declareForm}</div>
          </div>
          <div className="col-4">
            <strong>{"Từ ngày đơn vị đề nghị hưởng"}</strong>
            <div className={`detail ${checkHasChange('dateRequest')}`}>{data.dateRequest}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Từ ngày giải quyết trước"}</strong>
            <div className={`detail ${checkHasChange('dateLastResolved')}`}>{data.dateLastResolved}</div>
          </div>
          <div className="col-8">
            <strong>{"Phương án"}</strong>
            <div className={`detail ${checkHasChange('plan')}`}>{data.plan}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Ghi chú"}</strong>
            <div className={`detail ${checkHasChange('note')}`}>{data.note}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CÁ NHÂN */}
      <h5>THÔNG TIN CÁ NHÂN</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{t("FullName")}</strong>
            <div className={`detail ${checkHasChange('fullName')}`}>{data.fullName}</div>
          </div>
          <div className="col-4">
            <strong>{"Mã sổ/số sổ BHXH"}</strong>
            <div className={`detail ${checkHasChange('socialId')}`}>{data.socialId}</div>
          </div>
          <div className="col-4">
            <strong>{"Số CMND/Hộ chiếu/Thẻ căn cước"}</strong>
            <div className={`detail ${checkHasChange('IndentifiD')}`}>{data.IndentifiD}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Mã nhân viên"}</strong>
            <div className={`detail ${checkHasChange('employeeNo')}`}>{data.employeeNo}</div>
          </div>

          <div className="col-4">
            <strong>{"Ngày quay trở lại làm việc tại đơn vị"}</strong>
            <div className={`detail ${checkHasChange('startWork')}`}>{data.startWork}</div>
          </div>
        </div>
      </div>

      {/* SỐ NGÀY ĐỀ NGHỊ HƯỞNG CHẾ ĐỘ TẠI ĐƠN VỊ */}
      <h5>SỐ NGÀY ĐỀ NGHỊ HƯỞNG CHẾ ĐỘ TẠI ĐƠN VỊ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Số Seri"}</strong>
            <div className={`detail ${checkHasChange('seri')}`}>{data.seri}</div>
          </div>
          <div className="col-4">
            <strong>{"Từ ngày"}</strong>
            <div className={`detail ${checkHasChange('fromDate')}`}>{data.fromDate}</div>
          </div>
          <div className="col-4">
            <strong>{"Đến ngày"}</strong>
            <div className={`detail ${checkHasChange('toDate')}`}>{data.toDate}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Tổng số"}</strong>
            <div className={`detail ${checkHasChange('total')}`}>{data.total}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN GIÁM ĐỊNH */}
      <h5>THÔNG TIN GIÁM ĐỊNH</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <strong>{"Tỷ lệ suy giảm"}</strong>
            <div className={`detail ${checkHasChange('declineRate')}`}>{data.declineRate}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày giám định"}</strong>
            <div className={`detail ${checkHasChange('assessmentDate')}`}>{data.assessmentDate}</div>
          </div>
        </div>
      </div>

      {/* ĐỢT GIẢI QUYẾT */}
      <h5>ĐỢT GIẢI QUYẾT</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <strong>{"Nội dung đợt"}</strong>
            <div className={`detail ${checkHasChange('resolveContent')}`}>{data.resolveContent}</div>
          </div>
          <div className="col-4">
            <strong>{"Tháng năm"}</strong>
            <div className={`detail ${checkHasChange('resolveDate')}`}>{data.resolveDate}</div>
          </div>
        </div>
      </div>

      {/* ĐỢT BỔ SUNG */}
      <h5>ĐỢT BỔ SUNG</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-8">
            <strong>{"Nội dung đợt"}</strong>
            <div className={`detail ${checkHasChange('addtionContent')}`}>{data.addtionContent}</div>
          </div>
          <div className="col-4">
            <strong>{"Tháng năm"}</strong>
            <div className={`detail ${checkHasChange('addtionDate')}`}>{data.addtionDate}</div>
          </div>
        </div>
      </div>

      {/* HÌNH THỨC TRỢ CẤP */}
      <h5>HÌNH THỨC TRỢ CẤP</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Hình thức nhận"}</strong>
            <div className={`detail ${checkHasChange('receiveType')}`}>{data.receiveType?.name || ''}</div>
          </div>
          <div className="col-4">
            <strong>{"Số tài khoản"}</strong>
            <div className={`detail ${checkHasChange('accountNumber')}`}>{data.accountNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Tên chủ tài khoản"}</strong>
            <div className={`detail ${checkHasChange('accountName')}`}>{data.accountName}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Mã ngân hàng"}</strong>
            <div className={`detail ${checkHasChange('bankId')}`}>{data.bankId}</div>
          </div>
          <div className="col-8">
            <strong>{"Tên ngân hàng"}</strong>
            <div className={`detail ${checkHasChange('bankName')}`}>{data.bankName}</div>
          </div>
        </div>
      </div>

      <h5>PHẢN HỒI CỦA NHÂN SỰ</h5>
      <div className="box shadow cbnv" style={{paddingTop: '0px', paddingBottom: '0px'}}>
        <div className="row">
          <div className="col-12">
            <div className={`detail`}>{data.hrComment || ''}</div>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default withTranslation()(CreateConvalesInsurance);
