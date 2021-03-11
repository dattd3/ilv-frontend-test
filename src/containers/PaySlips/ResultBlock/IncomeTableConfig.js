export const IncomeTablesConfig = {
    Vinpearl: [
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
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng giới thiệu ứng viên', field: 'reference_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng khác (GROSS)', field: 'other_gross_bonus'},
                                {label: 'Thưởng vượt khoán phòng', field: 'over_contract_bonus'},
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
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ điều kiện sinh hoạt Vùng Phú Quốc', field: 'region_allowance'},
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
                    field: 'income_reduction_amount',
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
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
    ],

    Vinsoftware: [
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
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp chuyên môn/ tay nghề', field: 'professional_allowance'},
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'}
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
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng khác (NET)', field: 'other_net_bonus', isSplit: true},
                                {label: 'Thưởng khác (GROSSUP từ khoản NET tương ứng)', field: 'other_gross_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ kết hôn', field: 'marriage_subsidy'},
                                {label: 'Hỗ trợ ma chay', field: 'funerral_subsidy'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ điều kiện sinh hoạt', field: 'region_allowance'},
                                {label: 'Hỗ trợ đối với chuyên ngành khó tuyển dụng', field: 'special_industry_subsidy'},
                                {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
                                {label: 'Tiền thanh toán phép năm/nghỉ bù (nếu có)', field: 'annual_leave_payment'},
                                {label: 'Hỗ trợ/Thỏa thuận nghỉ việc', field: 'resignation_agreement_allowance'},
                                {label: 'Trợ cấp thôi việc', field: 'severance_allowance'},
                                {label: 'Truy lĩnh', field: 'back_pay'},
                                {label: 'Chi phúc lợi hàng năm', field: 'annual_welfare_allowance'},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (NET)', field: 'interest_rate_allowance', isSplit: true},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_grossup_allowance'},
                                {label: 'Hỗ trợ tiền thuê xe VF (NET)', field: 'car_rent_allowance', isSplit: true},
                                {label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_grossup_allowance'},
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
                    field: 'income_reduction_amount',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ vay Quỹ Thiện Tâm', field: 'deduction_of_loan_from_kind_heart_foundation'},
                        {label: 'Khấu trừ các khoản chi hộ', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},
                        {label: 'Khấu trừ tiền thuê xe VF', field: 'vf_car_and_electric_motobike_leasing_deduction'},
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
            label: 'THỰC LĨNH = III.1 ',
            field: 'net_salary_amount',
            level2: [
                {
                    label: 'Trả vào tài khoản ngân hàng',
                    field: 'net_salary_amount',
                    level3: []
                }
            ]
        }
    ],

    VinFast: [
        {
            index: 'I',
            label: 'CÁC KHOẢN PHÁT SINH TĂNG THU NHẬP = Sum (I.1 : I.2)',
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
                                {label: 'Thưởng YTCLCV', field: 'quality_of_work_bonus'}
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'},
                                {label: 'Phụ cấp trách nhiệm', field: 'responsibility_allowance'}
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
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng giới thiệu ứng viên', field: 'reference_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng khác (GROSS)', field: 'other_gross_bonus'},
                                {label: 'Thưởng khoán/KPI (Net)', field: 'kpi_bonus_net'},
                                {label: 'Thưởng Net', field: 'other_net_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ điều kiện sinh hoạt', field: 'region_allowance'},
                                {label: 'Hỗ trợ chuyển vùng', field: 'region_displace_allowance'},
                                // {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Hỗ trợ công việc đặc thù', field: 'specific_work_allowance'},
                                // {label: 'Hỗ trợ làm việc trên đảo tại Nha Trang', field: 'work_on_island_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
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
                    field: 'income_reduction_amount',
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
                        // {label: 'Bồi thường ưu đãi giá/cấp bậc mua xe VinFast', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'},
                        {label: 'Khấu trừ thuê/vay mua xe VinFast', field: 'vf_car_and_electric_motobike_leasing_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
    ],
    Vinmec: [
        {
            index: 'I',
            label: 'CÁC KHOẢN PHÁT SINH TĂNG THU NHẬP = Sum (I.1 : I.2)',
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
                                {label: 'Thưởng YTCLCV', field: 'quality_of_work_bonus'}
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp chuyên môn/tay nghề', field: 'professional_allowance'},
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'},
                                {label: 'Phụ cấp chức vụ', field: 'position_allowance'},
                                {label: 'Phụ cấp nguy hiểm độc hại', field: 'dangerous_allowance'},
                                {label: 'Phụ cấp trách nhiệm', field: 'responsibility_allowance'},
                                {label: 'Phụ cấp ngoại hình', field: 'looking_allowance'},
                                {label: 'Phụ cấp ngoại ngữ', field: 'foreign_language_allowance'},
                                {label: 'Phụ cấp ưu đãi nghề Điều dưỡng', field: 'nursing_allowance'}
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
                                {label: 'Thưởng tay nghề', field: 'professional_bonus'},
                                {label: 'Thưởng ngoại ngữ', field: 'lingo_bonus'},
                                {label: 'Thưởng ngoại hình', field: 'good_looking_bonus'},
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng số ca dịch vụ điều dưỡng', field: 'nursing_bonus'},
                                {label: 'Thưởng hiệu quả Bác sỹ', field: 'doctor_effective_working_bonus'},
                                {label: 'Thưởng bồi dưỡng trực Vinmec', field: 'tip_of_duty'},
                                {label: 'Thưởng tăng cường Oncall', field: 'oncall_bonus'},
                                {label: 'Thưởng mạng lưới KSNK', field: 'ksnk_network_bonus'},
                                {label: 'Thưởng tham gia tracer JCI', field: 'jci_tracer_enrollment_bonus'},
                                {label: 'Thưởng vượt khung', field: 'over_frame_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng hiệu suất', field: 'performance_bonus'},
                                {label: 'Thưởng EBITDA', field: 'ebitda_bonus'},
                                {label: 'Thưởng hiệu quả công việc', field: 'effective_working_bonus'},
                                {label: 'Thưởng KPI (NET)', field: 'kpi_bonus_net', isSplit: true},
                                {label: 'Thưởng KPI (GROSSUP từ khoản NET tương ứng)', field: 'kpi_grossup_bonus'},
                                {label: 'Thưởng khác (NET)', field: 'other_net_bonus',isSplit: true},
                                {label: 'Thưởng khác (GROSSUP từ khoản NET tương ứng)', field: 'other_gross_bonus'},
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ kết hôn', field: 'marriage_subsidy'},
                                {label: 'Hỗ trợ ma chay', field: 'funerral_subsidy'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ điều kiện sinh hoạt', field: 'region_allowance'},
                                {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
                                {label: 'Tiền thanh toán phép năm/nghỉ bù (nếu có)', field: 'annual_leave_payment'},
                                {label: 'Hỗ trợ/Thỏa thuận nghỉ việc', field: 'resignation_agreement_allowance'},
                                {label: 'Trợ cấp thôi việc', field: 'severance_allowance'},
                                {label: 'Truy lĩnh', field: 'back_pay'},
                                {label: 'Phúc lợi Net (GrossUp) (Vinmec, Vinschool, Thưởng tiền mặt,…)', field: 'welfare_net_allowance'},
                                {label: 'Chi phúc lợi hàng năm', field: 'annual_welfare_allowance'},
                                {label: 'Quà ngày lễ (VinID)', field: 'vinid_gift'},
                                {label: 'Thưởng tiền mặt', field: 'cash_bonus'},
                                {label: 'Công tác phí', field: 'mission_fee'},
                                {label: 'Hỗ trợ học phí cho con CBNV NNN', field: 'tuition_fee_allowance'},
                                {label: 'Hỗ trợ thu hút khó tuyển dụng', field: 'special_industry_subsidy'},
                                {label: 'Hỗ trợ vé máy bay NNN', field: 'plane_ticket_allowance'},
                                {label: 'Hỗ trợ mùa dịch Covid 19(NET)', field: 'covid_allowance', isSplit: true},
                                {label: 'Hỗ trợ mùa dịch Covid 19 (GROSSUP từ khoản NET tương ứng)', field: 'covid_grossup_allowance'},
                                
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (NET)', field: 'interest_rate_allowance', isSplit: true},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_grossup_allowance'},
                                {label: 'Hỗ trợ tiền thuê xe VF (NET)', field: 'car_rent_allowance', isSplit: true},
                                {label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_grossup_allowance'},
                                {label: 'Hỗ trợ thuê nhà Vinhomes (NET)', field: 'house_rent_allowance', isSplit: true},
                                {label: 'Hỗ trợ thuê nhà Vinhomes (GROSSUP từ khoản NET tương ứng)', field: 'house_rent_grossup_allowance'},
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
                    field: 'income_reduction_amount',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ vay Quỹ Thiện Tâm', field: 'deduction_of_loan_from_kind_heart_foundation'},
                        {label: 'Khấu trừ các khoản chi hộ', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},
                        {label: 'Khấu trừ các khoản thưởng, phúc lợi đã hưởng (Vinmec, Vinschool, VinID,...)', field: 'bonus_received_reduction'},
                        {label: 'Khấu trừ tiền thuê xe VF', field: 'vf_car_and_electric_motobike_leasing_deduction'},
                        {label: 'Khấu trừ lãi vay mua xe VF', field: 'vf_car_and_electric_motobike_purchase_deduction'},
                        {label: 'Bồi thường ưu đãi giá/cấp bậc mua xe VinFast', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'}
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
    ],

    VinSmart: [
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
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'},
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
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},

                                {label: 'Thưởng giới thiệu ứng viên', field: 'reference_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng khác (GROSS)', field: 'other_gross_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ xăng xe cho VSM', field: 'gas_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ chuyển vùng', field: 'region_displace_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
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
                    field: 'income_reduction_amount',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ các khoản chi hộ(Vay quỹ thiện tâm, QTT NLĐ nộp thêm,...)', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},


                        {label: 'Khấu trừ các khoản thưởng, phúc lợi đã hưởng (Vinmec, Vinschool, VinID,...)', field: 'bonus_received_reduction'},

                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
            label: 'THỰC LĨNH = III.1 ',
            field: 'net_salary_amount',
            level2: [
                {
                    label: 'Trả vào tài khoản ngân hàng',
                    field: 'net_salary_amount',
                    level3: []
                }
            ]
        }
    ],

    VinHome: [
        {
            index: 'I',
            label: 'CÁC KHOẢN PHÁT SINH TĂNG THU NHẬP = Sum (I.1 : I.3)',
            field: 'income_accrued_amount',
            level2: [
                {
                    label: 'THU NHẬP CƠ BẢN',
                    field: 'base_income_amount',
                    isSkipLevel4: true,
                    level3: [
                        {
                            label: 'Lương cơ bản',
                            field: 'base_salary'
                        },
                        {
                            label: 'Thưởng YTCLCV',
                            field: 'quality_of_work_bonus'
                        },
                        {
                            label: 'Lương theo giờ công',
                            field: 'hourly_salary'
                        }
                    ]
                },
                {
                    label: 'CÁC LOẠI PHỤ CẤP',
                    field: 'allowance_amount',
                    isSkipLevel4: true,
                    level3: [
                        {
                            label: 'Phụ cấp kiêm nhiệm',
                            field: 'Phụ cấp kiêm nhiệm'
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
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng khác (GROSS)', field: 'other_gross_bonus'},
                                {label: 'Thưởng thành tích tháng (tiền mặt)', field: 'cash_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ đặc thù', field: 'specific_work_allowance '},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ chuyển vùng', field: 'region_displace_allowance'},
                                {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Hỗ trợ khác', field: 'other_specific'},
                                {label: 'Tiền làm thêm ngoài giờ chịu thuế', field: 'overtime_payment_tax_included'},
                                {label: 'Tiền làm thêm ngoài giờ không chịu thuế', field: 'overtime_payment_without_tax'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
                                {label: 'Tiền thanh toán phép năm/nghỉ bù (nếu có)', field: 'annual_leave_payment'},
                                {label: 'Hỗ trợ/Thỏa thuận nghỉ việc', field: 'resignation_agreement_allowance'},
                                {label: 'Trợ cấp thôi việc', field: 'severance_allowance'},
                                {label: 'Truy lĩnh chịu thuế', field: 'back_pay_tax_included'},
                                {label: 'Truy lĩnh không chịu thuế', field: 'back_pay_without_tax'},
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
                    field: 'income_reduction_amount',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ các khoản chi hộ(Vay quỹ thiện tâm, QTT NLĐ nộp thêm,...)', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},
                        {label: 'Bồi thường ưu đãi giá/cấp bậc mua xe VinFast', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Khấu trừ lãi vay mua xe VinFast', field: 'vf_car_and_electric_motobike_purchase_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
            label: 'THỰC LĨNH = III.1 ',
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
    ],

    VinSchool: [
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
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'}
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
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng khác (GROSS)', field: 'other_gross_bonus'},

                                {label: 'Thưởng các khoản ngoài lương VSC(1)', field: 'non_salary_VSC_1_bonus'},
                                {label: 'Thưởng các khoản ngoài lương VSC(2)', field: 'non_salary_VSC_2_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh chính khóa', field: 'primary_course_enrol_commissions_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh ngoại khóa', field: 'extra_curricular_enrol_commissions_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh hè', field: 'summer_enrol_commissions_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh mầm xanh', field: 'green_sprout_enrol_commissions_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
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
                    field: 'income_reduction_amount',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ các khoản chi hộ(Vay quỹ thiện tâm, QTT NLĐ nộp thêm,...)', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},
                        {label: 'Khấu trừ các khoản thưởng, phúc lợi đã hưởng (Vinmec, Vinschool, VinID,...)', field: 'bonus_received_reduction'},
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
            label: 'THỰC LĨNH = III.1 ',
            field: 'net_salary_amount',
            level2: [
                {
                    label: 'Đợt 1',
                    field: 'pay_first',
                    level3: []
                }
            ]
        }
    ],

    VinGroup: [
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
                                {label: 'Thưởng tay nghề', field: 'professional_bonus'},
                                {label: 'Thưởng service charge', field: 'service_charge_bonus'}
                            ]
                        },
                        {
                            label: 'Các loại phụ cấp lương (nếu có)',
                            field: 'allowance_amount',
                            level4: [
                                {label: 'Phụ cấp chuyên môn/tay nghề', field: 'professional_allowance'},
                                {label: 'Phụ cấp kiêm nhiệm', field: 'pluralism_allowance'},
                                {label: 'Phụ cấp chức vụ', field: 'position_allowance'},
                                {label: 'Phụ cấp nguy hiểm độc hại', field: 'dangerous_allowance'},
                                {label: 'Phụ cấp Trách nhiệm', field: 'responsibility_allowance'},
                                {label: 'Phụ cấp ngoại ngữ', field: 'foreign_language_allowance'},
                                {label: 'Phụ cấp ngoại hình', field: 'looking_allowance'},
                                {label: 'Phụ cấp ưu đãi nghề Điều dưỡng', field: 'nursing_allowance'}
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
                                {label: 'Thưởng nghề', field: 'proficiency_bonus'},
                                {label: 'Thưởng ngoại ngữ', field: 'lingo_bonus'},
                                {label: 'Thưởng ngoại hình', field: 'good_looking_bonus'},
                                {label: 'Thưởng khoán', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'archievement_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                {label: 'Thưởng các khoản ngoài lương VSC(1)', field: 'non_salary_VSC_1_bonus'},
                                {label: 'Thưởng các khoản ngoài lương VSC(2)', field: 'non_salary_VSC_2_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh chính khóa', field: 'primary_course_enrol_commissions_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh ngoại khóa', field: 'extra_curricular_enrol_commissions_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh hè', field: 'summer_enrol_commissions_bonus'},
                                {label: 'Thưởng hoa hồng tuyển sinh mầm xanh', field: 'green_sprout_enrol_commissions_bonus'},
                                {label: 'Thưởng đặc thù (dạy các môn đặc thù hoặc dạy các khối đặc thù)', field: 'special_bonus'},
                                {label: 'Thưởng KPIs khối 9/khối 12', field: 'ninth_twelfth_grade_bonus'},
                                {label: 'Thưởng trông trưa', field: 'nap_time_watching_bonus'},
                                {label: 'Thưởng khối trưởng/tổ trưởng', field: 'key_leader_bonus'},
                                {label: 'Thưởng vượt tiết trợ giảng', field: 'exceeding_required_number_of_period_bonus'},
                                {label: 'Thưởng số ca dịch vụ điều dưỡng', field: 'nursing_bonus'},
                                {label: 'Thưởng hiệu quả bác sỹ', field: 'doctor_effective_working_bonus'},
                                {label: 'Thưởng bồi dưỡng trực Vinmec', field: 'tip_of_duty'},
                                {label: 'Thưởng tăng cường Oncall', field: 'oncall_bonus'},
                                {label: 'Thưởng mạng lưới KSNK', field: 'ksnk_network_bonus'},
                                {label: 'Thưởng Tracer JCI', field: 'jci_tracer_enrollment_bonus'},
                                {label: 'Thưởng vượt khung', field: 'over_frame_bonus'},
                                {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                {label: 'Thưởng hiệu suất', field: 'performance_bonus'},
                                {label: 'Thưởng EBITDA', field: 'ebitda_bonus'},
                                {label: 'Thưởng hiệu quả công việc', field: 'effective_working_bonus'},
                                {label: 'Thưởng roll-out', field: 'roll_out_bonus'},
                                {label: 'Thưởng vượt khoán phòng', field: 'over_contract_bonus'},
                                {label: 'Thưởng Caddie Fee', field: 'caddie_fee_bonus'},
                                {label: 'Thưởng công trường', field: 'construction_site_bonus'},
                                {label: 'Quyết toán SC', field: 'SC_bonus'},
                                {label: 'Thưởng KPI (NET - tiền mặt)', field: 'kpi_bonus'},
                                {label: 'Thưởng KPI (GROSSUP từ khoản NET tương ứng)', field: 'kpi_grossup_bonus'},
                                {label: 'Thưởng khác (NET)', field: 'other_net_bonus'},
                                {label: 'Thưởng khác (GROSSUP từ khoản NET tương ứng)', field: 'other_gross_bonus'}
                            ]
                        },
                        {
                            label: 'Các khoản chi trả khác',
                            field: 'other_payment_amount',
                            level4: [
                                {label: 'Hỗ trợ ăn ca', field: 'shift_eating_allowance'},
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ kết hôn', field: 'marriage_subsidy'},
                                {label: 'Hỗ trợ ma chay', field: 'funerral_subsidy'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
                                {label: 'Hỗ trợ đi lại, phương tiện di chuyển', field: 'transfer_allowance'},
                                {label: 'Hỗ trợ điện thoại', field: 'phone_allowance'},
                                {label: 'Hỗ trợ điều kiện sinh hoạt', field: 'region_allowance'},
                                {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Hỗ trợ công việc đặc thù', field: 'specific_work_allowance'},
                                {label: 'Hỗ trợ làm việc trên đảo tại Nha Trang', field: 'work_on_island_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
                                {label: 'Tiền thanh toán phép năm/nghỉ bù (nếu có)', field: 'annual_leave_payment'},
                                {label: 'Hỗ trợ/Thỏa thuận nghỉ việc', field: 'resignation_agreement_allowance'},
                                {label: 'Trợ cấp thôi việc', field: 'severance_allowance'},
                                {label: 'Truy lĩnh', field: 'back_pay'},
                                {label: 'Phúc lợi Net (GrossUp) (Vinmec, Vinschool, Thưởng tiền mặt,…)', field: 'welfare_net_allowance'},
                                {label: 'Chi phúc lợi hàng năm', field: 'annual_welfare_allowance'},
                                {label: 'Quà ngày lễ (VinID)', field: 'vinid_gift'},
                                {label: 'Thưởng tiền mặt', field: 'cash_bonus'},
                                {label: 'Công tác phí', field: 'mission_fee'},
                                {label: 'Hỗ trợ học phí cho con CBNV NNN', field: 'tuition_fee_allowance'},
                                {label: 'Hỗ trợ thu hút khó tuyển dụng', field: 'special_industry_subsidy'},
                                {label: 'Hỗ trợ vé máy bay NNN', field: 'plane_ticket_allowance'},
                                {label: 'Hỗ trợ mùa dịch Covid 19 (NET)', field: 'covid_allowance'},
                                {label: 'Hỗ trợ mùa dịch Covid 19 (GROSSUP từ khoản NET tương ứng)', field: 'covid_grossup_allowance'},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (NET)', field: 'interest_rate_allowance'},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_grossup_allowance'},
                                {label: 'Hỗ trợ tiền thuê xe VF (NET)', field: 'car_rent_allowance_welfare'},
                                {label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_grossup_allowance'},
                                {label: 'Hỗ trợ thuê nhà Vinhomes (NET)', field: 'house_rent_allowance'},
                                {label: 'Hỗ trợ thuê nhà Vinhomes (GROSSUP từ khoản NET tương ứng)', field: 'house_rent_grossup_allowance'},
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
                    field: 'income_reduction_amount',
                    isSkipLevel4: true,
                    level3: [
                        {label: 'Truy thu', field: 'arrears'},
                        {label: 'Trừ thưởng YTCLCV', field: 'quality_of_work_reduction'},
                        {label: 'Khấu trừ/bồi thường thiệt hại vật chất', field: 'damages'},
                        {label: 'Khấu trừ vay Quỹ Thiện Tâm', field: 'deduction_of_loan_from_kind_heart_foundation'},
                        {label: 'Khấu trừ các khoản chi hộ', field: 'loan_reduction'},
                        {label: 'Khấu trừ tạm ứng thu nhập', field: 'advance_reduction'},
                        {label: 'Khấu trừ tạm ứng VinID Pay', field: 'vinid_pay_reduction'},
                        {label: 'Khấu trừ các khoản thưởng, phúc lợi đã hưởng (Vinmec, Vinschool, VinID,...)', field: 'bonus_received_reduction'},
                        {label: 'Khấu trừ tiền thuê xe VF', field: 'vf_car_and_electric_motobike_leasing_deduction'},
                        {label: 'Khấu trừ lãi vay mua xe VF', field: 'vf_car_and_electric_motobike_purchase_deduction'},
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_deduction'},
                    ]
                },
                {
                    label: 'TRÍCH NỘP BẢO HIỂM - CÔNG ĐOÀN = Sum (II.2.2 : II.2.3)',
                    field: 'insurance_union_payment_amount',
                    isSkipSumLabel: true,
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
                    label: 'THUẾ TNCN = Sum(II.3.3)',
                    field: 'personal_income_tax_amount',
                    isSkipSumLabel: true,
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
            label: 'THỰC LĨNH = III.1 ',
            field: 'net_salary_amount',
            level2: [
                {
                    label: 'Đợt 1',
                    field: 'pay_first',
                    isSkipLevel4: true,
                    level3: [
                        {
                            label:'Trả vào tài khoản ngân hàng',
                            field:''
                        },
                        {
                            label:'Trả vào Ví VinID Pay',
                            field:''
                        }
                    ]
                },
                {
                    label: 'Đợt 2',
                    field: 'pay_second',
                    isSkipLevel4: true,
                    level3: [
                        {
                            label:'Trả vào tài khoản ngân hàng',
                            field:''
                        }
                    ]
                },
                {
                    label: 'Đợt n',
                    field: 'pay_first',
                    level3: []
                }
            ]
        }
    ]

};