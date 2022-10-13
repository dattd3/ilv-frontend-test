import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import moment from 'moment'
import { useCountdown } from '../../commons/hooks'
import IconReject from '../../assets/img/icon/Icon_Cancel.svg'
import IconCheck from '../../assets/img/icon/Icon_Check_White.svg'

const tokenTimeExpireStorage = localStorage.getItem('tokenExpired')

const WarningTokenModal = ({isShow, type, title, content, handleHideModal, handleAccept}) => {
    const warning = 0
    const tokenTimeExpired = moment(tokenTimeExpireStorage, 'YYYYMMDDHHmmss').valueOf()
    const [minutes, seconds] = useCountdown(tokenTimeExpired)
    const [isDisableOkButton, setIsDisableOkButton] = React.useState(false)

    React.useEffect(() => {
        setIsDisableOkButton(false)
    }, [isShow])

    const handleClickOkButton = () => {
        setIsDisableOkButton(true)
        handleAccept(type)
    }

    return (
        <Modal
            show={isShow}
            onHide={() => handleHideModal(false)}
            className='warning-token-expired-modal'
            backdrop="static" 
            keyboard={false}
        >
        <Modal.Body className='rounded'>
            <div className='text-title'>{title}</div>
            <div className='content'>{type === warning ? `Phiên làm việc của bạn sẽ hết hạn sau ${minutes}:${seconds} phút. Bạn có muốn gia hạn phiên làm việc?` : content}</div>
            <div className='text-right form-button-group'>
            {
                type === warning 
                && <Button
                    className='button-cancel d-inline-flex align-items-center justify-content-center'
                    onClick={() => handleHideModal(true)}
                    >
                    <Image src={IconReject} alt='Không' className='ic-status' />
                    Hủy
                    </Button>
            }
            <Button
                className='button-approve d-inline-flex align-items-center justify-content-center'
                onClick={handleClickOkButton}
                disabled={isDisableOkButton}
            >
                <Image src={IconCheck} alt='Đồng ý' className='ic-status' />
                Đồng ý
            </Button>
            </div>
        </Modal.Body>
        </Modal>
    )
}

export default WarningTokenModal
