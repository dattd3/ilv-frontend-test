import React, { useState } from "react";
import { withTranslation } from "react-i18next"

class PositionRecruitingTable extends React.Component {
  render() {
    const { t } = this.props
    return <div className="summary recruiting-search-result-block">
      <h5 className="result-label">các vị trí đang tuyển dụng</h5>
      <div className="card shadow">
        <div className="card-body">
          <table className="table" role="table">
            <thead className="search-result-title-row" role="rowgroup">
              <tr role="row">
                <th role="columnheader" className="position">{t("Position")}</th>
                <th role="columnheader" className="rank">{t("Grade")}</th>
                <th role="columnheader" className="profession">{t("Field")}</th>
                <th role="columnheader" className="department">{t("DepartmentBase")}</th>
                <th role="columnheader" className="placeOfWork">{t("Location")}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {this.props.jobs.map((job, index) => {
                 return <tr role="row" key={index}>
                    <td role="cell" data-title={t("Position")}>
              <a href={`/position-recruiting-detail/${job.id}`} className="position">{job.jobTitle}</a>
                    </td>
                    <td role="cell" className="rank" data-title={t("Grade")}>
                      <p>{job.rankName}</p>
                    </td>
                    <td role="cell" className="profession" data-title={t("Field")}>
                      <p>{job.professionName}</p>
                    </td>
                    <td role="cell" className="department" data-title={t("DepartmentBase")}>
                      <p>{job.departmentName}</p>
                    </td>
                    <td role="cell" className="placeOfWork" data-title={t("Location")}>
                      <p>{job.placeOfWorkName}</p>
                    </td>
                  </tr>
                })}
              </tbody>
          </table>
          
        </div>
      </div>
    </div>
  }
}

export default withTranslation()(PositionRecruitingTable)
