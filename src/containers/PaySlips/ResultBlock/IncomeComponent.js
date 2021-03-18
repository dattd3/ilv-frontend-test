import React from "react"
import { IncomeTablesConfig } from './IncomeTableConfig';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useTranslation } from "react-i18next"

function TrTable(props) {
    return (
        <tr className={props.clsName}>
            <td className={props.tdclsName}><span className={props.spanclsName}>{props.rowIndex}</span></td>
            <td className="same-width">{(props.row.field && props.payslipCalculate[props.row.field]) ? parseInt(props.payslipCalculate[props.row.field]).toLocaleString() : null}</td>
            <td className="same-width">{(props.row.field && props.payslipCalculate[props.row.field + '_tax_included']) ? parseInt(props.payslipCalculate[props.row.field + '_tax_included']).toLocaleString() : null}</td>
            <td className="same-width">{(props.row.field && props.payslipCalculate[props.row.field + '_without_tax']) ? parseInt(props.payslipCalculate[props.row.field + '_without_tax']).toLocaleString() : null}</td>
        </tr>
    )
}

function IncomeComponent(props) {
    const { t } = useTranslation()
    const payslipCalculate = props.payslip.payslip_calculate
    let incomeTables = []
    switch (localStorage.getItem('companyCode')) {
        case 'V030':
            incomeTables = IncomeTablesConfig(t).Vinpearl
            break;
        case 'V096':
            incomeTables = IncomeTablesConfig(t).Vinsoftware
            break
        case 'V070':
        case 'V077':
            incomeTables = IncomeTablesConfig(t).VinFast
            break
        case 'V060':
            incomeTables = IncomeTablesConfig(t).Vinmec
            break
        case 'V073':
            incomeTables = IncomeTablesConfig(t).VinSmart
            break
            case 'V040':
            incomeTables = IncomeTablesConfig(t).VinHome
            break
            case 'V061':
            incomeTables = IncomeTablesConfig(t).VinSchool
            break
        default:
            incomeTables = IncomeTablesConfig(t).VinGroup
            break
    }
    return (
        <>
            <table id="payslip-download" className="income-information-table">
                <thead>
                    <tr>
                        <th className="title top-title text-uppercase" colSpan="4"> <span>c. {t("Income")}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="same-width title special color-black">{t("Items")}</td>
                        <td className="same-width title color-black">{t("TotalMonthlyIncome")}</td>
                        <td className="same-width title color-black">{t("Taxable")}</td>
                        <td className="same-width title color-black">{t("NonTaxable")}</td>
                    </tr>
                    {incomeTables.map((row, index) => {
                        return <>
                            <TrTable
                                row={row}
                                rowIndex={row.index + '.' + row.label}
                                tdclsName="special bold color-black"
                                spanclsName="root"
                                clsName="root"
                                payslipCalculate={payslipCalculate}
                            />
                            {row.level2.map((row2, index2) => {
                                const lv3Number = row2.isSkipLevel4 ? row2.level3.filter(rw3 => rw3.field && (payslipCalculate[rw3.field] || payslipCalculate[rw3.field + '_tax_included'] || payslipCalculate[rw3.field + '_without_tax'])).length : row2.level3.length
                                const lv2Label = lv3Number > 0 && !row2.isSkipSumLabel ? row2.label + ' = Sum (' + row.index + '.' + (index2 + 1) + '.1 : ' + row.index + '.' + (index2 + 1) + '.' + lv3Number + ')' : row2.label
                                let countIndex3 = 0
                                return <>
                                    <TrTable
                                        row={row2}
                                        rowIndex={row.index + '.' + (index2 + 1) + '. ' + lv2Label}
                                        tdclsName="special bold color-black"
                                        spanclsName="child-first"
                                        clsName="first"
                                        payslipCalculate={payslipCalculate}
                                    />
                                    {row2.level3.map((row3, index3) => {
                                        const lv4Number = row3.level4 ? row3.level4.filter(rw4 => rw4.field && (payslipCalculate[rw4.field] || payslipCalculate[rw4.field + '_tax_included'] || payslipCalculate[rw4.field + '_without_tax'])).length : 0
                                        const lv3Label = lv4Number > 0 && !row3.isSkipSumLabel ? row3.label + ' = Sum (' + row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '.1 : ' + row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '.' + lv4Number + ')' : row3.label

                                        if (row3.field && (row3.level4 || payslipCalculate[row3.field] || payslipCalculate[row3.field + '_tax_included'] || payslipCalculate[row3.field + '_without_tax'])) {
                                            countIndex3++
                                        }
                                        let countIndex4 = 0

                                        let lv3SplitLabel = "";
                                        if (lv4Number > 0) {
                                            countIndex4 = 0
                                            row3.level4.map((row4, index4) => {
                                                if (row4.field && (payslipCalculate[row4.field] || payslipCalculate[row4.field + '_tax_included'] || payslipCalculate[row4.field + '_without_tax'])) {
                                                    countIndex4++
                                                    if (row4.isSplit) {
                                                        lv3SplitLabel += " - " + row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '.' + countIndex4
                                                    }
                                                }
                                            })
                                        }
                                        countIndex4 = 0;

                                        return <>
                                            {row3.field && (row3.level4 || payslipCalculate[row3.field] || payslipCalculate[row3.field + '_tax_included'] || payslipCalculate[row3.field + '_without_tax']) ? <TrTable
                                                row={row3}
                                                rowIndex={row.index + '.' + (index2 + 1) + '.' + countIndex3 + '. ' + lv3Label + lv3SplitLabel}
                                                tdclsName={row3.level4 ? 'special bold color-black' : 'special'}
                                                spanclsName="child-third"
                                                clsName={row3.level4 ? 'second' : null}
                                                payslipCalculate={payslipCalculate}
                                            /> : null}
                                            {row3.level4 ? row3.level4.map((row4, index4) => {
                                                if (row4.field && (payslipCalculate[row4.field] || payslipCalculate[row4.field + '_tax_included'] || payslipCalculate[row4.field + '_without_tax'])) {
                                                    countIndex4++
                                                }
                                                return row4.field && (payslipCalculate[row4.field] || payslipCalculate[row4.field + '_tax_included'] || payslipCalculate[row4.field + '_without_tax']) ? <TrTable
                                                    row={row4}
                                                    rowIndex={row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '.' + countIndex4 + '. ' + row4.label}
                                                    tdclsName={'special'}
                                                    spanclsName="child-fourth"
                                                    clsName={null}
                                                    payslipCalculate={payslipCalculate}
                                                /> : null
                                            }) : null}
                                        </>
                                    })}
                                </>
                            })}

                        </>
                    })}
                </tbody>
            </table>
            <span>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-link pull-right mr-2"
                    table="payslip-download"
                    filename="SalaryInformation"
                    sheet="SalaryInformation"
                    buttonText="Tải xuống Excel"
                /></span>
        </>
    );
}

export default IncomeComponent
