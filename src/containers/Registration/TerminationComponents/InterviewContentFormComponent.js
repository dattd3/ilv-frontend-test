import React from 'react'
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types'

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
        if (e) {
            const checkedValue = e.target?.value
            this.setState({ [type]: checkedValue })
            this.props.updateInterviewContents(type, checkedValue)
        }
    }

    handleCheckboxChange = (type, code, e) => {
        const resignationReasonOptionsChecked = [...this.state.resignationReasonOptionsChecked]
        resignationReasonOptionsChecked[code] = {key: code, value: e.target.checked, type: type}

        this.setState({resignationReasonOptionsChecked: resignationReasonOptionsChecked})
        this.props.updateInterviewContents("resignationReasonOptionsChecked", resignationReasonOptionsChecked)
    }

    handleTextareaChange = (code, e) => {
        const comments = {...this.state.comments}
        comments[code] = e.target.value || ""

        this.setState({comments: comments})
        this.props.updateInterviewContents("comments", comments)
    }

    render() {
        const { t, serveyInfos } = this.props
        const { timeJoinDefault, timeInDefault, resignationReasonOptionsChecked, comments } = this.state
        const timeJoinSurveyOptions = this.getTimeSurveyOptions("join")
        const timeInSurveyOptions = this.getTimeSurveyOptions("in")

        return (
            <>
            <div className="block interview-content-block">
                    <h6 className="block-title">II. Nội dung phỏng vấn</h6>
                    <div className="box shadow">
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
                            <table className="shadow list-staff">
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
                                            return <tr key={index}>
                                                        <td className="categories">
                                                            <div className="item">{item.category || ""}</div>
                                                        </td>
                                                        <td className="selection">
                                                            <div className="item">
                                                            {
                                                                (options || []).map((option, i) => {
                                                                    return <div className="sub" key={i}>
                                                                                <input type="checkbox" checked={resignationReasonOptionsChecked[option.value] ? resignationReasonOptionsChecked[option.value].value || false : false} 
                                                                                    onChange={e => this.handleCheckboxChange(option.type, option.value, e)} />
                                                                                <span>{option.label || ""}</span>
                                                                            </div>
                                                                })
                                                            }
                                                            </div>
                                                        </td>
                                                        <td className="explain">
                                                            <div className="item comment">
                                                                <textarea value={comments[item.categoryCode] || ""} onChange={e => this.handleTextareaChange(item.categoryCode, e)} rows={5} />
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
