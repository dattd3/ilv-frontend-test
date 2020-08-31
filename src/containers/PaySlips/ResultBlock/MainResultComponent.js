import React from "react"
import { Col, Row } from 'react-bootstrap'
import moment from 'moment'


function MainResultComponent(props) {
    return (
        <div className="main-result-section">
            <div className="block-title">
                <h4 className="title bold special">thông tin thu nhập tháng</h4>
                <h4 className="title">{`kỳ lương tháng ${props.personalInformation.month}/${props.personalInformation.year}`}</h4>
            </div>
            <Row>
                <Col sm={5} className="column">
                    <ul className="column-item first-column">
                        <li><span className="label">Họ và tên:</span><span>{props.personalInformation.name}</span></li>
                        <li><span className="label">Mã nhân viên:</span><span>{props.personalInformation.personal_number}</span></li>
                        <li><span className="label">Cấp bậc thực tế:</span><span>{props.personalInformation.employee_level}</span></li>
                        <li><span className="label">Chức danh:</span><span>{props.personalInformation.position}</span></li>
                        <li><span className="label">Số tài khoản:</span><span>{props.personalInformation.bank_number}</span></li>
                        {/* <li><span className="label">Ngày làm việc cuối cùng:</span><span>{props.personalInformation.lasting_working_date}</span></li> */}
                    </ul>
                </Col>
                <Col sm={7} className="column">
                    <ul className="column-item second-column">
                        <li><span className="label">Ngày bắt đầu làm việc:</span><span>{moment(props.personalInformation.hiring_date).format('DD/MM/YYYY')}</span></li>
                        <li><span className="label">Cấp bậc chức danh:</span><span>{props.personalInformation.position_level}</span></li>
                        <li><span className="label">Cấp hàm:</span><span>{props.personalInformation.c_and_b_level}</span></li>
                        <li><span className="label">Ban/Phòng/Bộ phận:</span><span>{props.personalInformation.division_department}</span></li>
                        <li><span className="label">Ngân hàng:</span><span>{props.personalInformation.bank}</span></li>
                        {/* <li><span className="label">Ngày nghỉ việc:</span><span>{props.personalInformation.termination_date}</span></li> */}
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default MainResultComponent;
