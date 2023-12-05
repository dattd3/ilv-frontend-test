import { useState } from "react"
import { Tabs, Tab } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import HOCComponent from 'components/Common/HOCComponent'
import NoticeTabContent from "./NoticeTabContent"
import VoucherTabContent from "./VoucherTabContent"
import LoadingModal from "components/Common/LoadingModal"
import { getRequestConfigurations } from "commons/Utils"

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
    const currentEmployeeCode = localStorage.getItem('employeeNo')
    const { t } = useTranslation()
    const [keyword, setKeyword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(new URLSearchParams(props?.history?.location?.search).get('tab') || tabMapping.valid)
    const [vouchersSearched, setVouchersSearched] = useState(null)

    const handleInputChange = e => {
        setKeyword(e?.target?.value || '')
    }

    const handleChangeTab = key => {
        setActiveTab(key)
        setKeyword("")
        setVouchersSearched(null)
        props.history.push('?tab=' + key)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const config = getRequestConfigurations()
            const payload = {
                employeeCode: currentEmployeeCode,
                voucherStatus: tabStatusMapping[activeTab],
                pageIndex: 1,
                pageSize: 10,
                search: keyword?.trim(),
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/3rd/stalls`, payload, config)
            if (response?.data?.data?.result) {
                setVouchersSearched({
                    total: response?.data?.data?.result?.totalRecords || 0,
                    listVouchers: response?.data?.data?.result?.data || []
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="my-voucher-page">
                <h1 className="content-page-header">{t("MyVoucher")}</h1>
                <div className="search-block">
                    <form className="d-flex" onSubmit={e => handleSearch(e)}>
                        <input type="text" className="search-input shadow-customize" placeholder="Tìm kiếm Voucher" value={keyword || ""} onChange={handleInputChange} />
                        <button type="submit" className="btn-search">{t("Search")}</button>
                    </form>
                </div>
                <div className="shadow-customize content-block">
                    <Tabs defaultActiveKey={activeTab} onSelect={key => handleChangeTab(key)}>
                        <Tab eventKey={tabMapping.valid} title={t("Còn hiệu lực")} className="tab-item">
                            <div className="tab-content">
                                <VoucherTabContent 
                                    needLoadData={activeTab === tabMapping.valid && !vouchersSearched} 
                                    activeTab={activeTab} 
                                    vouchersSearched={vouchersSearched}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey={tabMapping.invalid} title={t("Hết hiệu lực")} className="tab-item">
                            <div className="tab-content">
                                <VoucherTabContent 
                                    needLoadData={activeTab === tabMapping.invalid && !vouchersSearched} 
                                    activeTab={activeTab} 
                                    vouchersSearched={vouchersSearched}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey={tabMapping.used} title={t("Đã sử dụng")} className="tab-item">
                            <div className="tab-content">
                                <VoucherTabContent 
                                    needLoadData={activeTab === tabMapping.used && !vouchersSearched} 
                                    activeTab={activeTab} 
                                    vouchersSearched={vouchersSearched}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey={tabMapping.notification} title={t("Thông báo")} className="tab-item">
                            <div className="tab-content">
                                <NoticeTabContent 
                                    activeTab={activeTab} 
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export { tabMapping, tabStatusMapping }
export default HOCComponent(MyVoucher)
