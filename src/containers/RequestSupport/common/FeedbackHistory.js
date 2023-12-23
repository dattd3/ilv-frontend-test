import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import purify from "dompurify"
import moment from 'moment'
import { feedBackLine } from "../Constant"
import IconEmailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconEmailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconEmailCyan from 'assets/img/icon/ic_mail-cyan.svg'
import IconDownload from 'assets/img/ic_download_red.svg'
import IconExpand from 'assets/img/icon/ic_expand_grey.svg'
import IconCollapse from 'assets/img/icon/ic_collapse_grey.svg'
import IconCollapseBlue from 'assets/img/icon/ic_collapse_blue.svg'
import IconExpandGreen from 'assets/img/icon/ic_expand_green.svg'

import '../../../assets/css/ck-editor5.css'

const FeedbackHistoryItem = ({ index, fullName, ad, company, time, message, colorLine, files, isExpanded, handleExpanded }) => {
    const statusIconMapping = {
        [feedBackLine.requester]: IconEmailCyan,
        [feedBackLine.receiveInformationTogether]: IconEmailBlue,
        [feedBackLine.sameGroup]: IconEmailGreen,
    }

    const saveAttachments = () => {

    }

    return (
        <div className="d-flex justify-content-between item">
            <div className="d-inline-flex align-items-baseline left">
                <span className="icon"><img src={statusIconMapping[colorLine]} alt="Mail" /></span>
                <div className="d-flex flex-column content">
                    <div className="author"><span className="font-weight-bold">{fullName}</span> ({ad}-{company}) - {time}</div>
                    { isExpanded && (
                        <div 
                            className="comment ck ck-content"
                            dangerouslySetInnerHTML={{
                            __html: purify.sanitize(message || ''),
                            }}
                        />
                    )}
                    <span className="cursor-pointer action" onClick={() => handleExpanded(index, !isExpanded)}><img src={isExpanded ? IconCollapse : IconExpand} alt="Action" />{isExpanded ? 'Rút gọn' : 'Xem chi tiết'}</span>
                </div>
            </div>
            {
                files?.length && (
                    <div className="right">
                        <button className="btn-download" onClick={saveAttachments}><img src={IconDownload} alt="Download" />Tải về tệp tin</button>
                    </div>
                )
            }
        </div>
    )
}

const FeedbackHistory = ({ feedbacks }) => {
    const { t } = useTranslation()
    const [feedbackData, setFeedbackData] = useState({})

    useEffect(() => {
        feedbacks && setFeedbackData(feedbacks)
    }, [feedbacks])

    const handleExpanded = (index, status) => {
        const feedbackListClone = {...feedbackData}
        feedbackListClone.data = (feedbackListClone?.data || []).map((item, _index) => {
            return {
                ...item,
                isExpanded: (index === null || index === undefined) ? status : _index == index ? status : (item?.isExpanded || false),
            }
        })

        setFeedbackData(feedbackListClone)
    }

    return (
        <>
            {
                feedbackData?.data?.length > 0 && (
                    <div className="feedback-history-block">
                        <h5 className="font-weight-bold title-block">Lịch sử phản hồi </h5>
                        <div className="d-flex align-items-center expanded-collapsed-button">
                            <button className="d-inline-flex justify-content-center align-items-center btn collapsed" onClick={() => handleExpanded(null, false)}><img src={IconCollapseBlue} alt="collapsed" />Thu gọn</button>
                            <button className="d-inline-flex justify-content-center align-items-center btn expanded" onClick={() => handleExpanded(null, true)}><img src={IconExpandGreen} alt="expanded" />Mở rộng</button>
                        </div>
                        <div className="history">
                            {
                                (feedbackData?.data || []).map((item, index) => {
                                    let userInfo = JSON.parse(item?.createdInfo || '{}')
                                    let shortenedOrg = [userInfo?.shortenedOrgLevel2Name || '', userInfo?.shortenedOrgLevel3Name || '', userInfo?.shortenedOrgLevel4Name || '']
                                    .filter(name => name).join('-')

                                    return (
                                        <FeedbackHistoryItem 
                                            key={index}
                                            index={index}
                                            fullName={userInfo?.fullName}
                                            ad={userInfo?.ad}
                                            company={shortenedOrg}
                                            time={moment(item?.createdDate).isValid() ? moment(item?.createdDate).format("DD/MM/YYYY | HH:mm:ss") : ''}
                                            message={item?.contents}
                                            colorLine={item?.colorLine}
                                            files={item?.supportDocuments}
                                            isExpanded={item?.isExpanded || false}
                                            handleExpanded={handleExpanded}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
        </>
    ) 
}

export default FeedbackHistory
