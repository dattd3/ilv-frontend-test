import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { groupUsersConfig } from ".."
import IconEmailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconEmailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconEmailCyan from 'assets/img/icon/ic_mail-cyan.svg'
import IconDownload from 'assets/img/ic_download_red.svg'
import IconExpand from 'assets/img/icon/ic_expand_grey.svg'
import IconCollapse from 'assets/img/icon/ic_collapse_grey.svg'

const FeedbackHistoryItem = ({ fullName, ad, company, time, message, statusCode }) => {
    const statusIconMapping = {
        0: IconEmailGreen,
        1: IconEmailBlue,
        2: IconEmailCyan,
    }

    const [expanded, setExpanded] = useState(false)

    return (
        <div className="d-flex justify-content-between item">
            <div className="d-inline-flex align-items-baseline left">
                <span className="icon"><img src={statusIconMapping[statusCode]} alt="Mail" /></span>
                <div className="d-flex flex-column content">
                    <div className="author"><span className="font-weight-bold">{fullName}</span> ({ad}-{company}) - {time}</div>
                    { expanded && (<div className="comment">{message}</div>) }
                    <span className="cursor-pointer action" onClick={() => setExpanded(!expanded)}><img src={expanded ? IconCollapse : IconExpand} alt="Action" />{expanded ? 'Rút gọn' : 'Xem chi tiết'}</span>
                </div>
            </div>
            <div className="right">
                <button className="btn-download"><img src={IconDownload} alt="Download" />Tải về tệp tin</button>
            </div>
        </div>
    )
}

const FeedbackHistory = (props) => {
    const { t } = useTranslation()
    const lstItems = [{}, {}, {}]
 
    return (
        <div className="feedback-history-block">
            <h5 className="font-weight-bold title-block">Lịch sử phản hồi </h5>
            <div className="d-flex align-items-center expanded-collapsed-button">
                <button className="d-inline-flex justify-content-center align-items-center btn collapsed">Thu gọn</button>
                <button className="d-inline-flex justify-content-center align-items-center btn expanded">Mở rộng</button>
            </div>
            <div className="history">
                {
                    (lstItems || []).map((item, index) => (
                        <FeedbackHistoryItem 
                            key={index}
                            fullName={index === 0 ? 'Lê Đình Hoàng' : index === 1 ? 'Hoàng Tú Dũng' : 'Nguyễn Văn An'}
                            ad={index === 0 ? 'hoangld2' : index === 1 ? 'dunght12' : 'annv1'}
                            company={'CTVIS'}
                            time={'25/10/2023 | 12:30:00'}
                            message={'Yêu cầu của bạn đã được xử lý'}
                            statusCode={index === 0 ? 0 : index === 1 ? 1 : 2}
                        />
                    ))
                }
            </div>
        </div>
    ) 
}

export default FeedbackHistory
