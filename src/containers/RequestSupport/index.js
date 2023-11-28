import React, { useState, useEffect } from "react"
import { Tabs, Tab } from 'react-bootstrap'
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
import CreatedReceiving from "./tabs/CreatedReceiving"
import Processing from "./tabs/Processing"

const tabConfig = {
    createdReceiving: 'created-receiving',
    processing: 'processing',
}

const groupUsersConfig = {
    sameGroup: { label: 'Người cùng nhóm', icon: IconMailGreen },
    receiveInformationTogether: { label: 'Người cùng nhận thông tin', icon: IconMailBlue },
    requester: { label: 'Người yêu cầu', icon: IconMailYellow },
}
 
const RequestSupport = (props) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [tabActivated, setTabActivated] = useState(new URLSearchParams(props?.history?.location?.search).get('tab') || tabConfig.createdReceiving)

    const handleChangeTab = key => {
        setTabActivated(key)
        props.history.push('?tab=' + key)
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="request-support-page">
                <Tabs defaultActiveKey={tabActivated} className={`tabs`} onSelect={key => handleChangeTab(key)}>
                    <Tab eventKey={tabConfig.createdReceiving} title={t("Đã tạo/Đang nhận thông tin")}>
                        <CreatedReceiving />
                    </Tab>
                    <Tab eventKey={tabConfig.processing} title={t("Đang xử lý")}>
                        <Processing />
                    </Tab>
                </Tabs>
            </div> 
        </>
    )
}

export { tabConfig, groupUsersConfig }
export default HOCComponent(RequestSupport)