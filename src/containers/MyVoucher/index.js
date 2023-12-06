import { useState } from "react"
import { Tabs, Tab } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import HOCComponent from 'components/Common/HOCComponent'
import NoticeTabContent from "./NoticeTabContent"
import VoucherTabContent from "./VoucherTabContent"

const tabMapping = {
    valid: 'valid',
    invalid: 'invalid',
    used: 'used',
    notification: 'notification',
}

const tabStatusMapping = {
    valid: 0,
    invalid: 2,
    used: 1,
}

const MyVoucher = (props) => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState(new URLSearchParams(props?.history?.location?.search).get('tab') || tabMapping.valid)

    const handleChangeTab = key => {
        setActiveTab(key)
        props.history.push('?tab=' + key)
    }

    return (
        <div className="my-voucher-page">
            <h1 className="content-page-header">{t("MyVoucher")}</h1>
            <div className="shadow-customize content-block">
                <Tabs defaultActiveKey={activeTab} onSelect={key => handleChangeTab(key)}>
                    <Tab eventKey={tabMapping.valid} title={t("VoucherAvailable")} className="tab-item">
                        <div className="tab-content">
                            <VoucherTabContent 
                                needLoadData={activeTab === tabMapping.valid} 
                                activeTab={activeTab} 
                            />
                        </div>
                    </Tab>
                    <Tab eventKey={tabMapping.invalid} title={t("VoucherExpire")} className="tab-item">
                        <div className="tab-content">
                            <VoucherTabContent 
                                needLoadData={activeTab === tabMapping.invalid} 
                                activeTab={activeTab} 
                            />
                        </div>
                    </Tab>
                    <Tab eventKey={tabMapping.used} title={t("Used")} className="tab-item">
                        <div className="tab-content">
                            <VoucherTabContent 
                                needLoadData={activeTab === tabMapping.used} 
                                activeTab={activeTab} 
                            />
                        </div>
                    </Tab>
                    <Tab eventKey={tabMapping.notification} title={t("Notification")} className="tab-item">
                        <div className="tab-content">
                            <NoticeTabContent 
                                activeTab={activeTab} 
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export { tabMapping, tabStatusMapping }
export default HOCComponent(MyVoucher)
