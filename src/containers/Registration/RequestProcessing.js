import React from 'react'
import { useTranslation } from "react-i18next"
import moment from 'moment'

const RequestProcessing = ({ createDate, assessedDate, approvedDate, updatedDate, deletedDate, operationType }) => {
    const { t } = useTranslation()

    return (
        <>
            <h5 className='content-page-header'>{t("RequestHistory")}</h5>
            <div className="box shadow request-processing">
                <div className="row group">
                    {
                      operationType && <div className="col-xl-3">
                        {t("operation")}
                        <div className="detail">
                          {t(`operationType.${operationType ? operationType?.toLowerCase() : "ins"}`)}
                        </div>
                      </div>
                    }
                    {
                        createDate && (
                            <div className='col-xl-4'>
                                {t("TimeToSendRequest")}
                                <div className="detail">{ createDate ? moment(createDate).format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                            </div>
                        )
                    }
                    {
                        assessedDate && (
                            <div className='col-xl-4'>
                                {t("ConsentDate")}
                                <div className="detail">{ assessedDate ? moment(assessedDate).format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                            </div>
                        )
                    }
                    {
                        approvedDate && (
                            <div className='col-xl-4'>
                                {t("ApprovalDate")}
                                <div className="detail">{ approvedDate ? moment(approvedDate).format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                            </div>
                        )
                    }
                    {
                        updatedDate && (
                            <div className='col-xl-4'>
                                {t("EditDate")}
                                <div className="detail">{ updatedDate ? moment(updatedDate).format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                            </div>
                        )
                    }
                    {
                        deletedDate && (
                            <div className='col-xl-4'>
                                {t('CancelDate')}
                                <div className="detail">{ deletedDate ? moment(deletedDate).format('DD/MM/YYYY | HH:mm:ss') : '' }</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default RequestProcessing
