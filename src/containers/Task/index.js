import React from 'react'
import {Tabs, Tab} from 'react-bootstrap'
import RequestComponent from '../Task/Request/'
import ApprovalComponent from '../Task/Approval/'

class Task extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isShowApprovalTab: true,
            tabActive: new URLSearchParams(props.history.location.search).get('tab') || "request"
        }
    }

    getData = (data) => {
        if (data == null) {
            this.setState({isShowApprovalTab : false});
        }
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
                        <ApprovalComponent sendData={this.getData} />
                    </Tab>
                    : null
                }
            </Tabs>
        )
    }
}

export default Task
