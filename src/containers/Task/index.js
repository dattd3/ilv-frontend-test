import React from 'react'
import {Tabs, Tab} from 'react-bootstrap'
import RequestComponent from '../Task/Request/'
import ApprovalComponent from '../Task/Approval/'
import axios from 'axios'
import Constants from '../../commons/Constants'
import LoadingSpinner from '../../components/Forms/CustomForm/LoadingSpinner'

class Task extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isShowApprovalTab: false,
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
        axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/approval?companyCode=`+localStorage.getItem("companyCode"), config)
        .then(res => {
          if (res && res.data && res.data.data && res.data.result) {
            const result = res.data.result;
            if (result.code != Constants.API_ERROR_CODE) {
              let tasksOrdered = res.data.data.listUserProfileHistories.sort((a, b) => a.id <= b.id ? 1 : -1)
              this.setState({tasks : tasksOrdered, isShowApprovalTab: true});
            }
          }
        }).catch(error => {})
      }

    updateTabLink = key => {
        this.props.history.push('?tab=' + key);
        this.setState({tabActive : key})
    }

    render() {
        return (
            <Tabs defaultActiveKey={this.state.tabActive} className="task-tabs" onSelect={(key) => this.updateTabLink(key)}>
                <Tab eventKey="request" title="Yêu cầu">
                    <RequestComponent />
                </Tab>
                {
                    this.state.isShowApprovalTab == true ?
                    <Tab eventKey="approval" title="Phê duyệt">
                        <ApprovalComponent tasks={this.state.tasks} />
                    </Tab>
                    : null
                }
            </Tabs>

        )
    }
}

export default Task
