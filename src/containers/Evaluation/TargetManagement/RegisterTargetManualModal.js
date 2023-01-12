import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Collapse, Form, Button } from "react-bootstrap";
import { debounce } from "lodash";
import { getRequestConfigurations } from "commons/Utils";
import Constants from "commons/Constants";
import axios from "axios";

const TARGET_INITIAL_DATA = {
  targetName: "",
  metric1: "",
  metric2: "",
  metric3: "",
  metric4: "",
  metric5: "",
  weight: null,
  jobDetail: "",
  target: "",
};

export default function TargetRegistrationManualModal(props) {
  const { phaseOptions, onHide, data } = props;
  const [formValues, setFormValues] = useState({
    checkPhaseId: 0,
    listTarget: [TARGET_INITIAL_DATA],
    approverInfo: "",
    rejectReson: "",
  });
  const [targetToggleStatuses, setTargetToggleStatuses] = useState(
    Array(formValues.listTarget.length).fill(true)
  );
  const [approverOptions, setApproverOptions] = useState([]);
  console.log(approverOptions)
  
  const { t } = useTranslation();

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

  const onInputApproverSearchChange = debounce(async (e) => {
    console.log(e);
    const config = getRequestConfigurations()
    const payload = {
      account: e,
      employee_type: "APPROVER",
      status: Constants.statusUserActiveMulesoft
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config);
      if (res && res.data && res.data.data) {
        const data = res.data.data || []
        const users = data.map(res => {
          return {
            value: res.username,
            label: res.fullname,
            uid: res.uid,
            fullName: res.fullname,
            avatar: res.avatar,
            employeeLevel: res.rank_title || res.rank, // Cấp bậc chức danh để phân quyền
            pnl: res.pnl,
            orglv2Id: res.organization_lv2,
            account: res.username,
            current_position: res.position_name,
            department: res.division + (res.department ? '/' + res.department : '') + (res.part ? '/' + res.part : '')
          }
        })
        setApproverOptions(users);
      }
    } catch (error) {
    }

  }, 1000);

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
          onClick={onHide}
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
          isClearable
        />
        <div className="control-btns mb-20">
          <Button className="collapse-btn" onClick={collapseAll}>
            {t("Collapse")}
          </Button>
          <Button
            className="expand-btn"
            variant="outline-success"
            onClick={expandAll}
          >
            {t("Expand")}
          </Button>
        </div>
        {formValues.listTarget.map((target, index) => (
          <div className="form-container mb-16" key={index}>
            <div className="target-collapse">Mục tiêu {index + 1}</div>
            <Collapse in={!!targetToggleStatuses[index]}>
              <div className="collapse-container">
                <div className="mb-16">
                  <div className="mb-16">
                    Tên mục tiêu <span className="red-color">(*)</span>
                  </div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
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
                </div>
                <div className="mb-16">
                  <div className="mb-16">
                    Metric 1 (Điểm 1) <span className="red-color">(*)</span>
                  </div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="metric1"
                    onChange={(e) =>
                      onChangeTargetValues(index, "metric1", e?.target?.value)
                    }
                    value={target.metric1}
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 2 (Điểm 2)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="metric2"
                    onChange={(e) =>
                      onChangeTargetValues(index, "metric2", e?.target?.value)
                    }
                    value={target.metric2}
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 3 (Điểm 3)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="metric3"
                    onChange={(e) =>
                      onChangeTargetValues(index, "metric3", e?.target?.value)
                    }
                    value={target.metric3}
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 4 (Điểm 4)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="metric4"
                    onChange={(e) =>
                      onChangeTargetValues(index, "metric4", e?.target?.value)
                    }
                    value={target.metric4}
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 5 (Điểm 5)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="metric5"
                    onChange={(e) =>
                      onChangeTargetValues(index, "metric5", e?.target?.value)
                    }
                    value={target.metric5}
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">
                    Trọng số <span className="red-color">(*)</span>
                  </div>
                  <div class="weight-input-box">
                    <span class="prefix">%</span>
                    <Form.Control
                      as="input"
                      placeholder="Nhập"
                      className="form-input"
                      type="number"
                      name="weight"
                      onChange={(e) =>
                        onChangeTargetValues(index, "weight", e?.target?.value)
                      }
                      value={target.weight}
                    />
                  </div>
                </div>
                <div className="mb-16">
                  <div className="mb-16">Job Details</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="jobDetail"
                    onChange={(e) =>
                      onChangeTargetValues(index, "jobDetail", e?.target?.value)
                    }
                    value={target.jobDetail}
                  />
                </div>
                <div>
                  <div className="mb-16">Mục tiêu cần đạt được</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Nhập"
                    className="form-textarea"
                    name="target"
                    onChange={(e) =>
                      onChangeTargetValues(index, "target", e?.target?.value)
                    }
                    value={target.target}
                  />
                </div>
              </div>
            </Collapse>
          </div>
        ))}

        <button className="add-target-btn mb-16" onClick={addNewTarget}>
          + Thêm mục tiêu
        </button>
        <div className="mb-16">
          <div className="mb-16">
            Ý kiến của CBQL phê duyệt <span className="red-color">(*)</span>
          </div>
          <Form.Control
            as="textarea"
            placeholder="Nhập"
            className="form-textarea"
          />
        </div>
        <div className="form-container">
          <div className="target-collapse mb-16">CBQL phê duyệt</div>
          <div className="row group">
            <div className="col-xl-4">
              <div className="mb-16">Họ và tên</div>
              <Select
                onInputChange={onInputApproverSearchChange}
                name="approver"
                // onChange={(approverItem) =>
                //   handleSelectChange("approver", approverItem)
                // }
                // value={approver}
                placeholder={t("Search") + "..."}
                key="approver"
                options={approverOptions}
              />
            </div>
            <div className="col-xl-4">
              <div className="mb-16">Chức danh</div>
              <Form.Control readOnly />
            </div>
            <div className="col-xl-4">
              <div className="mb-16">Khối/Phòng/Bộ phận</div>
              <Form.Control readOnly />
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          <div className="total-weight-container">
            *Tổng trọng số:
            <span>40%</span>
          </div>
          <div>
            <button className="button cancel-btn" onClick={onHide}>
              Hủy
            </button>
            <button className="button save-btn">Lưu</button>
            <button className="button send-request-btn">Gửi yêu cầu</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
