import { useState, useEffect } from "react"
import axios from 'axios'
import { tabMapping } from "."
import { getRequestConfigurations } from '../../commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import VoucherItem from "./VoucherItem"

const VoucherTabContent = ({ activeTab }) => {
    const [isLoading, SetIsLoading] = useState(false)
    const [vouchers, setVouchers] = useState({
        total: 4,
        listVouchers: [
            {
                id: 1,
                name: 'Thẻ xanh mua sắm - Gắn kết niềm vui',
                startDate: '16/11/2023',
                endDate: '20/11/2023',
                address: 'Vincom Mega Mall Ocean Park',
            },
            {
                id: 2,
                name: 'Vui hè rực rỡ - Ưu đãi bất ngờ',
                startDate: '16/11/2023',
                endDate: '20/11/2023',
                address: 'Vincom Mega Mall Ocean Park',
            },
            {
                id: 3,
                name: 'Tưng bừng khai trương - Voucher 100.000',
                startDate: '16/11/2023',
                endDate: '20/11/2023',
                address: 'Vincom Mega Mall Ocean Park',
            },
            {
                id: 4,
                name: 'Phiếu giảm giá 200.000',
                startDate: '16/11/2023',
                endDate: '20/11/2023',
                address: 'Vincom Mega Mall Ocean Park',
            }
        ],
    })
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
    })

    useEffect(() => {   
        const fetchListVouchers = async (tab) => {
            SetIsLoading(true)
            try {
                // const config = getRequestConfigurations()
                // config.params = {
                //     page: 1,
                //     size: 10,
                // }
                // const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/list-notify`, config)
                // if (response?.data?.data) {
                //     setNotices({
                //         total: response?.data?.data?.total || 0,
                //         listNotices: response?.data?.data?.data || [],
                //     })
                // }
            } finally {
                SetIsLoading(false)
            }
        }
    
        fetchListVouchers(activeTab)
    }, [activeTab])

    return (
        <>
            <LoadingModal show={isLoading} />
            {
                (vouchers.listVouchers || []).map((voucher, index) => {
                    return (
                        <VoucherItem
                            key={`${activeTab}-${index}`}
                            voucher={voucher}
                        />
                    )
                })
            }
        </>
    )
}

export default VoucherTabContent
