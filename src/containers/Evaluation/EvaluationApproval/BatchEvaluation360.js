import React, { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Row, Col, Collapse } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import { evaluationStatus, actionButton, processStep, stepEvaluation360Config, evaluation360Status, evaluationApiVersion } from '../Constants'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations, getCurrentLanguage } from '../../../commons/Utils'
import { isJsonString } from "utils/string"
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import EvaluationDetailModal from '../EvaluationDetailModal'
import SearchUser from '../SearchUser'
import CustomPaging from '../../../components/Common/CustomPaging'
import HOCComponent from '../../../components/Common/HOCComponent'
import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'
import IconCollapse from '../../../assets/img/icon/pms/icon-collapse.svg'
import IconSearch from '../../../assets/img/icon/Icon_Loop.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconApprove from '../../../assets/img/icon/Icon_Check.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const employeeCode = localStorage.getItem('employeeNo')
const employeeAD = localStorage.getItem('email').split('@')[0]
const approvalTabCode = 'approval'
const batchApprovalTabCode = 'batchApproval'

const BatchEvaluation360 = (props) => {
    const { t } = useTranslation()
    const history = useHistory()
    const [isLoading, SetIsLoading] = useState(false)

    useEffect(() => {

    }, [])

    const lang = getCurrentLanguage()

    const scores = [1,2,3,4,5]

    return (
        <>
        <LoadingModal show={isLoading} />
        {/* <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} className='evaluation-status-modal' /> */}
        
        <div className="card shadow batch-evaluation-360">
            <div className="wrap-table-batch-evaluation-360">
                <table>
                    <thead>
                        <tr>
                            <th className="col-customize sticky-col kpi">Nội dung đánh giá</th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Nguyễn Văn Cường</div>
                                    <div className="employee-code">(3651641)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Nguyễn Đức Chiến</div>
                                    <div className="employee-code">(3651642)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Nguyễn Tiến Lợi</div>
                                    <div className="employee-code">(3999999)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Nguyễn Hoàng Minh</div>
                                    <div className="employee-code">(37896454)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Vũ Tiến Vượng</div>
                                    <div className="employee-code">(37896454)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Khương Văn Minh</div>
                                    <div className="employee-code">(37896454)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Trần Duy Đạt</div>
                                    <div className="employee-code">(37896454)</div>
                                </div>
                            </th>
                            <th className="col-customize user-point">
                                <div className="user">
                                    <div className="full-name">Trần Hữu Đạt</div>
                                    <div className="employee-code">(37896454)</div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="group">
                            <td colSpan={3} className="sticky-col group">Năng lực chuyên môn | Professional competency</td>
                        </tr>
                        <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={9} className="row-seperate"></td>
                        </tr>
                        <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={9} className="row-seperate"></td>
                        </tr>
                        <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr className="group">
                            <td colSpan={3} className="sticky-col group">Năng lực chuyên môn | Professional competency</td>
                        </tr>
                        <tr className="kpi-item">
                            <td className="col-customize sticky-col kpi">Năng lực chuyên môn sâu rộng, đáp ứng nhiệm vụ được giao | Extensive professional competence, meeting assigned tasks</td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td className="col-customize user-point">
                                <select onChange={e => handleInputChange(e)} value={''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

export default BatchEvaluation360
