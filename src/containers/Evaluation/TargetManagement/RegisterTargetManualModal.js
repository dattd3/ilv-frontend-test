import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Collapse, Form, Button } from "react-bootstrap";
import {
  getMuleSoftHeaderConfigurations,
  getRequestConfigurations,
} from "commons/Utils";
import {
  STATUS_EDITABLE_APPROVE_TAB,
  REGISTER_TYPES,
  REQUEST_STATUS,
} from "./Constant";
import Constants from "commons/Constants";
import axios from "axios";
import { MODAL_TYPES, TARGET_INITIAL_DATA } from "./Constant";
import { toast } from "react-toastify";
import { ReactComponent as IconCollapse } from "assets/img/icon/pms/icon-collapse.svg";
import { ReactComponent as IconExpand } from "assets/img/icon/pms/icon-expand.svg";
import { ReactComponent as IconRemove } from "assets/img/icon/pms/icon-trash.svg";
import { ReactComponent as IconRedRemove } from "assets/img/icon/pms/icon-red-remove.svg";
import { ReactComponent as IconSave } from "assets/img/icon/pms/icon-save.svg";
import { ReactComponent as IconSend } from "assets/img/icon/pms/icon-send.svg";
import { ReactComponent as IconReject } from "assets/img/icon/Icon_Cancel.svg";
import { ReactComponent as IconApprove } from "assets/img/icon/Icon_Check_White.svg";
import { ReactComponent as IconEdit } from "assets/img/icon/pms/icon-edit.svg";
import LoadingModal from "components/Common/LoadingModal";

const mapApproverOption = (approver) => ({
  account: approver.username,
  fullName: approver.fullname,
  employeeLevel: approver.rank_title,
  EmployeeNo: approver.uid,
  current_position: approver.title,
  department: approver.department,
  jobCode: approver.jobCode || null,
  organizationLv1: approver.organization_lv1 || null,
  organizationLv2: approver.organization_lv2 || null,
  organizationLv3: approver.organization_lv3 || null,
  organizationLv4: approver.organization_lv4 || null,
  organizationLv5: approver.organization_lv5 || null,
  organizationLv6: approver.organization_lv6 || null,
});

const REQUIRED_FIELDS = ["checkPhaseId", "listTarget"];
const REQUIRED_FIELDS_TARGET = ["targetName", "metric1", "weight"];

