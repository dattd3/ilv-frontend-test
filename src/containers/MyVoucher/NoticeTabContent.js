import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { tabMapping } from "."
import { getRequestConfigurations } from '../../commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import NoticeItem from "./NoticeItem"

const NoticeTabContent = ({ activeTab }) => {
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [notices, setNotices] = useState({
        total: 1,
        listNotices: [],
    })
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
    })

    useEffect(() => {   
        const fetchListNotices = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                config.params = {
                    page: 1,
                    size: 10,
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
    
        activeTab === tabMapping.notification && fetchListNotices()
    }, [activeTab])

    return (
        <>
            <LoadingModal show={isLoading} />
            {
                notices?.listNotices?.length > 0
                ? (
                    (notices.listNotices || []).map((notice, index) => {
                        return (
                            <NoticeItem
                                key={`${activeTab}-${index}`}
                                notice={notice}
                            />
                        )
                    })
                )
                : (<div className="alert alert-danger data-not-found">{t("NoDataFound")}</div>)
            }
        </>
    )
}

export default NoticeTabContent
