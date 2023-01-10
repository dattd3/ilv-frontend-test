import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, Collapse, Form } from "react-bootstrap";

export default function TargetRegistrationManualModal(props) {
  const { phaseOptions } = props;
  const { t } = useTranslation();

  return (
    <Modal
      show={false}
      onHide={() => {}}
      className="target-registration-modal"
      backdrop="static"
      centered
    >
      <Modal.Header>
        <div className="modal-title">ĐĂNG KÝ MỤC TIÊU</div>
        <a className="close" data-dismiss="alert" aria-label="Close">
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
          // onChange={(val) => setPhaseIdSelected(val?.value || 0)}
          isClearable
        />
        <div className="control-btns mb-20">
          <Button className="collapse-btn">{t("Collapse")}</Button>
          <Button className="expand-btn">{t("Expand")}</Button>
        </div>
        <div className="form-container">
          <div className="mb-16">
            <div className="target-collapse mb-16">Mục tiêu 1</div>
            <Collapse in={true}>
              <div>
                <div className="mb-16">
                  <div className="mb-16">
                    Tên mục tiêu <span className="red-color">(*)</span>
                  </div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">
                    Metric 1 (Điểm 1) <span className="red-color">(*)</span>
                  </div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 2 (Điểm 2)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 3 (Điểm 3)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 4 (Điểm 4)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Metric 5 (Điểm 5)</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Trọng số</div>
                  <div class="weight-input-box">
                    <span class="prefix">%</span>
                    <Form.Control
                      as="input"
                      placeholder="Leave a comment here"
                      className="form-input"
                      type="number"
                    />                
                  </div>
                </div>
                <div className="mb-16">
                  <div className="mb-16">Job Details</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
                <div className="mb-16">
                  <div className="mb-16">Mục tiêu cần đạt được</div>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    className="form-textarea"
                  />
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
