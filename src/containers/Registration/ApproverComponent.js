import React from 'react'
import Select from 'react-select'

class ApproverComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            approver: null
        }
    }

    componentDidMount() {
      if (this.props.approver) {
        this.setState({approver: this.props.approver})
      }
     }

    handleSelectChange(name, value) {
        this.setState({ [name]: value })
        this.props.updateApprover(value)
    }

    render() {
        const options = [
            { value: 'trucnht1@vingroup.net', label: 'Nguyễn Hoàng Thủy Trúc', current_position: 'Quyền Giám Đốc Dự án Chuyển đổi số', department: 'Dự án chuyển đổi Kỹ thuật số' }
          ]
        return <div className="approver">
        <div className="box shadow">
          <div className="row">
            <div className="col-4">
              <p className="title">Người phê duyệt</p>
              <div>
                <Select name="approver" onChange={approver => this.handleSelectChange('approver', approver)} value={this.state.approver} placeholder="Lựa chọn" key="approver" options={options} />
              </div>
              {this.props.errors && this.props.errors['approver'] ? <p className="text-danger">{this.props.errors['approver']}</p> : null}
            </div>

            <div className="col-4">
              <p className="title">Chức danh</p>
              <div>
                <input type="text" className="form-control" value={this.state.approver ? this.state.approver.current_position : null} readOnly/>
              </div>
            </div>

            <div className="col-4">
              <p className="title">Khối/Phòng/Bộ phận</p>
              <div>
                <input type="text" className="form-control" value={this.state.approver ? this.state.approver.department : null} readOnly/>
              </div>
            </div>

          </div>
        </div>
        </div>
    }
}

export default ApproverComponent