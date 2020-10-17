import React from 'react'
import Select from 'react-select'
import axios from 'axios'

const MyOption = props => {
  const { innerProps, innerRef } = props;
  return (
    <div ref={innerRef} {...innerProps} className="approver">
      <div className="title">{props.data.fullname}</div>
      <div className="comment"><i>({props.data.userAccount}) {props.data.current_position}</i></div>
    </div>
  )
}

class ApproverComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      approver: null,
      users: [],
      typingTimeout: 0
    }
  }

  componentDidMount() {
    if (this.props.approver) {
      this.setState({ approver: this.props.approver })
    }
  }

  handleSelectChange(name, value) {
    this.setState({ [name]: value })
    this.props.updateApprover(value)
  }

  onInputChange(str) {
    const self = this
    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    self.state.typingTimeout = setTimeout(() => {
      axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/userinfo/search`, { account: str }, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          const users = res.data.data.map(res => {
            return {
              label: res.fullname,
              value: res.user_account,
              fullname: res.fullname,
              userAccount: res.user_account,
              current_position: res.title,
              department: res.division + (res.department ? '/' + res.department : '') + (res.part ? '/' + res.part : '')
            }
          })
          this.setState({ users: users })
        }
      }).catch(error => {})
    }, 300)
  }

  render() {
    return <div className="approver">
      <div className="box shadow">
        <div className="row">
          <div className="col-4">
            <p className="title">Người phê duyệt</p>
            <div className="multiline">
              <Select components={{Option: MyOption}} onInputChange={this.onInputChange.bind(this)} name="approver" onChange={approver => this.handleSelectChange('approver', approver)} value={this.state.approver} placeholder="Lựa chọn" key="approver" options={this.state.users} />
            </div>
            {this.props.errors && this.props.errors['approver'] ? <p className="text-danger">{this.props.errors['approver']}</p> : null}
          </div>

          <div className="col-4">
            <p className="title">Chức danh</p>
            <div>
              <input type="text" className="form-control" value={this.state.approver ? this.state.approver.current_position : null} readOnly />
            </div>
          </div>

          <div className="col-4">
            <p className="title">Khối/Phòng/Bộ phận</p>
            <div>
              <input type="text" className="form-control" value={this.state.approver ? this.state.approver.department : null} readOnly />
            </div>
          </div>

        </div>
      </div>
    </div>
  }
}

export default ApproverComponent