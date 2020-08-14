import React from "react"
import axios from 'axios'
import moment from 'moment'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class PositionAppliedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      jobs: [],
      applicantStatus: []
    }
  }

  componentWillMount() {
    const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        }
    }

    axios.get(`${process.env.REACT_APP_REQUEST_URL}Vacancy/list`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        this.setState({jobs: res.data.data})
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })

    axios.get(`${process.env.REACT_APP_REQUEST_URL}ApplicantStatus/list`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        this.setState({applicantStatus: res.data.data})
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })
  }

  showStatus (statusId) {
    const status = this.state.applicantStatus.find(s => s.id == statusId)
    return status ? status.name : null
  }

  showColor (statusId) {
    const color = {1: 'waiting-approve', 2: 'mapped-conditions', 3: 'not-map-conditions', 4: 'recruited', 5: 'not-recruited'}[statusId]
    return color ? color : 'waiting-approve'
  }

  render() {
    const INTRODUCTION = 2
    
    return (
      <>
      <div className="summary position-applied-block">
        <h5 className="result-label">các vị trí đã giới thiệu</h5>
        <div className="card shadow">
          <div className="card-body">
            <table className="table" role="table">
              <thead className="position-applied-title-row" role="rowgroup">
                <tr role="row">
                  <th role="columnheader">Vị trí</th>
                  <th role="columnheader" className="name">Họ  và tên</th>
                  <th role="columnheader" className="phone">Số điện thoại</th>
                  <th role="columnheader" className="email">Email</th>
                  <th role="columnheader">Thời gian</th>
                  <th role="columnheader" className="result">Kết quả</th>
                  <th role="columnheader" className="note" >Tải CV</th>
                  <th role="columnheader" className="note" >Ghi chú</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
              {this.state.jobs.map(job => {
                return job.applicants.filter(app => app.applicantStatusId == INTRODUCTION).map(applicant => {
                return <tr role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href={`/position-recruiting-detail/${job.id}`} className="position">{job.jobTitle}</a>
                  </td>
                  <td role="cell" className="name" data-title="Họ và tên">
                    <p>{applicant.fullName}</p>
                  </td>
                  <td role="cell" className="phone" data-title="Số điện thoại">
                    <p>{applicant.phone}</p>
                  </td>
                  <td role="cell" className="email" data-title="Email">
                    <p>{applicant.email}</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>{moment(applicant.applicationDate).format('DD/MM/YYYY')}</p>
                  </td>
                  <td role="cell" className="result" data-title="Kết quả">
                    <p className={'recruiting-status ' + this.showColor(applicant.applicantStatusId)}>{this.showStatus(applicant.applicantStatusId)}</p>
                  </td>
                  <td role="cell" className="note">
                    <p><a className="download text-success" title="Tải về CV" href={applicant.cvFileLink} target="_blank"><i class="fas fa-download" aria-hidden="true"></i></a></p>
                  </td>
                  <td role="cell" className="note">
                    <p>
                    {applicant.note ? <OverlayTrigger placement="left" overlay={<Tooltip className="recruiting-detail-tooltip" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, whiteSpace: "normal" }}>{applicant.note}</Tooltip>}>
                      <i className="fas fa-edit text-warning" aria-hidden="true"></i>
                    </OverlayTrigger> : <i className="fas fa-edit text-secondary" aria-hidden="true"></i> }
                      </p>
                  </td>
                </tr>})})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default PositionAppliedList
