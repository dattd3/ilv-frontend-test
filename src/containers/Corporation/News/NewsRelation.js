import React, { useEffect, useState } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from "axios"
import { getRequestConfigurations } from "commons/Utils"
import { prepareNews } from "./NewsUtils"
import NewsItemGrid from "./NewsItemGrid"
import IconDiamond from '../../../assets/img/icon/Icon-Diamond.svg'

export default function NewsRelation(props) {
    const { t } = useTranslation();
    const { id, isEmployeePrivilege } = props
    const [otherInfo, setOtherInfo] = useState(null)

    useEffect(() => {
        const fetchOthers = async () => {
            const config = getRequestConfigurations()
            config.params = {
                id: id,
                count: 4,
                // ...(isEmployeePrivilege && {type: 'PRIVILEGE'})
                type: isEmployeePrivilege ? 'PRIVILEGE' : ''
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}article/listothers`, config)
                setOtherInfo(response?.data?.data?.listPrivilege || [])
            } finally {

            }
        }

        fetchOthers()
    }, [id])

    return (
        <div className="news-others">
            <h4 className="page-title"><Image src={IconDiamond} alt="News" />{t("OtherNews")}</h4>
            <div className="row list-news">
                {
                    (otherInfo || []).map((item, i) => {
                        let news = isEmployeePrivilege ? item : prepareNews(item)
                        return <NewsItemGrid article={news} key={news.id} id={news.id} isEmployeePrivilege={isEmployeePrivilege} />
                    })
                }
            </div>
        </div>
    )
}
