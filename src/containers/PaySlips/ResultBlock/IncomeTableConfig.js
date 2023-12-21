export const IncomeTablesConfig = t => {
    return {
        Vinpearl: [
            {
                index: 'I',
                label: `${t("Allowance")}`,
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
                                    { label: t("ToxicSubstancesAllowance"), field: 'dangerous_allowance' }
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("LivingConditionSupport"), field: 'region_allowance' },
                                    { label: t("RelocationSupport"), field: 'region_displace_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("HolidayGifts"), field: 'holiday_gifts' },
                                    { label: t("SpecializedJobSupport"), field: 'specific_work_allowance' },
                                    { label: t("IslandSupport"), field: 'work_on_island_allowance' },
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
                                    // { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("RefundForVFCarAndElectricMotobikePurchaseDiscount"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                label: `${t("ActualReceivable")}`,
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
                label: `${t("Allowance")}`,
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
                                label: t("AdditionalAllowance"),
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
                                    { label: t("SpecialAndRareIndustrySupport"), field: 'special_industry_subsidy' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance', isSplit: true },
                                    { label: t("GrossLoanInterestSupportVFCarAndElectricMotobikePurchase"), field: 'interest_rate_grossup_allowance' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance', isSplit: true },
                                    { label: t("VFCarAndElectricMotobikeLeasingGrossSupport"), field: 'car_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("DeductionLoanFromKindHeartFoundation"), field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("VFCarAndElectricMotobikeLeasingDeduction"), field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: t("RefundForVFCarAndElectricMotobikePurchaseDiscount"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                        label: t("PaymentIntoBankAccount"),
                        field: 'net_salary_amount',
                        level3: []
                    }
                ]
            }
        ],

        VinFast: [
            {
                index: 'I',
                label: `${t("Allowance")}`,
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
                                    { label: t("ResponsibilityAllowance"), field: 'responsibility_allowance' },
                                    { label: t("SeniorityAllowance"), field: 'seniority_allowances' },
                                    { label: t("WorkingConditionsAllowance"), field: 'allowance_working_conditions' },
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("KpiBonusGrossup"), field: 'kpi_grossup_bonus' },
                                    { label: t("PerformanceBonusVinfastGrossup"), field: 'bonus_hqcv_vf_grossup' },
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
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("NETCovid19PandemicSubsidy"), field: 'covid_allowance'},
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("HousingSubsidyGrossup"), field: 'housing_allowance_grossup' },
                                    { label: t("SupportVinfastCampaignAndProject"), field: 'support_vf_campaign_project' },
                                    { label: t("BenefitsPayingThroughSalaryGrossup"), field: 'welfare_grossup_allowance' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                label: `${t("ActualReceivable")}`,
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
                label: `${t("Allowance")}`,
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
                                    { label: t("ToxicSubstancesAllowance"), field: 'dangerous_allowance' },
                                    { label: t("ResponsibilityAllowance"), field: 'responsibility_allowance' },
                                    { label: t("AppearanceAllowance"), field: 'looking_allowance' },
                                    { label: t("ForeignLanguageAllowance"), field: 'foreign_language_allowance' },
                                    { label: t("AllowanceForNursingPosition"), field: 'nursing_allowance' }
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("NETCovidCampaignBonus"), field: 'covid_net' },
                                    { label: t("GROSSSUPCovidCampaignBonus"), field: 'covid_gross' },
                                    { label: t("GROSSCovidCampaignBonus"), field: 'covid_gross_bonus' },
                                    { label: t("PerformanceBasedIncentiveForNurses"), field: 'nursing_bonus' },
                                    { label: t("WageTypeBonusForCareManager"), field: 'care_manager_bonus' },
                                    { label: t("WageTypeTopicsBonus"), field: 'topics_bonus' },
                                    { label: t("DoctorCaseBonus"), field: 'doctor_effective_working_bonus' },
                                    { label: t("Medicine_sales_bonus"), field: 'medicine_sales_bonus' },
                                    { label: t("High_tech_center_sales_bonus"), field: 'high_tech_center_sales_bonus' },
                                    { label: t("VinmecOtherBonus"), field: 'vm_bonus_revenue_other' },
                                    { label: t("TelehealthServicesBonus"), field: 'telehealth_services' },
                                    { label: t("VinmecReferralRevenueBonus"), field: 'referral_revenue_bonus' },
                                    { label: t("CovidMobilzationAllowance"), field: 'covid_mobilzation' },
                                    { label: t("VinmecRollOutBonus"), field: 'roll_out_bonus' },
                                    { label: t("Sales_bonus"), field: 'sales_bonus' },
                                    { label: t("Head_of_sub_commitee_bonus"), field: 'head_of_sub_commitee_bonus' },
                                    { label: t("VinmecNightShiftOnDutyBonus"), field: 'tip_of_duty' },
                                    { label: t("OncallBonus"), field: 'oncall_bonus' },
                                    { label: t("InfectionControlNetworkAllowance"), field: 'ksnk_network_bonus' },
                                    { label: t("JciTracerBonus"), field: 'jci_tracer_enrollment_bonus' },
                                    { label: t("OutOfRangeBonus"), field: 'over_frame_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("TrainingBonusForVinmec"), field: 'trainning_bonus' },
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
                                    { label: t("HousingSubsidyNet"), field: 'housing_allowance_net' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("LivingConditionSupport"), field: 'region_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("OtBonus"), field: 'overtime_payment' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("VinmecJobLossAllowance"), field: 'severance_allowance_job' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("Retroactive"), field: 'back_pay' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("VinmecHolidayWelfarePayment"), field: 'holiday_welfare' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("VinIdGift"), field: 'vinid_gift' },
                                    { label: t("CashBonus"), field: 'cash_bonus' },
                                    { label: t("PerDiem"), field: 'mission_fee' },
                                    { label: t("TuitionFeeForExpatChildren"), field: 'tuition_fee_allowance' },
                                    { label: t("SpecialAndRareIndustrySupport"), field: 'special_industry_subsidy' },
                                    { label: t("AirTickerForExpat"), field: 'plane_ticket_allowance' },
                                    { label: t("NETCovid19PandemicSubsidy"), field: 'covid_allowance', isSplit: true },
                                    { label: t("Covid19SupportGrossUp"), field: 'covid_grossup_allowance' },
                                    { label: t("GROSSCovid19PandemicSubsidy"), field: 'covid_gross_subsidy' },
                                    { label: t("NETF0EmployeesSubsidy"), field: 'covid_net_f0' },
                                    { label: t("GROSSF0EmployeesSubsidy"), field: 'covid_gross_f0' },
                                    { label: t("NetLoanInterestSupportVFCarAndElectricMotobikePurchaseNet"), field: 'interest_rate_allowance', isSplit: true },
                                    { label: t("GrossLoanInterestSupportVFCarAndElectricMotobikePurchase"), field: 'interest_rate_grossup_allowance' },
                                    { label: t("VFCarAndElectricMotobikeLeasingNetSupport"), field: 'car_rent_allowance', isSplit: true },
                                    { label: t("VFCarAndElectricMotobikeLeasingGrossSupport"), field: 'car_rent_grossup_allowance' },
                                    { label: t("VinhomeRentalSupportNET"), field: 'house_rent_allowance', isSplit: true },
                                    { label: t("VinhomeRentalSupportGrossUp"), field: 'house_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' },
                                    { label: t("VFCarElectricStakeNet"), field: 'vf_car_electric_stake_net' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("DeductionLoanFromKindHeartFoundation"), field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: t("VFCarAndElectricMotobikeLeasingDeduction"), field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: t("DeductionForVFPurchaseInterestCost"), field: 'vf_car_and_electric_motobike_purchase_deduction' },
                            { label: t("RefundForVfVihicle"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                label: `${t("ActualReceivable")}`,
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
                label: `${t("Allowance")}`,
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
                                    { label: t("ToxicSubstancesAllowance"), field: 'dangerous_allowance' }
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("GasAllowance"), field: 'gas_allowance' },
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
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("RefundForVFCarAndElectricMotobikePurchaseDiscount"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                        label: t("PaymentIntoBankAccount"),
                        field: 'net_salary_amount',
                        level3: []
                    }
                ]
            }
        ],

        VinHome: [
            {
                index: 'I',
                label: `${t("Allowance")}`,
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
                                label: t("HourWages"),
                                field: 'hourly_salary'
                            },
                            {
                                label: t("SalaryStoppedWorkingAgreement"),
                                field: 'salary_stopped_working_agreement'
                            }
                        ]
                    },
                    {
                        label: t("SalaryAllowance"),
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
                                    { label: t("MonthlyIncentivesBonusCash"), field: 'cash_bonus' },
                                    { label: t("ReferralBonus"), field: 'reference_bonus' }
                                ]
                            },
                            {
                                label: t("OtherBonus"),
                                field: 'other_payment_amount',
                                level4: [
                                    { label: t("LunchAllowance"), field: 'shift_eating_allowance' },
                                    { label: t("SpecializedJobSupport"), field: 'specific_work_allowance' },
                                    { label: t("SickSupport"), field: 'sick_accident_allowance' },
                                    { label: t("MarriageAndCondolencestSupport"), field: 'funeral_wedding_allowance' },
                                    { label: t("HousingSupport"), field: 'housing_allowance' },
                                    { label: t("TransportationSupport"), field: 'transfer_allowance' },
                                    { label: t("TelephoneSupport"), field: 'phone_allowance' },
                                    { label: t("RelocationSupport"), field: 'region_displace_allowance' },
                                    { label: t("IntermittenShiftSupport"), field: 'shifts_allowance' },
                                    { label: t("OtherSupport"), field: 'other_specific' },
                                    { label: t("OvertimeTaxIncluded"), field: 'overtime_payment_tax_included' },
                                    { label: t("OvertimeWithoutTax"), field: 'overtime_payment_without_tax' },
                                    { label: t("NightBonus"), field: 'night_shift_allowance' },
                                    { label: t("AnnualLeaveToilEncashment"), field: 'annual_leave_payment' },
                                    { label: t("MuatuallyAgreedTerminationBonus"), field: 'resignation_agreement_allowance' },
                                    { label: t("SeveranceAllowance"), field: 'severance_allowance' },
                                    { label: t("RetroTaxIncluded"), field: 'back_pay_tax_included' },
                                    { label: t("RetroWithoutTax"), field: 'back_pay_without_tax' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance' },
                                    { label: t("BenefitForVfPurchase"), field: 'car_rent_allowance_welfare' },
                                    { label: t("BankInterestSupportForVfPurchase"), field: 'interest_rate_allowance' },
                                    { label: t("BenefitNet"), field: 'welfare_net_allowance' },
                                    { label: t("AnnualWelfare"), field: 'annual_welfare_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' },
                                    { label: t("SupportCampaignAndProject"), field: 'support_vf_campaign_project' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("VFPurchaseInterestCostDeduction"), field: 'vf_car_and_electric_motobike_purchase_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                label: `${t("Allowance")}`,
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
                                    { label: t("VinmecAllowanceForExceedingTeachingPeriods"), field: 'exceeding_required_number_of_period_bonus' },
                                ]
                            },
                            {
                                label: t("AllowanceIfAny"),
                                field: 'allowance_amount',
                                level4: [
                                    { label: t("AdditionalResponsibilitiesAllowance"), field: 'pluralism_allowance' },
                                    { label: t("PositionAllowance"), field: 'key_leader_bonus' },
                                    { label: t("BonusForNapTimeWatching"), field: 'nap_time_watching_bonus' },
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("VinSchoolNetKpiBonus"), field: 'kpi_bonus' },
                                    { label: t("AchievementBonus"), field: 'archievement_bonus' },
                                    { label: t("ProjectBonus"), field: 'project_campaign_bonus' },
                                    { label: t("MobilizationBonus"), field: 'mobilizing_bonus' },
                                    { label: t("TrainingBonus"), field: 'trainning_bonus' },
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },
                                    { label: t("VSC1OutOfSalaryBonus"), field: 'non_salary_VSC_1_bonus' },
                                    { label: t("ReferralBonus"), field: 'reference_bonus' },
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
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' },
                                    { label: t("VinmecUnionSupport"), field: 'union_support' },
                                    { label: t("BonusForNapTimeWatching"), field: 'nap_time_watching_bonus' },
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("RefundForVFCarAndElectricMotobikePurchaseDiscount"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
        // Tạo phiếu lương riêng cho VinBigData (ILVGR-846)
        // Lúc trước VinBigData thuộc phiếu lương chung. Nên update wage types mới cho phiếu lương chung thì cũng phải update cho VinBigData.
        VinBigData: [
            {
                index: 'I',
                label: `${t("Allowance")}`,
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
                                    { label: t("BehaviorAndAttitudeBonusForQuarterlySettlement"), field: 'quality_of_work_quarterly_settlement_bonus' },
                                    { label: t("NumberOfSharesConverted"), field: 'number_of_shares_converted' },
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
                                    { label: t("ToxicSubstancesAllowance"), field: 'dangerous_allowance' },
                                    { label: t("ResponsibilityAllowance"), field: 'responsibility_allowance' },
                                    { label: t("SeniorityAllowance"), field: 'seniority_allowances' },
                                    { label: t("WorkingConditionsAllowance"), field: 'allowance_working_conditions' },
                                    { label: t("ForeignLanguageAllowance"), field: 'foreign_language_allowance' },
                                    { label: t("AppearanceAllowance"), field: 'looking_allowance' },
                                    { label: t("AllowanceForNursingPosition"), field: 'nursing_allowance' }
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("ReferralBonus"), field: 'reference_bonus' },
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
                                    { label: t("VinIdGift"), field: 'vinid_gift' },
                                    { label: t("CashBonus"), field: 'cash_bonus' },
                                    { label: t("PerDiem"), field: 'mission_fee' },
                                    { label: t("TuitionFeeForExpatChildren"), field: 'tuition_fee_allowance' },
                                    { label: t("SpecialAndRareIndustrySupport"), field: 'special_industry_subsidy' },
                                    { label: t("HousingSubsidyNet"), field: 'housing_allowance_net' },
                                    { label: t("SpecialJobAllowanceForVinES"), field: 'specific_work_allowance_vines' },
                                    { label: t("SupportCampaignAndProject"), field: 'support_vf_campaign_project' },
                                    { label: t("AirTickerForExpat"), field: 'plane_ticket_allowance' },
                                    { label: t("NETCovid19PandemicSubsidy"), field: 'covid_allowance', isSplit: true },
                                    { label: t("Covid19SupportGrossUp"), field: 'covid_grossup_allowance' },
                                    { label: t("NetLoanInterestSupportVFCarAndElectricMotobikePurchaseNet"), field: 'interest_rate_allowance', isSplit: true },
                                    { label: t("GrossLoanInterestSupportVFCarAndElectricMotobikePurchase"), field: 'interest_rate_grossup_allowance' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance', isSplit: true },
                                    { label: t("VFCarAndElectricMotobikeLeasingGrossSupport"), field: 'car_rent_grossup_allowance' },
                                    { label: t("VinhomeRentalSupportNET"), field: 'house_rent_allowance', isSplit: true },
                                    { label: t("VinhomeRentalSupportGrossUp"), field: 'house_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VFCarElectricStakeNet"), field: 'vf_car_electric_stake_net' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("DeductionLoanFromKindHeartFoundation"), field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: t("VFCarAndElectricMotobikeLeasingDeduction"), field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: t("DeductionForVFPurchaseInterestCost"), field: 'vf_car_and_electric_motobike_purchase_deduction' },
                            { label: t("RefundForVFCarAndElectricMotobikePurchaseDiscount"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                                label: t("PaymentIntoBankAccount"),
                                field: ''
                            },
                            {
                                label: t("PaymentIntoVinIDPayWallet"),
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
                                label: t("PaymentIntoBankAccount"),
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
        ],
        VinGroup: [
            {
                index: 'I',
                label: `${t("Allowance")}`,
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
                                    { label: t("ToxicSubstancesAllowance"), field: 'dangerous_allowance' },
                                    { label: t("ResponsibilityAllowance"), field: 'responsibility_allowance' },
                                    { label: t("SeniorityAllowance"), field: 'seniority_allowances' },
                                    { label: t("WorkingConditionsAllowance"), field: 'allowance_working_conditions' },
                                    { label: t("ForeignLanguageAllowance"), field: 'foreign_language_allowance' },
                                    { label: t("AppearanceAllowance"), field: 'looking_allowance' },
                                    { label: t("AllowanceForNursingPosition"), field: 'nursing_allowance' }
                                ]
                            },
                            {
                                label: t("AdditionalAllowance"),
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
                                    { label: t("ReferralBonus"), field: 'reference_bonus' },
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
                                    { label: t("GrossOtherBonus"), field: 'other_gross_bonus' },
                                    { label: t("ReferralBonusGrossup"), field: 'reference_gross_bonus' }
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
                                    { label: t("VinIdGift"), field: 'vinid_gift' },
                                    { label: t("CashBonus"), field: 'cash_bonus' },
                                    { label: t("PerDiem"), field: 'mission_fee' },
                                    { label: t("TuitionFeeForExpatChildren"), field: 'tuition_fee_allowance' },
                                    { label: t("SpecialAndRareIndustrySupport"), field: 'special_industry_subsidy' },
                                    { label: t("HousingSubsidyNet"), field: 'housing_allowance_net' },
                                    { label: t("SpecialJobAllowanceForVinES"), field: 'specific_work_allowance_vines' },
                                    { label: t("SupportCampaignAndProject"), field: 'support_vf_campaign_project' },
                                    { label: t("AirTickerForExpat"), field: 'plane_ticket_allowance' },
                                    { label: t("NETCovid19PandemicSubsidy"), field: 'covid_allowance', isSplit: true },
                                    { label: t("Covid19SupportGrossUp"), field: 'covid_grossup_allowance' },
                                    { label: t("NetLoanInterestSupportVFCarAndElectricMotobikePurchaseNet"), field: 'interest_rate_allowance', isSplit: true },
                                    { label: t("GrossLoanInterestSupportVFCarAndElectricMotobikePurchase"), field: 'interest_rate_grossup_allowance' },
                                    { label: t("VfRentalSupport"), field: 'car_rent_allowance', isSplit: true },
                                    { label: t("VFCarAndElectricMotobikeLeasingGrossSupport"), field: 'car_rent_grossup_allowance' },
                                    { label: t("VinhomeRentalSupportNET"), field: 'house_rent_allowance', isSplit: true },
                                    { label: t("VinhomeRentalSupportGrossUp"), field: 'house_rent_grossup_allowance' },
                                    { label: t("OtherPayment"), field: 'other_payment' },
                                    { label: t("VFCarElectricStakeNet"), field: 'vf_car_electric_stake_net' },
                                    { label: t("VFCarElectricStakeGross"), field: 'vf_car_electric_stake' },
                                    { label: t("VinmecTaxRefundsAfterTaxFinalization"), field: 'tax_refunds_after' }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                index: 'II',
                label: `${t("Deduction")}`,
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
                            { label: t("DeductionLoanFromKindHeartFoundation"), field: 'deduction_of_loan_from_kind_heart_foundation' },
                            { label: t("CollectionOnBehalfOfQuyThienTam"), field: 'loan_reduction' },
                            { label: t("AdvanceDeduction"), field: 'advance_reduction' },
                            { label: t("AdvanceViaVinidDeduction"), field: 'vinid_pay_reduction' },
                            { label: t("DeductionOnUsedBenefits"), field: 'bonus_received_reduction' },
                            { label: t("VFCarAndElectricMotobikeLeasingDeduction"), field: 'vf_car_and_electric_motobike_leasing_deduction' },
                            { label: t("DeductionForVFPurchaseInterestCost"), field: 'vf_car_and_electric_motobike_purchase_deduction' },
                            { label: t("RefundForVFCarAndElectricMotobikePurchaseDiscount"), field: 'refund_for_vf_car_and_electric_motobike_purchase_discount' },
                            { label: t("OtherDeductions"), field: 'other_deduction' },
                            { label: t("VinmecAdditionalTaxAfterTaxFinalization"), field: 'tax_additional_after' }
                        ]
                    },
                    {
                        label: `${t("DeductionOnInsuranceAndTradeUnion")}`,
                        field: 'insurance_union_payment_amount',
                        isSkipSumLabel: true,
                        level3: [
                            {
                                label: t("SalaryForStatutorySocialInsuranceContribution"),
                                field: 'compulsary_insurance_amount_in_salary',
                                isSkipSumLabel: true,
                                level4: [
                                    { label: t("SalaryStatutorySocialAndHealthInsuranceContribution"), field: 'social_insurance_amount_in_salary' },
                                    { label: t("SalaryStatutoryUnemploymentInsuranceContribution"), field: 'unemployment_insurance_amount_in_salary' }
                                ]
                            },
                            {
                                label: t("StatutorySocialHealthInsuranceContribution"),
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
                        label: `${t("Pit")}`,
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
                                label: t("PaymentIntoBankAccount"),
                                field: ''
                            },
                            {
                                label: t("PaymentIntoVinIDPayWallet"),
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
                                label: t("PaymentIntoBankAccount"),
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
