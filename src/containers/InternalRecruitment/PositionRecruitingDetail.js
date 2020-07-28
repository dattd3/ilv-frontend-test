import React, { useState } from "react";
import { useApi, useFetcher } from "../../modules";
import CustomPaging from '../../components/Common/CustomPaging';
import InfoModal from '../../components/Common/InfoModal'
import ApplyPositionModal from './ApplyPositionModal'

class PositionRecruitingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      content: "",
      isLoading: false,
      showApplyForm: false,
      dataApplyForm: {},
      isLoadingApplyForm: false,
    }

    this.hideModal = this.hideModal.bind(this);
  }

  showModal = event => {
    event.preventDefault();
    const content = "Bạn đã nộp đơn giới thiệu thành công!";
    this.setState({show: true, content: content});
    // return (
    //   <InfoModal show={this.state.show} content={this.state.content} isLoading={this.state.isloading} />
    // );
  };

  applyPosition = () => {
    this.setState({showApplyForm: true});
    // return (
    //   <ApplyPositionModal show={this.state.showApplyForm} data={this.state.dataApplyForm} isLoading={this.state.isLoadingApplyForm} />
    // );
  }

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <>
      <InfoModal show={this.state.show} content={this.state.content} />
      <ApplyPositionModal show={this.state.showApplyForm} data={this.state.dataApplyForm} isLoading={this.state.isLoadingApplyForm} />
      <div className="summary position-recruiting-detail-block">
        <div className="header-block">
          <h5 className="result-label" onClick={this.hideModal}>thông tin tuyển dụng</h5>
          <span className="btn-apply-block" onClick={this.applyPosition}>
            <span className="btn-apply">Ứng tuyển <i className="metismenu-state-icon icon-arrow_right"></i></span>
          </span>
        </div>
        <div className="card shadow">
          <div className="card-body">
            <div className="content">
              <div className="title position">[Vinpearl - Hà Nội] Project Manager</div>
              <div className="date">Ngày: 19-06-2020</div>
              <div className="address">Địa điểm: Hà Nội, Việt Nam</div>
              <div className="company">Công ty: Vinpearl</div>
              <div className="cate description-position">
                <div className="title">Mô tả công việc</div>
                <p>- Số lượng: 01.</p>
                <p>- Giải quyết các vướng mắc kỹ thuật</p>
                <p>- Phân tích tìm định hướng giải quyết</p>
              </div>
              <div className="cate condition-position">
                <div className="title">Yêu cầu công việc</div>
                <p>- Số lượng: 01.</p>
                <p>- Giải quyết các vướng mắc kỹ thuật</p>
                <p>- Phân tích tìm định hướng giải quyết</p>
              </div>
              <div className="cate benefit-position">
                <div className="title">Quyền lợi</div>
                <p>- Số lượng: 01.</p>
                <p>- Giải quyết các vướng mắc kỹ thuật</p>
                <p>- Phân tích tìm định hướng giải quyết</p>
              </div>
              <div className="cate contact-position">
                <div className="title">Liên hệ</div>
                <p>Email: v.td@vinpearl.com</p>
                <p>Số điện thoại: 0904567897</p>
              </div>
            </div>
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

export default PositionRecruitingDetail
