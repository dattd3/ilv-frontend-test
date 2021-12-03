import React from "react"
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { formatStringByMuleValue } from "../../commons/Utils"

function EducationList(props) {
    const { t } = useTranslation()
    const { educations } = props

    return (
        <div>
            <Row className="info-label">
                <Col xs={12} md={6} lg={3}>{t("SchoolName")}</Col>
                <Col xs={12} md={6} lg={3}>{t("TypeOfDegree")}</Col>
                <Col xs={12} md={6} lg={3}>{t("Major")}</Col>
                <Col xs={12} md={6} lg={3}>{t("Cohort")}</Col>
            </Row>
            {
                educations && educations.length > 0 ?
                educations.map((item, i) => {
                    return <Row className="info-value" key={i}>
                        <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{formatStringByMuleValue(item.university_name) ? item.university_name : item.other_uni_name}</p>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{item.academic_level}</p>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{item.major_id === 0 ? item.other_major : item.major}</p>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{item.from_time} - {item.to_time}</p>
                        </Col>
                    </Row>
                })
                : t("NoDataFound")
            }
        </div>
    )
}

export default EducationList
