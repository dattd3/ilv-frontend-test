import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import CustomPaging from '../../../components/Common/CustomPaging';

class PositionRecruitingTable extends React.Component {
  render() {
    return <div className="summary recruiting-search-result-block">
      <h5 className="result-label">các vị trí đang tuyển dụng</h5>
      <div className="card shadow">
        <div className="card-body">
          <table className="table" role="table">
            <thead className="search-result-title-row" role="rowgroup">
              <tr role="row">
                <th role="columnheader">Vị trí</th>
                <th role="columnheader">Cấp bậc</th>
                <th role="columnheader">Ngành nghề</th>
                <th role="columnheader">Bộ phận / Cơ sở</th>
                <th role="columnheader">Địa điểm</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {this.props.jobs.map(job => {
                 return <tr role="row">
                    <td role="cell" data-title="Vị trí">
              <a href={`/position-recruiting-detail/${job.id}`} className="position">{job.positionName}</a>
                    </td>
                    <td role="cell" data-title="Cấp bậc">
                      <p>{job.rankName}</p>
                    </td>
                    <td role="cell" data-title="Ngành nghề">
                      <p>{job.professionName}</p>
                    </td>
                    <td role="cell" data-title="Bộ phận / Cơ sở">
                      <p>{job.departmentName}</p>
                    </td>
                    <td role="cell" data-title="Địa điểm">
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

export default PositionRecruitingTable
