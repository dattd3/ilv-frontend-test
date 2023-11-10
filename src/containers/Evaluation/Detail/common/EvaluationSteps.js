import { useTranslation } from "react-i18next"
import { evaluationStatus, processStep } from '../../Constants'
import IconArrowRightWhite from 'assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from 'assets/img/icon/pms/arrow-right-gray.svg'

const EvaluationSteps = ({ status, reviewStreamCode }) => {
  const { t } = useTranslation()
  let stepStatusMapping, stepEvaluationConfig;

  switch (reviewStreamCode) {
    case processStep.zeroLevel:
      stepEvaluationConfig = [t("EvaluationDetailSelfAssessment"), t("EvaluationDetailCompleted")];
      stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: null,
        [evaluationStatus.qlttAssessment]: null,
        [evaluationStatus.cbldApproved]: 1,
      };
      break;
    case processStep.oneLevel:
      stepEvaluationConfig = [t("EvaluationDetailSelfAssessment"), t("EvaluationDetailManagerAssessment"), t("EvaluationDetailCompleted")];
      stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: 1,
        [evaluationStatus.qlttAssessment]: null,
        [evaluationStatus.cbldApproved]: 2,
      };
      break;
    case processStep.twoLevels:
      stepEvaluationConfig = [t("EvaluationDetailSelfAssessment"), t("EvaluationDetailManagerAssessment"), t("EvaluationDetailManagerApprove"), t("EvaluationDetailCompleted")];
      stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: 1,
        [evaluationStatus.qlttAssessment]: 2,
        [evaluationStatus.cbldApproved]: 3,
      };
      break;
  }

  return (
    (stepEvaluationConfig || []).map((item, index) => {
      let activeClass = index === stepStatusMapping[status] ? 'active' : ''
      return (
        <div className="wrap-item" key={index}>
          <div className="line"><hr /></div>
          <div className={`info ${activeClass}`}>
            <div className="item">
                <span className="no"><span>{index + 1}</span></span>
                <span className="name">{item}</span>
                <img src={!activeClass ? IconArrowRightGray : IconArrowRightWhite} alt="Next" className="next" />
            </div>
          </div>
        </div>
      )
    })
  )
}

export default EvaluationSteps
