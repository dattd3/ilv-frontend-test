import React from "react";
import { Modal, Button, Image } from "react-bootstrap";
import clsx from "clsx";
import purify from "dompurify"
import IconReject from "../../assets/img/icon/Icon_Cancel.svg";
import IconCheck from "../../assets/img/icon/Icon_Check_White.svg";

export default function ConfirmModal(props) {
  const {
    show,
    confirmHeader,
    confirmContent,
    onHide,
    onCancelClick,
    onAcceptClick,
    tempButtonLabel,
    mainButtonLabel,
    modalClassName,
  } = props;
  return (
    <Modal
      centered
      show={show}
      className={clsx("zi-1040 confirm-modal-new2", modalClassName)}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <div className="modal-title">{confirmHeader}</div>
      </Modal.Header>
      <Modal.Body>
        <div className="content" dangerouslySetInnerHTML={{
          __html: purify.sanitize(confirmContent),
        }} />
        <div className="text-right form-button-group">
          {tempButtonLabel && (
            <Button
              className="button-cancel d-inline-flex align-items-center justify-content-center"
              onClick={onCancelClick}
            >
              <Image src={IconReject} alt="Không" className="ic-status" />
              {tempButtonLabel}
            </Button>
          )}
          <Button
            className="button-approve d-inline-flex align-items-center justify-content-center"
            onClick={onAcceptClick}
          >
            <Image src={IconCheck} alt="Đồng ý" className="ic-status" />
            {mainButtonLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
