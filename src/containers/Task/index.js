import React from 'react'
import {Tabs, Tab} from 'react-bootstrap'
import RequestComponent from '../Task/Request/'
import ApprovalComponent from '../Task/Approval/'

class Task extends React.Component {
    constructor() {
        super();
        this.state = {
            isShowApprovalTab: true
        }
    }

    getData = (data) => {
        if (data == null) {
            this.setState({isShowApprovalTab : false});
        }
    }

    componentWillUnmount() {
        // this.state.isShowApprovalTab
    }

    render() {
        return (
            <Tabs defaultActiveKey="RequestTab" className="task-tabs">
                <Tab eventKey="RequestTab" title="Yêu cầu">
                    <RequestComponent />
                </Tab>
                {
                    this.state.isShowApprovalTab == true ?
                    <Tab eventKey="ApprovalTab" title="Phê duyệt">
                        <ApprovalComponent sendData={this.getData} />
                    </Tab>
                    : null
                }
            </Tabs>
        )
    }
}

export default Task
