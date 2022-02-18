import React from "react"
import { useTranslation } from "react-i18next"
import { Image } from 'react-bootstrap'

import IconCancel from '../../../assets/img/icon/Icon_Cancel.svg'
import IconCheck from '../../../assets/img/icon/Icon_Check.svg'

function ButtonComponent(props) {
    const { t } = useTranslation()
    // const { rsmBusinessOwners } = props

    const handleApply = () => {
        props.handleApply()
    }

    return (
        <div className="button-block">
            <button className="button cancel"><Image src={IconCancel} alt="Hủy" />Hủy</button>
            <button className="button apply" onClick={handleApply}><Image src={IconCheck} alt="Ứng tuyển" />Ứng tuyển </button>
        </div>
    )
}

export default ButtonComponent
