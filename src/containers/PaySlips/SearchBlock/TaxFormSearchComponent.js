import React from "react";
import { withTranslation } from "react-i18next"
import { Form, Button, Col, Row } from 'react-bootstrap';
import Select from "react-select"
import Constants from '../../../commons/Constants'

class TaxFormSearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.currentLocale = localStorage.getItem("locale")
    
        this.state = {
          year: (new Date()).getFullYear()
        }
    }

    handleSubmitSearch = (e) => {
        const { month, year, currency } = this.state
        this.props.search(month, year, currency)
    }

    handleSelectChange = (e, name) => {
        this.setState({
            [name]: e?.value
        })
    }

    render() {
        const lang = localStorage.getItem("locale")
        const { t } = this.props
        const { year } = this.state
        const thisYear = (new Date()).getFullYear()
        const years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(index => {
            let yearCurrent = thisYear - index
            return {
                value: yearCurrent,
                label: `${ lang === Constants.LANGUAGE_VI ? t("Year") : "" } ${yearCurrent}`
            }
        })

        return (
            <div className="search-block">
            {/* <h4 className="h4 title-search-block">{t("SelectMonth")}</h4> */}
            <Form className="search-form">
                <Form.Group as={Row}>
                <Col sm={4}>
                    <Form.Label>{t("YearCapitalize")}</Form.Label>
                    <Select
                        className="text-capitalize"
                        placeholder={t("Select")}
                        options={years}
                        onChange={e => this.handleSelectChange(e, 'year')}
                        value={years.find((item) => item?.value == year)}
                        styles={{
                            indicatorSeparator: () => ({ display: "none" }),
                        }}
                    />
                </Col>
                <Col sm={4} className="button-block">
                    <Form.Label>&nbsp;</Form.Label>
                    <Button type="button" className="btn-submit" onClick={this.handleSubmitSearch}>{t("Search")}</Button>
                </Col>
                </Form.Group>
            </Form>
            </div>
        )
    }
}

export default withTranslation()(TaxFormSearchComponent);
