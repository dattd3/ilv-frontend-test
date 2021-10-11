import React from "react"
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next"

function MainResultComponent(props) {
    const { t } = useTranslation();

    return (
        <div className="main-result-section" id="wage-type">
            <div className="block-title">
                <div className="block-label">
                    <h4 className="title bold special">{t("PaySlipMonth")}</h4>
                    <h4 className="title">{`${t("PeriodMonth")} ${props.personalInformation.month}/${props.personalInformation.year}`}</h4>
                </div>
            </div>
            <Row>
                <Col sm={5} className="column">
                    <ul className="column-item first-column">
                        <li><span className="label">{t("FullName")}:</span><span>{props.personalInformation.name}</span></li>
                        <li><span className="label">{t("EmployeeNo")}:</span><span>{props.personalInformation.personal_number}</span></li>
                        <li><span className="label">{t("ActualGrade")}:</span><span>{props.personalInformation.employee_level}</span></li>
                        <li><span className="label">{t("Title")}:</span><span>{props.personalInformation.position}</span></li>
                        <li><span className="label">{t("BankAccountNumber")}:</span><span>{props.personalInformation.bank_number}</span></li>
                        {/* <li><span className="label">Ngày làm việc cuối cùng:</span><span>{props.personalInformation.lasting_working_date}</span></li> */}
                    </ul>
                </Col>
                <Col sm={7} className="column">
                    <ul className="column-item second-column">
                        <li><span className="label">{t("WorkStartDate")}:</span><span>{props.personalInformation.hiring_date ? props.personalInformation.hiring_date : null}</span></li>
                        <li><span className="label">{t("TitleGrade")}:</span><span>{props.personalInformation.position_level}</span></li>
                        <li><span className="label">{t("BenefitGrade")}:</span><span>{props.personalInformation.c_and_b_level}</span></li>
                        <li><span className="label">Ban/Phòng/Bộ phận:</span><span>{props.personalInformation.division_department}</span></li>
                        <li><span className="label">{t("Bank")}:</span><span>{props.personalInformation.bank}</span></li>
                        {/* <li><span className="label">Ngày nghỉ việc:</span><span>{props.personalInformation.termination_date}</span></li> */}
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default MainResultComponent;
