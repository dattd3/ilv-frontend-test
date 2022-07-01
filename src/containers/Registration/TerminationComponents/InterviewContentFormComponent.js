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

    getTimeSurveyOptions = (type) => {
        return [
            { value: 1, label: "< 6 tháng", element: `${type}-less-6-month`},
            { value: 2, label: "2 năm", element: `${type}-2-year`},
            { value: 3, label: "2 - 5 năm", element: `${type}-2-5-year`},
            { value: 4, label: "> 5 năm", element: `${type}-than-5-year`}
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
        
        const timeJoinSurveyOptions = this.getTimeSurveyOptions("join")
        const timeInSurveyOptions = this.getTimeSurveyOptions("in")
        return (
            <>
            <div className="block interview-content-block">
                    <h6 className="block-title">II. Nội dung phỏng vấn</h6>
                    <div className="box">
                        <div className="row">
                            <div className="col-12">
                                <p className="question">Bạn gia nhập công ty cách đây bao lâu ?</p>
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
                                <p className="question">Bạn ở vị trí hiện tại được bao lâu ?</p>
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
                    <h6 className="block-title">III. Lý do thôi việc</h6>
                    <div className="row">
                        <div className="col-12">
                            <table className="list-staff">
                                <thead>
                                    <tr>
                                        <th className="col-first">Danh mục</th>
                                        <th className="col-second">Lựa chọn</th>
                                        <th className="col-third">Diễn giải</th>
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
