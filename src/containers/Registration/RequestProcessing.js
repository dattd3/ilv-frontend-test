import React from 'react'
import { useTranslation } from "react-i18next"
import moment from 'moment'

const RequestProcessing = ({ createDate, deletedDate, assessedDate, approvedDate }) => {
    const { t } = useTranslation()

    return (
        <>
            <h5 className='content-page-header'>{t("Quá trình xử lý yêu cầu")}</h5>
            <div className="box shadow request-processing">
                <div className="row group">
                <div className='col-xl-4'>
                    {t("Thời gian gửi yêu cầu")}
                    <div className="detail">{ createDate && moment(createDate, 'MM/DD/YYYY HH:mm').isValid() ? moment(createDate, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                </div>
                <div className='col-xl-4'>
                    {t("Thời gian thẩm định")}
                    <div className="detail">{ assessedDate && moment(assessedDate, 'MM/DD/YYYY HH:mm').isValid() ? moment(assessedDate, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                </div>
                <div className='col-xl-4'>
                    {t("Thời gian phê duyệt")}
                    <div className="detail">{ approvedDate && moment(approvedDate, 'MM/DD/YYYY HH:mm').isValid() ? moment(approvedDate, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                </div>
                </div>
                <div className="row group" style={{ marginTop: 10 }}>
                <div className='col-xl-4'>
                    {t('Thời gian hủy yêu cầu')}
                    <div className="detail">{ deletedDate && moment(deletedDate, 'MM/DD/YYYY HH:mm').isValid() ? moment(deletedDate, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                </div>
                </div>
            </div>
        </>
    )
}

export default RequestProcessing
