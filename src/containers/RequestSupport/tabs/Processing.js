import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import HOCComponent from 'components/Common/HOCComponent'
import IconMailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconMailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconMailYellow from 'assets/img/icon/ic_mail-yellow.svg'
 
const Processing = (props) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)

    const handleChangeTab = key => {
        // setTabActivated(key)
        props.history.push('?tab=' + key)
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="request-support-page">

            </div>
        </>
    )
}

export default Processing
