import React from "react";
import { Form, Button, Col, Row } from 'react-bootstrap';

class FormSearchComponent extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          month: (new Date()).getMonth() + 1,
          year: (new Date()).getFullYear()
        }
    }

    handleSubmitSearch = (e) => {
        this.props.search(this.state.month, this.state.year)
    }

    setMonthYear (e) {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    render() {
        const months = [1,2,3,4,5,6,7,8,9,10,11,12]
        const thisYear = (new Date()).getFullYear()
        const years = [0,1,2,3,4,5,6,7,8,9].map(index => thisYear - index)

        return (
            <div className="search-block">
            <h4 className="h4 title-search-block">chọn bảng lương tháng</h4>
            <Form className="search-form">
                <Form.Group as={Row}>
                <Col sm={4}>
                    <Form.Control as="select" name="month" value={this.state.month} onChange={this.setMonthYear.bind(this)}>
                        {months.map((month, index) => {
                            return <option key={index} value={month}>{'Tháng ' + month}</option>
                        })}
                    </Form.Control>
                </Col>
                <Col sm={4}>
                    <Form.Control as="select" name="year" value={this.state.year} onChange={this.setMonthYear.bind(this)}>
                        {years.map((year, index) => {
                            return <option key={index} value={year}>{'Năm ' + year}</option>
                        })}
                    </Form.Control>
                </Col>
                <Col sm={4} className="button-block">
                    <Button type="button" className="btn-submit" onClick={this.handleSubmitSearch}>Áp dụng</Button>
                </Col>
                </Form.Group>
            </Form>
            <hr />
            </div>
        )
    }
}

export default FormSearchComponent;
