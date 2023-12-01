import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import axios from "axios";
import LoadingSpinner from "components/Forms/CustomForm/LoadingSpinner";

const EvaluationRecruitmentDetailModal = (props) => {
  const { t } = useTranslation();
  const { taskId, show, onHide } = props;
  const [candidateApplication, setCandidateApplication] = useState<any>(null);
  const [evaluationInfo, setEvaluationInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && taskId) {
      initData();
    }
  }, [show, taskId]);

  const initData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    try {
      setLoading(true);
      const evaluationResponse = await axios.get(
        `${process.env.REACT_APP_HRDX_URL}api/assessments/${taskId}`,
        config
      );
      const { candidateId, jobVacancyId } = evaluationResponse?.data?.data || {};
      if (candidateId) {
        const candidateResponse = await axios.get(
          `${process.env.REACT_APP_HRDX_URL}api/appplications/applicationHistory`,
          {
            ...config,
            params: { CandidateId: candidateId, JobVacancyId: jobVacancyId },
          }
        );
        setEvaluationInfo(evaluationResponse?.data?.data);
        setCandidateApplication(candidateResponse?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size="xl"
      className={`info-modal-common position-apply-modal request-detail-modal`}
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {loading ? (
          <LoadingSpinner />
        ) : candidateApplication ? (
          <div className="registration-section">Modal Detail</div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default EvaluationRecruitmentDetailModal;
