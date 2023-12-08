import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import { UPDATE_KEYS_MAP } from "../InsuranceComponents/InsuranceData";

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
    { value: 3, label: "Dưỡng sức" },
  ];

  const checkHasChange = (key) => {
    const actualKey = 'maternityData.' + key;
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
            <strong>{"Trường hợp hưởng chế độ thai sản"}</strong>
            <div className={`detail ${checkHasChange('maternityRegime')}`}>{data.maternityRegime}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Từ ngày đơn vị đề nghị hưởng"}</strong>
            <div className={`detail ${checkHasChange('dateRequest')}`}>{data.dateRequest}</div>
          </div>
          <div className="col-4">
            <strong>{"Từ ngày giải quyết trước"}</strong>
            <div className={`detail ${checkHasChange('dateLastResolved')}`}>{data.dateLastResolved}</div>
          </div>
          <div className="col-4">
            <strong>{"Điều kiện khám thai"}</strong>
            <div className={`detail ${checkHasChange('maternityCondition')}`}>{data.maternityCondition}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Điều kiện sinh con"}</strong>
            <div className={`detail ${checkHasChange('birthCondition')}`}>{data.birthCondition}</div>
          </div>
          <div className="col-8">
            <strong>{"Số sổ BHXH của người nuôi dưỡng (trường hợp mẹ chết)"}</strong>
            <div className={`detail ${checkHasChange('raiserInsuranceNumber')}`}>{data.raiserInsuranceNumber}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Cha nghỉ chăm con"}</strong>
            <div className={`detail ${checkHasChange('dadCare')}`}>{data.dadCare}</div>
          </div>
          <div className="col-8">
            <strong>{"Phương án"}</strong>
            <div className={`detail ${checkHasChange('plan')}`}>{data.plan}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Lý do đề nghị điều chỉnh"}</strong>
            <div className={`detail ${checkHasChange('reason')}`}>{data.reason}</div>
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
            <strong>{"Ngày nghỉ hàng tuần"}</strong>
            <div className={`detail ${checkHasChange('leaveOfWeek')}`}>{data.leaveOfWeek}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày bắt đầu đi làm lại thực tế"}</strong>
            <div className={`detail ${checkHasChange('startWork')}`}>{data.startWork}</div>
          </div>
        </div>
      </div>

      {/* CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ */}
      <h5>CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Số Seri/Số lưu trữ"}</strong>
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

      {/* THÔNG TIN CỦA CON */}
      <h5>THÔNG TIN CỦA CON</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Mã số BHXH của con"}</strong>
            <div className={`detail ${checkHasChange('childInsuranceNumber')}`}>{data.childInsuranceNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Số thẻ BHYT của con"}</strong>
            <div className={`detail ${checkHasChange('childHealthNumber')}`}>{data.childHealthNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Tuổi thai"}</strong>
            <div className={`detail ${checkHasChange('age')}`}>{data.age}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Ngày sinh con"}</strong>
            <div className={`detail ${checkHasChange('childBirth')}`}>{data.childBirth}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày con chết"}</strong>
            <div className={`detail ${checkHasChange('childDead')}`}>{data.childDead}</div>
          </div>
          <div className="col-4">
            <strong>{"Số con"}</strong>
            <div className={`detail ${checkHasChange('childNumbers')}`}>{data.childNumbers}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-8">
            <strong>{"Số con chết hoặc số thai chết lưu khi sinh"}</strong>
            <div className={`detail ${checkHasChange('childDeadNumbers')}`}>{data.childDeadNumbers}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày nhận nuôi con nuôi"}</strong>
            <div className={`detail ${checkHasChange('childReceiveDate')}`}>{data.childReceiveDate}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Ngày nhận nuôi (Đối với người mẹ nhờ mang thai hộ nhận con)"}</strong>
            <div className={`detail ${checkHasChange('childRaiseDate')}`}>{data.childRaiseDate}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CỦA MẸ */}
      <h5>THÔNG TIN CỦA MẸ</h5>
      <div className="box shadow cbnv">
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Mã số BHXH của mẹ"}</strong>
            <div className={`detail ${checkHasChange('momInsuranceNumber')}`}>{data.momInsuranceNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Số thẻ BHYT của mẹ"}</strong>
            <div className={`detail ${checkHasChange('momHealthNumber')}`}>{data.momHealthNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Số CMTND của mẹ"}</strong>
            <div className={`detail ${checkHasChange('momIdNumber')}`}>{data.momIdNumber}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Nghỉ dưỡng thai"}</strong>
            <div className={`detail ${checkHasChange('maternityLeave')}`}>{data.maternityLeave}</div>
          </div>
          <div className="col-4">
            <strong>{"Mang thai hộ"}</strong>
            <div className={`detail ${checkHasChange('hasRainser')}`}>{data.hasRainser}</div>
          </div>

          <div className="col-4">
            <strong>{"Phẫu thuật hoặc thai dưới 32 tuần"}</strong>
            <div className={`detail ${checkHasChange('hasSurgery')}`}>{data.hasSurgery}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Ngày mẹ chết"}</strong>
            <div className={`detail ${checkHasChange('momDeadDate')}`}>{data.momDeadDate}</div>
          </div>
          <div className="col-8">
            <strong>{"Ngày kết luận (mẹ không đủ điều kiện chăm con)"}</strong>
            <div className={`detail ${checkHasChange('resultDate')}`}>{data.resultDate}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Phí giám định y khoa"}</strong>
            <div className={`detail ${checkHasChange('assessment')}`}>{data.assessment}</div>
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
            <div className={`detail ${checkHasChange('receiveType')}`}>{data.receiveType || ''}</div>
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

export default withTranslation()(CreateMaternityInsurance);
