import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Collapse, Form, Button } from "react-bootstrap";
import { debounce, isEmpty, omit } from "lodash";
import {
  getMuleSoftHeaderConfigurations,
  getRequestConfigurations,
} from "commons/Utils";
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

const requestConfig = getRequestConfigurations();

const MyOption = (props) => {
  const { innerProps, innerRef } = props;
  const addDefaultSrc = (ev) => {
    ev.target.src =
      "data:image/png;base64,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";
  };

  return (
    <div ref={innerRef} {...innerProps} className="approver">
      <div className="d-block clearfix">
        <div className="float-left mr-2 w-20">
          <img
            className="avatar"
            src={`data:image/png;base64,${props.data.avatar}`}
            onError={addDefaultSrc}
            alt="avatar"
          />
        </div>
        <div className="float-left text-wrap w-75">
          {/* {props.isSearch === false && <div className="title font-weight-bold text-dark">{t('ApproverRecently')}</div>} */}
          <div className="title">{props.data.fullName}</div>
          <div className="comment">
            <i>
              ({props.data.account}) {props.data.positionName}
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapApproverOption = (approver) => ({
  avatar: approver.avatar,
  account: approver.username,
  fullName: approver.fullname,
  employeeLevel: approver.rank_title,
  EmployeeNo: approver.uid,
  positionName: approver.position_name,
  organizationLv1: approver.organization_lv1,
  organizationLv2: approver.organization_lv2,
  organizationLv3: approver.organization_lv3,
  organizationLv4: approver.organization_lv4,
  organizationLv5: approver.organization_lv5,
  organizationLv6: approver.organization_lv6,
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
  const [approverOptions, setApproverOptions] = useState([]);
  const totalWeight = formValues.listTarget.reduce(
    (acc, curr) => Number((acc += curr.weight * 1 || 0)),
    0
  );
  const approverJSON = JSON.parse(formValues.approverInfo || "{}") || null;
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
        const approver = response.data?.data[0] || {};

        if (result && result.code === Constants.API_SUCCESS_CODE) {
          onChangeFormValues("approverInfo", JSON.stringify(mapApproverOption(approver)));
        }
      }
    } catch (e) {}
  };

  const checkIsFormValid = () => {
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

  const onInputApproverSearchChange = debounce((e) => {
    if (e) {
      const payload = {
        account: e,
        employee_type: "APPROVER",
        status: Constants.statusUserActiveMulesoft,
      };
      axios
        .post(
          `${process.env.REACT_APP_REQUEST_URL}user/employee/search`,
          payload,
          requestConfig
        )
        .then((res) => {
          if (res && res.data && res.data.data) {
            const data = res.data.data || [];
            const users = data.map((approver) => mapApproverOption(approver));
            setApproverOptions(users);
          }
        });
    }
  }, 1000);

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
          isClearable
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
                        ` | ${target.targetName} |`}
                    </span>
                    <span className="fw-400 green-color">
                      {!targetToggleStatuses[index] &&
                        target.weight &&
                        ` ${target.weight}`}
                    </span>
                  </span>
                  {data &&
                    data.createBy?.split("@")?.[0] !== data.lastUpdateBy && (
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
                          type="number"
                          name="weight"
                          onChange={(e) =>
                            onChangeTargetValues(
                              index,
                              "weight",
                              e?.target?.value
                            )
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
            {(isApprover || (!isApprover && data?.ReviewComment)) && (
              <div className="mb-16">
                <div className="mb-16">
                  Ý kiến của CBQL phê duyệt{" "}
                  <span className="red-color">(*)</span>
                </div>
                <Form.Control
                  as="textarea"
                  placeholder={!isReadOnlyField && "Nhập"}
                  className="form-textarea"
                  readOnly={isReadOnlyField}
                  onChange={(e) =>
                    onChangeFormValues("ReviewComment", e?.target?.value)
                  }
                  value={data?.ReviewComment}
                />
              </div>
            )}
            <div className="form-container mb-16">
              <div className="target-collapse mb-16">CBQL phê duyệt</div>
              <div className="row group">
                <div className="col-xl-4">
                  <div className="mb-16">Họ và tên</div>
                  <Select
                    onInputChange={onInputApproverSearchChange}
                    name="approver"
                    components={{ Option: (e) => MyOption(e) }}
                    onChange={(approverItem) =>
                      onChangeFormValues(
                        "approverInfo",
                        JSON.stringify(omit(approverItem, "avatar"))
                      )
                    }
                    value={approverJSON}
                    placeholder={t("Search") + "..."}
                    key="approver"
                    options={approverOptions}
                    classNamePrefix="filter-select"
                    getOptionLabel={(option) => option.fullName}
                    getOptionValue={(option) => option.account}
                    isDisabled={isApprover || isReadOnlyField}
                  />
                </div>
                <div className="col-xl-4">
                  <div className="mb-16">Chức danh</div>
                  <Form.Control
                    readOnly
                    value={approverJSON.positionName}
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
                        : (approverJSON.division || "") +
                          (approverJSON.department
                            ? "/" + approverJSON.department
                            : "") +
                          (approverJSON.part ? "/" + approverJSON.part : "")
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
              <div>
                {!isReadOnlyField && (
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
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
