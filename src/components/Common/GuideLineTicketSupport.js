import React, { useState } from "react"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import ReactTooltip from 'react-tooltip'
import IconGuideLineTicket from "assets/img/icon/Icon_guideline_ticket.svg"
import IconClose from "assets/img/icon/icon_x.svg"
 
const GuideLineTicketSupport = (props) => {
  const { t } = useTranslation()
  const [isShow, setIsShow] = useState(false)

  const onHide = () => {
    setIsShow(false)
  }

  const handleShowGuideLineTicketPopup = () => {
    setIsShow(true)
  }

  const handleCopy = (text) => {
    if (!text) {
      return
    }
    navigator.clipboard.writeText(text)
  }

  return (
    <>
    <button className="guide-line-ticket" onClick={handleShowGuideLineTicketPopup}><img src={IconGuideLineTicket} alt="Guide line ticket" /></button>
    <Modal
      show={isShow}
      onHide={onHide}
      className="guide-line-ticket-modal"
    >
      <Modal.Body className='rounded'>
        <div className="header">
          <div className='text-title text-uppercase'>{t("SupportEmailBoxes")}</div>
          <span className="close" onClick={onHide}><img src={IconClose} alt="Close" /></span>
        </div>
        <div className='content'>
          <div className="note">
            <span>1. {t("PleaseEmailTo")}</span>&nbsp;
            <span 
              data-tip data-for={`mail-it-vingroup`} 
              className="highlight" 
              onClick={() => handleCopy('it@vingroup.net')}>
              <ReactTooltip 
                  id={`mail-it-vingroup`} 
                  delayHide={600}
                  afterShow={() => {
                    ReactTooltip.hide()
                  }}
                  event="click" 
                  scrollHide 
                  isCapture 
                  globalEventOff="click" 
                  effect="solid" 
                  place="right" 
                  type='dark'>
                  {t("Copied")}: it@vingroup.net
              </ReactTooltip>
              it@vingroup.net
            </span>&nbsp;
            <span>{t("WithSubjectIncludeKeyword")}</span><br />
            <span 
              data-tip data-for={`ilovevingroup-keyword`} 
              className="highlight" 
              onClick={() => handleCopy('ILOVEVINGROUP')}>
              <ReactTooltip 
                  id={`ilovevingroup-keyword`} 
                  delayHide={600}
                  afterShow={() => {
                    ReactTooltip.hide()
                  }}
                  event="click" 
                  scrollHide 
                  isCapture 
                  globalEventOff="click" 
                  effect="solid" 
                  place="right" 
                  type='dark'>
                  {t("Copied")}: ILOVEVINGROUP
              </ReactTooltip>
              [ILOVEVINGROUP]
            </span>,&nbsp;
            <span>{t("SubContentSupportILV")}</span>
          </div>
          <div className="note">
            <span>2. {t("PleaseEmailTo")}</span>&nbsp;
            <span 
              data-tip data-for={`mail-sap-hcm`} 
              className="highlight" 
              onClick={() => handleCopy('sap.hcm@vingroup.net')}>
              <ReactTooltip 
                  id={`mail-sap-hcm`} 
                  delayHide={600}
                  afterShow={() => {
                    ReactTooltip.hide()
                  }}
                  event="click" 
                  scrollHide 
                  isCapture 
                  globalEventOff="click" 
                  effect="solid" 
                  place="right" 
                  type='dark'>
                  {t("Copied")}: sap.hcm@vingroup.net
              </ReactTooltip>
              sap.hcm@vingroup.net
            </span>&nbsp;
            <span>{t("WithSubjectIncludeKeyword")}</span><br />
            <span>OM/PA/TM</span>,&nbsp;
            <span>{t("SubContentSupportSAP")}</span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default GuideLineTicketSupport
