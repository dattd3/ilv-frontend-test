import { useTranslation } from "react-i18next"
import { processStep } from '../../Constants'

const EvaluationEmployeeInfo = ({ fullName, position, employeeLevel, organization_lv3, organization_lv4, hrAdmin, reviewStreamCode, reviewer, approver }) => {
  const { t } = useTranslation()
  const approverInfos = JSON.parse(approver || '{}')
  const reviewerInfos = JSON.parse(reviewer || '{}')
  const isShowManagerApproverInfo = reviewStreamCode === processStep.twoLevels
  const isDifferentZeroLevel = reviewStreamCode !== processStep.zeroLevel
  
  return (
    <>
      <div className="title">{t("EvaluationDetailEmployeeInfo")}</div>
      <div className="detail align-items-start">
        <div className="left">
          <div className="info-item">
            <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeFullName")}</span><span>:</span></span>
            <span className="value">{fullName || ''}</span>
          </div>
          <div className="info-item">
            <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeJobTitle")}</span><span>:</span></span>
            <span className="value">{position || ''}</span>
          </div>
          <div className="info-item">
            <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeJobLevel")}</span><span>:</span></span>
            <span className="value">{employeeLevel || ''}</span>
          </div>
          <div className="info-item">
            <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeDivision")}</span><span>:</span></span>
            <span className="value">{organization_lv3 || ''}</span>
          </div>
        </div>
        <div className="right">
          <div className="info-item">
            <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeDepartment")}</span><span>:</span></span>
            <span className="value">{organization_lv4 || ''}</span>
          </div>
          {
            isDifferentZeroLevel && 
              <div className="info-item">
                <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeManagerAssessment")}</span><span>:</span></span>
                <span className="value">{reviewerInfos?.fullname && `${reviewerInfos?.fullname || ''} - ${reviewerInfos?.position_title || ''}`}</span>
              </div>
          }
          {
            isShowManagerApproverInfo && 
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeManagerApprove")}</span><span>:</span></span>
              <span className="value">{approverInfos?.fullname && `${approverInfos?.fullname || ''} - ${approverInfos?.position_title || ''}`}</span>
            </div>
          }
          <div className="info-item">
            <span className="label"><span className="font-weight-bold">HR Admin</span><span>:</span></span>
            <span className="value">{`${hrAdmin || ''}`}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default EvaluationEmployeeInfo
