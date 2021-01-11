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
                                {label: 'Hỗ trợ ốm đau, tai nạn', field: 'sick_accident_allowance'},
                                {label: 'Hỗ trợ hiếu hỉ', field: 'funeral_wedding_allowance'},
                                {label: 'Hỗ trợ nhà ở', field: 'housing_allowance'},
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
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'compensative_car_purchased'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_reduction'},
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
                                // {label: 'Phụ cấp chức vụ', field: 'position_allowance'},
                                // {label: 'Phụ cấp ngoại ngữ', field: 'foreign_language_allowance'},
                                // {label: 'Phụ cấp ngoại hình', field: 'looking_allowance'}
                            ]
                        },
                        {
                            label: 'Các khoản bổ sung khác (nếu có)',
                            field: 'additional_allowance',
                            level4: []
                        }
                    ]
                },
                // {
                //     label: 'THU NHẬP GIẢNG DẠY',
                //     field: 'other_income_amount',
                //     level3: [
                //         {
                //             label: 'Thu nhập tiết giảng dạy',
                //             field: 'todo',
                //             level4: []
                //         },
                //         {
                //             label: 'Thu nhập tiết theo ngày công',
                //             field: 'todo',
                //             level4: []
                //         },
                //         {
                //             label: 'Thu nhập tiết sự kiện đồng giá',
                //             field: 'todo',
                //             level4: []
                //         },
                //         {
                //             label: 'Thu nhập tiết sự kiện không đồng giá',
                //             field: 'todo',
                //             level4: []
                //         }
                //     ]
                // },
                {
                    label: 'CÁC KHOẢN THU NHẬP KHÁC',
                    field: 'other_income_amount',
                    level3: [
                        {
                            label: 'Tiền thưởng',
                            field: 'bonus_amount',
                            level4: [
                                // {label: 'Thưởng tay nghề', field: 'todo'},
                                // {label: 'Thưởng ngoại ngữ', field: 'lingo_bonus'},
                                // {label: 'Thưởng ngoại hình', field: 'good_looking_bonus'},
                                // {label: 'Thưởng service charge', field: 'todo'},
                                {label: 'Thưởng khoán/KPI', field: 'kpi_bonus'},
                                {label: 'Thưởng tháng lương 13 (chỉ áp dụng tại thời điểm chi trả)', field: 'thirteenth_month_bonus'},
                                {label: 'Thưởng cuối năm Âm lịch (chỉ áp dụng tại thời điểm chi trả)', field: 'lunar_new_year_bonus'},
                                {label: 'Thưởng thành tích', field: 'performance_bonus'},
                                {label: 'Thưởng chiến dịch/dự án', field: 'project_campaign_bonus'},
                                // {label: 'Thưởng đặc thù (dạy các môn đặc thù hoặc dạy các khối đặc thù)', field: 'special_bonus'},
                                // {label: 'Thưởng KPIs khối 9/khối 12', field: 'ninth_twelfth_grade_bonus'},
                                // {label: 'Thưởng trông trưa', field: 'nap_time_watching_bonus'},
                                // {label: 'Thưởng khối trưởng/tổ trưởng', field: 'key_leader_bonus'},
                                // {label: 'Thưởng vượt tiết trợ giảng', field: 'exceeding_required_number_of_period_bonus'},
                                // {label: 'Thưởng doanh thu bác sỹ', field: 'performance_based_incentive_for_doctor'},
                                // {label: 'Thưởng số ca dịch vụ điều dưỡng', field: 'performance_based_incentive_for_nurse'},
                                // {label: 'Thưởng bồi dưỡng trực Vinmec', field: 'vinmec_night_shift_on_duty_bonus'},
                                // {label: 'Thưởng mạng lưới KSNK', field: 'infection_control_network_allowance'},
                                // {label: 'Thưởng Tracer JCI', field: 'jci_tracer_bonus'},
                                // {label: 'Thưởng điều động', field: 'mobilizing_bonus'},
                                // {label: 'Thưởng giới thiệu ứng viên', field: 'reference_bonus'},
                                // {label: 'Thưởng đào tạo', field: 'trainning_bonus'},
                                // {label: 'Thưởng chuyển giao hàng', field: 'goods_transportation_bonus'},
                                // {label: 'Thưởng tăng cường Oncall', field: 'oncall_bonus'},
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
                                {label: 'Hỗ trợ điều kiện sinh hoạt', field: 'living_cost_subsidy'},
                                {label: 'Hỗ trợ đối với chuyên ngành khó tuyển dụng', field: 'special_industry_subsidy'},
                                {label: 'Hỗ trợ ca gãy', field: 'shifts_allowance'},
                                {label: 'Tiền làm thêm ngoài giờ', field: 'overtime_payment'},
                                {label: 'Trợ cấp làm đêm', field: 'night_shift_allowance'},
                                {label: 'Tiền thanh toán phép năm/nghỉ bù (nếu có)', field: 'annual_leave_payment'},
                                {label: 'Hỗ trợ/Thỏa thuận nghỉ việc', field: 'resignation_agreement_allowance'},
                                {label: 'Trợ cấp thôi việc', field: 'severance_allowance'},
                                {label: 'Truy lĩnh', field: 'back_pay'},
                                {label: 'Chi phúc lợi hàng năm', field: 'annual_welfare_allowance'},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (NET)', field: 'interest_rate_allowance'},
                                {label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_allowance_tax_included'},
                                {label: 'Hỗ trợ tiền thuê xe VF (NET)', field: 'car_rent_allowance_welfare'},
                                {label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_allowance_welfare_tax_included'},
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
                        {label: 'Bồi thường ưu đãi mua xe VF', field: 'compensative_car_purchased'},
                        {label: 'Các khoản khấu trừ khác', field: 'other_reduction'},
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
            label: 'THỰC LĨNH = III.1 ',
            field: 'net_salary_amount',
            level2: [
                {
                    label: '(III.1) Trả vào tài khoản ngân hàng',
                    field: 'net_salary_amount',
                    level3: []
                }
            ]
        }
    ]
};