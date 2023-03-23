import React from 'react'
import { Image } from 'react-bootstrap'
import Select, { components } from 'react-select'
import Moment from 'react-moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import IconReset from '../../../assets/img/icon/ic-reset.svg'
import { t } from 'i18next'
import { getResignResonsMasterData } from 'commons/Utils'

const AttachmentOption = ({ children, ...props }) => (<components.ValueContainer {...props}>
    <div>File đính kèm</div><div style={{visibility: 'hidden'}}>{children}</div>
    </components.ValueContainer>);

const Option = props => {
    return (
        <div>
            <components.Option {...props} innerProps={{
                ...props.innerProps,
                onClick: e => {
                    const nodeName = e && e.target && e.target.nodeName || null
                    if (nodeName && nodeName.toLowerCase() === 'img') {
                        props.innerProps.onClick()
                    } else if (nodeName && nodeName.toLowerCase() === 'div') {
                        e.stopPropagation()
                        e.preventDefault()
                    }
                }
                }}
            >
                <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <a title={props.label} href={props.data.link} style={{overflow: 'hidden', textOverflow: 'ellipsis', color: 'black', font: '13px Arial'}} target="_blank">{props.label}</a>{props.data.editable ? <Image src={IconReset} alt="Xuất báo cáo" className="ic-action" style={{marginLeft: '20px', cursor: 'pointer'}} /> : null}
            </div>
            </components.Option>
        </div>
    )
}

class ListStaffResignationComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            listUserTerminations: [],
            requestIdChecked: {},
            isCheckedAll : false
        }
        this.statusOptions = [
            {value: 0, label: props.t("unfinished")},
            {value: 1, label: props.t("accomplished")}
        ]
        this.sapStatusOptions = [
            {value: 0, label: props.t('not_push_SAP')},
            {value: 1, label: props.t('pushed_SAP')},
            {value: 2, label: props.t('not_push_SAP')},
        ];
        this.PAYMENT_OPTIONS = [
            {label: 'Giữ lương', value: 0},
            {label: 'Đã trả', value: 1}
        ];
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
                container: base => ({
                    ...base,
                    width: '100%'
                }),
                input: (base) => ({
                    ...base,
                    color: '#ffffff'
                }),
                control: (base) => ({
                    ...base,
                    color: '#a6afb6',
                    border: '1px solid #a6afb6',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    borderRadius: '0px',
                    padding: '0',
                    height: '35px',
                "&:hover": {
                    borderColor: "#a6afb6",
                    color: "#a6afb6"
                }
                }),
                dropdownIndicator: base => ({
                    ...base,
                    color: '#a6afb6',
                    fontWeight: 'normal',
                    "&:hover": {
                        color: "#a6afb6"
                    }
                })
            }
            element = <Select options={this.statusOptions} onChange={e => this.handleSelectChange(index, e, stateName)} value={this.statusOptions.filter(so => so.value == currentItem[stateName])} placeholder="Chọn trạng thái" styles={customStyles} menuPortalTarget={document.body} />
        } else {
            const statusName = this.statusOptions.filter(item => item.value == statusCode)
            if (statusName && statusName.length > 0) {
                element = statusName[0]?.label || ""
            }
        }

        return element
    }

    handleSelectChange = (index, e, name) => {
        const listUserTerminations = [...this.state.listUserTerminations]
        listUserTerminations[index][name] = e ? e.value : null

        this.setState({listUserTerminations: listUserTerminations})
        this.props.updateTerminationRequestList("listUserTerminations", listUserTerminations)
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

    renderSalaryStatus = (salaryStatus) => {
        const statusName = this.PAYMENT_OPTIONS.filter(item => item.value == salaryStatus)
        return statusName && statusName.length > 0 ? statusName[0]?.label || "" : ""
    }

    renderAttachmentView = (attachments, index) => {
        const ATTACHED_FILE_CODE = 0
        const customStyles = {
            container: base => ({
                ...base,
                width: '100%'
            }),
            input: (base) => ({
                ...base,
                color: '#ffffff'
            }),
            control: (base) => ({
                ...base,
                color: '#000000',
                border: '1px solid #000000',
                boxShadow: 'none',
                cursor: 'pointer',
                borderRadius: '0px',
                padding: '0 10px',
                height: '35px',
            "&:hover": {
                borderColor: "#000000",
                color: "#000000"
            }
            }),
            dropdownIndicator: base => ({
                ...base,
                color: '#000000',
                fontWeight: 'normal',
                "&:hover": {
                    color: "#000000"
                }
            })
        }

        let options = []
        if (attachments && attachments.length > 0) {
            options = (attachments || [])
            .filter(item => item && item.fileStatus == ATTACHED_FILE_CODE && !item.isDeleted)
            .map(item => {
                return {value: item.id, label: item.fileName, link: item.fileUrl, id: item.id, editable: item.isEdit}
            })
        }

        return <Select components={{ValueContainer: AttachmentOption, IndicatorSeparator:() => null, Option }} closeMenuOnSelect={false}
                    options={options} isClearable={false} styles={{...customStyles, option: (styles, state) => ({
                        ...styles,
                        backgroundColor: state.isSelected ? null : null,
                        })
                    }} disabled={'disabled'} readOnly={'readonly'}
                    isOptionDisabled={(option) => option.isdisabled}
                    onChange={e => this.handleDeleteAttachedFiles(index, e)}
                    menuPortalTarget={document.body}
                />
    }

    handleDeleteAttachedFiles = (index, file) => {
        const listUserTerminations = [...this.state.listUserTerminations]
        let documentIdsDelete = listUserTerminations[index].deletedDocumentIds
        const profileDocuments = listUserTerminations[index].profileDocuments

        if (documentIdsDelete && Array.isArray(documentIdsDelete)) {
            documentIdsDelete = documentIdsDelete.concat(file.id)
        } else {
            documentIdsDelete = [file.id]
        }

        listUserTerminations[index].deletedDocumentIds = documentIdsDelete
        listUserTerminations[index].profileDocuments = (profileDocuments || []).filter(item => item && !documentIdsDelete.includes(item.id))

        this.setState({listUserTerminations: listUserTerminations})
        this.props.updateTerminationRequestList("listUserTerminations", listUserTerminations)
    }

    handleCheckAll = (e) => {
        //this.handleCheckboxChange(item, item.id, item.requestStatusProcessId, item.isUploadFile, userInfos?.employeeNo, e)}
        
        if(e.target.checked == false) {
            this.setState({requestIdChecked: {}, isCheckedAll: false});
            this.props.updateTerminationRequestList("requestIdChecked", Object.values({}), false);
            return;
        }

        const requestIdChecked = {...this.state.requestIdChecked};
        const itemsChecked = {};
        Object.keys(requestIdChecked).map(key => {
            const item = requestIdChecked[key];
            item.value = true;
            itemsChecked[key] = item;
        });
        this.state.listUserTerminations.map(item => {
            if(!itemsChecked[item.id]) {
                itemsChecked[item.id] = {key: item.id, value: true, requestStatusProcessId: item.requestStatusProcessId, isUploadFile: item.isUploadFile, employeeNo: item.userInfo?.employeeNo, item: item};
            }
        });
        this.setState({requestIdChecked: itemsChecked, isCheckedAll: true});
        this.props.updateTerminationRequestList("requestIdChecked", Object.values(itemsChecked), true)

    }

    handleCheckboxChange = (item, code, requestStatusProcessId, isUploadFile, employeeNo, e) => {
        const requestIdChecked = {...this.state.requestIdChecked}
        requestIdChecked[code] = {key: code, value: e.target.checked, requestStatusProcessId: requestStatusProcessId, isUploadFile: isUploadFile, employeeNo: employeeNo, item: item}
       
        let checkAll = this.state.listUserTerminations?.length > 0 ? true: false;
        this.state.listUserTerminations.map(item => {
            if(requestIdChecked[item.id]?.value != true) {
                checkAll = false;
            }
            return item;
        });
        this.setState({requestIdChecked: requestIdChecked, isCheckedAll: checkAll});
        this.props.updateTerminationRequestList("requestIdChecked", Object.values(requestIdChecked), checkAll)
    }

    render() {
        const { t , isCheckedAll} = this.props
        const {listUserTerminations, requestIdChecked} = this.state
        const reasonMasterData = getResignResonsMasterData();

        return <div className="block staff-information-proposed-resignation-block">
                    <div className="row">
                        <div className="col-12">
                            <div className="list-staff-block">
                                <table className="list-staff table">
                                    <thead>
                                        <tr>
                                            <th className="sticky-col full-name-col text-left">
                                                <div className="data full-name text-left">
                                                    <input type="checkbox" style={{marginRight: '8px'}} checked={isCheckedAll}  onChange={e => this.handleCheckAll(e)} />
                                                    {t('FullName')}
                                                </div>
                                            </th>
                                            <th className="sticky-col employee-code-col">{t('EmployeeNo')}</th>
                                            <th>{t('Title')}</th>
                                            <th>{t('DepartmentManage')}</th>
                                            <th>{t('Grade')}</th>
                                            <th>Cost Center</th>
                                            <th>{t('resignAt')}</th>
                                            <th>{t('ContractTerminationDate')}</th>
                                            <th>{t('ReasonForContractTermination')}</th>
                                            <th>{t('DetailedReason')}</th>
                                            <th>{t('loai_hop_dong')}</th>
                                            <th>{t('CreatedBy')}</th>
                                            <th>{t('AttachFile')}</th>
                                            <th>{t('handover_status')}</th>
                                            <th>{t('work_status')}</th>
                                            <th>{t('resource_status')}</th>
                                            <th>{t('social_status')}</th>
                                            <th>{t('uniform_status')}</th>
                                            <th>{t('email_status')}</th>
                                            <th>{t('timesheet_status')}</th>
                                            <th className="handover-software-col">{t('software_status')}</th>
                                            <th>{t('policy_status')}</th>
                                            <th>{t('approval_status')}</th>
                                            <th>{t('insurance_status')}</th>
                                            <th>{t('salary_status')}</th>
                                            <th>{t('interview_form')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listUserTerminations.map((item, index) => {
                                                const userInfos = item.userInfo
                                                const reason = item.reason
                                                const attachments = item.profileDocuments
                                                const interviewQuestionnaire = item.processStatus == Constants.STATUS_APPROVED ? <a className="data interview-card" href={`/contract-termination-interview/${item.contractTerminationInfoId}/export`} title={t('interview_form')} target="_blank">{t('interview_form')}</a>  : <span className="data interview-card">{t('interview_form')}</span>

                                                return <tr key={index}>
                                                            <td className="sticky-col full-name-col">
                                                                <div className="data full-name">
                                                                    <input type="checkbox" checked={requestIdChecked[item?.id]?.value || false} 
                                                                    onChange={e => this.handleCheckboxChange(item, item.id, item.requestStatusProcessId, item.isUploadFile, userInfos?.employeeNo, e)} />
                                                                    <span>{userInfos?.fullName || ""}</span>
                                                                </div>
                                                            </td>
                                                            <td className="sticky-col employee-code-col"><div className="data employee-code">{userInfos?.employeeNo || ""}</div></td>
                                                            <td className="job-title-col"><div className="data job-title">{userInfos?.jobTitle || ""}</div></td>
                                                            <td className="block-department-part-col"><div className="data block-department-part" title={userInfos?.department || ''}>{userInfos?.department || ""}</div></td>
                                                            <td className="rank-col"><div className="data rank text-center">{userInfos?.rank || ""}</div></td>
                                                            <td className="rank-col"><div className="data rank text-center">{item?.costCenter || ""}</div></td>
                                                            <td className="application-date-col"><div className="data text-center application-date">{item?.createDate ? <Moment format="DD/MM/YYYY">{item.createDate}</Moment> : ""}</div></td>
                                                            <td className="contract-termination-date-col"><div className="data text-center contract-termination-date">{item?.dateTermination ? <Moment format="DD/MM/YYYY">{item?.dateTermination}</Moment> : ""}</div></td>
                                                            <td className="reason-termination-col"><div className="data reason-termination">{reasonMasterData[reason?.value] || ""}</div></td>
                                                            <td className="detailed-reason-col"><div className="data detailed-reason">{item?.reasonDetailed || ""}</div></td>
                                                            <td className="contract-type-col"><div className="data contract-type">{userInfos?.contractName || ""}</div></td>
                                                            <td className="created-by-col"><div className="data created-by">{item?.createdBy?.fullName || ""}</div></td>
                                                            <td className="attachment-col"><div className="data attachment">{this.renderAttachmentView(attachments, index)}</div></td>
                                                            <td className="handover-status-col"><a className="data handover-status" href={`/handover/${item.contractTerminationInfoId}/request`} title={item?.statusDeliverString}>{item?.statusDeliverString}</a></td>
                                                            <td className="handover-job-col"><div className="data handover-job">{this.renderStatus(index, item.isHandoverWork, item.statusWork, "statusWork")}</div></td>
                                                            <td className="asset-transfer-col"><div className="data asset-transfer">{this.renderStatus(index, item.isHandoverAsset, item.statusAsset, "statusAsset")}</div></td>
                                                            <td className="handover-insurance-col"><div className="data handover-insurance">{this.renderStatus(index, item.isHandoverSocial, item.statusSocial, "statusSocial")}</div></td>
                                                            <td className="handover-uniforms-col"><div className="data handover-uniforms">{this.renderStatus(index, item.isHandoverUniform, item.statusUniform, "statusUniform")}</div></td>
                                                            <td className="handover-fingerprints-email-col"><div className="data handover-fingerprints-email">{this.renderStatus(index, item.isHandoverFingerprintEmail, item.statusFingerprintEmail, "statusFingerprintEmail")}</div></td>
                                                            <td className="handover-liabilities-col"><div className="data handover-liabilities">{this.renderStatus(index, item.isHandoverDebt, item.statusDebt, "statusDebt")}</div></td>
                                                            <td className="handover-software-col" style={{textAlign: 'center'}}><div className="data handover-software">{this.renderStatus(index, item.isHandoverSoftware, item.statusSoftware, "statusSoftware")}</div></td>
                                                            <td className="confirm-violation-records-col" style={{textAlign: 'center'}}><div className="data confirm-violation-records">{this.renderStatus(index, item.isHandoverConfirmation, item.statusConfirmation, "statusConfirmation")}</div></td>
                                                            <td className="approval-status-col" style={{textAlign: 'center'}}><div className="data approval-status">{item?.processStatusString || ""}</div></td>
                                                            <td className="social-insurance-book-status-col" style={{textAlign: 'center'}}><div className="data social-insurance-book-status">{item?.statusSocialClosing || ''}</div></td>
                                                            <td className="leave-salary-col" style={{textAlign: 'center'}}><div className="data leave-salary">{this.renderSalaryStatus(item?.statusLastPayment)}</div></td>
                                                            <td className="interview-card-col">{interviewQuestionnaire}</td>
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
