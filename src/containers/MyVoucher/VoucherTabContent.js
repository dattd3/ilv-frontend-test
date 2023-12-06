import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { tabStatusMapping } from "."
import { getRequestConfigurations } from '../../commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import VoucherItem from "./VoucherItem"
import CustomPaging from "components/Common/CustomPaging"

const VoucherTabContent = ({ needLoadData, activeTab }) => {
    const listPageSizes = [10, 20, 30, 40, 50]
    const currentEmployeeCode = localStorage.getItem('employeeNo')
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [vouchers, setVouchers] = useState({
        total: 0,
        listVouchers: [],
    })
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
    })
    const [refresh, SetRefresh] = useState(false)

    const fetchListVouchers = async (pagingInput, _isSearching = false) => {
        SetIsLoading(true)
        try {
            const config = getRequestConfigurations()
            const payload = {
                employeeCode: currentEmployeeCode,
                voucherStatus: tabStatusMapping[activeTab],
                pageIndex: pagingInput ? pagingInput?.pageIndex : paging.pageIndex,
                pageSize: pagingInput ? pagingInput?.pageSize : paging.pageSize,
                search: (_isSearching || isSearching) ? keyword?.trim() : '',
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

    useEffect(() => {
        setIsSearching(false)
        setKeyword("")
        needLoadData && fetchListVouchers()
    }, [needLoadData, activeTab])

    const handleInputChange = e => {
        setKeyword(e?.target?.value || '')
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setIsSearching(true)
        const pagingInput = {
            pageIndex: 1,
            pageSize: paging.pageSize,
        }
        fetchListVouchers(pagingInput, true)
    }

    const handleChangePageSize = (pageSize) => {
        const pagingInput = {
            pageIndex: 1,
            pageSize: pageSize,
        }
        setPaging(pagingInput)
        fetchListVouchers(pagingInput, false)
    }

    const handleChangePage = (page) => {
        const pagingInput = {
            pageIndex: page,
            pageSize: paging.pageSize,
        }
        setPaging(pagingInput)
        fetchListVouchers(pagingInput)
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="search-block">
                <form className="d-flex" onSubmit={handleSearch}>
                    <input type="text" className="search-input" placeholder="Tìm kiếm" value={keyword || ""} onChange={handleInputChange} />
                    <button type="submit" className="btn-search">{t("Search")}</button>
                </form>
            </div>
            {
                vouchers?.listVouchers?.length > 0
                ? (
                    <>
                        {
                            (vouchers?.listVouchers || []).map((voucher, index) => {
                                return (
                                    <VoucherItem
                                        key={`${activeTab}-${index}`}
                                        voucher={voucher}
                                        activeTab={activeTab}
                                    />
                                )
                            })
                        }
                        <div className="d-flex align-items-center paging-region">
                            <div className="customize-display">
                                <label>{t("EvaluationShow")}</label>
                                <select value={paging.pageSize || listPageSizes[0]} onChange={(e) => handleChangePageSize(e?.target?.value)}>
                                    {
                                        listPageSizes.map((page, i) => {
                                            return <option value={page} key={i}>{page}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging 
                                    pageSize={parseInt(paging.pageSize)} 
                                    onChangePage={page => handleChangePage(page)} 
                                    totalRecords={vouchers?.total} 
                                    needRefresh={refresh} 
                                />
                            </div>
                        </div>
                    </>
                )
                : (<div className="alert alert-danger data-not-found">{t("NoDataFound")}</div>)
            }
        </>
    )
}

export default VoucherTabContent
