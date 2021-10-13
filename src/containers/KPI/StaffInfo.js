import React from 'react'
import { withTranslation } from "react-i18next"
class StaffInfo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {   
    const {t} = this.props
    const fullName = localStorage.getItem('fullName')
    const jobTitle = localStorage.getItem('jobTitle')
    const department = localStorage.getItem('department')

    return (
      <div className="kpi-staff-info">
        <div className="float-left w-100">
          <span className="float-left text-uppercase title-group">{t("EmployeeInfo")}</span>
        </div>
        <br style={{'clear': 'both'}} />
        <div className="card border shadow mb-4 mt-2">
          <table className="table table-borderless main-info-table">
            <tbody>
              <tr>
                <td style={{'width': '200px'}}><div className="content-title">{t("FullName")}</div></td>
                <td>
                  <div className="content-bg">
                    <span className="content-value">{fullName || ""}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="content-title">{t("Title")}</div></td>
                <td>
                  <div className="content-bg">
                    <span className="content-value">{jobTitle || ""}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td><div className="content-title">{t("DepartmentName")}</div></td>
                <td>
                  <div className="content-bg">
                    <span className="content-value">{department || ""}</span>
                  </div>
                </td>
              </tr>
              {/*
              <tr>
                <td><div className="content-title">Cán bộ quản lý</div></td>
                <td>
                  <div className="content-bg">
                    <span className="content-value">{ManagerFullName}</span>
                  </div>
                </td>
              </tr>
              */}
            </tbody>  
          </table>
        </div>      
      </div>
    )
  }
}

export default withTranslation()(StaffInfo)
