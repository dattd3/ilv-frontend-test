import React, { useState } from "react";
import { Modal, Button, Image, Form } from "react-bootstrap";
import clsx from "clsx";
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconCheck from 'assets/img/icon/Icon_Check_White.svg'

export default function RejectConfirmModal(props) {
  const {
    show,
    onHide,
    onCancelClick,
    modalClassName,
    onReject
  } = props;
  const [reasonInput, setReasonInput] = useState(null);
  const onAcceptClick = () => {
    onReject(reasonInput);
  };

  return (
    <Modal
      centered
      show={show}
      className={clsx("confirm-modal-new", modalClassName)}
      onHide={onHide}
    >
      <Modal.Body className="rounded">
        <div className="text-title">XÁC NHẬN TỪ CHỐI</div>
        <div className="content">
          <div>Lý do <span className="red-color">(*)</span></div>
          <Form.Control
            as="textarea"
            placeholder="Nhập"
            className="form-textarea"
            name="targetName"
            onChange={(e) => setReasonInput(e.target?.value)}
            value={reasonInput}
            maxLength={255}
          />
        </div>
        <div className="text-right form-button-group">
            <Button
              className="button-cancel d-inline-flex align-items-center justify-content-center"
              onClick={onCancelClick}
            >
              <Image src={IconReject} alt="Không" className="ic-status" />
              Hủy
            </Button>
          <Button
            className="button-approve d-inline-flex align-items-center justify-content-center reject-approve-btn"
            onClick={onAcceptClick}
            disabled={!reasonInput}
          >
            <Image src={IconCheck} alt="Đồng ý" className="ic-status" />
            Đồng ý
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
