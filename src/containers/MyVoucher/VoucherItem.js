import { useState, useEffect } from "react"
import { Tabs, Tab, Form, Button, Row, Col, Collapse } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../commons/Constants'
import { getRequestConfigurations } from '../../commons/Utils'
import { useGuardStore } from '../../modules'
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import HOCComponent from 'components/Common/HOCComponent'
import IconQR from 'assets/img/icon/ic_qr.svg'
import IconVoucher from 'assets/img/icon/ic_voucher.svg'
import IconClock from 'assets/img/icon/ic_clock.svg'
import IconLocation from 'assets/img/icon/ic_location.svg'
import ModalQRCodes from "./ModalQRCodes"

const VoucherItem = ({ voucher }) => {
    const tabMapping = {
        valid: 'valid',
        invalid: 'invalid',
        used: 'used',
        notification: 'notification',
    }
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [activeTab, setActiveTab] = useState(tabMapping.valid)
    const [modalQRCodes, setModalQRCodes] = useState({
        isShow: false,
        listQRs: [],
    })

    const guard = useGuardStore()
    const user = guard.getCurentUser()

    const handleShowQRs = (qrs = []) => {
        setModalQRCodes({
            isShow: true,
            listQRs: qrs,
        })
    }

    const onHideModal = () => {
        setModalQRCodes({
            isShow: false,
            listQRs: [],
        })
    }

    const qrs = [
        {
            code: '123456ABCDEF',
            image: "https://hrdx-dev.s3.ap-southeast-1.amazonaws.com/pms/qrcode_test.png"
        },
        {
            code: 'ZXASDFDGEG3123',
            image: "https://hrdx-dev.s3.ap-southeast-1.amazonaws.com/pms/qrcode_test.png"
        },
        {
            code: 'OGFILOJFRIO78987',
            image: "https://hrdx-dev.s3.ap-southeast-1.amazonaws.com/pms/qrcode_test.png"
        }
    ]

    return (
        <>
            <ModalQRCodes 
                isShowModal={modalQRCodes.isShow} 
                listQRs={modalQRCodes.listQRs}
                onHideModal={onHideModal}
            />
            <div className="voucher-item">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="left">
                        <div className="d-flex row-customize voucher">
                            <span className="img-block">
                                <img alt="Voucher" src={IconVoucher} />
                            </span>
                            <span className="text">{voucher?.name || ''}</span>
                        </div>
                        <div className="d-flex row-customize time">
                            <span className="img-block">
                                <img alt="Time" src={IconClock} />
                            </span>
                            <span className="text">Thời gian sử dụng: {voucher?.startDate} - {voucher?.endDate}</span>
                        </div>
                        <div className="d-flex row-customize address">
                            <span className="img-block">
                                <img alt="Address" src={IconLocation } />
                            </span>
                            <span className="text">Địa điểm áp dụng: {voucher?.address}</span>
                        </div>
                    </div>
                    <div className="right">
                        <button className="d-inline-flex btn-view-qr" onClick={() => handleShowQRs(qrs)}>
                            <img alt="View QR" src={IconQR} />Mã QR Code
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoucherItem
