import React, { useState, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, exportToPDF } from '../../../commons/Utils'
import { evaluation360Status, stepEvaluation360Config, evaluationApiVersion } from '../Constants'
import { useGuardStore } from '../../../modules'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import HOCComponent from '../../../components/Common/HOCComponent'
import Evaluation360VinGroupTemplate from '../Templates/Template360/Vingroup'
import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconDownload from '../../../assets/img/icon/Icon_download_red.svg'
import IconSend from '../../../assets/img/icon/Icon_send.svg'

const currentLocale = localStorage.getItem("locale")
const companyThemeColor = localStorage.getItem("companyThemeColor")

const Evaluation360 = ({ evaluationFormId, formCode, employeeCode }) => {
  const { t } = useTranslation()
  const [errors, SetErrors] = useState({})
  const [bottom, setBottom] = useState(false)
  const [isLoading, SetIsLoading] = useState(false)
  const [evaluationFormDetail, SetEvaluationFormDetail] = useState(null)
  const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true })
  const guard = useGuardStore()
  const user = guard.getCurentUser()

  const relations = [
    { value: 'CT', label: t("RelationManager") },
    { value: 'DN', label: t("RelationPeer") },
    { value: 'CBCD', label: t("RelationStaff") },
    { value: 'BT', label: t("RelationSelf") },
  ]

  useEffect(() => {
    const processEvaluationFormDetailData = response => {
      if (response && response.data) {
        const result = response.data.result
        if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
          const evaluationFormDetailTemp = response.data?.data;
          if (evaluationFormDetailTemp.listGroup) {
            evaluationFormDetailTemp.listGroup = ([...evaluationFormDetailTemp?.listGroup] || []).sort((pre, next) => pre?.groupOrder - next?.groupOrder)
          }
          SetEvaluationFormDetail(evaluationFormDetailTemp)
        }
      }
    }

    const fetchEvaluationFormDetails = async () => {
      SetIsLoading(true)
      try {
        const config = getRequestConfigurations()
        config.params = {
          checkPhaseFormId: evaluationFormId,
          EmployeeCode: employeeCode,
          FormCode: formCode,
          UserName: user?.ad,
        }
        const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/${evaluationApiVersion.v1}/targetform/formbyuser`, config)
        processEvaluationFormDetailData(response)
      } catch (e) {
        SetStatusModal({
          ...statusModal,
          isShow: true,
          content: t("AnErrorOccurred"),
          isSuccess: false,
          needReload: true,
        })
      } finally {
        SetIsLoading(false)
      }
    }

    fetchEvaluationFormDetails()
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 200;
    setBottom(bottom)
  }

  const onHideStatusModal = () => {
    const statusModalTemp = { ...statusModal }
    statusModalTemp.isShow = false
    statusModalTemp.isSuccess = true
    statusModalTemp.content = ""
    statusModalTemp.needReload = true
    SetStatusModal(statusModalTemp)

    if (statusModal.needReload) {
      window.location.reload()
    }
  }

  const isDataValid = () => {
    let messageError = ''
    let hasError = false
    if (!evaluationFormDetail?.relation) {
      messageError = t("RequiredYourRelationshipWithEvaluatee")
      hasError = true
    } else {
      messageError = t("RequiredEvaluationScore")
      hasError = (evaluationFormDetail?.listGroup[1]?.listTarget || []).some(item => item?.seftPoint === '' || item?.seftPoint === null)
    }

    if (hasError) {
      SetStatusModal({
        ...statusModal,
        isShow: true,
        isSuccess: false,
        content: messageError,
        needReload: false,
      })
    }

    return !hasError
  }

  const handleSubmit = async () => {
    const isValid = isDataValid()
    if (!isValid) {
      return
    }

    const statusModalTemp = { ...statusModal }

    // statusModalTemp.isShow = true
    // statusModalTemp.isSuccess = false
    // statusModalTemp.content = t("EvaluationTotalScoreInValid")
    // statusModalTemp.needReload = false
    // SetStatusModal(statusModalTemp)
    // return

    SetIsLoading(true)
    try {
      const config = getRequestConfigurations()
      const payload = { ...evaluationFormDetail }
      const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/${evaluationApiVersion.v1}/targetform/update`, { requestString: JSON.stringify(payload || {}) }, config)
      SetErrors({})
      statusModalTemp.isShow = true
      statusModalTemp.isSuccess = false
      statusModalTemp.content = t("EvaluationFailedToEvaluateForm")
      if (response && response?.data) {
        const result = response.data?.result
        if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
          statusModalTemp.isSuccess = true
          statusModalTemp.content = t("EvaluationFormEvaluatedSuccessfully")
          statusModalTemp.needReload = true
        } else {
          statusModalTemp.content = result?.message
        }
      }
      SetStatusModal(statusModalTemp)
    } catch (e) {
      statusModalTemp.isShow = true
      statusModalTemp.isSuccess = false
      statusModalTemp.content = t("AnErrorOccurred")
      statusModalTemp.needReload = false
      SetStatusModal(statusModalTemp)
    } finally {
      SetIsLoading(false)
    }
  }

  const handleInputChange = (subIndex, stateName, element) => {
    let val = null
    switch (stateName) {
      case 'seftPoint':
        val = element?.target?.value
        break
      case 'relation':
        val = element?.value || null
        break
      default:
        val = element?.target?.value || ''
        break
    }

    if (['seftPoint'].includes(stateName) && (!(/^\d*$/.test(Number(val))) || val.includes('.'))) {
      return
    }

    const evaluationFormDetailClone = {...evaluationFormDetail}
    if (stateName === 'relation') {
      evaluationFormDetailClone.relation = val
    } else {
      evaluationFormDetailClone.listGroup[1].listTarget[subIndex][stateName] = val
    }

    SetEvaluationFormDetail(evaluationFormDetailClone)
  }

  const renderEvaluationStep = () => {
    const stepEvaluation = stepEvaluation360Config.map(item => {
      return {
        ...item,
        label: t(item?.label)
      }
    })

    return (stepEvaluation || []).map((item, index) => {
      let activeClass = item?.value == evaluationFormDetail?.status ? 'active' : ''
      return (
        <div className="wrap-item" key={index}>
          <div className="line"><hr /></div>
          <div className={`info ${activeClass}`}>
            <div className="item">
              <span className="no"><span>{index + 1}</span></span>
              <span className="name">{item?.label}</span>
              <Image src={!activeClass ? IconArrowRightGray : IconArrowRightWhite} alt="Next" className="next" />
            </div>
          </div>
        </div>
      )
    })
  }

  const renderEmployeeInfos = () => {
    const isCompleted = evaluationFormDetail?.status == evaluation360Status.completed || evaluationFormDetail?.status == evaluation360Status.evaluated
    const isDisableInput = !evaluationFormDetail?.isEdit || isCompleted
    const relationOption = relations.find(item => item.value === evaluationFormDetail?.relation)

    return (
      <div className="employee-info">
        <div className="title">I. {t("EmployeeInformationIsEvaluated")}</div>
        <div className="detail align-items-start">
          <div className="left">
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeFullName")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.fullName || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeJobTitle")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.position || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeJobLevel")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.employeeLevel || ''}</span>
            </div>
          </div>
          <div className="right">
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeDivision")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.organization_lv3 || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeDepartment")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.organization_lv4 || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">HR Admin</span><span>:</span></span>
              <span className="value">{`${evaluationFormDetail?.hrAdmin || ''}`}</span>
            </div>
          </div>
        </div>
        <div className="detail align-items-start">
          <div className="left" style={{ paddingTop: 10 }}>{t("YourRelationshipWithEvaluatee")} :</div>
          <div className="right">
            <div className="relation-label">{relationOption?.label}</div>
          </div>
        </div>
      </div>
    )
  }

  const exportToPdfFile = () => {
    const btnExport = document.getElementById('btn-export')
    const blockActionButton = document.getElementById('button-block')
    const elementView = document.getElementById('evaluation-360')

    if (btnExport) {
      btnExport.style.visibility = 'hidden'
    }
    if (blockActionButton) {
      blockActionButton.style.visibility = 'hidden'
    }

    exportToPDF(elementView, evaluationFormDetail?.checkPhaseFormName)

    if (btnExport) {
      btnExport.style.visibility = 'visible'
    }
    if (blockActionButton) {
      blockActionButton.style.visibility = 'visible'
    }
  }

  return (
    <>
      <LoadingModal show={isLoading} />
      <StatusModal 
        show={statusModal.isShow} 
        isSuccess={statusModal.isSuccess} 
        content={statusModal.content} 
        className="evaluation-status-modal"
        onHide={onHideStatusModal} />
      <div className="evaluation-360" id="evaluation-360">
        <div className="header-block">
          <h1 className="content-page-header">{`${t("360DegreeFeedbackFormFor")} ${evaluationFormDetail?.fullName}`}</h1>
          <button className="btn-export" onClick={exportToPdfFile} id="btn-export">
            <img src={IconDownload} alt="Download" />
            <span>{t("DownloadPDF")}</span>
          </button>
        </div>
        <div className="card shadow evaluation-process">
          <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
          <div className="step-block">
            {renderEvaluationStep()}
          </div>
          <div className="employee-info-block">
            {renderEmployeeInfos()}
          </div>
          <Evaluation360VinGroupTemplate 
            evaluationFormDetail={evaluationFormDetail}
            isEdit={evaluationFormDetail?.isEdit}
            currentLocale={currentLocale}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        </div>
        {
          evaluationFormDetail?.status == evaluation360Status.waitingEvaluation && evaluationFormDetail?.isEdit && (
            <div className="button-block" id="button-block">
              <button className="btn-action confirm" onClick={handleSubmit}><Image src={IconSend} alt="Send" />{t("Evaluation360ButtonSend")}</button>
            </div>
          )
        }
      </div>
      {
        !bottom && evaluationFormDetail?.status == evaluation360Status.waitingEvaluation && evaluationFormDetail?.isEdit && (
          <div className="scroll-to-save" style={{ color: companyThemeColor, zIndex: '10' }}>
            <div>
              <button className="btn-action save" onClick={handleSubmit}><Image src={IconSend} alt="Send" />{t("Evaluation360ButtonSend")}</button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default HOCComponent(Evaluation360)
