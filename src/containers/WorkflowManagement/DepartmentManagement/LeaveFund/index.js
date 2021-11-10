import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import FilterData from "../../ShareComponents/FilterData";
import { getMuleSoftHeaderConfigurations, getRequestConfigurations } from "../../../../commons/Utils"

class LeaveFund extends Component {
  constructor() {
    super();
    this.state = {
      timsheetSummary: {},
      timesheets: [],
      timeTables: [],
      isSearch: false,
    };
  }

  searchTimesheetByDate(startDate, endDate) {
    this.setState({ isSearch: false });
    this.search(startDate, endDate);
    //this.requestReasonAndComment(startDate, endDate);
    const config = getMuleSoftHeaderConfigurations()

    const start = moment(startDate).format("YYYYMMDD").toString();
    const end = moment(endDate).format("YYYYMMDD").toString();

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timekeeping?from_time=${start}&to_time=${end}`, config)
      .then((res) => {
        if (res && res.data && res.data.data) {
          const defaultData = {
            actual_working: 0,
            attendance: 0,
            paid_leave: 0,
            salary_wh: 0,
            total_overtime: 0,
            trainning: 0,
            unpaid_leave: 0,
            working_day_plan: 0,
            working_deal: 0,
          };
          const timsheetSummary = res.data.data[0]
            ? res.data.data[0]
            : defaultData;
          this.setState({ timsheetSummary: timsheetSummary, isSearch: true });
        }
      })
      .catch((error) => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });
  }

  search(startDate, endDate) {
    let start = moment(startDate).format("YYYYMMDD").toString();
    let end = moment(endDate).format("YYYYMMDD").toString();
    const timeoverviewParams = {
      from_date: start,
      to_date: end,
    };
    const reasonParams = {
      startdate: start,
      endDate: end,
    };

    const config = getRequestConfigurations()
    const muleSoftConfig = getMuleSoftHeaderConfigurations()
    config['params'] = reasonParams
    muleSoftConfig['params'] = timeoverviewParams

    const timOverviewEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timeoverview`;
    const ReasonEndpoint = `${process.env.REACT_APP_REQUEST_URL}request/GetLeaveTypeAndComment`;
    const requestTimOverview = axios.get(timOverviewEndpoint, muleSoftConfig);
    const requestReson = axios.get(ReasonEndpoint, config);

    axios.all([requestReson, requestTimOverview]).then(
      axios.spread((...responses) => {
        if (responses[1]) {
          const res = responses[1];
          if (res && res.data && res.data.data) {
            let dataSorted = res.data.data.sort((a, b) =>
              moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") <
              moment(b.date, "DD-MM-YYYY").format("YYYYMMDD")
                ? 1
                : -1
            );
            if (dataSorted && dataSorted.length > 0) {
              const startReal = moment(
                dataSorted[dataSorted.length - 1].date,
                "DD-MM-YYYY"
              ).format("YYYYMMDD");
              start = startReal > start ? startReal : start;
              const endReal = moment(dataSorted[0].date, "DD-MM-YYYY").format(
                "YYYYMMDD"
              );
              end = endReal < end ? endReal : end;
            }
            // const data = this.processDataForTable(dataSorted,start, end, responses[0].data.data);
            const data = [];
            this.setState({ timeTables: data });
          }
        }
      })
    );
  }

  render() {
    return (
      <div className="timesheet-section">
        <FilterData clickSearch={this.searchTimesheetByDate.bind(this)} />
        <div className="detail">
          <div className="card shadow">
            <div className="card-body">
              <div className="leave-fund-data table-responsive">
                <table className="custom-split-table">
                  {/* <col> */}
                  <colgroup span="2"></colgroup>
                  <colgroup span="2"></colgroup>
                  <thead>
                    <tr>
                      <td rowSpan="2" className="text-danger">HỌ VÀ TÊN</td>
                      <th colSpan="3" scope="colgroup" className="text-warning">
                        Ngày phép tồn năm trước
                      </th>
                      <th colSpan="3" scope="colgroup" className="text-primary">
                        Ngày phép năm nay
                      </th>
                      <td rowSpan="2">TỔNG SỐ NGÀY PHÉP CÒN ĐƯỢC SỬ DỤNG</td>
                      <th colSpan="3" scope="colgroup" className="text-warning">
                        Giờ bù tồn năm trước
                      </th>
                      <th colSpan="3" scope="colgroup" className="text-primary">
                        Giờ bù tồn năm nay
                      </th>
                      <td rowSpan="2">TỔNG SỐ GIỜ BÙ CÒN ĐƯỢC SỬ DỤNG</td>
                    </tr>
                    <tr>
                      <th scope="col">Đã sử dụng</th>
                      <th scope="col" className="text-warning">Còn được sử dụng</th>
                      <th scope="col">Hạn sử dụng</th>
                      <th scope="col">Đã sử dụng</th>
                      <th scope="col" className="text-primary">Còn được sử dụng</th>
                      <th scope="col">Hạn sử dụng</th>
                      <th scope="col">Đã sử dụng</th>
                      <th scope="col" className="text-warning">Còn được sử dụng</th>
                      <th scope="col">Hạn sử dụng</th>
                      <th scope="col">Đã sử dụng</th>
                      <th scope="col" className="text-primary">Còn được sử dụng</th>
                      <th scope="col">Hạn sử dụng</th>
                    </tr>
                    <tr className="divide"></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" className="text-danger">TRẦN LAN ANH</th>
                      <td>50,000</td>
                      <td>30,000</td>
                      <td>100,000</td>
                      <td>50,000</td>
                      <td>30,000</td>
                      <td>100,000</td>
                      <td className="text-danger">50,000</td>
                      <td>30,000</td>
                      <td>100,000</td>
                      <td>50,000</td>
                      <td>30,000</td>
                      <td>100,000</td>
                      <td>30,000</td>
                      <td className="text-danger">100,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeaveFund;
