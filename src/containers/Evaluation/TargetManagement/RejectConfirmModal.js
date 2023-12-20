import React, { useState } from "react";
import { Modal, Button, Image, Form } from "react-bootstrap";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import IconReject from "assets/img/icon/Icon_Cancel.svg";
import IconCheck from "assets/img/icon/Icon_Check_White.svg";
import { MODAL_TYPES } from "./Constant";

export default function RejectConfirmModal(props) {
  const {
    show,
    onHide,
    onCancelClick,
    modalClassName,
    onReject,
    type = MODAL_TYPES.REJECT_CONFIRM,
  } = props;
  const { t } = useTranslation();
  const [reasonInput, setReasonInput] = useState(null);
  const onAcceptClick = () => {
    onReject(reasonInput);
  };

  return (
    <Modal
      centered
      show={show}
      className={clsx("zi-1040 confirm-modal-new2", modalClassName)}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <div className="modal-title">
          {type === MODAL_TYPES.REJECT_CONFIRM ? (
            <>{t("xac_nhan_tu_choi")}</>
          ) : (
            <>{t("xac_nhan_thu_hoi")}</>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="content">
          <div>
            {type === MODAL_TYPES.REJECT_CONFIRM ? (
              <>
                {" "}
                {t("Reason")} <span className="red-color">(*)</span>
              </>
            ) : (
              <>
                {t("ly_do_thu_hoi")} <span className="red-color">(*)</span>
              </>
            )}
          </div>
          <Form.Control
            as="textarea"
            placeholder={t("EvaluationInput")}
            className="form-textarea"
            name="targetName"
            onChange={(e) => setReasonInput(e.target?.value)}
            value={reasonInput}
            maxLength={1000}
          />
        </div>
        <div className="text-right form-button-group">
          <Button
            className="button-cancel d-inline-flex align-items-center justify-content-center"
            onClick={onCancelClick}
          >
            <Image src={IconReject} alt="Không" className="ic-status" />
            {t("Cancel2")}
          </Button>
          <Button
            className="reject-approve-btn button-approve d-inline-flex align-items-center justify-content-center"
            onClick={onAcceptClick}
            disabled={!reasonInput}
          >
            <Image src={IconCheck} alt={t("dong_y")} className="ic-status" />
            {t("dong_y")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
