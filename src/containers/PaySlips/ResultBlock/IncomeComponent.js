import React from "react"

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
    const incomeTables  = [
        {
            index: 'I',
            label: 'CÁC KHOẢN PHÁT SINH TĂNG THU NHẬP = Sum (I.1 : I.3)',
            field: 'income_accrued_amount',
            level2: [
                {
                    label: 'THU NHẬP CƠ BẢN',
                    field: 'base_income_amount',
                    level3: [
                        {
                            label: 'Lương cơ bản  + Thưởng YTCLCV',
                            field: 'base_salary_and_quality_of_work_bonus',
                            level4: [
                                {label: 'Lương cơ bản', field: 'base_salary'},
                                {label: 'Thưởng YTCLCV', field: 'quality_of_work_bonus'},
                                {label: 'Thưởng Tay nghề', field: 'professional_bonus'},
                                {label: 'Thưởng Service Charge', field: 'service_charge_bonus'}
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp chuyên môn/tay nghề', field: 'professional_allowance'},
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'},
                                {label: 'Phụ cấp chức vụ', field: 'position_allowance'},
                                {label: 'Phụ cấp nguy hiểm độc hại', field: 'dangerous_allowance'}
                            ]
                        },
                        {
                            label: 'Các khoản bổ sung khác (nếu có)',
                            field: 'additional_allowance',
                            level4: []
                        }
                    ]
                },
                {
                    label: 'CÁC KHOẢN THU NHẬP KHÁC',
                    field: 'other_income_amount',
                    level3: [
                        {
                            label: 'Tiền thưởng',
                            field: 'bonus_amount',
                            level4: [
                                {label: 'Thưởng ngoại ngữ', field: 'lingo_bonus'},
                                {label: 'Thưởng ngoại hình', field: 'good_looking_bonus'},
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus '},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'performance_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng giới thiệu ứng viên', field: 'reference_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng khác (GROSS)', field: 'other_gross_bonus'},
                                {label: 'Thưởng vượt khoán phòng', field: 'overtarget_bonus'},
                                {label: 'Thưởng Caddie Fee', field: 'caddie_fee_bonus'},
                                {label: 'Thưởng Công Trường', field: 'construction_site_bonus'},
                                {label: 'Quyết toán SC', field: 'SC_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance '},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance '},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ điều kiện sinh hoạt Vùng Phú Quốc', field: 'phu_quoc_region_allowance'},
                                {label: 'Hỗ trợ chuyển vùng', field: 'region_displace_allowance'},
                                {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Hỗ trợ công việc đặc thù VP', field: 'specific_work_allowance'},
                                {label: 'Hỗ trợ làm việc trên đảo tại Nha Trang', field: 'work_on_island_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Tiền lương làm đêm', field: 'night_shift_allowance'},
                                {label: 'Tiền thanh toán phép năm/nghỉ bù (nếu có)', field: 'annual_leave_payment'},
                                {label: 'Hỗ trợ/Thỏa thuận nghỉ việc', field: 'resignation_agreement_allowance'},
                                {label: 'Trợ cấp thôi việc', field: 'severance_allowance'},
                                {label: 'Truy lĩnh', field: 'back_pay'},
                                {label: 'Hỗ trợ thuê xe VF', field: 'car_rent_allowance'},
                                {label: 'Phúc lợi hỗ trợ xe VF', field: 'car_rent_allowance_welfare'},
                                {label: 'Hỗ trợ lãi suất VF', field: 'interest_rate_allowance'},
                                {label: 'Phúc lợi Net (GrossUp) (Vinmec, Vinschool, Thưởng tiền mặt,…)', field: 'welfare_net_allowance'},
                                {label: 'Chi phúc lợi hàng năm', field: 'annual_welfare_allowance'},
                                {label: 'Các khoản chi khác', field: 'other_payment'},
                            ]
                        }
                    ]
                }
            ]
        },

        {
            index: 'II',
            label: 'CÁC KHOẢN PHÁT SINH GIẢM THU NHẬP = Sum (II.1: II.3)',
            field: 'income_reduction_incurred_amount',
            level2: [
                {
                    label: 'CÁC KHOẢN KHẤU TRỪ',
                    field: 'other_reduction',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ các khoản chi hộ (Vay quỹ thiện tâm, QTT NLĐ nộp thêm,...)', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},
                        {label: 'Khấu trừ các khoản thưởng, phúc lợi đã hưởng (Vinmec, Vinschool, VinID,...)', field: 'bonus_received_reduction'},
                        {label: 'Khấu trừ KTX, BUS Vinpearl PQ', field: 'bus_reduction'},
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'compensative_car_purchased'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_reduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN',
                    field: 'insurance_union_payment_amount',
                    level3: [
                        {
                            label: 'Mức lương đóng Bảo hiểm bắt buộc',
                            field: 'compulsary_insurance_amount_in_salary',
                            isSkipSumLabel: true,
                            level4: [
                                {label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary'},
                                {label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary'}
                            ]
                        },
                        {
                            label: 'Trích nộp Bảo hiểm bắt buộc',
                            field: 'compulsary_insurance_amount_fee',
                            level4: [
                                {label: 'Bảo hiểm xã hội (8%)', field: 'social_insurance_fee'},
                                {label: 'Bảo hiểm y tế (1.5%)', field: 'health_insurance_fee'},
                                {label: 'Bảo hiểm thất nghiệp (1%)', field: 'unemployment_insurance_fee'},
                            ]
                        },
                        {
                            label: 'Trích nộp phí đoàn viên Công đoàn',
                            field: 'union_fee',
                            level4: []
                        }
                    ]
                },

                {
                    label: 'THUẾ TNCN',
                    field: 'personal_income_tax_amount',
                    level3: [
                        {
                            label: 'Tổng giảm trừ gia cảnh và các khoản giảm trừ khác',
                            field: 'family_allowances_amount',
                            level4: [
                                {label: 'Giảm trừ bản thân', field: 'personal_allowance'},
                                {label: 'Giảm trừ người phụ thuộc', field: 'dependant_allowance'},
                                {label: 'Giảm trừ khác', field: 'other_allowance'}
                            ]
                        },
                        {
                            label: 'Tổng thu nhập tính thuế',
                            field: 'income_tax_include_amount',
                            level4: []
                        },
                        {
                            label: 'Thuế TNCN phải nộp trong kỳ',
                            field: 'personal_income_tax_in_period_amount',
                            level4: [
                                {label: 'Thuế TNCN do NLĐ chi trả', field: 'personal_income_tax_is_paid_by_employee'},
                                {label: 'Thuế TNCN do Công ty chi trả', field: 'personal_income_tax_is_paid_by_employer'}
                            ]
                        }
                    ]
                },
                
            ]
        },
        {
            index: 'III',
            label: 'THỰC LĨNH = Sum (III.1 : III.3)',
            field: 'net_salary_amount',
            level2: [
                {
                    label: 'Đợt 1',
                    field: 'pay_first',
                    level3: []
                },
                {
                    label: 'Đợt 2',
                    field: 'pay_second',
                    level3: []
                },
                {
                    label: 'Đợt n',
                    level3: []
                },
            ]
        }
    ]

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
                                    const lv2Label = lv3Number > 0 ? row2.label + ' = Sum (' + row.index + '.' + (index2 + 1) + '.1 : ' + row.index + '.' + (index2 + 1) + '.' + lv3Number + ')' : row2.label
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
                                        return <>
                                            { row3.field && (row3.level4 || payslipCalculate[row3.field] || payslipCalculate[row3.field + '_tax_included'] || payslipCalculate[row3.field + '_without_tax']) ? <TrTable 
                                                row={row3} 
                                                rowIndex={row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '. ' + lv3Label} 
                                                tdclsName={row3.level4 ? 'special bold color-black' : 'special'} 
                                                spanclsName="child-third"
                                                clsName={row3.level4 ? 'second' : null} 
                                                payslipCalculate={payslipCalculate}
                                            /> : null }
                                        {row3.level4 ? row3.level4.map((row4, index4) => {
                                            return row4.field && (payslipCalculate[row4.field] || payslipCalculate[row4.field + '_tax_included'] || payslipCalculate[row4.field + '_without_tax']) ? <TrTable 
                                                row={row4} 
                                                rowIndex={row.index + '.' + (index2 + 1) + '.' + (index3 + 1) + '.' + (index4 + 1) + '. ' + row4.label} 
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
                    } )}
                </tbody>
            </table>
        </>
    );
}

export default IncomeComponent
