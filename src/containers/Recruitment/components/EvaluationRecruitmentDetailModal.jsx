import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import axios from "axios";
import LoadingSpinner from "components/Forms/CustomForm/LoadingSpinner";
import UserInfoEvaluation from "./UserInfoEvaluation";
import IconStarFull from "assets/img/ic-star-full.svg";
import IconStarEmpty from "assets/img/ic-star-empty.svg";
import Rating from "react-rating"; //
import _ from "lodash";
import IconAttachment from "assets/img/icon/ic_upload_attachment.svg";
import IconReset from "assets/img/icon/ic-reset.svg";
import IconCancel from 'assets/img/icon/Icon_Cancel.svg'
import IconSave from "assets/img/icon/pms/icon-save.svg";
import Select from "react-select";
import { getRequestConfigurations } from "commons/Utils";
import LoadingModal from "components/Common/LoadingModal";
import StatusModal from "components/Common/StatusModal";
import { validateTotalFileSize } from "utils/file";

const EvaluationRecruitmentDetailModal = (props) => {
  const { t } = useTranslation();
  const { taskId, show, onHide } = props;
  const [candidateApplication, setCandidateApplication] = useState(null);
  const [evaluationInfo, setEvaluationInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [totalScore, setTotalScore] = useState("0");
  const [requestDocuments, setRequestDocuments] = useState([]);
  const [scores, setScores] = useState({
    thaido: "0",
    chuyenmon: "0",
    muctieu: "0",
  });
  const [requestInfo, setRequestInfo] = useState({
    thaido: "",
    chuyenmon: "",
    nhanxetchung: "",
    ketluan: undefined,
    muctieu: "",
  });
  const [modal, setModal] = useState({
    visible: false,
    type: "error",
    message: "",
  });
  const ConclusionOptions = [
    { value: "1", label: "Tuyển dụng", id: "1", name: "Tuyển dụng" }, //{"id":3,"name":"Loại"}
    { value: "2", label: "Lưu hồ sơ", id: "2", name: "Lưu hồ sơ" },
    { value: "3", label: "Loại", id: "3", name: "Loại" },
  ];
  const [errors, setErrors] = useState({});

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
      const {
        candidateId,
        jobVacancyId,
        expertiseMark,
        goalsLongtmMark,
        attitudeMark,
      } = evaluationResponse?.data?.data || {};
      const _scores = {
        //get diem
        chuyenmon: expertiseMark || "0",
        muctieu: goalsLongtmMark || "0",
        thaido: attitudeMark || "0",
      };
      setScores(_scores);
      calculatorTotalScore(_scores);
      const result = evaluationResponse?.data?.data || {};
      setRequestInfo({
        //get comment
        thaido: result.attitude,
        chuyenmon: result.expertise,
        muctieu: result.goalsLongtm,
        nhanxetchung: result.generalComment,
        ketluan: result.resultInfo ? JSON.parse(result.resultInfo) : null,
      });

      //Thông tin file đính kèm
      if (result.attachedFiles && result.attachedFiles.length > 0) {
        setRequestDocuments(result.attachedFiles);
      } else {
        setRequestDocuments([]);
      }
      if (result?.status == 10) {
        setIsCreateMode(true);
      } else {
        setIsCreateMode(false);
      }
      if (candidateId) {
        const candidateResponse = await axios.get(
          `${process.env.REACT_APP_HRDX_URL}api/candidate/fullDetails`,
          {
            ...config,
            params: { EntityId: candidateId},
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

  const calculatorTotalScore = (listScores) => {
    let _total = 0;
    let count = 0.0;
    let score = { ...listScores };
    score = _.pick(score, ["chuyenmon", "thaido", "muctieu"]);
    const result = Object.keys(score).map((item) => {
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

  const handleChangeSelectInputs = (e, name) => {
    const _requestInfo = { ...requestInfo };
    _requestInfo[name] = null;
    if (e) {
      _requestInfo[name] = e;
    }
    setRequestInfo(_requestInfo);
  };

  const handleTextInputChange = (e, name) => {
    const _requestInfo = { ...requestInfo };
    _requestInfo[name] = e != null ? e.target.value : "";
    setRequestInfo(_requestInfo);
  };

  const handleRatingChangeForItemVinhome = (value, name) => {
    const candidateInfos = { ...scores };
    candidateInfos[name] = value || "0";
    calculatorTotalScore(candidateInfos);
    setScores(candidateInfos);
  };

  const handleChangeFileInput = (e, name) => {
    const attachments = Object.values(e.target.files);
    let files = [...requestDocuments];
    files = files.concat(attachments);
    const isValid = validateTotalFileSize(e, files, t);
    if(isValid) {
      setRequestDocuments(files);
    } else {
      setModal({
        visible: true,
        type: 'error',
        message: t('ExceedMaxFileSize')
      })
    }
  };

  const removeFiles = (index, name) => {
    let files = [...requestDocuments];
    const filesExist = files.filter((item, i) => i !== index);
    files = filesExist;
    setRequestDocuments(files);
  };

  const processCancelButton = (e) => {
    onHide();
  };

  const verifyInputs = () => {
    let flag = true;
    //verify score
    let score = { ...scores };
    score = _.pick(score, ["chuyenmon", "thaido", "muctieu"]);
    let error = {};
    Object.keys(score).map((item) => {
      error["scores"] =
        score[item] == "0"
          ? `${t("please_enter")} ${t("content_rated")}`
          : error["scores"];
      return item;
    });

    //verify input
    let LIST_FIELD_REQUIRE = ["ketluan", "nhanxetchung"];

    let optionFields = ["ketluan"];
    LIST_FIELD_REQUIRE.some((key) => {
      if (
        _.isEmpty(requestInfo[key]) ||
        (!(requestInfo[key])?.value && optionFields.includes(key))
      ) {
        error[key] = t("please_enter");
        flag = false;
      }
    });

    // let checkfiles =
    //   !requestDocuments || requestDocuments?.length === 0
    //     ? t("please_attach_the_file")
    //     : null;

    // if (checkfiles) {
    //   error["files"] = t("please_enter");
    //   flag = false;
    // }
    setErrors(error);
    return flag;
  };

  const processOkButton = (e) => {
    e.preventDefault();
    const isValidData = verifyInputs();
    console.log(isValidData);
    if (!isValidData) {
        return
    }

    //const employeeInfo = this.props.data;
    let bodyFormData = new FormData();

    bodyFormData.append('CompanyCode', localStorage.getItem('companyCode') || '');
    bodyFormData.append('TotalMark', totalScore);
    bodyFormData.append('Id', taskId);
    bodyFormData.append('Expertise', requestInfo.chuyenmon || ''); //Kiến thức chuyên môn
    bodyFormData.append('ExpertiseMark', scores.chuyenmon);
    bodyFormData.append('Attitude', requestInfo.thaido || ''); //Thái độ nghiêm túc, cầu tiến, đam mê công vi
    bodyFormData.append('AttitudeMark', scores.thaido);//Thái độ ng
    bodyFormData.append('GoalsLongtm', requestInfo.muctieu || ''); //Thái độ nghiêm túc, cầu tiến, đam mê công vi
    bodyFormData.append('GoalsLongtmMark', scores.muctieu);//Thái độ ng
    bodyFormData.append('GeneralComment', requestInfo.nhanxetchung); //Nhận xét chung
    bodyFormData.append('ResultInfo', JSON.stringify(requestInfo.ketluan));

    requestDocuments?.forEach(file => {
        bodyFormData.append('attachedFiles', file)
    })
    setLoading(true);

    const config = {
        headers: {
            'Authorization': `${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
        }
    }

      axios.post(
        `${process.env.REACT_APP_HRDX_URL}api/assessments/evaluate`,
        bodyFormData,
        config
      ).then(response => {
          if (response.data && response.data.model_errors && Array.isArray(response.data.model_errors) && response.data.model_errors.length > 0) {
              let messages = t('AnErrorOccurred');
              const modelErrors = response.data.model_errors
              const err = (modelErrors || []).map(item => item.message)
              messages = err.join(' | ')
              setModal({
                visible: true,
                type: 'error',
                message: messages
              })
              return;
          }

          setModal({
            visible: true,
            type: 'success',
            message: t('save_information_success')
          })
      })
      .catch(error => {
          let messages = error?.message || t('AnErrorOccurred');
          console.log(messages);
          setModal({
            visible: true,
            type: 'error',
            message: messages
          });
      }).finally(() => {
        setLoading(false);
      })
  };

  const showerrors = (name, isMarginBottom = false) => {
    return errors[name] ? (
      <p
        className="text-danger errors mt-1"
        style={{ marginBottom: isMarginBottom ? "1rem" : "0px" }}
      >
        {errors[name]}
      </p>
    ) : null;
  };

  const hideStatusModal = () => {
    setModal({
      ...modal,
      visible: false
    });
    if(modal.type == 'success')
    window.location.reload();
  }

  return (
    <>
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
        {candidateApplication ? (
          <div className="registration-section">
            <h5 className="content-page-header">{t("EmployeeInfomation")}</h5>
            <div className="row group">
              <div className={`col-xl-6`}>
                {t("apply_position")}
                <div className="detail">{evaluationInfo.jobTitle}</div>
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
              {candidateApplication ? (
                <UserInfoEvaluation t={t} item={candidateApplication} />
              ) : null}
            </div>

            <h5 className="content-page-header my-2">
              {"II. " + t("danh_gia_nguoi_phong_van")}
            </h5>
            <div className="box shadow">
              {renderRatingEvaluation(
                t,
                isCreateMode,
                totalScore,
                scores,
                requestInfo,
                handleTextInputChange,
                handleRatingChangeForItemVinhome
              )}
              {showerrors("scores")}
            </div>

            <div className="form-row mb-3" id="nhanxetchung">
              <div className=" only-label col-md-3">
                <label htmlFor="i_deadline">
                  {t('nhan_xet_chung')}<span className="required">(*)</span>
                </label>
              </div>
              <div className="col-md-9">
                <textarea
                  rows={3}
                  disabled={!isCreateMode}
                  className="form-control"
                  value={requestInfo.nhanxetchung || ""}
                  onChange={(e) => handleTextInputChange(e, "nhanxetchung")}
                />
                {showerrors("nhanxetchung")}
              </div>
            </div>

            <div className="form-row mb-3">
              <div className=" only-label col-md-3">
                <label htmlFor="i_deadline">{t("AttachmentFile")}</label>
              </div>
              <div className="col-md-9" id={"dinhkem"}>
                <div className="block-attachment-input" style={{minHeight: '40px'}}> 
                {
                  isCreateMode ?
                  <label
                    htmlFor="file-upload-dinhkem"
                    className="custom-file-upload"
                  >
                    {t("SelectFilePlaceHolder")}
                  </label> : null
                }
                  
                  <div className="list-files-selected">
                    {requestDocuments && requestDocuments.length > 0
                      ? requestDocuments.map((item, index) => {
                          return (
                            <div className="item file-name" style={{boxShadow: 'none'}} key={index}>
                              <a
                                style={{ cursor: "pointer" }}
                                href = {item.link}
                                target="_blank"
                              >
                                <img
                                  src={IconAttachment}
                                  alt="Đính kèm"
                                  className="ic-attachment mr-1"
                                />
                                {item.name}
                              </a>
                              {isCreateMode ? (
                                <span
                                  className="remove-file"
                                  onClick={(e) => removeFiles(index, "dinhkem")}
                                >
                                  <img
                                    src={IconReset}
                                    alt="Xóa"
                                    className="ic-action ic-reset"
                                  />
                                </span>
                              ) : null}
                            </div>
                          );
                        })
                      : "Không có tệp nào được chọn"}
                  </div>
                  {
                    isCreateMode ?
                    <input
                      id="file-upload-dinhkem"
                      className="input-file"
                      type="file"
                      onChange={(e) => handleChangeFileInput(e, "dinhkem")}
                      multiple
                      accept=".docx, .doc, .pdf, .xlsx, .xls, .csv"
                    /> : null
                  }
                  
                </div>
                {showerrors("files")}
              </div>
            </div>
            <div className="form-row mb-3" id="ketluan">
              <div className=" only-label col-md-3">
                <label htmlFor="i_deadline">
                  {t("ket_luan")}
                  <span className="required">(*)</span>
                </label>
              </div>
              <div className="col-md-9">
                <Select
                  options={ConclusionOptions}
                  noOptionsMessage={() => "Không có lựa chọn"}
                  value={ConclusionOptions.filter(
                    (so) => so.value === requestInfo.ketluan?.value
                  )}
                  onChange={(e) => handleChangeSelectInputs(e, "ketluan")}
                  className="input"
                  isDisabled={!isCreateMode}
                  name="i_need_security"
                  id="i_need_security"
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                />
                {showerrors("ketluan")}
              </div>
            </div>

            {
              isCreateMode ?
              <div className="actions-block" style={{ marginTop: "20px" }}>
                <div className="action-group">
                  <span
                    className="btn-action btn-close"
                    onClick={processCancelButton}
                  >
                    <img
                      src={IconCancel}
                      alt="Hủy"
                      className="ic-action ic-reset"
                    />
                    <span>{t("Cancel2")}</span>
                  </span>
                  <span
                    className="btn-action btn-accept"
                    onClick={processOkButton}
                  >
                    <img
                      src={IconSave}
                      alt="Đồng ý"
                      className="ic-action ic-accept"
                    />
                    <span>{t("Save")}</span>
                  </span>
                </div>
              </div> : null
            }
            
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
    <LoadingModal show={loading} />
    <StatusModal show={modal.visible} content={modal.message} isSuccess={modal.type != 'error'} onHide={hideStatusModal} />
    </>
  );
};

const renderRatingEvaluation = (
  t,
  isCreateMode,
  total,
  score,
  requestInfo,
  handleTextInputChange,
  handleRatingChangeForItemVinhome
): JSX.Element => {
  return (
    <>
      <div className="form-row">
        <div className=" only-label col-md-3"></div>
        <div className=" col-md-9 d-flex justify-content-end">
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "64px" }}
          >
            Yếu
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "25px" }}
          >
            Trung bình{" "}
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "33px" }}
          >
            Khá{" "}
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "46px" }}
          >
            Tốt
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "30px" }}
          >
            Xuất sắc
          </label>
        </div>
      </div>
      <div className="form-row mb-3">
        <div className=" only-label col-md-3">
          <label htmlFor="i_deadline">{t("chuyen_mon")}</label>
        </div>
        <div
          className=" col-md-9 d-flex justify-content-end mb-1"
          style={{ paddingRight: "18px" }}
        >
          <Rating
            readonly={!isCreateMode}
            start={0}
            stop={10}
            step={1}
            emptySymbol={
              <img src={IconStarEmpty} className="rating-empty-vinhome" />
            }
            fullSymbol={
              <img src={IconStarFull} className="rating-full-vinhome" />
            }
            onChange={(rating) =>
              handleRatingChangeForItemVinhome(rating, "chuyenmon")
            }
            initialRating={score.chuyenmon}
          />
        </div>
        <div className="col-md-12">
          <textarea
            rows={3}
            disabled={!isCreateMode}
            className="form-control"
            value={requestInfo.chuyenmon || ""}
            onChange={(e) => handleTextInputChange(e, "chuyenmon")}
            placeholder={"Ghi chú"}
          />
        </div>
      </div>
      <div className="form-row">
        <div className=" only-label col-md-3"></div>
        <div className=" col-md-9 d-flex justify-content-end">
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "64px" }}
          >
            Yếu
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "25px" }}
          >
            Trung bình{" "}
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "33px" }}
          >
            Khá{" "}
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "46px" }}
          >
            Tốt
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "30px" }}
          >
            Xuất sắc
          </label>
        </div>
      </div>
      <div className="form-row mb-3">
        <div className=" only-label col-md-3">
          <label htmlFor="i_deadline">{t("thai_do")}</label>
        </div>
        <div
          className=" col-md-9 d-flex justify-content-end  mb-1 "
          style={{ paddingRight: "18px" }}
        >
          <Rating
            readonly={!isCreateMode}
            start={0}
            stop={10}
            step={1}
            emptySymbol={
              <img src={IconStarEmpty} className="rating-empty-vinhome" />
            }
            fullSymbol={
              <img src={IconStarFull} className="rating-full-vinhome" />
            }
            onChange={(rating) =>
              handleRatingChangeForItemVinhome(rating, "thaido")
            }
            initialRating={score.thaido}
          />
        </div>
        <div className="col-md-12">
          <textarea
            rows={3}
            className="form-control"
            value={requestInfo.thaido || ""}
            onChange={(e) => handleTextInputChange(e, "thaido")}
            placeholder={"Ghi chú"}
            disabled={!isCreateMode}
          />
        </div>
      </div>
      <div className="form-row">
        <div className=" only-label col-md-3"></div>
        <div className=" col-md-9 d-flex justify-content-end">
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "64px" }}
          >
            Yếu
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "25px" }}
          >
            Trung bình{" "}
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "33px" }}
          >
            Khá{" "}
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "46px" }}
          >
            Tốt
          </label>
          <label
            htmlFor="i_deadline"
            className="instruction-vinhome"
            style={{ paddingLeft: "30px" }}
          >
            Xuất sắc
          </label>
        </div>
      </div>
      <div className="form-row mb-3">
        <div className=" only-label col-md-3">
          <label htmlFor="i_deadline">{t("muc_tieu_cong_viec")}</label>
        </div>
        <div
          className=" col-md-9 d-flex justify-content-end  mb-1"
          style={{ paddingRight: "18px" }}
        >
          <Rating
            readonly={!isCreateMode}
            start={0}
            stop={10}
            step={1}
            emptySymbol={
              <img src={IconStarEmpty} className="rating-empty-vinhome" />
            }
            fullSymbol={
              <img src={IconStarFull} className="rating-full-vinhome" />
            }
            onChange={(rating) =>
              handleRatingChangeForItemVinhome(rating, "muctieu")
            }
            initialRating={score.muctieu}
          />
        </div>
        <div className="col-md-12">
          <textarea
            rows={3}
            disabled={!isCreateMode}
            className="form-control"
            value={requestInfo.muctieu || ""}
            onChange={(e) => handleTextInputChange(e, "muctieu")}
            placeholder={"Ghi chú"}
          />
        </div>
      </div>

      {/* {this.errors('score')} */}
      <div className="form-row">
        <div className=" score col-md-12">
          <label htmlFor="i_deadline" className="text1">
            Tổng điểm:
          </label>
          <label htmlFor="i_deadline" className="text2">{`${total}/10`}</label>
        </div>
      </div>
    </>
  );
};

export default EvaluationRecruitmentDetailModal;
