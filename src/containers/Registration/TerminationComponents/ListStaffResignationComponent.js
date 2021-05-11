import React from 'react'
import Select from 'react-select'
import Moment from 'react-moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next";

const statusOptions = [
    {value: 0, label: "Chưa hoàn thành"},
    {value: 1, label: "Đã hoàn thành"}
]

class ListStaffResignationComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            listUserTerminations: props.listUserTerminations,
            requestIdChecked: [],
            appraiser: null,
            users: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { listUserTerminations } = nextProps
        if (listUserTerminations) {
            return ({
                listUserTerminations: listUserTerminations
            })
        }

        return prevState
    }

    renderStatus = (index, isEditable, statusCode, stateName) => {
        const listUserTerminations = [...this.state.listUserTerminations]
        const currentItem = listUserTerminations[index]
        let element = ""

        if (isEditable) {
            const customStyles = {
                option: (styles, state) => ({
                    ...styles,
                    cursor: 'pointer',
                }),
                control: (styles) => ({
                    ...styles,
                    cursor: 'pointer',
                })
            }
            element = <Select options={statusOptions} onChange={e => this.handleSelectChange(index, e, stateName)} value={statusOptions.filter(so => so.value == currentItem[stateName])} placeholder="Chọn trạng thái" styles={customStyles} />
        } else {
            const statusName = statusOptions.filter(item => item.value == statusCode)
            if (statusName && statusName.length > 0) {
                element = statusName[0]?.label || ""
            }
        }

        return element
    }

    renderInsuranceBookStatus = (statusCode) => {
        const insuranceBookOptions = [
            {value: "LV1", label: "PNS lưu trữ"},
            {value: "LV2", label: "NLĐ tự bảo quản"},
            {value: "LV3", label: "CQBHXH đang cấp"},
            {value: "LV4", label: "CQBHXH đang xử lý"},
            {value: "LV5", label: "Thất lạc sổ"},
            {value: "NV1", label: "Sổ đã chốt"},
            {value: "NV2", label: "Sổ đang chốt"},
            {value: "NV3", label: "Sổ chưa chốt"}

        ]

        const statusName = insuranceBookOptions.filter(item => item.value == statusCode)
        return statusName && statusName.length > 0 ? statusName[0]?.label || "" : ""
    }

    // renderAttachmentView = (fileOptions, index, isEditable, statusCode, stateName) => {
    //     return <Select options={fileOptions, statusOptions} onChange={e => this.handleSelectChange(index, e, stateName)} value={statusOptions.filter(so => so.value == currentItem[stateName])} placeholder="Chọn trạng thái" styles={customStyles} />
    // }

    renderAttachmentView = (attachments, index) => {
        const customStyles = {
            option: (styles, state) => ({
                ...styles,
                cursor: 'pointer',
            }),
            control: (styles) => ({
                ...styles,
                cursor: 'pointer',
            })
        }

        let options = []
        if (attachments && attachments.length > 0) {
            options = (attachments || []).map(item => {
                return {value: item.id, label: item.fileName}
            })
        }

        return <Select options={options} /* onChange={e => this.handleSelectChange(index, e, stateName)} value={statusOptions.filter(so => so.value == currentItem[stateName])} */ styles={customStyles} />
    }

    handleSelectChange = (index, e, name) => {
        const listUserTerminations = [...this.state.listUserTerminations]
        listUserTerminations[index][name] = e ? e.value : null

        this.setState({listUserTerminations: listUserTerminations})
    }

    handleCheckboxChange = (index, code, e) => {
        const requestIdChecked = [...this.state.requestIdChecked]
        requestIdChecked[index] = {key: code, value: e.target.checked}

        this.setState({requestIdChecked: requestIdChecked})
        this.props.updateTerminationRequestList(requestIdChecked)
    }

    render() {
        const { t, isEdit } = this.props
        const {listUserTerminations, requestIdChecked} = this.state

        return <div className="block staff-information-proposed-resignation-block">
                    <div className="row">
                        <div className="col-12">
                            <div className="list-staff-block">
                                <table className="list-staff table">
                                    <thead>
                                        <tr>
                                            <th className="sticky-col full-name-col">Họ và tên</th>
                                            <th className="sticky-col employee-code-col">Mã nhân viên</th>
                                            <th>Chức danh</th>
                                            <th>Khối/Phòng/Bộ phận</th>
                                            <th>Cấp bậc</th>
                                            <th>Ngày nộp đơn</th>
                                            <th>Ngày chấm dứt hợp đồng</th>
                                            <th>Lý do nghỉ</th>
                                            <th>Lý do chi tiết</th>
                                            <th>Loại hợp đồng</th>
                                            <th>Người tạo</th>
                                            <th>Tệp đính kèm</th>
                                            <th>Tình trạng bàn giao</th>
                                            <th>Bàn giao công việc</th>
                                            <th>Bàn giao tài sản công ty</th>
                                            <th>Bàn giao BHXH và BHYT</th>
                                            <th>Bàn giao đồng phục</th>
                                            <th>Bàn giao vân tay/email</th>
                                            <th>Bàn giao công nợ</th>
                                            <th className="handover-software-col">Các phần mềm phục vụ công việc (nếu có)</th>
                                            <th>Xác nhận biên bản vi phạm chưa xử lý</th>
                                            <th>Tình trạng phê duyệt</th>
                                            <th>Tình trạng sổ BHXH</th>
                                            <th>Lương nghỉ việc</th>
                                            <th>Phiếu phỏng vấn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listUserTerminations.map((item, index) => {
                                                const userInfos = item.userInfo
                                                const reason = item.reason
                                                const attachments = item.profileDocuments

                                                return <tr key={index}>
                                                            <td className="sticky-col full-name-col">
                                                                <div className="data full-name">
                                                                    {/* <input type="checkbox" defaultChecked={false} /> */}
                                                                    <input type="checkbox" checked={requestIdChecked[index] && requestIdChecked[index].value ? requestIdChecked[index].value : false} 
                                                                    onChange={e => this.handleCheckboxChange(index, item.id, e)} />
                                                                    <span>{userInfos?.fullName || ""}</span>
                                                                </div>
                                                            </td>
                                                            <td className="sticky-col employee-code-col"><div className="data employee-code">{userInfos?.employeeNo || ""}</div></td>
                                                            <td className="job-title-col"><div className="data job-title">{userInfos?.jobTitle || ""}</div></td>
                                                            <td className="block-department-part-col"><div className="data block-department-part">{userInfos?.department || ""}</div></td>
                                                            <td className="rank-col"><div className="data rank">{userInfos?.rank || ""}</div></td>
                                                            <td className="application-date-col"><div className="data text-center application-date">{item?.createDate ? <Moment format="DD/MM/YYYY">{item.createDate}</Moment> : ""}</div></td>
                                                            <td className="contract-termination-date-col"><div className="data text-center contract-termination-date">{item?.dateTermination ? <Moment format="DD/MM/YYYY">{item?.dateTermination}</Moment> : ""}</div></td>
                                                            <td className="reason-termination-col"><div className="data reason-termination">{reason?.label || ""}</div></td>
                                                            <td className="detailed-reason-col"><div className="data detailed-reason">{item?.reasonDetailed || ""}</div></td>
                                                            <td className="contract-type-col"><div className="data contract-type">{userInfos?.contractName || ""}</div></td>
                                                            <td className="created-by-col"><div className="data created-by">{item?.createdBy || ""}</div></td>
                                                            <td className="attachment-col"><div className="data attachment">{this.renderAttachmentView(attachments, index)}</div></td>
                                                            <td className="handover-status-col"><div className="data handover-status">{item?.statusDeliverString}</div></td>
                                                            <td className="handover-job-col"><div className="data handover-job">{this.renderStatus(index, item.isHandoverWork, item.statusWork, "statusWork")}</div></td>
                                                            <td className="asset-transfer-col"><div className="data asset-transfer">{this.renderStatus(index, item.isHandoverAsset, item.statusAsset, "statusAsset")}</div></td>
                                                            <td className="handover-insurance-col"><div className="data handover-insurance">{this.renderStatus(index, item.isHandoverSocial, item.statusSocial, "statusSocial")}</div></td>
                                                            <td className="handover-uniforms-col"><div className="data handover-uniforms">{this.renderStatus(index, item.isHandoverUniform, item.statusUniform, "statusUniform")}</div></td>
                                                            <td className="handover-fingerprints-email-col"><div className="data handover-fingerprints-email">{this.renderStatus(index, item.isHandoverFingerprintEmail, item.statusFingerprintEmail, "statusFingerprintEmail")}</div></td>
                                                            <td className="handover-liabilities-col"><div className="data handover-liabilities">{this.renderStatus(index, item.isHandoverDebt, item.statusDebt, "statusDebt")}</div></td>
                                                            <td className="handover-software-col"><div className="data handover-software">{this.renderStatus(index, item.isHandoverSoftware, item.statusSoftware, "statusSoftware")}</div></td>
                                                            <td className="confirm-violation-records-col"><div className="data confirm-violation-records">{this.renderStatus(index, item.isHandoverConfirmation, item.statusConfirmation, "statusConfirmation")}</div></td>
                                                            <td className="approval-status-col"><div className="data approval-status">{item?.processStatusString || ""}</div></td>
                                                            <td className="social-insurance-book-status-col"><div className="data social-insurance-book-status">{this.renderInsuranceBookStatus(item?.statusSocialClosing)}</div></td>
                                                            <td className="leave-salary-col"><div className="data leave-salary">{item?.statusLastPaymentString || ""}</div></td>
                                                            <td className="interview-card-col"><a className="data interview-card" href={`/contract-termination-interview/${item.id}/export`} title="Phiếu phỏng vấn" target="_blank">Phiếu phỏng vấn</a></td>
                                                        </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(ListStaffResignationComponent)
