import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import axios from "axios";
import LoadingSpinner from "components/Forms/CustomForm/LoadingSpinner";
import UserInfoEvaluation from "./UserInfoEvaluation";
import IconStarFull from 'assets/img/ic-star-full.svg';
import IconStarEmpty from 'assets/img/ic-star-empty.svg';
import Rating from "react-rating";
import _ from "lodash";

const EvaluationRecruitmentDetailModal = (props) => {
  const { t }: any = useTranslation();
  const { taskId, show, onHide } = props;
  const [candidateApplication, setCandidateApplication] = useState<any>(null);
  const [evaluationInfo, setEvaluationInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [totalScore, setTotalScore] = useState('0');
  const [requestDocuments, setRequestDocuments] = useState([]);
  const [scores, setScores] = useState({
    thaido: '0',
    chuyenmon: '0',
    muctieu: '0',
  });
  const [requestInfo, setRequestInfo] = useState({
    thaido: '',
    chuyenmon: '',
    nhanxetchung: '',
    ketluan: undefined,
    muctieu: '',
  });
  const [modal, setModal] = useState({
    visible: false,
    type: 'error',
    message: '',
  });

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
      const { candidateId, jobVacancyId, expertiseMark, goalsLongtmMark, attitudeMark} =
        evaluationResponse?.data?.data || {};
      const _scores = { //get diem
        chuyenmon: expertiseMark || '0',
        muctieu: goalsLongtmMark || '0',
        thaido: attitudeMark || '0',
      };
      setScores(_scores);
      calculatorTotalScore(_scores);
      const result = evaluationResponse?.data?.data || {}; 
      setRequestInfo({ //get comment
        thaido: result.attitude,
        chuyenmon: result.expertise,
        muctieu: result.goalsLongtm,
        nhanxetchung: result.generalComment,
        ketluan: result.resultInfo ? JSON.parse(result.resultInfo) : null,
      });

      //Thông tin file đính kèm
      if (result.attachedFiles && result.attachedFiles.length > 0) {
        setRequestDocuments(result.attachedFiles);
      }
      if (result?.status == 10) {
        setIsCreateMode(true);
      }
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

  const calculatorTotalScore = listScores => {
    let _total: number = 0;
    let count = 0.0;
    let score = {...listScores};
    score = _.pick(score, ['chuyenmon', 'thaido', 'muctieu']);
    const result = Object.keys(score).map(item => {
      _total += listScores[item] ? parseInt(listScores[item]) : 0;
      count += 10;
      return item;
    });

    let _totalScore = Number((_total * 10) / count).toFixed(2);
    setTotalScore(_totalScore);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleTextInputChange = (e, name) => {
    const _requestInfo = {...requestInfo};
    _requestInfo[name] = e != null ? e.target.value : "";
    setRequestInfo(_requestInfo);
  }

  const handleRatingChangeForItemVinhome = (value, name) => {
    const candidateInfos = {...scores};
    candidateInfos[name] = value || '0';
    calculatorTotalScore(candidateInfos);
    setScores(candidateInfos);
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size="xl"
      className={`info-modal-common position-apply-modal request-detail-modal recruitment-page`}
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {loading ? (
          <LoadingSpinner />
        ) : candidateApplication ? (
          <div className="registration-section">
            <h5 className="content-page-header">{t("EmployeeInfomation")}</h5>
            <div className="row group">
              <div className={`col-xl-6`}>
                {t("apply_position")}
                <div className="detail">{"Chuyên viên SAP"}</div>
              </div>
            </div>
            <h5 className="content-page-header">{"I. " + t("GeneralInfo")}</h5>
            <div className="box shadow">
              <div className="row">
                <div className="col-xl-6">
                  {t("candidate_name")}
                  <div className="detail">
                    {evaluationInfo.candidateName || ""}
                  </div>
                </div>
                <div className="col-xl-6">
                  {t("DateOfBirth")}
                  <div className="detail">
                    {evaluationInfo.dateOfBirth || ""}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6">
                  {capitalizeFirstLetter(t("reviewer").toLowerCase())}
                  <div className="detail">
                    {evaluationInfo.interviewerName || ""}
                  </div>
                </div>
                <div className="col-xl-6">
                  {t("Title")}
                  <div className="detail">
                    {evaluationInfo.interviewerTitle || ""}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  {t("DepartmentName")}
                  <div className="detail">
                    {evaluationInfo.interviewerPart || ""}
                  </div>
                </div>
              </div>
              {
                candidateApplication ?
                <UserInfoEvaluation
                  t={t}
                  item={candidateApplication}
                /> : null
              }
            </div>

            <h5 className="content-page-header my-2">{"II. " + t("danh_gia_nguoi_phong_van")}</h5>
            <div className="box shadow">
              {renderRatingEvaluation(t, isCreateMode, totalScore, scores, requestInfo, handleTextInputChange, handleRatingChangeForItemVinhome)}
            </div>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

const renderRatingEvaluation = (t, isCreateMode, total, score, requestInfo, handleTextInputChange, handleRatingChangeForItemVinhome) => {
  return (
  <>
      <div className="form-row">
          <div className=" only-label col-md-3">
          </div>
          <div className=" col-md-9 d-flex justify-content-end">
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '64px'}}>Yếu</label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '25px'}}>Trung bình </label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '33px'}}>Khá </label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '46px'}}>Tốt</label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '30px'}}>Xuất sắc</label>
          </div>
      </div>
      <div className="form-row mb-3">
          <div className=" only-label col-md-3">
              <label htmlFor="i_deadline">{t('chuyen_mon')}</label>
          </div>
          <div className=" col-md-9 d-flex justify-content-end mb-1" style={{paddingRight: '18px'}}>
              <Rating readonly={!isCreateMode} start={0} stop={10}  step={1} emptySymbol={<img src={IconStarEmpty} className="rating-empty-vinhome"/>} fullSymbol={<img src = {IconStarFull} className="rating-full-vinhome"/>}  onChange={(rating) => handleRatingChangeForItemVinhome(rating, 'chuyenmon')} initialRating = {score.chuyenmon}/>
          </div>
          <div className="col-md-12">
              <textarea rows={3} disabled={!isCreateMode} className="form-control" value={requestInfo.chuyenmon || ''} onChange={(e) => handleTextInputChange(e, 'chuyenmon')} placeholder = {'Ghi chú'}/>
          </div>
      </div>
      <div className="form-row">
          <div className=" only-label col-md-3">
          </div>
          <div className=" col-md-9 d-flex justify-content-end">
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '64px'}}>Yếu</label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '25px'}}>Trung bình </label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '33px'}}>Khá </label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '46px'}}>Tốt</label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '30px'}}>Xuất sắc</label>
          </div>
      </div>
      <div className="form-row mb-3">
          <div className=" only-label col-md-3">
              <label htmlFor="i_deadline">{t('thai_do')}</label>
          </div>
          <div className=" col-md-9 d-flex justify-content-end  mb-1 " style={{paddingRight: '18px'}}>
              <Rating readonly={!isCreateMode} start={0} stop={10}  step={1} emptySymbol={<img src={IconStarEmpty} className="rating-empty-vinhome"/>} fullSymbol={<img src = {IconStarFull} className="rating-full-vinhome"/>} onChange={(rating) => handleRatingChangeForItemVinhome(rating, 'thaido')} initialRating = {score.thaido}/>
          </div>
          <div className="col-md-12">
              <textarea rows={3} className="form-control" value={requestInfo.thaido || ''} onChange={(e) =>  handleTextInputChange(e, 'thaido')} placeholder = {'Ghi chú'} disabled={!isCreateMode}/>
          </div>
      </div>
      <div className="form-row">
          <div className=" only-label col-md-3">
          </div>
          <div className=" col-md-9 d-flex justify-content-end">
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '64px'}}>Yếu</label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '25px'}}>Trung bình </label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '33px'}}>Khá </label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '46px'}}>Tốt</label>
          <label htmlFor="i_deadline" className="instruction-vinhome" style={{paddingLeft: '30px'}}>Xuất sắc</label>
          </div>
      </div>
      <div className="form-row mb-3">
          <div className=" only-label col-md-3">
              <label htmlFor="i_deadline">{t('muc_tieu_cong_viec')}</label>
          </div>
          <div className=" col-md-9 d-flex justify-content-end  mb-1" style={{paddingRight: '18px'}}>
              <Rating readonly={!isCreateMode} start={0} stop={10}  step={1} emptySymbol={<img src={IconStarEmpty} className="rating-empty-vinhome"/>} fullSymbol={<img src = {IconStarFull} className="rating-full-vinhome"/>} onChange={(rating) => handleRatingChangeForItemVinhome(rating, 'muctieu')} initialRating = {score.muctieu}/>
          </div>
          <div className="col-md-12">
              <textarea rows={3} disabled={!isCreateMode} className="form-control" value={requestInfo.muctieu || ''} onChange={(e) => handleTextInputChange(e, 'muctieu')} placeholder = {'Ghi chú'}/>
          </div>
      </div>
      {/* {this.errors('score')} */}
      <div className="form-row mb-3">
          <div className=" score col-md-12">
          <label htmlFor="i_deadline" className="text1">Tổng điểm:</label><label htmlFor="i_deadline" className="text2">{`${total}/10`}</label>
          </div>

      </div>
  </>)
}

export default EvaluationRecruitmentDetailModal;
