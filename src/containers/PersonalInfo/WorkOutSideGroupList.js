import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { formatStringByMuleValue } from "../../commons/Utils"
import WorkOutSideGroupItem from './WorkOutSideGroupItem'
import ActionButtons from "./ActionButtons"
import IconAddWhite from "../../assets/img/icon/ic_btn_add_white.svg"

function WorkOutSideGroupList(props) {
    const { t } = useTranslation()
    const [errors, SetErrors] = useState({})

    const data = [1, 2]

    const handleSendRequest = () => {

    }

    const updateFilesToParent = () => {

    }

    return (
        <div className="work-outside-group-list">
            {
                (data || []).map((item, index) => (
                    <WorkOutSideGroupItem key={index} />
                ))
            }
            <div className="block-btn-add-company">
                <button><img src={IconAddWhite} alt="Add" /><span>Thêm công ty</span></button>
            </div>
            <ActionButtons errors={errors} sendRequests={handleSendRequest} updateFilesToParent={updateFilesToParent} />
      </div>
    )
}

export default WorkOutSideGroupList
