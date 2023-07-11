import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useGuardStore } from "modules/index"
import HOCComponent from "components/Common/HOCComponent"

function HistoryVinGroup(props) {
    const { t } = useTranslation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()

    return (
        <div>
            <iframe src="https://online.flippingbook.com/view/258545642/6/" style={{ width: '100%', height: '100vh' }}></iframe>
        </div>
    )
}

export default HOCComponent(HistoryVinGroup)
