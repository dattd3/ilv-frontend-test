import React from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import ApplicationImage from '../assets/img/application_name.svg'

export default function Maintenance({ location }) {
  const { t } = useTranslation()

  return (
    <div className="maintenance-page">
      <div className="maintenance-content">
        <h1 className="title">{t('Announcement')}</h1>
        <div className="message-block">
          <Image src={ApplicationImage} alt="Application name" className="application-image" />
          <span className="message">đang tiến hành nâng cấp và bảo trì hệ thống từ 19/05/2022 00:00 - 19/05/2022 10:00!</span>
        </div>
      </div>
    </div>
  )
}