export default function TargetRegistrationManualModal(props) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === Constants.LANGUAGE_EN ? "en" : "vi";

  const {
    phaseOptions,
    onHide,
    id,
    isApprover = false,
    setModalManagement,
    sendTargetRegister,
    saveTargetRegister,
    viewOnly,
  } = props;
  const [isEditing, setIsEditing] = useState(!viewOnly);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [formValues, setFormValues] = useState({
    checkPhaseId: 0,
    approverInfo: "",
    rejectReson: "",
    listTarget: [TARGET_INITIAL_DATA],
  });

  const [targetToggleStatuses, setTargetToggleStatuses] = useState([true]);
  const [isFetchedApprover, setIsFetchedApprover] = useState(false);

  const totalWeight = formValues.listTarget.reduce(
    (acc, curr) => Number((acc += curr.weight * 1 || 0)),
    0
  );
  const approverJSON = JSON.parse(formValues.approverInfo || null);
  const userInfoJSON = JSON.parse(formValues.userInfo || null);

  useEffect(() => {
    if (!id) {
      loadApproverForPnL();
    } else {
      fetchTargetRegisterData(id);
    }
  }, []);

  const loadApproverForPnL = async () => {
    try {
      const muleConfig = getMuleSoftHeaderConfigurations();
      const response = await axios.get(
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/manager`,
        muleConfig
      );
      if (response && response.data) {
        const result = response.data.result;
        const approver = response.data?.data?.[0];

        if (result?.code === Constants.API_SUCCESS_CODE && approver) {
          onChangeFormValues(
            "approverInfo",
            JSON.stringify(mapApproverOption(approver))
          );
        }
      }
    } catch (e) {}
    setIsFetchedApprover(true);
  };

  const fetchTargetRegisterData = async () => {
    setIsLoading(true);
    try {
      const config = getRequestConfigurations();
      config.params = {
        id: id,
      };
      const response = await axios.get(
        `${process.env.REACT_APP_HRDX_PMS_URL}api/targetregist/detail`,
        config
      );
      const data = response?.data?.data?.requests;
      if (data) {
        setData(data);
        setFormValues({
          checkPhaseId: 0,
          approverInfo: "",
          rejectReson: "",
          ...data,
          listTarget:
            data?.listTarget?.length > 0
              ? data.listTarget
                  .map((target) => ({
                    ...target,
                    targetName: JSON.parse(target.targetName || "{}")?.[
                      currentLanguage
                    ],
                  }))
                  .sort((a, b) => a.order - b.order)
              : [TARGET_INITIAL_DATA],
        });
        setTargetToggleStatuses(Array(data.listTarget.length).fill(!viewOnly));
      } else {
        toast.error(`Không tìm thấy mục tiêu đăng ký! Vui lòng kiểm tra lại`);
      }
    } catch (e) {
      toast.error(`Không tìm thấy mục tiêu đăng ký! Vui lòng kiểm tra lại`);
    }
    setIsLoading(false);
  };

  const checkIsFormValid = () => {
    if (!approverJSON) return false;
    return (
      !REQUIRED_FIELDS.some((item) => typeof formValues[item] === "string" ? !formValues[item]?.trim() : !formValues[item]) &&
      !formValues.listTarget.some((item) =>
        REQUIRED_FIELDS_TARGET.some((field) => typeof formValues[item] === "string" ? !formValues[item]?.trim() : !item[field])
      )
    );
  };

  const onChangeFormValues = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  const onChangeTargetValues = (index, key, value) => {
    const listTarget = formValues.listTarget;
    listTarget[index] = {
      ...listTarget[index],
      [key]: value,
      isEdit: isApprover,
    };
    onChangeFormValues("listTarget", listTarget);
  };

  const onChangeWeightInput = (index, value) => {
    const parsedValue = parseFloat(value);
    if (!value) {
      onChangeTargetValues(index, "weight", "");
      return;
    }

    if (!isNaN(parsedValue) && !isNaN(value - parsedValue)) {
      onChangeTargetValues(index, "weight", value);
    }
  };

  const collapseAll = () => {
    setTargetToggleStatuses(Array(formValues.listTarget.length).fill(false));
  };

  const expandAll = () => {
    setTargetToggleStatuses(Array(formValues.listTarget.length).fill(true));
  };

  const addNewTarget = () => {
    setFormValues({
      ...formValues,
      listTarget: [
        ...formValues?.listTarget,
        { ...TARGET_INITIAL_DATA, isEdit: isApprover },
      ],
    });
    setTargetToggleStatuses([...targetToggleStatuses, true]);
  };

  const onSaveTargetRegister = async () => {
    // if (!checkIsFormValid()) {
    //   return toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
    // }
    // if (isApprover && !formValues.reviewComment) {
    //   return toast.error("Vui lòng nhập ý kiến của CBQL phê duyệt");
    // }
    await saveTargetRegister(formValues);
    if (isApprover) {
      setIsEditing(false);
      fetchTargetRegisterData();
      collapseAll();
      toast.success("Lưu mục tiêu CBNV thành công")
    }
  };

  const onSendTargetRegister = () => {
    if (!checkIsFormValid()) {
      return toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
    }
    sendTargetRegister(formValues);
  };

  const onRemoveTarget = (idx) => {
    setFormValues({
      ...formValues,
      listTarget: [
        ...formValues?.listTarget?.filter((_, index) => index !== idx),
      ],
    });
    setTargetToggleStatuses([
      ...targetToggleStatuses?.filter((_, index) => index !== idx),
    ]);
  };

  const onEditButtonClick = () => {
    if (!isApprover) {
      setModalManagement({
        type: MODAL_TYPES.REGISTER_LIBRARY,
        data,
      });
    } else {
      setIsEditing(true);
      expandAll();
    }
  };

  const isReadonlyField = (target) =>
    !isEditing || (data?.requestType === REGISTER_TYPES.LIBRARY && target?.id);

  return (
    <Modal
      show={true}
      className="target-registration-modal"
      centered
      onHide={onHide}
    >
      <LoadingModal show={isLoading} />
      <Modal.Header closeButton>
        <div className="modal-title">ĐĂNG KÝ MỤC TIÊU</div>
      </Modal.Header>
      <Modal.Body>
        <div>
          Chọn kỳ đánh giá <span className="red-color">(*)</span>
        </div>
        <Select
          className="select-container mb-20"
          classNamePrefix="filter-select"
          placeholder={t("Select")}
          options={phaseOptions.filter(item => item?.isAvailable && !item?.isDeleted && item?.status)}
          onChange={(val) => onChangeFormValues("checkPhaseId", val?.value)}
          value={phaseOptions.find(
            (opt) => opt.value === formValues.checkPhaseId
          )}
          isDisabled={isApprover || !isEditing}
        />
        <div className="control-btns mb-20">
          <Button className="collapse-btn" onClick={collapseAll}>
            <IconCollapse className="icon-collapse" /> &nbsp;
            {t("Collapse")}
          </Button>
          <Button
            className="expand-btn"
            variant="outline-success"
            onClick={expandAll}
          >
            <IconExpand className="icon-expand" /> &nbsp;
            {t("Expand")}
          </Button>
        </div>
        {formValues.listTarget.map((target, index) => (
          <div className="form-container mb-15" key={index}>
            <div
              className="target-collapse"
              onClick={() =>
                setTargetToggleStatuses(
                  targetToggleStatuses.map((it, idx) =>
                    idx === index ? !it : it
                  )
                )
              }
            >
              {targetToggleStatuses[index] ? <IconCollapse /> : <IconExpand />}
              <span>
                <span>&nbsp; Mục tiêu {index + 1}</span>
                <span className="fw-400">
                  {!targetToggleStatuses[index] &&
                    target.targetName &&
                    ` | ${target.targetName} |`}
                </span>
                <span className="fw-400 green-color">
                  {!targetToggleStatuses[index] &&
                    target.weight &&
                    ` ${target.weight}%`}
                </span>
              </span>
              {target?.lastUpdateBy &&
                target?.lastUpdateBy?.toLowerCase() ===
                  approverJSON?.account?.toLowerCase() && (
                  <div className="yellow-color">
                    * Mục tiêu đã được QLTT chỉnh sửa
                  </div>
                )}
              {isEditing && formValues.listTarget?.length > 1 && (
                <button
                  className="button delete-button"
                  onClick={() => onRemoveTarget(index)}
                >
                  <IconRedRemove />
                  &nbsp; Xóa
                </button>
              )}
            </div>
            <Collapse in={targetToggleStatuses[index]}>
              <div className="collapse-container">
                <div className="mb-15">
                  <div className="mb-15">
                    Tên mục tiêu <span className="red-color">(*)</span>
                  </div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.targetName}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="targetName"
                      onChange={(e) =>
                        onChangeTargetValues(
                          index,
                          "targetName",
                          e?.target?.value
                        )
                      }
                      value={target.targetName}
                    />
                  )}
                </div>
                <div className="mb-15">
                  <div className="mb-15">
                    Metric 1 (Điểm 1) <span className="red-color">(*)</span>
                  </div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.metric1}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="metric1"
                      onChange={(e) =>
                        onChangeTargetValues(index, "metric1", e?.target?.value)
                      }
                      value={target.metric1}
                    />
                  )}
                </div>
                <div className="mb-15">
                  <div className="mb-15">Metric 2 (Điểm 2)</div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.metric2}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="metric2"
                      onChange={(e) =>
                        onChangeTargetValues(index, "metric2", e?.target?.value)
                      }
                      value={target.metric2}
                    />
                  )}
                </div>
                <div className="mb-15">
                  <div className="mb-15">Metric 3 (Điểm 3)</div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.metric3}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="metric3"
                      onChange={(e) =>
                        onChangeTargetValues(index, "metric3", e?.target?.value)
                      }
                      value={target.metric3}
                    />
                  )}
                </div>
                <div className="mb-15">
                  <div className="mb-15">Metric 4 (Điểm 4)</div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.metric4}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="metric4"
                      onChange={(e) =>
                        onChangeTargetValues(index, "metric4", e?.target?.value)
                      }
                      value={target.metric4}
                    />
                  )}
                </div>
                <div className="mb-15">
                  <div className="mb-15">Metric 5 (Điểm 5)</div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.metric5}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="metric5"
                      onChange={(e) =>
                        onChangeTargetValues(index, "metric5", e?.target?.value)
                      }
                      value={target.metric5}
                    />
                  )}
                </div>
                <div className="mb-15">
                  <div className="mb-15">
                    Trọng số <span className="red-color">(*)</span>
                  </div>
                  <div className="weight-input-box">
                    <span className="prefix">%</span>
                    <Form.Control
                      as="input"
                      placeholder={isEditing && "Nhập"}
                      className="form-input border-none"
                      type="text"
                      name="weight"
                      onChange={(e) =>
                        onChangeWeightInput(index, e.target.value)
                      }
                      value={target.weight}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                <div className="mb-15">
                  <div className="mb-15">Job Details</div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.jobDetail}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="jobDetail"
                      onChange={(e) =>
                        onChangeTargetValues(
                          index,
                          "jobDetail",
                          e?.target?.value
                        )
                      }
                      value={target.jobDetail}
                    />
                  )}
                </div>
                <div>
                  <div className="mb-15">Mục tiêu cần đạt được</div>
                  {isReadonlyField(target) ? (
                    <div className="read-only-text">{target.target}</div>
                  ) : (
                    <Form.Control
                      as="textarea"
                      placeholder={isEditing && "Nhập"}
                      className="form-textarea"
                      name="target"
                      onChange={(e) =>
                        onChangeTargetValues(index, "target", e?.target?.value)
                      }
                      value={target.target}
                    />
                  )}
                </div>
              </div>
            </Collapse>
          </div>
        ))}

        {isEditing && (
          <button className="add-target-btn mb-15" onClick={addNewTarget}>
            + Thêm mục tiêu
          </button>
        )}
        {(data?.reviewComment || (isApprover && isEditing)) && (
          <div className="mb-15">
            <div className="mb-15">
              Ý kiến của CBQL phê duyệt <span className="red-color">(*)</span>
            </div>
            {isEditing ? (
              <Form.Control
                as="textarea"
                placeholder={isEditing && "Nhập"}
                className="form-textarea review-comment-textarea"
                onChange={(e) =>
                  onChangeFormValues("reviewComment", e?.target?.value)
                }
                value={formValues?.reviewComment}
              />
            ) : (
              <div className="read-only-text">{data.reviewComment}</div>
            )}
          </div>
        )}
        <div className="form-container mb-15">
          <div className="approver-title mb-15">
            {isApprover ? "CBNV đăng ký mục tiêu" : "CBQL phê duyệt"}
          </div>
          <div className="row group">
            <div className="col-xl-4">
              <div className="mb-15">Họ và tên</div>
              <Form.Control
                readOnly
                value={
                  isApprover
                    ? userInfoJSON?.fullName || ""
                    : approverJSON?.fullName || ""
                }
                className="form-input"
              />
            </div>
            <div className="col-xl-4">
              <div className="mb-15">Chức danh</div>
              <Form.Control
                readOnly
                value={
                  isApprover
                    ? userInfoJSON?.current_position || ""
                    : approverJSON?.current_position || ""
                }
                className="form-input"
              />
            </div>
            <div className="col-xl-4">
              <div className="mb-15">Khối/Phòng/Bộ phận</div>
              <Form.Control
                readOnly
                className="form-input"
                value={
                  isApprover
                    ? userInfoJSON?.department || ""
                    : approverJSON?.department || ""
                }
              />
            </div>
          </div>
        </div>
        {!isEditing && data?.rejectReson && (
          <div className="mb-15">
            <div className="mb-15">Lý do</div>
            {<div className="read-only-text">{data?.rejectReson || ""}</div>}
          </div>
        )}
        <div className="custom-modal-footer">
          {!approverJSON && isFetchedApprover && (
            <div className="red-color mb-15">
              * Chưa có thông tin CBQL phê duyệt. Vui lòng liên hệ Nhân sự để
              được hỗ trợ!
            </div>
          )}

          {totalWeight > 0 &&
            totalWeight !== 100 &&
            (isEditing ||
              (isApprover && data?.status === REQUEST_STATUS.PROCESSING)) && (
              <div className="red-color mb-15">
                * Yêu cầu tổng trọng số bằng 100%. Vui lòng kiểm tra lại!
              </div>
            )}
          <div className="modal-footer-action">
            <div>
              {(isEditing ||
                (isApprover && data?.status === REQUEST_STATUS.PROCESSING)) && (
                <div
                  className="total-weight-container"
                  style={{
                    color: totalWeight !== 100 ? "#D13238" : "#44A257",
                    border:
                      totalWeight !== 100
                        ? "1px solid #D13238"
                        : "1px solid #44A257",
                    background: totalWeight !== 100 ? "#FEF3F4" : "#F1F8F2",
                  }}
                >
                  *Tổng trọng số:&nbsp;
                  <span>{totalWeight}%</span>
                </div>
              )}
            </div>
            {isApprover &&
              STATUS_EDITABLE_APPROVE_TAB.includes(data?.status) && (
                <div>
                  <button
                    className="button cancel-approver-btn"
                    onClick={onHide}
                  >
                    <IconRemove />
                    &nbsp; Hủy
                  </button>
                  {!isEditing ? (
                    <button
                      className="button edit-btn"
                      onClick={onEditButtonClick}
                    >
                      <IconEdit />
                      &nbsp; Sửa
                    </button>
                  ) : (
                    <button
                      className="button save-approver-btn"
                      onClick={onSaveTargetRegister}
                      disabled={!checkIsFormValid() || !formValues.reviewComment?.trim()}
                    >
                      <IconSave />
                      &nbsp; Lưu
                    </button>
                  )}
                  <button
                    className="button reject-btn"
                    onClick={() =>
                      setModalManagement({
                        type: MODAL_TYPES.REJECT_CONFIRM,
                        data,
                      })
                    }
                    disabled={isEditing}
                  >
                    <IconReject />
                    &nbsp; Từ chối
                  </button>
                  <button
                    className="button approve-btn"
                    onClick={() =>
                      setModalManagement({
                        type: MODAL_TYPES.APPROVE_CONFIRM,
                        data,
                      })
                    }
                    disabled={isEditing || totalWeight !== 100}
                  >
                    <IconApprove />
                    &nbsp; Phê duyệt
                  </button>
                </div>
              )}
            {!isApprover && isEditing && (
              <div>
                {/* {(data?.status === REQUEST_STATUS.REJECT || isEditing) && ( */}
                {/* {data?.status === REQUEST_STATUS.REJECT && !isEditing && (
                      <button
                        className="button edit-btn"
                        onClick={onEditButtonClick}
                      >
                        <IconEdit />
                        &nbsp; Sửa
                      </button>
                    )} */}
                <button className="button cancel-btn" onClick={onHide}>
                  <IconRemove className="ic-remove-white" />
                  &nbsp; Hủy
                </button>
                <button
                  className="button save-btn"
                  disabled={!formValues.checkPhaseId || !checkIsFormValid()}
                  onClick={onSaveTargetRegister}
                >
                  <IconSave />
                  &nbsp; Lưu
                </button>
                <button
                  className="button send-request-btn"
                  disabled={
                    totalWeight !== 100 ||
                    (data?.status === REQUEST_STATUS.REJECT &&
                      !isEditing &&
                      data?.lastUpdatedBy?.toLowerCase() ===
                        approverJSON?.account?.toLowerCase())
                  }
                  onClick={onSendTargetRegister}
                >
                  <IconSend />
                  &nbsp; Gửi yêu cầu
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
