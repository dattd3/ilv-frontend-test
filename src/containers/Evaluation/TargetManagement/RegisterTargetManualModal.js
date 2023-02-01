import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Collapse, Form, Button } from "react-bootstrap";
import { isEmpty } from "lodash";
import { getMuleSoftHeaderConfigurations } from "commons/Utils";
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

const REQUIRED_FIELDS = ["checkPhaseId", "listTarget", "approverInfo"];
const REQUIRED_FIELDS_TARGET = ["targetName", "metric1", "weight"];

export default function TargetRegistrationManualModal(props) {
  const { t } = useTranslation();
  const {
    phaseOptions,
    onHide,
    data,
    isApprover = false,
    setModalManagement,
    sendTargetRegister,
    saveTargetRegister,
    viewOnly,
  } = props;
  const [isApproverEditing, setIsApproverEditing] = useState(false);

  const [formValues, setFormValues] = useState({
    checkPhaseId: 0,
    listTarget: [TARGET_INITIAL_DATA],
    approverInfo: "",
    rejectReson: "",
    ...(data && data),
  });
  const [targetToggleStatuses, setTargetToggleStatuses] = useState(
    Array(formValues.listTarget.length).fill(!viewOnly)
  );
  const totalWeight = formValues.listTarget.reduce(
    (acc, curr) => Number((acc += curr.weight * 1 || 0)),
    0
  );
  const approverJSON = JSON.parse(formValues.approverInfo || null);
  useEffect(() => {
    if (!data) {
      loadApproverForPnL();
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
  };

  const checkIsFormValid = () => {
    if (!approverJSON) return false;
    return (
      !REQUIRED_FIELDS.some((item) => !formValues[item]) &&
      !formValues.listTarget.some((item) =>
        REQUIRED_FIELDS_TARGET.some((field) => !item[field])
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
    const targets = formValues.listTarget;
    targets[index] = {
      ...targets[index],
      [key]: value,
      isEdit: isApprover,
    };
    onChangeFormValues("listTarget", targets);
  };

  const onChangeWeightInput = (index, value) => {
    if (!isNaN(value)) {
      onChangeTargetValues(index, 'weight', value * 1);
    }
  }

  const collapseAll = () => {
    setTargetToggleStatuses(Array(formValues.listTarget.length).fill(false));
  };

  const expandAll = () => {
    setTargetToggleStatuses(Array(formValues.listTarget.length).fill(true));
  };

  const addNewTarget = () => {
    setFormValues({
      ...formValues,
      listTarget: [...formValues?.listTarget, TARGET_INITIAL_DATA],
    });
    setTargetToggleStatuses([...targetToggleStatuses, true]);
  };

  const onSaveTargetRegister = async () => {
    // if (!checkIsFormValid()) {
    //   return toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
    // }
    await saveTargetRegister(formValues);
    if (isApprover) {
      setIsApproverEditing(false);
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

  const isReadOnlyField = (isApprover && !isApproverEditing) || viewOnly;

  return (
    <Modal
      show={true}
      className="target-registration-modal"
      centered
      onHide={onHide}
    >
      <Modal.Header>
        <div className="modal-title">ĐĂNG KÝ MỤC TIÊU</div>
        <a
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={() => onHide()}
        >
          <span aria-hidden="true">&times;</span>
        </a>
      </Modal.Header>
      <Modal.Body>
        <div>
          Chọn kỳ đánh giá <span className="red-color">(*)</span>
        </div>
        <Select
          className="select-container mb-20"
          classNamePrefix="filter-select"
          placeholder={t("Select")}
          options={phaseOptions}
          onChange={(val) => onChangeFormValues("checkPhaseId", val?.value)}
          value={phaseOptions.find(
            (opt) => opt.value === formValues.checkPhaseId
          )}
          isDisabled={isApprover || isReadOnlyField}
        />
        {!!formValues.checkPhaseId && (
          <>
            {!isReadOnlyField && (
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
            )}
            {formValues.listTarget.map((target, index) => (
              <div className="form-container mb-16" key={index}>
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
                  {targetToggleStatuses[index] ? (
                    <IconCollapse />
                  ) : (
                    <IconExpand />
                  )}
                  <span>
                    <span>&nbsp; Mục tiêu {index + 1}</span>
                    <span className="fw-400">
                      {!targetToggleStatuses[index] &&
                        target.targetName &&
                        ` | ${target.targetName}`}
                    </span>
                    <span className="fw-400 green-color">
                      {!targetToggleStatuses[index] &&
                        target.weight &&
                        `  | ${target.weight}%`}
                    </span>
                  </span>
                  {target && target.lastUpdateBy &&
                    target.createBy?.split("@")?.[0] !==
                      target.lastUpdateBy && (
                      <div className="yellow-color">
                        * Mục tiêu đã được QLTT chỉnh sửa
                      </div>
                    )}
                  {!isReadOnlyField && index !== 0 && (
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
                    <div className="mb-16">
                      <div className="mb-16">
                        Tên mục tiêu <span className="red-color">(*)</span>
                      </div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
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
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">
                        Metric 1 (Điểm 1) <span className="red-color">(*)</span>
                      </div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
                        className="form-textarea"
                        name="metric1"
                        onChange={(e) =>
                          onChangeTargetValues(
                            index,
                            "metric1",
                            e?.target?.value
                          )
                        }
                        value={target.metric1}
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">Metric 2 (Điểm 2)</div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
                        className="form-textarea"
                        name="metric2"
                        onChange={(e) =>
                          onChangeTargetValues(
                            index,
                            "metric2",
                            e?.target?.value
                          )
                        }
                        value={target.metric2}
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">Metric 3 (Điểm 3)</div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
                        className="form-textarea"
                        name="metric3"
                        onChange={(e) =>
                          onChangeTargetValues(
                            index,
                            "metric3",
                            e?.target?.value
                          )
                        }
                        value={target.metric3}
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">Metric 4 (Điểm 4)</div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
                        className="form-textarea"
                        name="metric4"
                        onChange={(e) =>
                          onChangeTargetValues(
                            index,
                            "metric4",
                            e?.target?.value
                          )
                        }
                        value={target.metric4}
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">Metric 5 (Điểm 5)</div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
                        className="form-textarea"
                        name="metric5"
                        onChange={(e) =>
                          onChangeTargetValues(
                            index,
                            "metric5",
                            e?.target?.value
                          )
                        }
                        value={target.metric5}
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">
                        Trọng số <span className="red-color">(*)</span>
                      </div>
                      <div className="weight-input-box">
                        <span className="prefix">%</span>
                        <Form.Control
                          as="input"
                          placeholder={!isReadOnlyField && "Nhập"}
                          className="form-input"
                          type="text"
                          name="weight"
                          onChange={(e) =>
                            onChangeWeightInput(index, e.target.value)
                          }
                          value={target.weight}
                          readOnly={isReadOnlyField}
                        />
                      </div>
                    </div>
                    <div className="mb-16">
                      <div className="mb-16">Job Details</div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
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
                        readOnly={isReadOnlyField}
                      />
                    </div>
                    <div>
                      <div className="mb-16">Mục tiêu cần đạt được</div>
                      <Form.Control
                        as="textarea"
                        placeholder={!isReadOnlyField && "Nhập"}
                        className="form-textarea"
                        name="target"
                        onChange={(e) =>
                          onChangeTargetValues(
                            index,
                            "target",
                            e?.target?.value
                          )
                        }
                        value={target.target}
                        readOnly={isReadOnlyField}
                      />
                    </div>
                  </div>
                </Collapse>
              </div>
            ))}

            {!isReadOnlyField && (
              <button className="add-target-btn mb-16" onClick={addNewTarget}>
                + Thêm mục tiêu
              </button>
            )}
            {(isApprover || (!isApprover && data?.reviewComment)) && (
              <div className="mb-16">
                <div className="mb-16">
                  Ý kiến của CBQL phê duyệt{" "}
                  <span className="red-color">(*)</span>
                </div>
                <Form.Control
                  as="textarea"
                  placeholder={!isReadOnlyField && "Nhập"}
                  className="form-textarea review-comment-textarea"
                  readOnly={isReadOnlyField || !isApprover}
                  onChange={(e) =>
                    onChangeFormValues("reviewComment", e?.target?.value)
                  }
                  value={data?.reviewComment}
                />
              </div>
            )}
            <div className="form-container mb-16">
              <div className="target-collapse mb-16">CBQL phê duyệt</div>
              <div className="row group">
                <div className="col-xl-4">
                  <div className="mb-16">Họ và tên</div>
                  <Form.Control
                    readOnly
                    value={approverJSON?.fullName}
                    className="form-input"
                  />
                </div>
                <div className="col-xl-4">
                  <div className="mb-16">Chức danh</div>
                  <Form.Control
                    readOnly
                    value={approverJSON?.positionName}
                    className="form-input"
                  />
                </div>
                <div className="col-xl-4">
                  <div className="mb-16">Khối/Phòng/Bộ phận</div>
                  <Form.Control
                    readOnly
                    className="form-input"
                    value={
                      isEmpty(approverJSON)
                        ? ""
                        : (approverJSON?.division || "") +
                          (approverJSON?.department
                            ? "/" + approverJSON?.department
                            : "") +
                          (approverJSON?.part ? "/" + approverJSON?.part : "")
                    }
                  />
                </div>
              </div>
            </div>
            {viewOnly && data.rejectReson && (
              <div className="mb-16">
                <div className="mb-16">Lý do</div>
                <Form.Control
                  as="textarea"
                  className="form-textarea"
                  readOnly={true}
                  value={data.rejectReson}
                />
              </div>
            )}
            <div className="custom-modal-footer">
              {!approverJSON && (
                <div className="red-color mb-16">
                  * Chưa có thông tin CBQL phê duyệt, vui lòng liên hệ Nhân sự
                  để được hỗ trợ!
                </div>
              )}

              {totalWeight > 100 && !isReadOnlyField && (
                <div className="red-color mb-16">
                  * Yêu cầu tổng trọng số bằng 100%. Vui lòng kiểm tra lại!
                </div>
              )}
              <div className="modal-footer-action">
                <div>
                  {!viewOnly && (!isApprover || isApproverEditing) && (
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
                {!viewOnly && (
                  <>
                    {isApprover ? (
                      <div>
                        <button
                          className="button cancel-approver-btn"
                          onClick={onHide}
                        >
                          <IconRemove />
                          &nbsp; Hủy
                        </button>
                        {!isApproverEditing ? (
                          <button
                            className="button edit-btn"
                            onClick={() => setIsApproverEditing(true)}
                          >
                            <IconEdit />
                            &nbsp; Sửa
                          </button>
                        ) : (
                          <button
                            className="button save-approver-btn"
                            onClick={onSaveTargetRegister}
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
                          disabled={isApproverEditing}
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
                          disabled={isApproverEditing}
                        >
                          <IconApprove />
                          &nbsp; Phê duyệt
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button className="button cancel-btn" onClick={onHide}>
                          <IconRemove className="ic-remove-white" />
                          &nbsp; Hủy
                        </button>
                        <button
                          className="button save-btn"
                          onClick={onSaveTargetRegister}
                        >
                          <IconSave />
                          &nbsp; Lưu
                        </button>
                        <button
                          className="button send-request-btn"
                          disabled={totalWeight !== 100}
                          onClick={onSendTargetRegister}
                        >
                          <IconSend />
                          &nbsp; Gửi yêu cầu
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
