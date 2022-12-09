import React from 'react'
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import ResizableTextarea from '../TextareaComponent'

class InterviewContentFormComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            timeJoinDefault: null,
            timeInDefault: null,
            resignationReasonOptionsChecked: [],
            comments: {}
        }
    }

    getTimeSurveyOptions = (type, t) => {
        return [
            { value: 1, label: t('less_6_months'), element: `${type}-less-6-month`},
            { value: 2, label: t('2_years'), element: `${type}-2-year`},
            { value: 3, label: t('2_5_years'), element: `${type}-2-5-year`},
            { value: 4, label: t('greater_5_years'), element: `${type}-than-5-year`}
        ]
    }

    handleChangeRadioInput = (e, type) => {
        const {isViewOnly} = this.props
        if (isViewOnly) {
            return
        }

        if (e) {
            const checkedValue = e.target?.value
            this.setState({ [type]: checkedValue })
            this.props.updateInterviewContents(type, checkedValue)
        }
    }

    handleCheckboxChange = (type, code, e) => {
        const {isViewOnly} = this.props
        if (isViewOnly) {
            return
        }

        const resignationReasonOptionsChecked = [...this.props.resignationReasonOptionsChecked]
        resignationReasonOptionsChecked[code] = {key: code, value: e.target.checked, type: type}

        this.setState({resignationReasonOptionsChecked: resignationReasonOptionsChecked})
        this.props.updateInterviewContents("resignationReasonOptionsChecked", resignationReasonOptionsChecked)
    }

    handleTextareaChange = (code, e) => {
        const {isViewOnly} = this.props
        if (isViewOnly) {
            return
        }
        const comments = {...this.props.comments}
        comments[code] = e.target.value || ""

        this.setState({comments: comments})
        this.props.updateInterviewContents("comments", comments)
    }

    render() {
        const { t, serveyInfos, serveyDetail, isViewOnly, timeJoinDefault, timeInDefault, resignationReasonOptionsChecked, comments } = this.props
        
        const timeJoinSurveyOptions = this.getTimeSurveyOptions("join", t)
        const timeInSurveyOptions = this.getTimeSurveyOptions("in", t)
        return (
            <>
            <div className="block interview-content-block">
                    <h6 className="block-title">II. {t('noi_dung_phong_van')}</h6>
                    <div className="box">
                        <div className="row">
                            <div className="col-12">
                                <p className="question">{t('ban_gia_nhap_cong_ty_cach_day_bao_lau')}</p>
                                <div className="answer">
                                    {
                                        (timeJoinSurveyOptions || []).map((item, index) => {
                                            const isDefault = item.value == timeJoinDefault
                                            return <span key={index}>
                                                        <input type="radio" value={item.value} checked={isDefault} id={item.element} name={item.element} onChange={e => this.handleChangeRadioInput(e, "timeJoinDefault")} />
                                                        <label htmlFor={item.element}>{item.label}</label>
                                                    </span>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <hr className="divider" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="question">{t('ban_o_vi_tri_hien_tai_duoc_bao_lau')}</p>
                                <div className="answer">
                                    {
                                        (timeInSurveyOptions || []).map((item, index) => {
                                            const isDefault = item.value == timeInDefault
                                            return <span key={index}>
                                                        <input type="radio" value={item.value} checked={isDefault} id={item.element} name={item.element} onChange={e => this.handleChangeRadioInput(e, "timeInDefault")} />
                                                        <label htmlFor={item.element}>{item.label}</label>
                                                    </span>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block interview-content-block">
                    <h6 className="block-title">III. {t('ly_do_thoi_viec')}</h6>
                    <div className="row">
                        <div className="col-12">
                            <table className="list-staff">
                                <thead>
                                    <tr>
                                        <th className="col-first">{t('danh_muc')}</th>
                                        <th className="col-second">{t('option')}</th>
                                        <th className="col-third">{t('dien_giai')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (serveyInfos || []).map((item, index) => {
                                            const options = item.data
                                            const optionSelected = item.responseKeyOptionSelects ? serveyDetail[item.responseKeyOptionSelects] : ""
                                            const optionSelectedToArray = optionSelected ? optionSelected.split(",") : []
                                            return <tr key={index}>
                                                        <td className="categories">
                                                            <div className="item">{item.category || ""}</div>
                                                        </td>
                                                        <td className="selection">
                                                            <div className="item">
                                                            {
                                                                (options || []).map((option, i) => {
                                                                    const isChecked = resignationReasonOptionsChecked[option.value] ? resignationReasonOptionsChecked[option.value].value || false : false
                                                                    return <div className="sub" key={i}>
                                                                                <input type="checkbox" checked={isChecked} id={'key' + index + i}
                                                                                    onChange={e => this.handleCheckboxChange(option.type, option.value, e)} />
                                                                                <label htmlFor={'key' + index + i}>{option.label || ""}</label>
                                                                            </div>
                                                                })
                                                            }
                                                            </div>
                                                        </td>
                                                        <td className="explain">
                                                            <div className="item comment">
                                                                {
                                                                    isViewOnly ? 
                                                                    <div className='detail'>
                                                                        {
                                                                            comments[item.categoryCode] ?
                                                                            comments[item.categoryCode].split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                                                            : ''
                                                                        }
                                                                    </div>
                                                                    :
                                                                    <ResizableTextarea value={comments[item.categoryCode] || ""} onChange={e => this.handleTextareaChange(item.categoryCode, e)} rows={5} readOnly={isViewOnly} disabled={isViewOnly} /> 
                                                                }
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

InterviewContentFormComponent.propTypes = {
    serveyInfos: PropTypes.array
}

export default withTranslation()(InterviewContentFormComponent)
