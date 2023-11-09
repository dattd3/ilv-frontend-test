import Constants from "commons/Constants";
import LoadingModal from "components/Common/LoadingModal";
import StatusModal from "components/Common/StatusModal";
import ConfirmationModal from "containers/Registration/ConfirmationModal";
import ResultModal from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ResultModal";
import React, { useState } from "react";
import IconEye from "../../../assets/img/icon/eye.svg";
import IconRemove from "../../../assets/img/ic-remove.svg";
import IconAdd from "../../../assets/img/ic-add-green.svg";
import IconNotEye from "../../../assets/img/icon/not-eye.svg";
import IconDelete from "../../../assets/img/icon/Icon_Cancel.svg";
import { useHistory } from "react-router";

const InsuranceApproveActionButtons = ({ showComponent, t, id, requestTypeId = Constants.INSURANCE_SOCIAL }: any) => {
  const history = useHistory();
  const [resultModal, setResultModal] = useState({
    title: "",
    message: "",
    show: false,
    isSuccess: false,
  });
  const [proposalModal, setProposalModal] = useState({
    show: false,
    index: -1,
    data: null,
  });
  const [modalStatus, setModalStatus] = useState({
    url: "",
    content: "",
    isSuccess: true,
    isShowStatusModal: false,
  });
  const [confirmModal, setConfirmModal] = useState<any>({
    modalTitle: "",
    typeRequest: "",
    modalMessage: "",
    confirmStatus: "",
    isShowModalConfirm: false,
    dataToUpdate: [],
    indexCurrentAppraiser: -1,
  });

  const hideResultModal = () => {
    setResultModal({ title: "", message: "", show: false, isSuccess: false });
  };

  const hideStatusModal = () => {
    setModalStatus({ ...modalStatus, isShowStatusModal: false });
    if (modalStatus.url) window.location.href = modalStatus.url;
  };

  const onHideModalConfirm = () => {
    setConfirmModal({ ...confirmModal, isShowModalConfirm: false });
  };

  const handleCancel = () => history?.push("/tasks");

  const handleRefuse = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("RejectConsenterRequest"),
      modalMessage: t("ReasonRejectRequest"),
      typeRequest: Constants.STATUS_NO_CONSENTED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: id,
          requestTypeId: requestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 7,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  // Thẩm định
  const handleConsent = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ConsentConfirmation"),
      modalMessage: t("ConfirmConsentRequest"),
      typeRequest: Constants.STATUS_CONSENTED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: id,
          requestTypeId: requestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 5,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  // Không phê duyệt
  const handleReject = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ConfirmNotApprove"),
      modalMessage: `${t("ReasonNotApprove")}`,
      typeRequest: Constants.STATUS_NOT_APPROVED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: id,
          requestTypeId: requestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 1,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  const handleApprove = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ApproveRequest"),
      modalMessage: t("ConfirmApproveChangeRequest"),
      typeRequest: Constants.STATUS_APPROVED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: id,
          requestTypeId: requestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 2,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };
  return (
    <div>
      <ResultModal
        show={resultModal.show}
        title={resultModal.title}
        message={resultModal.message}
        isSuccess={resultModal.isSuccess}
        onHide={hideResultModal}
      />

      <StatusModal
        show={modalStatus.isShowStatusModal}
        content={modalStatus.content}
        isSuccess={modalStatus.isSuccess}
        onHide={hideStatusModal}
      />
      <ConfirmationModal
        show={confirmModal.isShowModalConfirm}
        title={confirmModal.modalTitle}
        type={confirmModal.typeRequest}
        message={confirmModal.modalMessage}
        confirmStatus={confirmModal.confirmStatus}
        dataToSap={confirmModal.dataToUpdate}
        onHide={onHideModalConfirm}
        indexCurrentAppraiser={confirmModal.indexCurrentAppraiser}
      />

      <div className="block-status">
        <span
          className={`status ${
            Constants.mappingStatusRequest[showComponent.processStatusId]
              ?.className
          }`}
        >
          {t(showComponent.processLabel)}
        </span>
        {/* { showComponent?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && messageSAP && 
            <div className={`d-flex status fail`}>
              <i className="fas fa-times pr-2 text-danger align-self-center"></i>
              <div>
                {messageSAP.map((msg, index) => {
                  return <div key={index}>{msg}</div>
                })}
              </div>
            </div>
          } */}
      </div>

      <div className="d-flex justify-content-end mb-5">
        {/* Hủy */}
        {showComponent.btnCancel && (
          <button
            type="button"
            className="btn btn-secondary ml-3 shadow"
            onClick={handleCancel}
          >
            <img src={IconDelete} className="mr-1" alt="cancel" />{" "}
            {t("CancelSearch")}
          </button>
        )}

        {/* Từ chối */}
        {showComponent.btnRefuse && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleRefuse}
          >
            <img src={IconDelete} className="mr-1" alt="delete" />{" "}
            {t("RejectQuestionButtonLabel")}
          </button>
        )}
        {/* Thẩm định */}
        {showComponent.btnExpertise && (
          <button
            type="button"
            className="btn btn-primary float-right ml-3 shadow"
            onClick={handleConsent}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t("Consent")}
          </button>
        )}
        {/* Không phê duyệt */}
        {showComponent.btnNotApprove && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleReject}
          >
            <img src={IconDelete} className="mr-1" alt="delete" /> {t("Reject")}
          </button>
        )}
        {/* Phê duyệt */}
        {showComponent.btnApprove && (
          <button
            type="button"
            className="btn btn-success float-right ml-3 shadow"
            onClick={handleApprove}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t("Approval")}
          </button>
        )}
      </div>
    </div>
  );
};

export default InsuranceApproveActionButtons;
