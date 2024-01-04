import { useState, useEffect } from "react"
import { Tabs, Tab } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import HOCComponent from 'components/Common/HOCComponent'
import CreatedReceiving from "./tabs/CreatedReceiving"
import Processing from "./tabs/Processing"
import { tabConfig } from "./Constant"
 
const RequestSupport = (props) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [masterData, setMasterData] = useState(null)
    const [tabActivated, setTabActivated] = useState(new URLSearchParams(props?.history?.location?.search).get('tab') || tabConfig.createdReceiving)

    useEffect(() => {
        const fetchMasterData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}api/support/masterdata`, getRequestConfigurations())
            setMasterData(response?.data?.data || null)
        }

        fetchMasterData()
    }, [])

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
                        <CreatedReceiving
                            masterData={masterData}
                            needLoadData={tabActivated === tabConfig.createdReceiving}
                            tab={tabConfig.createdReceiving}
                        />
                    </Tab>
                    <Tab eventKey={tabConfig.processing} title={t("Đang xử lý")}>
                        <Processing
                            masterData={masterData}
                            needLoadData={tabActivated === tabConfig.processing}
                            tab={tabConfig.processing}
                        />
                    </Tab>
                </Tabs>
            </div> 
        </>
    )
}

export default HOCComponent(RequestSupport)
