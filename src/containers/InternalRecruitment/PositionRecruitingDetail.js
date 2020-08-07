import React, { useState } from "react";
import StatusModal from '../../components/Common/StatusModal'
import ApplyPositionModal from './ApplyPositionModal'
import axios from 'axios'
import unescape from 'lodash/unescape'
import moment from 'moment'

class PositionRecruitingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowStatusModal: false,
      content: "",
      isLoading: false,
      isShowApplyPositionModal: false,
      isLoadingApplyForm: false,
      isSuccess: false,
      job: {}
    }

    // this.hideStatusModal = this.hideStatusModal.bind(this);
    // this.showStatusModal = this.showStatusModal.bind(this);
    // this.showApplyPositionModal = this.showApplyPositionModal.bind(this);
    // this.hideApplyPositionModal = this.hideApplyPositionModal.bind(this);
  }

  componentWillMount() {
    const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        }
    }

    axios.get(`${process.env.REACT_APP_REQUEST_URL}Vacancy/detail/${this.props.match.params.id}`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        this.setState({job: res.data.data, isLoading: true})
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })
  }

  showApplyPositionModal = () => {
    this.setState({ isShowApplyPositionModal: true });
  }

  hideApplyPositionModal = () => {
    this.setState({ isShowApplyPositionModal: false });
  };

  showStatusModal = (message, isSuccess = false) => {
    this.setState({isShowStatusModal: true, content: message, isSuccess: isSuccess});
    this.hideApplyPositionModal()
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  render() {
    return (
      this.state.isLoading ? <>
      <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
      {this.state.isShowApplyPositionModal ? <ApplyPositionModal id={this.props.match.params.id} show={this.state.isShowApplyPositionModal} onHide={this.hideApplyPositionModal} showStatusModal={this.showStatusModal.bind(this)} /> : null }
      <div className="summary position-recruiting-detail-block">
        <div className="header-block">
          <h5 className="result-label">thông tin tuyển dụng</h5>
          
        </div>
        <div className="clearfix">
          <div className="float-left">
            <a className="btn btn-outline-primary" href="/position-recruiting"><i className="fa fa-arrow-left"/> Back</a>
          </div>
          <div className="float-right">
            <span className="btn-apply-block" onClick={this.showApplyPositionModal}>
              <span className="btn-apply" >Ứng tuyển <i className="metismenu-state-icon icon-arrow_right"></i></span>
            </span>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-body">
            <div className="content">
              <div className="title position">{this.state.job.positionName}</div>
              <div className="date">Ngày: {moment(this.state.job.dateCreated).format('DD/MM/YYYY')}</div>
              <div className="address">Địa điểm: {this.state.job.placeOfWorkName}</div>
              <div className="company">Công ty: Vinpearl</div>
              <div className="cate description-position">
                <div className="title">Mô tả công việc</div>
                <div  dangerouslySetInnerHTML={{__html: unescape(this.state.job.jobDescription)}} />
              </div>
              <div className="cate condition-position">
                <div className="title">Yêu cầu công việc</div>
                <div dangerouslySetInnerHTML={{__html: unescape(this.state.job.jobRequirement)}} />
              </div>
              <div className="cate benefit-position">
                <div className="title">Quyền lợi</div>
                <div dangerouslySetInnerHTML={{__html: unescape(this.state.job.benefit)}} />
              </div>
              <div className="cate contact-position">
                <div className="title">Liên hệ</div>
                <div dangerouslySetInnerHTML={{__html: unescape(this.state.job.contactInfo)}} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </> : null
    )
  }
}

export default PositionRecruitingDetail
