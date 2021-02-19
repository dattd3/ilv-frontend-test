import React from "react"
import { IncomeTablesConfig } from './IncomeTableConfig';

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
    const payslipCalculate = props.payslip.payslip_calculate
    let incomeTables = []
    switch (localStorage.getItem('companyCode')) {
        case 'V030':
            incomeTables = IncomeTablesConfig.Vinpearl
            break;
        case 'V096':
            incomeTables = IncomeTablesConfig.Vinsoftware
            break
        case 'V070':
            incomeTables = IncomeTablesConfig.VinFast
            break
        case 'V060':
            incomeTables = IncomeTablesConfig.Vinmec
            break
        default:
            incomeTables = IncomeTablesConfig.Vinpearl
            break
    }

    return (
        <>
            <table className="income-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="4">c. thông tin thu nhập</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="same-width title special color-black">Tên mục</td>
                        <td className="same-width title color-black">Tổng thu nhập tháng</td>
                        <td className="same-width title color-black">Chịu thuế</td>
                        <td className="same-width title color-black">Không chịu thuế</td>
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
                                        let countIndex4 = 0
                                        return <>
                                            {row3.field && (row3.level4 || payslipCalculate[row3.field] || payslipCalculate[row3.field + '_tax_included'] || payslipCalculate[row3.field + '_without_tax']) ? <TrTable
                                                row={row3}
                                                rowIndex={row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '. ' + lv3Label}
                                                tdclsName={row3.level4 ? 'special bold color-black' : 'special'}
                                                spanclsName="child-third"
                                                clsName={row3.level4 ? 'second' : null}
                                                payslipCalculate={payslipCalculate}
                                            /> : null}
                                            {row3.level4 ? row3.level4.map((row4, index4) => {
                                                if(row4.field && (payslipCalculate[row4.field] || payslipCalculate[row4.field + '_tax_included'] || payslipCalculate[row4.field + '_without_tax']))
                                                {
                                                    countIndex4 ++
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
        </>
    );
}

export default IncomeComponent
