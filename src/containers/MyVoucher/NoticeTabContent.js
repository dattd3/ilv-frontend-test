import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { tabMapping } from "."
import { getRequestConfigurations } from '../../commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import NoticeItem from "./NoticeItem"
import CustomPaging from "components/Common/CustomPaging"

const NoticeTabContent = ({ activeTab }) => {
    const listPageSizes = [1, 20, 30, 40, 50]
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [notices, setNotices] = useState({
        total: 1,
        listNotices: [],
    })
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 1,
    })

    const fetchListNotices = async (pagingInput) => {
        SetIsLoading(true)
        try {
            const config = getRequestConfigurations()
            config.params = {
                page: pagingInput ? pagingInput?.pageIndex : paging.pageIndex,
                size: pagingInput ? pagingInput?.pageSize : paging.pageSize,
            }
            const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/list-notify`, config)
            if (response?.data?.data) {
                setNotices({
                    total: response?.data?.data?.total || 0,
                    listNotices: response?.data?.data?.data || [],
                })
            }
        } finally {
            SetIsLoading(false)
        }
    }

    useEffect(() => {   
        activeTab === tabMapping.notification && fetchListNotices()
    }, [activeTab])

    const handleChangePageSize = (pageSize) => {
        const pagingInput = {
            pageIndex: 1,
            pageSize: pageSize,
        }
        setPaging(pagingInput)
        fetchListNotices(pagingInput, false)
    }

    const handleChangePage = (page) => {
        const pagingInput = {
            pageIndex: page,
            pageSize: paging.pageSize,
        }
        setPaging(pagingInput)
        fetchListNotices(pagingInput)
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            {
                notices?.listNotices?.length > 0
                ? (
                    <>
                        {
                            (notices.listNotices || []).map((notice, index) => {
                                return (
                                    <NoticeItem
                                        key={`${activeTab}-${index}`}
                                        notice={notice}
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
                                    totalRecords={notices?.total} 
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

export default NoticeTabContent
