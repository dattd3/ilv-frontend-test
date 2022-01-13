import React from 'react'
import {Tabs, Tab} from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import RequestComponent from '../Task/Request/'
import ConsentComponent from '../Task/Consent/'
import ApprovalComponent from '../Task/Approval/'
import ApprovalDelegationModal from "./ApprovalDelegation/ApprovalDelegationModal"
import ApprovalDelegationList from "./ApprovalDelegation/index"
import PrepareComponent from '../Task/Prepare';
import axios from 'axios'
import Constants from '../../commons/Constants'
import processingDataReq from "../Utils/Common"
import { actionApprovalDelegation } from "./ApprovalDelegation/Constant"
import StatusModal from "../../components/Common/StatusModal"

const tabKey = {
    request: 'request',
    consent: 'consent',
    approval: 'approval',
    approvalDelegation: 'approvalDelegation'
}

class Task extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isShowApprovalTab: true,
            isShowPrepareTab: false,
            isShowJobEvalutionTab: true,
            tabActive: new URLSearchParams(props.history.location.search).get('tab') || "request",
            tasks: [],
            approvalDelegationModal: {
                isShowApprovalDelegationModal: false,
                titleModal: '',
                actionModal: actionApprovalDelegation.create,
                userApprovalDelegation: null
            },
            statusModal: {
                isShowStatusModal: false,
                message: '',
                isSuccess: true
            }
        }
    }

    componentDidMount() {
        this.fetchUserApprovalDelegations()
        this.checkPermissonShowPrepareTab();
    }

    checkPermissonShowPrepareTab = async () => {
        try {
            const config = {
                headers: {
                  'Authorization': `${localStorage.getItem('accessToken')}`
                }
            }
            const response = await axios.get(`${process.env.REACT_APP_HRDX_URL}user/managementPoint?companyCode=${localStorage.getItem('companyCode')}`, config)

            if (response && response.data) {
                this.setState({
                    ...this.state,
                    isShowPrepareTab: response.data.data?.isSupporter == true ? true : false
                })
            }
        } catch(e) {

        }
    } 

    fetchUserApprovalDelegations = async () => {
        try {
            const config = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
            const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}user/delegation`, config)
            if (response && response.data) {
                const result = response.data.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data.data
                    const approvalDelegationModal = {...this.state.approvalDelegationModal}
                    approvalDelegationModal.userApprovalDelegation = data
                    this.setState({approvalDelegationModal: approvalDelegationModal})
                }
            }
        } catch(e) {

        }
    }

    updateTabLink = key => {
        if (key === tabKey.approvalDelegation) {
            this.cancelApprovalDelegation()
        }

        this.props.history.push('?tab=' + key);
        this.setState({tabActive : key})
    }

    onHideModal = (state, property) => {
        const stateClone = {...this.state[[state]]}
        stateClone[[property]] = false
        this.setState({[state]: stateClone})
        if (state === 'statusModal') {
            return window.location.reload()
        }
    }

    updateStatus = (result) => {
        const statusModal = {...this.state.statusModal}
        statusModal.isShowStatusModal = true
        statusModal.message = result?.message || ""
        statusModal.isSuccess = result?.isSuccess || false
        this.setState({statusModal: statusModal})
    }

    cancelApprovalDelegation = () => {
        const { t } = this.props
        const approvalDelegationModal = {...this.state.approvalDelegationModal}
        approvalDelegationModal.isShowApprovalDelegationModal = true
        approvalDelegationModal.actionModal = approvalDelegationModal.userApprovalDelegation ? actionApprovalDelegation.cancel : actionApprovalDelegation.create
        approvalDelegationModal.titleModal = approvalDelegationModal.userApprovalDelegation ? t("EndDelegation") : t("ApprovalDelegation")
        this.setState({approvalDelegationModal: approvalDelegationModal})
    }

    render() {
        const { t } = this.props
        const { tasks, approvalDelegationModal, statusModal } = this.state
        const labelApprovalDelegationAction = approvalDelegationModal.userApprovalDelegation ? t("EndDelegation") : t("ApprovalDelegation")
        const approvalDelegationClass = approvalDelegationModal.userApprovalDelegation ? 'approval-delegation end-approval-delegation' : 'approval-delegation create-approval-delegation'
        const companyCode = localStorage.getItem("companyCode")
        const employeeLevel = localStorage.getItem("employeeLevel")
        const smallNavClass = Constants.APPROVAL_DELEGATION_LIST_LEVEL.includes(employeeLevel) ? 'nav-tabs-small' : '';

        return (
            <>
            <ApprovalDelegationModal
                isShow={approvalDelegationModal.isShowApprovalDelegationModal}
                title={approvalDelegationModal.titleModal}
                action={approvalDelegationModal.actionModal}
                userApprovalDelegation={approvalDelegationModal.userApprovalDelegation}
                updateStatus={this.updateStatus}
                onHideApprovalDelegationModal={() => this.onHideModal('approvalDelegationModal', 'isShowApprovalDelegationModal')} />
            <StatusModal
                show={statusModal.isShowStatusModal}
                content={statusModal.message}
                isSuccess={statusModal.isSuccess}
                onHide={() => this.onHideModal('statusModal', 'isShowStatusModal')} />
            <div className="task-page">
                <Tabs defaultActiveKey={this.state.tabActive} className={`task-tabs ${smallNavClass}`} onSelect={(key) => this.updateTabLink(key)}>
                    <Tab eventKey={tabKey.request} title={t("Request")}>
                        <RequestComponent />
                    </Tab>
                    {
                    Constants.CONSENTER_LIST_LEVEL.includes(employeeLevel) || (companyCode == "V073" && Constants.CONSENTER_LIST_LEVEL_V073.includes(employeeLevel)) ?
                    <Tab eventKey={tabKey.consent} title={t("Consent")}>
                        <ConsentComponent />
                    </Tab>
                    : null
                    }
                    {
                        this.state.isShowApprovalTab == true && (Constants.APPROVER_LIST_LEVEL.includes(employeeLevel) || ["minhvb1@vingroup.net"].includes(localStorage.getItem("email")) || Constants.ROLE_ASSIGMENT_APPROVE.some(word => localStorage.getItem("role_assigment").toLowerCase().includes(localStorage.getItem("role_assigment").toLowerCase())))?
                        <Tab eventKey={tabKey.approval} title={t("Approval")}>
                            <ApprovalComponent tasks={tasks} />
                        </Tab>
                        : null
                    }
                    {
                        Constants.APPROVAL_DELEGATION_LIST_LEVEL.includes(employeeLevel) ?
                        <Tab eventKey={tabKey.approvalDelegation} title={labelApprovalDelegationAction} tabClassName={approvalDelegationClass}>
                            <ApprovalDelegationList userApprovalDelegation={approvalDelegationModal.userApprovalDelegation} cancelApprovalDelegation={this.cancelApprovalDelegation} />
                        </Tab>
                        : null
                    }
                    {
                        this.state.isShowPrepareTab == true ?
                        <Tab eventKey="prepare" title="Hỗ trợ chuẩn bị nhận việc">
                            <PrepareComponent />
                        </Tab>
                        : null
                    }
                    {
                        /*this.state.isShowJobEvalutionTab == true ?
                        <Tab eventKey="evalution" title="Đánh giá công việc">
                            <EvalutionComponent />
                        </Tab>
                        : null*/
                    }
                </Tabs>
            </div>
            </>
        )
    }
}

export default withTranslation()(Task)
