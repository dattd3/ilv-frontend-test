import React from "react"
import axios from 'axios'
import moment from 'moment'

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
    const APPLICANT_TYPE = {1: 'Ứng Tuyển', 2: 'Giới thiệu'}
    
    return (
      <>
      <div className="summary position-applied-block">
        <h5 className="result-label">các vị trí đã ứng tuyển</h5>
        <div className="card shadow">
          <div className="card-body">
            <table className="table" role="table">
              <thead className="position-applied-title-row" role="rowgroup">
                <tr role="row">
                  <th role="columnheader">Vị trí</th>
                  <th role="columnheader">Cấp bậc</th>
                  <th role="columnheader">Ngành nghề</th>
                  <th role="columnheader">Bộ phận / Cơ sở</th>
                  <th role="columnheader">Địa điểm</th>
                  <th role="columnheader" className="applicantType" >Hình thức</th>
                  <th role="columnheader">Thời gian</th>
                  <th role="columnheader" className="result">Kết quả</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
              {this.state.jobs.map(job => {
                return job.applicants.map(applicant => {
                return <tr role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href={`/position-recruiting-detail/${job.id}`} className="position">{job.positionName}</a>
                  </td>
                  <td role="cell" className="rank" data-title="Cấp bậc">
                    <p>{job.rankName}</p>
                  </td>
                  <td role="cell" className="profession" data-title="Ngành nghề">
                    <p>{job.professionName}</p>
                  </td>
                  <td role="cell" className="department" data-title="Bộ phận / Cơ sở">
                    <p>{job.departmentName}</p>
                  </td>
                  <td role="cell" className="placeOfWork" data-title="Địa điểm">
                    <p>{job.placeOfWorkName}</p>
                  </td>
                  <td role="cell" data-title="Hình thức" className="applicantType">
                  <p>{APPLICANT_TYPE[applicant.applicationFormId]}</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>{moment(applicant.applicationDate).format('DD/MM/YYYY')}</p>
                  </td>
                  <td role="cell" className="result" data-title="Kết quả">
                    <p className={'recruiting-status ' + this.showColor(applicant.applicantStatusId)}>{this.showStatus(applicant.applicantStatusId)}</p>
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
