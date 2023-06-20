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
            { value: 1, label: t('less_2_months'), element: `${type}-less-2-month`},
            { value: 2, label: t('2month_1year'), element: `${type}-2-month-1year`},
            { value: 3, label: t('1_3years'), element: `${type}-1-3-year`},
            { value: 4, label: t('greater_3_years'), element: `${type}-than-3-year`}
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

    handleQuestionChange = (key, e) => {
        const {isViewOnly} = this.props
        if (isViewOnly) {
            return
        }
        const  questions = {...this.props.questions}
        questions[key] = e.target.value || ""
        this.props.updateInterviewContents("questions", questions)
    }

    render() {
        const { t, serveyInfos, serveyDetail, isViewOnly, timeJoinDefault, timeInDefault, resignationReasonOptionsChecked, comments, questions } = this.props
        const timeJoinSurveyOptions = this.getTimeSurveyOptions("join", t)
        const timeInSurveyOptions = this.getTimeSurveyOptions("in", t)
        return (
            <>
                <div className="block interview-content-block">
                    <h6 className="block-title">II. {t('noi_dung_phong_van')}</h6>
                    <div className="box">
                        <div className="row">
                            <div className="col-12">
                                <p className="question">{t('ban_gia_nhap_cong_ty_cach_day_bao_lau')}&nbsp;<span className='red-color'>(*)</span></p>
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
                                <p className="question">{t('ban_o_vi_tri_hien_tai_duoc_bao_lau')}&nbsp;<span className='red-color'>(*)</span></p>
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
                                            // const optionSelected = item.responseKeyOptionSelects ? serveyDetail[item.responseKeyOptionSelects] : ""
                                            // const optionSelectedToArray = optionSelected ? optionSelected.split(",") : []
                                            return <tr key={index}>
                                                        <td className="categories">
                                                            <div className="item">{item.category || ""}&nbsp;<span className='red-color'>(*)</span></div>
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
                                                                    <ResizableTextarea value={comments[item.categoryCode] || ""} onChange={e => this.handleTextareaChange(item.categoryCode, e)} minRows={5} readOnly={isViewOnly} disabled={isViewOnly} /> 
                                                                }
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                        })
                                    }
                                    <tr >
                                        <td className="categories">
                                            <div className="item">{t('other_reason')}</div>
                                        </td>
                                        <td className="selection">
                                            <div className="item comment">
                                                {
                                                    isViewOnly ? 
                                                    <div className='detail'>
                                                        {
                                                            questions?.reason1 ?
                                                            questions.reason1.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                                            : ''
                                                        }
                                                    </div>
                                                    :
                                                    <ResizableTextarea value={questions?.reason1 || ""} onChange={e => this.handleQuestionChange('reason1', e)} minRows={2} readOnly={isViewOnly} disabled={isViewOnly} /> 
                                                }
                                                
                                            </div>
                                        </td>
                                        <td className="explain">
                                            <div className="item comment" style={{marginTop: '10px', marginBottom: '10px'}}>
                                                {
                                                    isViewOnly ? 
                                                    <div className='detail'>
                                                        {
                                                            questions?.reason2 ?
                                                            questions.reason2.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                                            : ''
                                                        }
                                                    </div>
                                                    :
                                                    <ResizableTextarea value={questions?.reason2 || ""} onChange={e => this.handleQuestionChange('reason2', e)} minRows={2} readOnly={isViewOnly} disabled={isViewOnly} /> 
                                                }
                                                
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="block interview-content-block questions" style={{marginTop: '15px'}}>
                    <h6 className="block-title">IV. {t('other_question')}</h6>
                    <div className="row">
                        <div className="col-12">
                            <p className="title" style={{fontWeight: 'bold', marginTop: '0.5rem'}}>{t('servey_question_1')}</p>
                            <div>
                                {
                                    isViewOnly ? 
                                    <div className='detail'>
                                        {
                                            questions?.q1 ?
                                            questions.q1.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                            : ''
                                        }
                                    </div>
                                    :
                                    <ResizableTextarea value={questions?.q1 || ""} onChange={e => this.handleQuestionChange("q1", e)} minRows={2} maxRows={4} readOnly={isViewOnly} disabled={isViewOnly} className="w-100 form-control"/>
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="title" style={{fontWeight: 'bold', marginTop: '1.5rem'}}>{t('servey_question_2')}</p>
                            <div>
                                {
                                    isViewOnly ? 
                                    <div className='detail'>
                                        {
                                            questions?.q2 ?
                                            questions.q2.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                            : ''
                                        }
                                    </div>
                                    :
                                    <ResizableTextarea value={questions?.q2 || ""} onChange={e => this.handleQuestionChange("q2", e)} minRows={2} maxRows={4} readOnly={isViewOnly} disabled={isViewOnly} className="w-100 form-control"/>
                                }
                            
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="title" style={{fontWeight: 'bold', marginTop: '1.5rem'}}>{t('servey_question_3')}</p>
                            <div>
                                {
                                    isViewOnly ? 
                                    <div className='detail'>
                                        {
                                            questions?.q3 ?
                                            questions.q3.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                            : ''
                                        }
                                    </div>
                                    :
                                    <ResizableTextarea value={questions?.q3 || ""} onChange={e => this.handleQuestionChange("q3", e)} minRows={2} maxRows={4} readOnly={isViewOnly} disabled={isViewOnly} className="w-100 form-control"/>
                                }
                            
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="title" style={{fontWeight: 'bold', marginTop: '1.5rem'}}>{t('servey_question_4')}</p>
                            <div>
                                {
                                    isViewOnly ? 
                                    <div className='detail'>
                                        {
                                            questions?.q4 ?
                                            questions.q4.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                            : ''
                                        }
                                    </div>
                                    :
                                    <ResizableTextarea value={questions?.q4 || ""} onChange={e => this.handleQuestionChange("q4", e)} minRows={2} maxRows={4} readOnly={isViewOnly} disabled={isViewOnly} className="w-100 form-control"/>
                                }
                            
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="title" style={{fontWeight: 'bold', marginTop: '1.5rem'}}>{t('servey_question_5')}</p>
                            <div>
                                {
                                    isViewOnly ? 
                                    <div className='detail'>
                                        {
                                            questions?.q5 ?
                                            questions.q5.split ('\n').map ((item, i) => <p style={{margin: 0}} key={i}>{item}</p>)
                                            : ''
                                        }
                                    </div>
                                    :
                                    <ResizableTextarea value={questions?.q5 || ""} onChange={e => this.handleQuestionChange("q5", e)} minRows={2} maxRows={4} readOnly={isViewOnly} disabled={isViewOnly} className="w-100 form-control"/>
                                }
                            
                            </div>
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
