import { useState, useEffect } from "react"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import moment from 'moment'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import IconApprove from 'assets/img/icon/Icon_Check.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const currentLocale = localStorage.getItem("locale")

const HealthInsurance = (props) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [healthInsuranceData, setHealthInsuranceData] = useState(null)

//   props.match.params.version;

    useEffect(() => {
        const processHealthInsuranceData = response => {
            // if (response && response.data) {
            //     const result = response.data.result
            //     if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
            //         const evaluationFormDetailTemp = response.data?.data;
            //         if (evaluationFormDetailTemp.listGroup) {
            //             evaluationFormDetailTemp.listGroup = ([...evaluationFormDetailTemp?.listGroup] || []).sort((pre, next) => pre?.groupOrder - next?.groupOrder)
            //         }
            //         setHealthInsuranceData(evaluationFormDetailTemp)
            //     }
            // }
        }

        // const fetchHealthInsurance = async () => {
        //     setIsLoading(true)
        //     try {
        //         const config = getRequestConfigurations()
        //         // config.params = {
        //         // checkPhaseFormId: evaluationFormId,
        //         // EmployeeCode: showByManager ? props.employeeCode : user?.employeeNo,
        //         // FormCode: formCode
        //         // }
        //         // const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/${version}/targetform/formbyuser`, config)
        //         processHealthInsuranceData(response)
        //     } finally {
        //         setIsLoading(false)
        //     }
        // }

        // props?.needLoad && fetchHealthInsurance()
    }, [props?.needLoad])

    const handleInputChange = () => {

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
                        <h1 className="tab-title">{t("Bảo hiểm sức khỏe")}</h1>
                        <div className="shadow-customize main-content">
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="label">Quan hệ bảo hiểm</p>
                                    <Select 
                                        placeholder={t("EvaluationSelectYear")} 
                                        isClearable={true} 
                                        value={null} 
                                        options={[]} 
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <p className="label">Ngày bắt đầu</p>
                                    <label className="wrap-date-input">
                                        <DatePicker
                                            // selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                            selected={null}
                                            onChange={date => handleInputChange('fromDate', date ? moment(date).format('YYYY-MM-DD') : null)}
                                            dateFormat="dd/MM/yyyy"
                                            showMonthDropdown={true}
                                            showYearDropdown={true}
                                            locale="vi"
                                            className="form-control input" />
                                        <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                                    </label>
                                </div>
                                <div className="col-md-3">
                                    <p className="label">Ngày kết thúc</p>
                                    <div className="value">30/12/2023</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="label">Đơn vị bảo hiểm</p>
                                    <div className="value">B - Bảo hiểm PVI</div>
                                </div>
                                <div className="col-md-6">
                                    <p className="label">Gói bảo hiểm</p>
                                    <div className="value">G9-Gold 56 - 60</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="label">Họ tên người được BH</p>
                                    <div className="value">Nguyễn Văn Cường</div>
                                </div>
                                <div className="col-md-6">
                                    <p className="label">Mã số thẻ</p>
                                    <div className="value">0123456789</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <p className="label">Công ty pháp lý</p>
                                    <div className="value">AB31 - Công ty BĐS Vinhomes</div>
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
