import React, { useEffect, useState } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from "axios"
import { getRequestConfigurations, getCurrentLanguage } from "commons/Utils"
import { isJsonString } from "../../../utils/string"
import { prepareNews } from "./NewsUtils"
import NewsItemGrid from "./NewsItemGrid"
import IconDiamond from '../../../assets/img/icon/Icon-Diamond.svg'
import IconGift from '../../../assets/img/icon/Icon_gift_gray.svg'

export default function NewsRelation(props) {
    const lang = getCurrentLanguage()
    const { t } = useTranslation();
    const { id, isEmployeePrivilege } = props
    const [otherInfo, setOtherInfo] = useState(null)

    useEffect(() => {
        const fetchOthers = async () => {
            const config = getRequestConfigurations()
            config.params = {
                id: id,
                count: 4,
                ...(isEmployeePrivilege && { type: 'PRIVILEGE', culture: lang }),
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}article/listothers`, config)
                const otherInfoData = (response?.data?.data || []).map(item => ({
                    ...item,
                    title: isJsonString(item?.title) ? (JSON.parse(item?.title)?.[lang] || JSON.parse(item?.title)?.['vi']) : item?.title,
                    description: isJsonString(item?.description) ? (JSON.parse(item?.description)?.[lang] || JSON.parse(item?.description)?.['vi']) : item?.description,
                    thumbnail: isJsonString(item?.thumbnail) ? (JSON.parse(item?.thumbnail)?.[lang] || JSON.parse(item?.thumbnail)?.['vi']) : item?.thumbnail,
                }))
                setOtherInfo(otherInfoData)
            } finally {

            }
        }

        fetchOthers()
    }, [id])

    return (
        <div className="news-others">
            <h4 className="page-title"><Image src={isEmployeePrivilege ? IconGift : IconDiamond} alt="News" /><span style={{ marginTop: 4 }}>{isEmployeePrivilege ? t("OtherIncentives") : t("OtherNews") }</span></h4>
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
