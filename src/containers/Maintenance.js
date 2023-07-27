import React, { useEffect, useState } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { getRequestConfigs } from "commons/commonFunctions"
import map from "containers/map.config"
import Constants from "commons/Constants"
import ApplicationImage from '../assets/img/application_name.svg'
import LoadingModal from "components/Common/LoadingModal"

export default function Maintenance(props) {
  const { t } = useTranslation()
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI

  useEffect(() => {
    const fetchMaintenanceInfo = async () => {
      setIsLoading(true)
      const config = getRequestConfigs()
      config.params = {
        appId: Constants.MAINTENANCE.APP_ID,
        device: Constants.MAINTENANCE.DEVICE,
        type: Constants.MAINTENANCE.MODE,
      }
      const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}api/guest/system`, config)
      setIsLoading(false)
      if (response?.data?.data?.maintainStatus) {
        setContent({
          [Constants.LANGUAGE_VI]: response?.data?.data?.maintainContentVi,
          [Constants.LANGUAGE_EN]: response?.data?.data?.maintainContentEn,
        })
      } else {
        window.location.href = map.Login
      }
    }

    fetchMaintenanceInfo()
  }, [])

  return (
    <>
    <LoadingModal show={isLoading} />
    <div className="maintenance-page">
      <div className="maintenance-content">
        <h1 className="title">{t('Announcement')}</h1>
        <div className="message-block">
          <Image src={ApplicationImage} alt="Application name" className="application-image" />
          <span className="message">{content && content[locale]}</span>
        </div>
      </div>
    </div>
    </>
  )
}
