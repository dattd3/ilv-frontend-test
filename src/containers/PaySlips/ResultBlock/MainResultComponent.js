import React from "react"
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next"

function MainResultComponent(props) {
    const { t } = useTranslation();
    const personalInformation = props.personalInformation

    return (
        <div className="main-result-section" id="wage-type">
            <div className="block-title">
                <div className="block-label">
                    <h4 className="title bold special">{t("PaySlipMonth")}</h4>
                    <h4 className="title" style={{margin: '10px 0 0 0'}}>{`${t("PeriodMonth")} ${personalInformation.month}/${personalInformation.year}`}</h4>
                </div>
            </div>
            <Row>
                <Col sm={5} className="column">
                    <ul className="column-item first-column">
                        <li><span className="label">{t("FullName")}:</span><span>{personalInformation.name}</span></li>
                        <li><span className="label">{t("EmployeeNo")}:</span><span>{personalInformation.personal_number}</span></li>
                        <li><span className="label">{t("ActualGrade")}:</span><span>{personalInformation.employee_level}</span></li>
                        <li><span className="label">{t("Title")}:</span><span>{personalInformation.position}</span></li>
                        <li><span className="label">{t("BankAccountNumber")}:</span><span>{personalInformation.bank_number}</span></li>
                        {/* <li><span className="label">Ngày làm việc cuối cùng:</span><span>{personalInformation.lasting_working_date}</span></li> */}
                    </ul>
                </Col>
                <Col sm={7} className="column">
                    <ul className="column-item second-column">
                        <li><span className="label">{t("WorkStartDate")}:</span><span>{personalInformation.hiring_date || null}</span></li>
                        <li><span className="label">{t("TitleGrade")}:</span><span>{personalInformation.position_level}</span></li>
                        <li><span className="label">{t("BenefitGrade")}:</span><span>{personalInformation.c_and_b_level}</span></li>
                        <li><span className="label">{t("DepartmentSalary")}:</span><span>{personalInformation.division_department}</span></li>
                        <li><span className="label">{t("Bank")}:</span><span>{personalInformation.bank}</span></li>
                        {/* <li><span className="label">Ngày nghỉ việc:</span><span>{personalInformation.termination_date}</span></li> */}
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default MainResultComponent;
