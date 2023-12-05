import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { tabMapping, tabStatusMapping } from "."
import { getRequestConfigurations } from '../../commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import VoucherItem from "./VoucherItem"

const VoucherTabContent = ({ needLoadData, activeTab, vouchersSearched }) => {
    const currentEmployeeCode = localStorage.getItem('employeeNo')
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [vouchers, setVouchers] = useState({
        total: 0,
        listVouchers: [],
    })
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
    })

    useEffect(() => {
        console.log("needLoadData ", needLoadData)
        const fetchListVouchers = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                const payload = {
                    employeeCode: currentEmployeeCode,
                    voucherStatus: tabStatusMapping[activeTab],
                    pageIndex: paging.pageIndex,
                    pageSize: paging.pageSize,
                    search: "",
                }
                const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/3rd/stalls`, payload, config)
                if (response?.data?.data?.result) {
                    setVouchers({
                        total: response?.data?.data?.result?.totalRecords || 0,
                        listVouchers: response?.data?.data?.result?.data || []
                    })
                }
            } finally {
                SetIsLoading(false)
            }
        }
    
        needLoadData && fetchListVouchers(activeTab)
    }, [needLoadData, activeTab])

    const voucherInfos = vouchersSearched ? vouchersSearched : vouchers

    return (
        <>
            <LoadingModal show={isLoading} />
            {
                voucherInfos?.listVouchers?.length > 0
                ? (
                    (voucherInfos?.listVouchers || []).map((voucher, index) => {
                        return (
                            <VoucherItem
                                key={`${activeTab}-${index}`}
                                voucher={voucher}
                                activeTab={activeTab}
                            />
                        )
                    })
                )
                : (<div className="alert alert-danger data-not-found">{t("NoDataFound")}</div>)
            }
        </>
    )
}

export default VoucherTabContent
