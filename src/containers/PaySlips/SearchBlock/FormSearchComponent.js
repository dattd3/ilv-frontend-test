import React from "react";
import { Form, Button, Col, Row } from 'react-bootstrap';

function FormSearchComponent(props) {

    const handleSubmitSearch = (e) => {

    }

    const monthData = [
        {value: 1, label: "Tháng 1 / 2020"},
        {value: 2, label: "Tháng 2 / 2020"},
        {value: 3, label: "Tháng 3 / 2020"}
    ]

    return (
        <div className="search-block">
        <h4 className="h4 title-search-block">chọn bảng lương tháng</h4>
        <Form className="search-form" onSubmit={handleSubmitSearch}>
            <Form.Group as={Row}>
            <Col sm={8}>
                <Form.Control as="select" name="month-input">
                    {monthData.map((vp, index) => {
                        return <option key={index} value={vp.value}>{vp.label}</option>
                    })}
                </Form.Control>
            </Col>
            <Col sm={4} className="button-block">
                <Button type="submit" className="btn-submit">Áp dụng</Button>
            </Col>
            </Form.Group>
        </Form>
        <hr />
        </div>
    );
}

export default FormSearchComponent;
