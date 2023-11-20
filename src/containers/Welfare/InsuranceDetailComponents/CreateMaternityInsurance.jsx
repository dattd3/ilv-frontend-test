import { useState } from "react";
import { withTranslation } from "react-i18next";
import _ from "lodash";

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

  return (
    <>
      {/* YÊU CẦU BẢO HIỂM Y TẾ */}
      <h5>YÊU CẦU BẢO HIỂM Y TẾ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{"Loại yêu cầu"}</strong>
            <div className="detail">{type?.label}</div>
          </div>
          <div className="col-4">
            <strong>{"Hình thức kê khai phát sinh"}</strong>
            <div className="detail">{data.declareForm}</div>
          </div>
          <div className="col-4">
            <strong>{"Trường hợp hưởng chế độ thai sản"}</strong>
            <div className="detail">{data.maternityRegime}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Từ ngày đơn vị đề nghị hưởng"}</strong>
            <div className="detail">{data.dateRequest}</div>
          </div>
          <div className="col-4">
            <strong>{"Từ ngày giải quyết trước"}</strong>
            <div className="detail">{data.dateLastResolved}</div>
          </div>
          <div className="col-4">
            <strong>{"Điều kiện khám thai"}</strong>
            <div className="detail">{data.maternityCondition}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Điều kiện sinh con"}</strong>
            <div className="detail">{data.birthCondition}</div>
          </div>
          <div className="col-8">
            <strong>{"Số sổ BHXH của người nuôi dưỡng (trường hợp mẹ chết)"}</strong>
            <div className="detail">{data.raiserInsuranceNumber}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Cha nghỉ chăm con"}</strong>
            <div className="detail">{data.dadCare}</div>
          </div>
          <div className="col-8">
            <strong>{"Phương án"}</strong>
            <div className="detail">{data.plan}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Lý do đề nghị điều chỉnh"}</strong>
            <div className="detail">{data.reason}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Ghi chú"}</strong>
            <div className="detail">{data.note}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CÁ NHÂN */}
      <h5>THÔNG TIN CÁ NHÂN</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{t("FullName")}</strong>
            <div className="detail">{data.fullName}</div>
          </div>
          <div className="col-4">
            <strong>{"Mã sổ/số sổ BHXH"}</strong>
            <div className="detail">{data.socialId}</div>
          </div>
          <div className="col-4">
            <strong>{"Số CMND/Hộ chiếu/Thẻ căn cước"}</strong>
            <div className="detail">{data.IndentifiD}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Mã nhân viên"}</strong>
            <div className="detail">{data.employeeNo}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày nghỉ hàng tuần"}</strong>
            <div className="detail">{data.leaveOfWeek}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày bắt đầu đi làm lại thực tế"}</strong>
            <div className="detail">{data.startWork}</div>
          </div>
        </div>
      </div>

      {/* CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ */}
      <h5>CHỈ ĐỊNH CHẾ ĐỘ NGHỈ HƯỞNG CỦA BÁC SĨ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{"Số Seri/Số lưu trữ"}</strong>
            <div className="detail">{data.seri}</div>
          </div>
          <div className="col-4">
            <strong>{"Từ ngày"}</strong>
            <div className="detail">{data.fromDate}</div>
          </div>
          <div className="col-4">
            <strong>{"Đến ngày"}</strong>
            <div className="detail">{data.toDate}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Tổng số"}</strong>
            <div className="detail">{data.total}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CỦA CON */}
      <h5>THÔNG TIN CỦA CON</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{"Mã số BHXH của con"}</strong>
            <div className="detail">{data.childInsuranceNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Số thẻ BHYT của con"}</strong>
            <div className="detail">{data.childHealthNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Tuổi thai"}</strong>
            <div className="detail">{data.age}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Ngày sinh con"}</strong>
            <div className="detail">{data.childBirth}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày con chết"}</strong>
            <div className="detail">{data.childDead}</div>
          </div>
          <div className="col-4">
            <strong>{"Số con"}</strong>
            <div className="detail">{data.childNumbers}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-8">
            <strong>{"Số con chết hoặc số thai chết lưu khi sinh"}</strong>
            <div className="detail">{data.childDeadNumbers}</div>
          </div>
          <div className="col-4">
            <strong>{"Ngày nhận nuôi con nuôi"}</strong>
            <div className="detail">{data.childReceiveDate}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Ngày nhận nuôi (Đối với người mẹ nhờ mang thai hộ nhận con)"}</strong>
            <div className="detail">{data.childRaiseDate}</div>
          </div>
        </div>
      </div>

      {/* THÔNG TIN CỦA MẸ */}
      <h5>THÔNG TIN CỦA MẸ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{"Mã số BHXH của mẹ"}</strong>
            <div className="detail">{data.momInsuranceNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Số thẻ BHYT của mẹ"}</strong>
            <div className="detail">{data.momHealthNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Số CMTND của mẹ"}</strong>
            <div className="detail">{data.momIdNumber}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Nghỉ dưỡng thai"}</strong>
            <div className="detail">{data.maternityLeave}</div>
          </div>
          <div className="col-4">
            <strong>{"Mang thai hộ"}</strong>
            <div className="detail">{data.hasRainser}</div>
          </div>

          <div className="col-4">
            <strong>{"Phẫu thuật hoặc thai dưới 32 tuần"}</strong>
            <div className="detail">{data.hasSurgery}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Ngày mẹ chết"}</strong>
            <div className="detail">{data.momDeadDate}</div>
          </div>
          <div className="col-8">
            <strong>{"Ngày kết luận (mẹ không đủ điều kiện chăm con)"}</strong>
            <div className="detail">{data.resultDate}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-12">
            <strong>{"Phí giám định y khoa"}</strong>
            <div className="detail">{data.assessment}</div>
          </div>
        </div>
      </div>

      {/* ĐỢT GIẢI QUYẾT */}
      <h5>ĐỢT GIẢI QUYẾT</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-8">
            <strong>{"Nội dung đợt"}</strong>
            <div className="detail">{data.resolveContent}</div>
          </div>
          <div className="col-4">
            <strong>{"Tháng năm"}</strong>
            <div className="detail">{data.resolveDate}</div>
          </div>
        </div>
      </div>

      {/* ĐỢT BỔ SUNG */}
      <h5>ĐỢT BỔ SUNG</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-8">
            <strong>{"Nội dung đợt"}</strong>
            <div className="detail">{data.addtionContent}</div>
          </div>
          <div className="col-4">
            <strong>{"Tháng năm"}</strong>
            <div className="detail">{data.addtionDate}</div>
          </div>
        </div>
      </div>

      {/* HÌNH THỨC TRỢ CẤP */}
      <h5>HÌNH THỨC TRỢ CẤP</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            <strong>{"Hình thức nhận"}</strong>
            <div className="detail">{data.receiveType?.name || ''}</div>
          </div>
          <div className="col-4">
            <strong>{"Số tài khoản"}</strong>
            <div className="detail">{data.accountNumber}</div>
          </div>
          <div className="col-4">
            <strong>{"Tên chủ tài khoản"}</strong>
            <div className="detail">{data.accountName}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            <strong>{"Mã ngân hàng"}</strong>
            <div className="detail">{data.bankId}</div>
          </div>
          <div className="col-8">
            <strong>{"Tên ngân hàng"}</strong>
            <div className="detail">{data.bankName}</div>
          </div>
        </div>
      </div>

      {/* PHẢN HỒI CỦA NHÂN SỰ */}
      <h5>PHẢN HỒI CỦA NHÂN SỰ</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-12">
            <div className="detail m-0 p-0">{data.note}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTranslation()(CreateMaternityInsurance);
