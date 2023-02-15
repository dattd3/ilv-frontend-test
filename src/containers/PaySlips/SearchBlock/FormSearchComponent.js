import React from "react";
import { withTranslation } from "react-i18next"
import { Form, Button, Col, Row } from 'react-bootstrap';
import Select from "react-select"
import Constants from '../../../commons/Constants'
import { languageCurrencyMapping } from '../ResultBlock/IncomeComponent'

class FormSearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.currentLocale = localStorage.getItem("locale")
    
        this.state = {
          month: (new Date()).getMonth() + 1,
          year: (new Date()).getFullYear(),
          currency: languageCurrencyMapping[this.currentLocale]
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
        const { month, year, currency } = this.state
        const months = [
            {value: 1, label: t("Jan")},
            {value: 2, label: t("Feb")},
            {value: 3, label: t("Mar")},
            {value: 4, label: t("Apr")},
            {value: 5, label: t("May")},
            {value: 6, label: t("Jun")},
            {value: 7, label: t("Jul")},
            {value: 8, label: t("Aug")},
            {value: 9, label: t("Sep")},
            {value: 10, label: t("Oct")},
            {value: 11, label: t("Nov")},
            {value: 12, label: t("Dec")}
        ]
        const thisYear = (new Date()).getFullYear()
        const years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(index => {
            let yearCurrent = thisYear - index
            return {
                value: yearCurrent,
                label: `${ lang === Constants.LANGUAGE_VI ? t("Year") : "" } ${yearCurrent}`
            }
        })
        const currencyOptions = [
            { value: Constants.CURRENCY.VND, label: Constants.CURRENCY.VND },
            { value: Constants.CURRENCY.USD, label: Constants.CURRENCY.USD },
        ]

        return (
            <div className="search-block">
            {/* <h4 className="h4 title-search-block">{t("SelectMonth")}</h4> */}
            <Form className="search-form">
                <Form.Group as={Row}>
                <Col sm={3}>
                    <Form.Label>{t("Month")}</Form.Label>
                    <Select
                        className="text-capitalize"
                        placeholder={t("Select")}
                        options={months}
                        onChange={e => this.handleSelectChange(e, 'month')}
                        value={months.find((item) => item?.value == month)}
                        styles={{
                            indicatorSeparator: () => ({ display: "none" }),
                        }}
                    />
                </Col>
                <Col sm={3}>
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
                <Col sm={3}>
                    <Form.Label>{t("Currency")}</Form.Label>
                    <Select
                        placeholder={t("Select")}
                        options={currencyOptions}
                        onChange={e => this.handleSelectChange(e, 'currency')}
                        value={currencyOptions.find((item) => item?.value == currency)}
                        styles={{
                            indicatorSeparator: () => ({ display: "none" }),
                        }}
                    />
                </Col>
                <Col sm={3} className="button-block">
                    <Form.Label>&nbsp;</Form.Label>
                    <Button type="button" className="btn-submit" onClick={this.handleSubmitSearch}>{t("Search")}</Button>
                </Col>
                </Form.Group>
            </Form>
            </div>
        )
    }
}

export default withTranslation()(FormSearchComponent);
