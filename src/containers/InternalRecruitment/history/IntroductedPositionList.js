import React from "react"
import axios from 'axios'
import moment from 'moment'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import HOCComponent from '../../../components/Common/HOCComponent'

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
    const { t } = this.props

    return (
      <>
      <div className="summary position-applied-block">
        <h1 className="content-page-header">{t("ReferredPositions")}</h1>
        <div className="card">
          <div className="card-body">
            <table className="table" role="table">
              <thead className="position-applied-title-row" role="rowgroup">
                <tr role="row">
                  <th role="columnheader" className="title">{t("Position")}</th>
                  <th role="columnheader" className="name">{t("FullName")}</th>
                  <th role="columnheader" className="phone">{t("MobileNo")}</th>
                  <th role="columnheader" className="email">Email</th>
                  <th role="columnheader" className="time">{t("Time")}</th>
                  <th role="columnheader" className="result">{t("Result")}</th>
                  <th role="columnheader" className="download-cv">{t("DownloadCV")}</th>
                  <th role="columnheader" className="note" >{t("Note")}</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
              {this.state.jobs.map(job => {
                return job.applicants.filter(app => app.applicationFormId == INTRODUCTION).map((applicant, index) => {
                return <tr role="row" key={index}>
                  <td role="cell" data-title={t("Position")} className="title">
                    <a href={`/position-recruiting-detail/${job.id}`} className="position">{job.jobTitle}</a>
                  </td>
                  <td role="cell" className="name" data-title={t("NameOfApplicant")}>
                    <p>{applicant.fullName}</p>
                  </td>
                  <td role="cell" className="phone" data-title={t("MobileNo")}>
                    <p>{applicant.phone}</p>
                  </td>
                  <td role="cell" className="email" data-title="Email">
                    <p>{applicant.email}</p>
                  </td>
                  <td role="cell" data-title={t("Time")} className="time">
                    <p>{moment(applicant.applicationDate).format('DD/MM/YYYY')}</p>
                  </td>
                  <td role="cell" className="result" data-title={t("Result")}>
                    <p className={'recruiting-status ' + this.showColor(applicant.applicantStatusId)}>{this.showStatus(applicant.applicantStatusId)}</p>
                  </td>
                  <td role="cell" className="download-cv">
                    <p><a className="download text-success" title={t("DownloadCV")} href={applicant.cvFileLink} target="_blank"><i className="fas fa-download" aria-hidden="true"></i></a></p>
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

export default HOCComponent(withTranslation()(PositionAppliedList))
