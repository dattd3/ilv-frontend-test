import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import purify from "dompurify"
import Constants from 'commons/Constants'
import { getRequestConfigurations } from '../../commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import '../../assets/css/ck-editor5.css'

const NoticeDetail = (props) => {
    const locale = localStorage.getItem("locale")
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [notice, setNotice] = useState(null)

    useEffect(() => {   
        const fetchListNotices = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/detail/${props?.match?.params?.id}`, config)
                setNotice(response?.data?.data || null)
            } finally {
                SetIsLoading(false)
            }
        }
    
        fetchListNotices()
    }, [])

    return (
        <>
            <LoadingModal show={isLoading} />
            {
                notice
                ? (
                    <div className="voucher-notice-detail">
                        <h1 className="content-page-header">{locale === Constants.LANGUAGE_VI ? notice?.titleVi : notice?.titleEn}</h1>
                        <div className="shadow-customize wrap-content">
                            <div className="ck ck-content" dangerouslySetInnerHTML={{
                                __html: purify.sanitize(locale === Constants.LANGUAGE_VI ? notice?.contentVi?.trim() : notice?.contentEn?.trim()),
                            }} />
                        </div>
                    </div>
                )
                : (<div className="alert alert-danger data-not-found" style={{ margin: 0, padding: 12, fontSize: 14 }}>{t("NoDataFound")}</div>)
            }
        </>
    )
}

export default NoticeDetail
