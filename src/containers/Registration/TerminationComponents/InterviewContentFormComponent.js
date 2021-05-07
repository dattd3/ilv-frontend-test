import React from 'react'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next";
import Constants from "../../../commons/Constants"

class InterviewContentFormComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            timeJoinDefault: null,
            timeInDefault: null,
        }
    }

    componentDidMount() {
        
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

    render() {
        const { t } = this.props
        const { timeJoinDefault, timeInDefault } = this.state

        const timeJoinSurveyOptions = this.getTimeSurveyOptions("join")
        const timeInSurveyOptions = this.getTimeSurveyOptions("in")

        console.log(timeJoinDefault)
        console.log(timeInDefault)

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

                                    {/* <input type="checkbox" checked={employeeIdChecked[index] && employeeIdChecked[index].value ? employeeIdChecked[index].value : false} 
                                                                    onChange={e => this.handleCheckboxChange(index, item.employeeNo, e)} 
                                                                   onChange={e => this.handleCheckboxChange(i, item.id, e, item.gender, item.fullName, item.email)} /> */}
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
                                    <tr>
                                        <td className="categories">
                                            <div className="item">Công việc hiện tại</div>
                                        </td>
                                        <td className="selection">
                                            <div className="item">
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Khối lượng công việc</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Thời gian làm việc</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Địa điểm làm việc</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Áp lực công việc</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Áp lực công việc</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Môi trường làm việc</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Cơ hội phát triển nghề nghiệp</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Lý do khác</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="explain">
                                            <div className="item"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="categories">
                                            <div className="item">Quản lý</div>
                                        </td>
                                        <td className="selection">
                                            <div className="item">
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Người quản lý trực tiếp</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Cách thức điều hành của DN</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Văn hóa doanh nghiệp</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Tinh thần gắn kết trong nội bộ</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Các vấn đề khác</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="explain">
                                            <div className="item"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="categories">
                                            <div className="item">Lương thưởng & Chế độ đãi ngộ</div>
                                        </td>
                                        <td className="selection">
                                            <div className="item">
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Chế độ lương thưởng</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Chế độ phúc lợi: trợ cấp, đi lại, ăn, bảo hiểm...</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Tính chất của chế độ đãi ngộ: đầy đủ, công bằng...</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Đánh giá công việc</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="explain">
                                            <div className="item"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="categories">
                                            <div className="item">Lý do các nhân</div>
                                        </td>
                                        <td className="selection">
                                            <div className="item">
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Thay đổi địa điểm cư trú</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Kinh doanh riêng</span>
                                                </div>
                                                <div className="sub">
                                                    <input type="checkbox" defaultChecked={false} />
                                                    <span>Lý do khác</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="explain">
                                            <div className="item"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withTranslation()(InterviewContentFormComponent)
