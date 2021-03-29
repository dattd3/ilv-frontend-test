import React, { useState } from "react";
import StatusModal from '../../components/Common/StatusModal'
import ApplyPositionModal from './ApplyPositionModal'
import axios from 'axios'
import unescape from 'lodash/unescape'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { withTranslation} from "react-i18next"

class PositionRecruitingDetail extends React.Component {
  static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

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
    const { t } = this.props
    return (
      this.state.isLoading ? <>
      <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
      {this.state.isShowApplyPositionModal ? <ApplyPositionModal id={this.props.match.params.id} show={this.state.isShowApplyPositionModal} onHide={this.hideApplyPositionModal} showStatusModal={this.showStatusModal.bind(this)} /> : null }
      <div className="summary position-recruiting-detail-block">
        <div className="header-block">
          <h5 className="result-label">{t("VacancyInfomation")}</h5>
          
        </div>
        <div className="clearfix">
          <div className="float-left">
            <button className="btn btn-outline-primary" onClick={this.props.history.goBack}><i className="fa fa-arrow-left"/> {t("Back")}</button>
          </div>
          <div className="float-right">
            <span className="btn-apply-block" onClick={this.showApplyPositionModal}>
              <span className="btn-apply" >{t("Application_Referral")} <i className="metismenu-state-icon icon-arrow_right"></i></span>
            </span>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-body">
            <div className="content">
              <div className="title position">{this.state.job.jobTitle}</div>
              <div className="date text-capitalize">{t("Day")}: {moment(this.state.job.dateCreated).format('DD/MM/YYYY')}</div>
              <div className="address">{t("Location")}: {this.state.job.placeOfWorkName}</div>
              <div className="company">{t("Company")}: Vinpearl</div>
              {this.state.job.jobDescription && this.state.job.jobDescription != 'undefined' ? <div className="cate description-position">
                {this.state.job.sourceName == 'Vinpearl' ? null : <div className="title">{t("JobDetail")}</div>}
                <div  dangerouslySetInnerHTML={{__html: unescape(this.state.job.jobDescription)}} />
              </div> : null}
              {this.state.job.jobRequirement && this.state.job.jobRequirement != 'undefined' ? <div className="cate condition-position">
              {this.state.job.sourceName == 'Vinpearl' ? null : <div className="title">{t("JobRequire")}</div>}
                <div dangerouslySetInnerHTML={{__html: unescape(this.state.job.jobRequirement)}} />
              </div> : null }
              {this.state.job.benefit && this.state.job.benefit != 'undefined' ? <div className="cate benefit-position">
                {this.state.job.sourceName == 'Vinpearl' ? null : <div className="title">{t("Benefit")}</div> }
                <div dangerouslySetInnerHTML={{__html: unescape(this.state.job.benefit)}} />
              </div> : null}
              {this.state.job.contactInfo && this.state.job.contactInfo != 'undefined' ? <div className="cate contact-position">
                {this.state.job.sourceName == 'Vinpearl' ? null : <div className="title">{t("Contact")}</div>}
                <div dangerouslySetInnerHTML={{__html: unescape(this.state.job.contactInfo)}} />
              </div> : null}
            </div>
          </div>
        </div>
      </div>
      </> : null
    )
  }
}

export default withRouter(withTranslation()(PositionRecruitingDetail))
