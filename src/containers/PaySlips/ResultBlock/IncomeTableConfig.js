export const IncomeTablesConfig = t => {
    return {
        Vinpearl: [
            {
                index: 'I',
                label: `${t("Allowance")} = Sum (I.1 : I.3)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' },
                                    { label: t("ProficiencyBonus"), field: 'professional_bonus' },
                                    { label: t("ServiceCharge"), field: 'service_charge_bonus' }
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("ProficiencySkillsBonus"), field: 'professional_allowance' },
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' },
                                    { label: t("PositionAllowance"), field: 'position_allowance' },
                                    { label: t("ToxicSubstancesAllowance "), field: 'dangerous_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("ForeignLanguageBonus"), field: 'lingo_bonus' },
                                    { label: t("AppearanceBonus"), field: 'good_looking_bonus' },
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("ReferralBonus"), field: 'reference_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },
                                    { label: t("NetOtherBonusExceedRoomQuota"), field: 'over_contract_bonus' },
                                    { label: t("CaddieBonus"), field: 'caddie_fee_bonus' },
                                    { label: t("ConstructionSiteBonus"), field: 'construction_site_bonus' },
                                    { label: t("ScFinalization"), field: 'sc_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageAndCondolencestSupport"), field: 'funeral_wedding_allowance' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: 'Hỗ trợ điều kiện sinh hoạt Vùng Phú Quốc', field: 'region_allowance' },
                                    { label: t("RelocationSupport"), field: 'region_displace_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("SpecializedJobSupport"), field: 'specific_work_allowance' },
                                    { label: t("IslandSupport"), field: 'work_on_island_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: 'Tiền lương làm đêm', field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: t("DeductionOnDormitoryVinpearlBusPhuQuoc"), field: 'bus_reduction' },
                            { label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: t("Pit"),
                        field: 'personal_income_tax_amount',
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = Sum (III.1 : III.3)`,
                field: 'net_salary_amount',
                level2: [
                    {
                        label: t("FirstPayment"),
                        field: 'pay_first',
                        level3: []
                    },
                    {
                        label: t("SecondPayment"),
                        field: 'pay_second',
                        level3: []
                    },
                    {
                        label: t("ThirdPayment"),
                        level3: []
                    },
                ]
            }
        ],

        Vinsoftware: [
            {
                index: 'I',
                label: `${t("Allowance")} = Sum (I.1 : I.3)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' },
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("ProficiencySkillsBonus"), field: 'professional_allowance' },
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("OtherNetBonus"), field: 'other_net_bonus', isSplit: true },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageSupport"), field: 'marriage_subsidy' },
                                    { label: t("FunerralSupport"), field: 'funerral_subsidy' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("LivingConditionSupport"), field: 'region_allowance' },
                                    { label: 'Hỗ trợ đối với chuyên ngành khó tuyển dụng', field: 'special_industry_subsidy' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance', isSplit: true },
                                    { label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_grossup_allowance' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance', isSplit: true },
                                    { label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: 'Khấu trừ vay Quỹ Thiện Tâm', field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: 'Khấu trừ tiền thuê xe VF', field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = III.1 `,
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
                label: `${t("Allowance")} = Sum (I.1 : I.2)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' }
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' },
                                    { label: t("ForeignLanguageAllowance"), field: 'responsibility_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("ReferralBonus"), field: 'reference_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },
                                    { label: t("NetKpiBonus"), field: 'kpi_bonus_net' },
                                    { label: t("BonusNet"), field: 'other_net_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageAndCondolencestSupport"), field: 'funeral_wedding_allowance' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("LivingConditionSupport"), field: 'region_allowance' },
                                    { label: t("RelocationSupport"), field: 'region_displace_allowance' },
                                    // {label: t("IntermittenShiftSupport"), field: 'shifts_allowance'},
                                    { label: t("SpecializedJobSupport"), field: 'specific_work_allowance' },
                                    // {label: t("IslandSupport"), field: 'work_on_island_allowance'},
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: 'Hỗ trợ mùa dịch Covid 19(NET)', field: 'covid_allowance'},
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: t("DeductionOnDormitoryVinpearlBusPhuQuoc"), field: 'bus_reduction' },
                            // {label: t("RefundForVfVihicle"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount'},
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("DeductionOnVfLeaseAndVfLoans"), field: 'vf_car_and_electric_motobike_leasing_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = Sum (III.1 : III.3)`,
                field: 'net_salary_amount',
                level2: [
                    {
                        label: t("FirstPayment"),
                        field: 'pay_first',
                        level3: []
                    },
                    {
                        label: t("SecondPayment"),
                        field: 'pay_second',
                        level3: []
                    },
                    {
                        label: t("ThirdPayment"),
                        level3: []
                    },
                ]
            }
        ],
        Vinmec: [
            {
                index: 'I',
                label: `${t("Allowance")} = Sum (I.1 : I.2)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' }
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("ProficiencySkillsBonus"), field: 'professional_allowance' },
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' },
                                    { label: t("PositionAllowance"), field: 'position_allowance' },
                                    { label: t("ToxicSubstancesAllowance "), field: 'dangerous_allowance' },
                                    { label: t("ForeignLanguageAllowance"), field: 'responsibility_allowance' },
                                    { label: t("AppearanceBonus"), field: 'looking_allowance' },
                                    { label: t("ForeignLanguageBonus"), field: 'foreign_language_allowance' },
                                    { label: t("Allowance for Nursing Position"), field: 'nursing_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("ProficiencyBonus"), field: 'professional_bonus' },
                                    { label: t("ForeignLanguageBonus"), field: 'lingo_bonus' },
                                    { label: t("AppearanceBonus"), field: 'good_looking_bonus' },
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("ManagementEfficiencyBonus"), field: 'effect_management' },

                                    // New
                                    { label: t("NETCovidCampaignBonus"), field: 'covid_net' },
                                    { label: t("GROSSCovidCampaignBonus"), field: 'covid_gross' },
                                    { label: t("CovidMobilzationAllowance"), field: 'covid_mobilzation' },

                                    { label: t("PerformanceBasedIncentiveForNurses"), field: 'nursing_bonus' },
                                    { label: t("DoctorCaseBonus"), field: 'doctor_effective_working_bonus' },
                                    { label: t("Medicine_sales_bonus"), field: 'medicine_sales_bonus' },
                                    { label: t("High_tech_center_sales_bonus"), field: 'high_tech_center_sales_bonus' },
                                    { label: t("Sales_bonus"), field: 'sales_bonus' },
                                    { label: t("Head_of_sub_commitee_bonus"), field: 'head_of_sub_commitee_bonus' },
                                    { label: t("VinmecNightShiftOnDutyBonus"), field: 'tip_of_duty' },
                                    { label: t("OncallBonus"), field: 'oncall_bonus' },
                                    { label: t("InfectionControlNetworkAllowance"), field: 'ksnk_network_bonus' },
                                    { label: t("JciTracerBonus"), field: 'jci_tracer_enrollment_bonus' },
                                    { label: t("OutOfRangeBonus"), field: 'over_frame_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("EfficiencyBonus"), field: 'performance_bonus' },
                                    { label: t("EbitdaBonus"), field: 'ebitda_bonus' },
                                    { label: t("PerformanceBonus"), field: 'effective_working_bonus' },
                                    { label: t("NetKpiBonus"), field: 'kpi_bonus_net', isSplit: true },
                                    { label: t("KpiGrossBonus"), field: 'kpi_grossup_bonus' },
                                    { label: t("OtherNetBonus"), field: 'other_net_bonus', isSplit: true },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageSupport"), field: 'marriage_subsidy' },
                                    { label: t("FunerralSupport"), field: 'funerral_subsidy' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("LivingConditionSupport"), field: 'region_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: 'Quà ngày lễ (VinID)', field: 'vinid_gift' },
                                    { label: 'Thưởng tiền mặt', field: 'cash_bonus' },
                                    { label: 'Công tác phí', field: 'mission_fee' },
                                    { label: 'Hỗ trợ học phí cho con CBNV NNN', field: 'tuition_fee_allowance' },
                                    { label: 'Hỗ trợ thu hút khó tuyển dụng', field: 'special_industry_subsidy' },
                                    { label: 'Hỗ trợ vé máy bay NNN', field: 'plane_ticket_allowance' },
                                    { label: 'Hỗ trợ mùa dịch Covid 19(NET)', field: 'covid_allowance', isSplit: true },
                                    { label: 'Hỗ trợ mùa dịch Covid 19 (GROSSUP từ khoản NET tương ứng)', field: 'covid_grossup_allowance' },

                                    // New
                                    { label: t("GROSSCovid19PandemicSubsidy"), field: 'covid_gross_subsidy' },
                                    { label: t("NETF0EmployeesSubsidy"), field: 'covid_net_f0' },
                                    { label: t("GROSSF0EmployeesSubsidy"), field: 'covid_gross_f0' },

                                    { label: 'Hỗ trợ lãi suất vay mua xe VF (NET)', field: 'interest_rate_allowance', isSplit: true },
                                    { label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_grossup_allowance' },
                                    { label: 'Hỗ trợ tiền thuê xe VF (NET)', field: 'car_rent_allowance', isSplit: true },
                                    { label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_grossup_allowance' },
                                    { label: 'Hỗ trợ thuê nhà Vinhomes (NET)', field: 'house_rent_allowance', isSplit: true },
                                    { label: 'Hỗ trợ thuê nhà Vinhomes (GROSSUP từ khoản NET tương ứng)', field: 'house_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: 'Khấu trừ vay Quỹ Thiện Tâm', field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: 'Khấu trừ tiền thuê xe VF', field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: 'Khấu trừ lãi vay mua xe VF', field: 'vf_car_and_electric_motobike_purchase_deduction' },
                            { label: t("RefundForVfVihicle"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = Sum (III.1 : III.3)`,
                field: 'net_salary_amount',
                level2: [
                    {
                        label: t("FirstPayment"),
                        field: 'pay_first',
                        level3: []
                    },
                    {
                        label: t("SecondPayment"),
                        field: 'pay_second',
                        level3: []
                    },
                    {
                        label: t("ThirdPayment"),
                        level3: []
                    },
                ]
            }
        ],

        VinSmart: [
            {
                index: 'I',
                label: `${t("Allowance")} = Sum (I.1 : I.3)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' },
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' },
                                    { label: t("ToxicSubstancesAllowance "), field: 'dangerous_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },

                                    { label: t("ReferralBonus"), field: 'reference_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: 'Hỗ trợ xăng xe cho VSM', field: 'gas_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageAndCondolencestSupport"), field: 'funeral_wedding_allowance' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("RelocationSupport"), field: 'region_displace_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },


                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },

                            { label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = III.1 `,
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
                label: `${t("Allowance")} = Sum (I.1 : I.3)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        isSkipLevel4: true,
                        level3: [
                            {
                                label: t("BaseSalary"),
                                field: 'base_salary'
                            },
                            {
                                label: t("BehaviorAndAttitudeBonus"),
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
                                label: t("AdditionalResponsibilitiesAllowance"),
                                field: t("AdditionalResponsibilitiesAllowance")
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },
                                    { label: 'Thưởng thành tích tháng (tiền mặt)', field: 'cash_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: 'Hỗ trợ đặc thù', field: 'specific_work_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageAndCondolencestSupport"), field: 'funeral_wedding_allowance' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("RelocationSupport"), field: 'region_displace_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: 'Hỗ trợ khác', field: 'other_specific' },
                                    { label: 'Tiền làm thêm ngoài giờ chịu thuế', field: 'overtime_payment_tax_included' },
                                    { label: 'Tiền làm thêm ngoài giờ không chịu thuế', field: 'overtime_payment_without_tax' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: 'Truy lĩnh chịu thuế', field: 'back_pay_tax_included' },
                                    { label: 'Truy lĩnh không chịu thuế', field: 'back_pay_without_tax' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("RefundForVfVihicle"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: 'Khấu trừ lãi vay mua xe VinFast', field: 'vf_car_and_electric_motobike_purchase_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalIncomeTaxInclude"),
                                field: 'total_income_tax_include',
                                level4: []
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = III.1 `,
                field: 'net_salary_amount',
                level2: [
                    {
                        label: t("FirstPayment"),
                        field: 'pay_first',
                        level3: []
                    },
                    {
                        label: t("SecondPayment"),
                        field: 'pay_second',
                        level3: []
                    },
                    {
                        label: t("ThirdPayment"),
                        level3: []
                    },
                ]
            }
        ],

        VinSchool: [
            {
                index: 'I',
                label: `${t("Allowance")} = Sum (I.1 : I.3)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' },
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },

                                    { label: t("VSC1OutOfSalaryBonus"), field: 'non_salary_VSC_1_bonus' },
                                    { label: t("VSC2OutOfSalaryBonus"), field: 'non_salary_VSC_2_bonus' },
                                    { label: t("StudentRecruitmentCommission"), field: 'primary_course_enrol_commissions_bonus' },
                                    { label: t("ExtraCurriculumStudentRecruitmentCommission"), field: 'extra_curricular_enrol_commissions_bonus' },
                                    { label: t("SummerCourseRecruitmentCommission"), field: 'summer_enrol_commissions_bonus' },
                                    { label: t("GreenseedRecruitment"), field: 'green_sprout_enrol_commissions_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageAndCondolencestSupport"), field: 'funeral_wedding_allowance' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = III.1 `,
                field: 'net_salary_amount',
                level2: [
                    {
                        label: t("FirstPayment"),
                        field: 'pay_first',
                        level3: []
                    }
                ]
            }
        ],

        VinGroup: [
            {
                index: 'I',
                label: `${t("Allowance")} = Sum (I.1 : I.3)`,
                field: 'income_accrued_amount',
                level2: [
                    {
                        label: t("BaseInccome"),
                        field: 'base_income_amount',
                        level3: [
                            {
                                label: t("BaseSalaryAndAttitudeAndBehaviorsBonus"),
                                field: 'base_salary_and_quality_of_work_bonus',
                                level4: [
                                    { label: t("BaseSalary"), field: 'base_salary' },
                                    { label: t("BehaviorAndAttitudeBonus"), field: 'quality_of_work_bonus' },
                                    { label: t("ProficiencyBonus"), field: 'professional_bonus' },
                                    { label: t("ServiceCharge"), field: 'service_charge_bonus' }
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("ProficiencySkillsBonus"), field: 'professional_allowance' },
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' },
                                    { label: t("PositionAllowance"), field: 'position_allowance' },
                                    { label: t("ToxicSubstancesAllowance "), field: 'dangerous_allowance' },
                                    { label: t("ForeignLanguageAllowance"), field: 'responsibility_allowance' },
                                    { label: t("ForeignLanguageBonus"), field: 'foreign_language_allowance' },
                                    { label: t("AppearanceBonus"), field: 'looking_allowance' },
                                    { label: t("Allowance for Nursing Position"), field: 'nursing_allowance' }
                                ]
                            },
                            {
                                label: t("AppearanceAllowance"),
                                field: 'additional_allowance',
                                level4: []
                            }
                        ]
                    },
                    {
                        label: t("OtherIncome"),
                        field: 'other_income_amount',
                        level3: [
                            {
                                label: t("Bonus"),
                                field: 'bonus_amount',
                                level4: [
                                    { label: t("ProficiencyBonus"), field: 'proficiency_bonus' },
                                    { label: t("ForeignLanguageBonus"), field: 'lingo_bonus' },
                                    { label: t("AppearanceBonus"), field: 'good_looking_bonus' },
                                    { label: t("KpiBonus"), field: 'kpi_bonus' },
                                    { label: t("13ThMonthSalary"), field: 'thirteenth_month_bonus' },
                                    { label: t("AnnualPerformanceBonusAtTimeOfPayment"), field: 'lunar_new_year_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("VSC1OutOfSalaryBonus"), field: 'non_salary_VSC_1_bonus' },
                                    { label: t("VSC2OutOfSalaryBonus"), field: 'non_salary_VSC_2_bonus' },
                                    { label: t("StudentRecruitmentCommission"), field: 'primary_course_enrol_commissions_bonus' },
                                    { label: t("ExtraCurriculumStudentRecruitmentCommission"), field: 'extra_curricular_enrol_commissions_bonus' },
                                    { label: t("SummerCourseRecruitmentCommission"), field: 'summer_enrol_commissions_bonus' },
                                    { label: t("GreenseedRecruitment"), field: 'green_sprout_enrol_commissions_bonus' },
                                    { label: t("SpecialBonus"), field: 'special_bonus' },
                                    { label: t("9And12GradeAdmissionBonus"), field: 'ninth_twelfth_grade_bonus' },
                                    { label: t("BonusForNapTimeWatching"), field: 'nap_time_watching_bonus' },
                                    { label: t("BonusForKeyTeacherHeadOfSubjectDepartment"), field: 'key_leader_bonus' },
                                    { label: t("BonusForExceedingRequiredNumberOfPeriodsWithTeachingAssistanceService"), field: 'exceeding_required_number_of_period_bonus' },
                                    { label: t("PerformanceBasedIncentiveForNurses"), field: 'nursing_bonus' },
                                    { label: t("DoctorCaseBonus"), field: 'doctor_effective_working_bonus' },
                                    { label: t("VinmecNightShiftOnDutyBonus"), field: 'tip_of_duty' },
                                    { label: t("OncallBonus"), field: 'oncall_bonus' },
                                    { label: t("InfectionControlNetworkAllowance"), field: 'ksnk_network_bonus' },
                                    { label: t("JciTracerBonus"), field: 'jci_tracer_enrollment_bonus' },
                                    { label: t("OutOfRangeBonus"), field: 'over_frame_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("EfficiencyBonus"), field: 'performance_bonus' },
                                    { label: t("EbitdaBonus"), field: 'ebitda_bonus' },
                                    { label: t("PerformanceBonus"), field: 'effective_working_bonus' },
                                    { label: t("RollOutBonus"), field: 'roll_out_bonus' },
                                    { label: t("NetOtherBonusExceedRoomQuota"), field: 'over_contract_bonus' },
                                    { label: t("CaddieBonus"), field: 'caddie_fee_bonus' },
                                    { label: t("ConstructionSiteBonus"), field: 'construction_site_bonus' },
                                    { label: t("ScFinalization"), field: 'sc_bonus' },
                                    { label: t("NetKpiBonus"), field: 'kpi_bonus_net', isSplit: true },
                                    { label: t("KpiGrossBonus"), field: 'kpi_grossup_bonus' },
                                    { label: t("OtherNetBonus"), field: 'other_net_bonus', isSplit: true },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageSupport"), field: 'marriage_subsidy' },
                                    { label: t("FunerralSupport"), field: 'funerral_subsidy' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("LivingConditionSupport"), field: 'region_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("SpecializedJobSupport"), field: 'specific_work_allowance' },
                                    { label: t("IslandSupport"), field: 'work_on_island_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: 'Quà ngày lễ (VinID)', field: 'vinid_gift' },
                                    { label: 'Thưởng tiền mặt', field: 'cash_bonus' },
                                    { label: 'Công tác phí', field: 'mission_fee' },
                                    { label: 'Hỗ trợ học phí cho con CBNV NNN', field: 'tuition_fee_allowance' },
                                    { label: 'Hỗ trợ thu hút khó tuyển dụng', field: 'special_industry_subsidy' },
                                    { label: 'Hỗ trợ vé máy bay NNN', field: 'plane_ticket_allowance' },
                                    { label: 'Hỗ trợ mùa dịch Covid 19 (NET)', field: 'covid_allowance', isSplit: true },
                                    { label: 'Hỗ trợ mùa dịch Covid 19 (GROSSUP từ khoản NET tương ứng)', field: 'covid_grossup_allowance' },
                                    { label: 'Hỗ trợ lãi suất vay mua xe VF (NET)', field: 'interest_rate_allowance', isSplit: true },
                                    { label: 'Hỗ trợ lãi suất vay mua xe VF (GROSSUP từ khoản NET tương ứng)', field: 'interest_rate_grossup_allowance' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance', isSplit: true },
                                    { label: 'Hỗ trợ tiền thuê xe VF (GROSSUP từ khoản NET tương ứng)', field: 'car_rent_grossup_allowance' },
                                    { label: 'Hỗ trợ thuê nhà Vinhomes (NET)', field: 'house_rent_allowance', isSplit: true },
                                    { label: 'Hỗ trợ thuê nhà Vinhomes (GROSSUP từ khoản NET tương ứng)', field: 'house_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")} = Sum (II.1: II.3)`,
                field: 'income_reduction_incurred_amount',
                level2: [
                    {
                        label: t("DeductionItem"),
                        field: 'income_reduction_amount',
                        isSkipLevel4: true,
                        level3: [
                            { label: t("Reimbursement"), field: 'arrears' },
                            { label: t("DeductionOnBehaviorAndAttitudeBonus"), field: 'quality_of_work_reduction' },
                            { label: t("DeductionOnLoss"), field: 'damages' },
                            { label: 'Khấu trừ vay Quỹ Thiện Tâm', field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: 'Khấu trừ tiền thuê xe VF', field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: 'Khấu trừ lãi vay mua xe VF', field: 'vf_car_and_electric_motobike_purchase_deduction' },
                            { label: 'Bồi thường ưu đãi mua xe VF', field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")} = Sum (II.2.2 : II.2.3)`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: 'Mức lương đóng BHXH, BHYT', field: 'social_insurance_amount_in_salary' },
                                    { label: 'Mức lương đóng BHTN', field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: 'Trích nộp Bảo hiểm bắt buộc',
                                field: 'compulsary_insurance_amount_fee',
                                level4: [
                                    { label: t("SocialInsurance"), field: 'social_insurance_fee' },
                                    { label: t("MedicalInsurance"), field: 'health_insurance_fee' },
                                    { label: t("UnemploymentInsurance"), field: 'unemployment_insurance_fee' },
                                ]
                            },
                            {
                                label: t("TradeUnionMemberContribution"),
                                field: 'union_fee',
                                level4: []
                            }
                        ]
                    },

                    {
                        label: `${t("Pit")} = Sum(II.3.3)`,
                        field: 'personal_income_tax_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("PitReductionsAndOtherReductions"),
                                field: 'family_allowances_amount',
                                level4: [
                                    { label: t("DeductionForSelf"), field: 'personal_allowance' },
                                    { label: t("DeductionForDependents"), field: 'dependant_allowance' },
                                    { label: t("OtherReductions"), field: 'other_allowance' }
                                ]
                            },
                            {
                                label: t("TotalTaxable"),
                                field: 'income_tax_include_amount',
                                level4: []
                            },
                            {
                                label: t("TaxablePitInPeriod"),
                                field: 'personal_income_tax_in_period_amount',
                                level4: [
                                    { label: t("PitPaidByEmployee"), field: 'personal_income_tax_is_paid_by_employee' },
                                    { label: t("PitPaidByEmployer"), field: 'personal_income_tax_is_paid_by_employer' }
                                ]
                            }
                        ]
                    },

                ]
            },
            {
                index: 'III',
                label: `${t("ActualReceivable")} = III.1 `,
                field: 'net_salary_amount',
                level2: [
                    {
                        label: t("FirstPayment"),
                        field: 'pay_first',
                        isSkipLevel4: true,
                        level3: [
                            {
                                label: 'Trả vào tài khoản ngân hàng',
                                field: ''
                            },
                            {
                                label: 'Trả vào Ví VinID Pay',
                                field: ''
                            }
                        ]
                    },
                    {
                        label: t("SecondPayment"),
                        field: 'pay_second',
                        isSkipLevel4: true,
                        level3: [
                            {
                                label: 'Trả vào tài khoản ngân hàng',
                                field: ''
                            }
                        ]
                    },
                    {
                        label: t("ThirdPayment"),
                        field: '',
                        level3: []
                    }
                ]
            }
        ]
    }
};