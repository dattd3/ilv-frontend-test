import { useState, useEffect } from "react"
import { Tabs, Tab } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../commons/Constants'
import { getRequestConfigurations } from '../../commons/Utils'
import { useGuardStore } from '../../modules'
import LoadingModal from 'components/Common/LoadingModal'
import HOCComponent from 'components/Common/HOCComponent'
import NoticeTabContent from "./NoticeTabContent"
import VoucherTabContent from "./VoucherTabContent"

const tabMapping = {
    valid: 'valid',
    invalid: 'invalid',
    used: 'used',
    notification: 'notification',
}

const MyVoucher = (props) => {
    const { t } = useTranslation()
    const [keyword, setKeyword] = useState('')
    const [activeTab, setActiveTab] = useState(new URLSearchParams(props?.history?.location?.search).get('tab') || tabMapping.valid)
    // const guard = useGuardStore()
    // const user = guard.getCurentUser()

    const handleInputChange = e => {
        setKeyword(e?.target?.value || '')
    }

    const handleChangeTab = key => {
        setActiveTab(key)
        props.history.push('?tab=' + key)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
    }

    return (
        <div className="my-voucher-page">
            <h1 className="content-page-header">{t("MyVoucher")}</h1>
            <div className="search-block">
                <form onSubmit={handleSearch}>
                    <input type="text" className="search-input shadow-customize" placeholder="Tìm kiếm Voucher" value={keyword || ""} onChange={handleInputChange} />
                </form>
            </div>
            <div className="shadow-customize content-block">
                <Tabs defaultActiveKey={activeTab} onSelect={key => handleChangeTab(key)}>
                    <Tab eventKey={tabMapping.valid} title={t("Còn hiệu lực")} className="tab-item">
                        <div className="tab-content">
                            <VoucherTabContent />
                        </div>
                    </Tab>
                    <Tab eventKey={tabMapping.invalid} title={t("Hết hiệu lực")} className="tab-item">
                        <div className="tab-content">
                            <VoucherTabContent />
                        </div>
                    </Tab>
                    <Tab eventKey={tabMapping.used} title={t("Đã sử dụng")} className="tab-item">
                        <div className="tab-content">
                            <VoucherTabContent />
                        </div>
                    </Tab>
                    <Tab eventKey={tabMapping.notification} title={t("Thông báo")} className="tab-item">
                        <div className="tab-content">
                            <NoticeTabContent activeTab={activeTab} />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export { tabMapping }
export default HOCComponent(MyVoucher)
