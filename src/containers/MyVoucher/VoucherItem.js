import { useState } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { getRequestConfigurations } from '../../commons/Utils'
import { tabStatusMapping } from "."
import LoadingModal from 'components/Common/LoadingModal'
import IconQR from 'assets/img/icon/ic_qr.svg'
import IconVoucher from 'assets/img/icon/ic_voucher.svg'
import IconLocation from 'assets/img/icon/ic_location.svg'
import ModalQRCodes from "./ModalQRCodes"

const VoucherItem = ({ voucher, activeTab }) => {
    const currentEmployeeCode = localStorage.getItem('employeeNo')
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [modalQRCodes, setModalQRCodes] = useState({
        isShow: false,
        listQRs: [],
    })

    const handleShowQRs = async () => {
        SetIsLoading(true)
        try {
            const config = getRequestConfigurations()
            const payload = {
                employeeCode: currentEmployeeCode,
                voucherStatus: tabStatusMapping[activeTab],
                pageIndex: 1,
                pageSize: 20,
                stallId: voucher?.id,
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/3rd/tickets`, payload, config)

            if (response?.data?.data?.result?.data) {
                setModalQRCodes({
                    isShow: true,
                    listQRs: response?.data?.data?.result?.data || [],
                })
            }
        } catch (e) {
            setModalQRCodes({
                isShow: true,
                listQRs: [],
            })
        } finally {
            SetIsLoading(false)
        }
    }

    const onHideModal = () => {
        setModalQRCodes({
            isShow: false,
            listQRs: [],
        })
    }

    return (
        <>
            <LoadingModal show={isLoading} />
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
                            <span className="text">{voucher?.name?.trim() || ''}</span>
                        </div>
                        <div className="d-flex row-customize address">
                            <span className="img-block">
                                <img alt="Address" src={IconLocation } />
                            </span>
                            <span className="text">{t("ApplicableLocations")}: {voucher?.location}</span>
                        </div>
                    </div>
                    <div className="right">
                        <button className="d-inline-flex btn-view-qr" onClick={handleShowQRs}>
                            <img alt="View QR" src={IconQR} />{t("QRCode")}
                            <span className="count">{voucher?.voucherCount || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoucherItem
