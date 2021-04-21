import React from 'react'
import {Tabs, Tab} from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import RequestComponent from '../Task/Request/'
import EvalutionComponent from './Evalution'
import ConsentComponent from '../Task/Consent/'
import ApprovalComponent from '../Task/Approval/'
import PrepareComponent from '../Task/Prepare';
import axios from 'axios'
import Constants from '../../commons/Constants'
import processingDataReq from "../Utils/Common"

class Task extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isShowApprovalTab: true,
            isShowPrepareTab: true,
            isShowJobEvalutionTab: true,
            tabActive: new URLSearchParams(props.history.location.search).get('tab') || "request",
            tasks: []
        }
    }

    componentDidMount() {
        const config = {
          headers: {
            'Authorization': `${localStorage.getItem('accessToken')}`
          }
        }
        axios.get(`${process.env.REACT_APP_REQUEST_URL}request/approval?companyCode=`+localStorage.getItem("companyCode"), config)
        .then(res => {
          if (res && res.data && res.data.data && res.data.result) {
            const result = res.data.result;
            if (result.code != Constants.API_ERROR_CODE) {
              let tasksOrdered = res.data.data.requests
              let taskList = processingDataReq(tasksOrdered)
              const shouldShowPrepareJob = ['V030'].includes(localStorage.getItem("companyCode"));
              this.setState({tasks : taskList , isShowPrepareTab: true});
            }
          }
        }).catch(error => {})
      }

    updateTabLink = key => {
        this.props.history.push('?tab=' + key);
        this.setState({tabActive : key})
    }

    render() {
      const { t } = this.props
        return (
            <Tabs defaultActiveKey={this.state.tabActive} className="task-tabs" onSelect={(key) => this.updateTabLink(key)}>
               <Tab eventKey="request" title={t("Request")}>
                    <RequestComponent />
                </Tab>
                {
                  Constants.CONSENTER_LIST_LEVEL.includes(localStorage.getItem("employeeLevel")) ?
                  <Tab eventKey="consent" title={t("Consent")}>
                    <ConsentComponent />
                  </Tab>
                  : null
                }
                {
                    this.state.isShowApprovalTab == true && Constants.APPROVER_LIST_LEVEL.includes(localStorage.getItem("employeeLevel")) ?
                    <Tab eventKey="approval" title={t("Approval")}>
                        <ApprovalComponent tasks={this.state.tasks} />
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
                    this.state.isShowJobEvalutionTab == true ?
                    <Tab eventKey="evalution" title="Đánh giá công việc">
                        <EvalutionComponent />
                    </Tab>
                    : null
                }

            </Tabs>
        )
    }
}

export default withTranslation()(Task)
