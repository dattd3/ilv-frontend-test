import { useState, useEffect } from "react"
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import { formatStringByMuleValue, getMuleSoftHeaderConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'

const HealthInsurance = (props) => {
    const insuranceByRelationIndividual = 'V000' // Cá nhân
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [healthInsuranceData, setHealthInsuranceData] = useState(null)
    const [healthInsuranceByRelations, setHealthInsuranceByRelations] = useState(null)
    const [healthInsuranceDetail, setHealthInsuranceDetail] = useState(null)
    const [dataFilter, setDataFilter] = useState({
        healthInsuranceByRelation: null,
        startDate: null,
    })

    useEffect(() => {
        const processHealthInsuranceData = response => {
            if (response?.data?.data) {
                const data = _.chain(response?.data?.data)
                .groupBy("insurance_relations")
                .toPairs()
                .map(item => _.zipObject(["insurance_relations", "start_date", "end_date", "card_number", "fullname_insured_person", "insurance_unit", "legal_company", "name_insured_person"], item))
                .value()
                .map(item => {
                    return {
                        insurance_relations: item?.insurance_relations,
                        start_date: item?.start_date,
                    }
                })
                setHealthInsuranceData(data || [])

                const defaultHealthInsuranceByRelations = (data || []).find(item => item?.insurance_relations === insuranceByRelationIndividual)
                setHealthInsuranceByRelations(defaultHealthInsuranceByRelations)

                const dateDefault = (defaultHealthInsuranceByRelations?.start_date || [])
                .map(item => item?.start_date)
                .sort((prev, next) => {
                    return moment(prev, "DD-MM-YYYY").isBefore(moment(next, "DD-MM-YYYY")) ? 1 : -1
                })[0] || null

                setHealthInsuranceDetail((defaultHealthInsuranceByRelations?.start_date || []).find(item => item?.start_date === dateDefault))

                const dataFilterClone = {...dataFilter}
                dataFilterClone.healthInsuranceByRelation = { value: defaultHealthInsuranceByRelations?.insurance_relations, label: defaultHealthInsuranceByRelations?.insurance_relations }
                dataFilterClone.startDate = dateDefault ? { value: dateDefault, label: moment(dateDefault, "DD-MM-YYYY")?.format("DD/MM/YYYY") } : null
                setDataFilter(dataFilterClone)
            }
        }

        const fetchHealthInsurance = async () => {
            setIsLoading(true)
            try {
                const config = getMuleSoftHeaderConfigurations()
                const response = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/health/insurance`, config)
                processHealthInsuranceData(response)
            } finally {
                setIsLoading(false)
            }
        }

        props?.needLoad && fetchHealthInsurance()
    }, [props?.needLoad])

    const handleSelectChange = (key, e) => {
        const dataFilterClone = {...dataFilter}
        dataFilterClone[key] = e

        if (key === 'healthInsuranceByRelation') {
            setHealthInsuranceByRelations((healthInsuranceData || []).find(item => item?.insurance_relations === e?.value))
            setHealthInsuranceDetail(null)
            dataFilterClone.startDate = null
        } else {
            setHealthInsuranceDetail((healthInsuranceByRelations?.start_date || []).find(item => item?.start_date === e?.value))
        }

        setDataFilter(dataFilterClone)
    }
    
    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="health-insurance-tab">
                {
                    healthInsuranceData?.length === 0
                    ? (<h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>)
                    : (
                        <>
                        <h1 className="tab-title">{t("HealthInsurance")}</h1>
                        <div className="shadow-customize main-content">
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="label">{t("InsuranceRelations")}</p>
                                    <Select 
                                        placeholder={t("EvaluationSelectYear")} 
                                        isClearable={true} 
                                        value={dataFilter?.healthInsuranceByRelation} 
                                        options={(healthInsuranceData || []).map(item => {
                                            return {
                                                value: item?.insurance_relations,
                                                label: item?.insurance_relations,
                                            }
                                        })} 
                                        onChange={e => handleSelectChange('healthInsuranceByRelation', e)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <p className="label">{t("StartDate")}</p>
                                    <Select 
                                        placeholder={t("EvaluationSelectYear")} 
                                        isClearable={true} 
                                        value={dataFilter?.startDate} 
                                        options={(healthInsuranceByRelations?.start_date || []).map(item => {
                                            return {
                                                value: item?.start_date,
                                                label: moment(item?.start_date, "DD-MM-YYYY")?.format("DD/MM/YYYY"),
                                            }
                                        })} 
                                        onChange={e => handleSelectChange('startDate', e)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <p className="label">{t("EndDate")}</p>
                                    <div className="value">{moment(healthInsuranceDetail?.end_date, "DD-MM-YYYY")?.isValid() ? moment(healthInsuranceDetail?.end_date, "DD-MM-YYYY").format("DD/MM/YYYY") : ''}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="label">{t("InsuranceUnit")}</p>
                                    <div className="value">{formatStringByMuleValue(healthInsuranceDetail?.insurance_unit)}</div>
                                </div>
                                <div className="col-md-6">
                                    <p className="label">{t("InsurancePackage")}</p>
                                    <div className="value">{formatStringByMuleValue(healthInsuranceDetail?.fullname_insured_person)}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="label">{t("FullNameOfInsured")}</p>
                                    <div className="value">{formatStringByMuleValue(healthInsuranceDetail?.name_insured_person)}</div>
                                </div>
                                <div className="col-md-6">
                                    <p className="label">{t("CardNumber")}</p>
                                    <div className="value">{formatStringByMuleValue(healthInsuranceDetail?.card_number)}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <p className="label">{t("PAndL")}</p>
                                    <div className="value">{formatStringByMuleValue(healthInsuranceDetail?.legal_company)}</div>
                                </div>
                            </div>
                        </div>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default HealthInsurance
