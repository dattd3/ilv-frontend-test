import React from "react";
import { withTranslation } from "react-i18next"
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
        const { t } = this.props
        const months = [
            {value: 1, label: "Jan"},
            {value: 2, label: "Feb"},
            {value: 3, label: "Mar"},
            {value: 4, label: "Apr"},
            {value: 5, label: "May"},
            {value: 6, label: "Jun"},
            {value: 7, label: "Jul"},
            {value: 8, label: "Aug"},
            {value: 9, label: "Sep"},
            {value: 10, label: "Oct"},
            {value: 11, label: "Nov"},
            {value: 12, label: "Dec"}
        ]
        const thisYear = (new Date()).getFullYear()
        const years = [0,1,2,3,4,5,6,7,8,9].map(index => thisYear - index)

        const lang = localStorage.getItem("locale")

        return (
            <div className="search-block">
            <h4 className="h4 title-search-block">{t("SelectMonth")}</h4>
            <Form className="search-form">
                <Form.Group as={Row}>
                <Col sm={4}>
                    <Form.Control as="select" name="month" value={this.state.month} onChange={this.setMonthYear.bind(this)}>
                        {months.map((month, index) => {
                            return <option key={index} value={month.value}>{t(month.label)}</option>
                        })}
                    </Form.Control>
                </Col>
                <Col sm={4}>
                    <Form.Control as="select" name="year" value={this.state.year} className="text-capitalize" onChange={this.setMonthYear.bind(this)}>
                        {years.map((year, index) => {
                            return <option key={index} value={year} className="text-capitalize">{`${lang === "vi-VN" ? t("Year") : ""} ` + year}</option>
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

export default withTranslation()(FormSearchComponent);
