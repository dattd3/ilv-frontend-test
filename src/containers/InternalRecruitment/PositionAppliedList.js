import React, { useState } from "react";
import { useApi, useFetcher } from "../../modules";
import CustomPaging from '../../components/Common/CustomPaging';
import InfoModal from '../../components/Common/InfoModal'

class PositionAppliedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      content: "",
      isLoading: false
    }

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal = event => {
    const content = "Bạn đã nộp đơn giới thiệu thành công!";
    this.setState({show: true, content: content});
    event.preventDefault();
    return (
      <InfoModal show={this.state.show} content={this.state.content} handleClose={this.hideModal} />
    );
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    // const usePreload = (params) => {
    //   const api = useApi();
    //   const [data = [], err] = useFetcher({
    //       api: api.fetchArticleList,
    //       autoRun: true,
    //       params: params
    //   });
    //   return data;
    // };
    
    // const [pageIndex, SetPageIndex] = useState(1);
    // const [pageSize, SetPageSize] = useState(9);
    
    // const result = usePreload([pageIndex, pageSize]);
    
    // const objDataRes = result.data;
    
    // function onChangePage(page) {
    //     SetPageIndex(page);
    // }
    
    return (
      <>
      <InfoModal show={this.state.show} content={this.state.content} />
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
                  <th role="columnheader">Hình thức</th>
                  <th role="columnheader">Thời gian</th>
                  <th role="columnheader">Kết quả</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                <tr role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href="#" onClick={this.showModal} className="position">Project Manager</a>
                  </td>
                  <td role="cell" data-title="Cấp bậc">
                    <p>Chuyên gia</p>
                  </td>
                  <td role="cell" data-title="Ngành nghề">
                    <p>Khối CNTT</p>
                  </td>
                  <td role="cell" data-title="Bộ phận / Cơ sở">
                    <p>Công nghệ thông tin</p>
                  </td>
                  <td role="cell" data-title="Địa điểm">
                    <p>Hà Nội</p>
                  </td>
                  <td role="cell" data-title="Hình thức">
                    <p>Ứng tuyển</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>15/01/2020</p>
                  </td>
                  <td role="cell" data-title="Kết quả">
                    <p className="recruiting-status waiting-approve">Đang chờ duyệt</p>
                  </td>
                </tr>
                <tr className="watched" role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href="#" className="position">Project Manager</a>
                  </td>
                  <td role="cell" data-title="Cấp bậc">
                    <p>Chuyên gia</p>
                  </td>
                  <td role="cell" data-title="Ngành nghề">
                    <p>Khối CNTT</p>
                  </td>
                  <td role="cell" data-title="Bộ phận / Cơ sở">
                    <p>Công nghệ thông tin</p>
                  </td>
                  <td role="cell" data-title="Địa điểm">
                    <p>Hà Nội</p>
                  </td>
                  <td role="cell" data-title="Hình thức">
                    <p>Giới thiệu</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>20/02/2020</p>
                  </td>
                  <td role="cell" data-title="Kết quả">
                    <p className="recruiting-status mapped-conditions">Đủ điều kiện</p>
                  </td>
                </tr>
                <tr className="" role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href="#" className="position">Project Manager</a>
                  </td>
                  <td role="cell" data-title="Cấp bậc">
                    <p>Chuyên gia</p>
                  </td>
                  <td role="cell" data-title="Ngành nghề">
                    <p>Khối CNTT</p>
                  </td>
                  <td role="cell" data-title="Bộ phận / Cơ sở">
                    <p>Công nghệ thông tin</p>
                  </td>
                  <td role="cell" data-title="Địa điểm">
                    <p>Hà Nội</p>
                  </td>
                  <td role="cell" data-title="Hình thức">
                    <p>Giới thiệu</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>20/02/2020</p>
                  </td>
                  <td role="cell" data-title="Kết quả">
                    <p className="recruiting-status not-map-conditions">Không đủ điều kiện</p>
                  </td>
                </tr>
                <tr className="" role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href="#" className="position">Project Manager</a>
                  </td>
                  <td role="cell" data-title="Cấp bậc">
                    <p>Chuyên gia</p>
                  </td>
                  <td role="cell" data-title="Ngành nghề">
                    <p>Khối CNTT</p>
                  </td>
                  <td role="cell" data-title="Bộ phận / Cơ sở">
                    <p>Công nghệ thông tin</p>
                  </td>
                  <td role="cell" data-title="Địa điểm">
                    <p>Hà Nội</p>
                  </td>
                  <td role="cell" data-title="Hình thức">
                    <p>Giới thiệu</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>20/02/2020</p>
                  </td>
                  <td role="cell" data-title="Kết quả">
                    <p className="recruiting-status not-recruited">Không tuyển dụng</p>
                  </td>
                </tr>
                <tr className="" role="row">
                  <td role="cell" data-title="Vị trí">
                    <a href="#" className="position">Project Manager</a>
                  </td>
                  <td role="cell" data-title="Cấp bậc">
                    <p>Chuyên gia</p>
                  </td>
                  <td role="cell" data-title="Ngành nghề">
                    <p>Khối CNTT</p>
                  </td>
                  <td role="cell" data-title="Bộ phận / Cơ sở">
                    <p>Công nghệ thông tin</p>
                  </td>
                  <td role="cell" data-title="Địa điểm">
                    <p>Hà Nội</p>
                  </td>
                  <td role="cell" data-title="Hình thức">
                    <p>Giới thiệu</p>
                  </td>
                  <td role="cell" data-title="Thời gian">
                    <p>20/02/2020</p>
                  </td>
                  <td role="cell" data-title="Kết quả">
                    <p className="recruiting-status recruited">Đã tuyển dụng</p>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <div className="row">
              <div className="col-sm"></div>
              <div className="col-sm">
                  <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={objDataRes.totalRecord} />
              </div>
              <div className="col-sm text-right">Total: {objDataRes.totalRecord}</div>
            </div> */}
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default PositionAppliedList
