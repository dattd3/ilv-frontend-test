import React from 'react';
import axios from 'axios';
import { withTranslation } from "react-i18next"
import purify from "dompurify"
import Constants from '../../../commons/Constants';
import SubmitQuestionModal from '../../QuestionAndAnswer/SubmitQuestionModal'
import StatusModal from '../../../components/Common/StatusModal'
import HOCComponent from '../../../components/Common/HOCComponent'
import { getCurrentLanguage, isEnableFunctionByFunctionName } from "../../../commons/Utils";
import '../../../assets/css/ck-editor5.css';

purify.addHook('afterSanitizeAttributes', function (node) {
  if ('target' in node) {
    if (node?.target === '_blank') {
      node.setAttribute('rel', 'noreferrer noopener')
    }
  }
})

class NotificationDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationInfo: [],
      isShowSubmitQuestionModal: false,
      isEditQuestion: false,
      isShowStatusModal: false,
      content: "",
      isSuccess: false,
      categories: [],
    }
  }

  getNotificationId = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      },
      params: {
        'culture': getCurrentLanguage()
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}notifications/${this.getNotificationId()}`, config)
      .then(res => {
        if (res && res.data && res.data.data && res.data.result) {
          const result = res.data.result;
          if (result.code != Constants.API_ERROR_CODE) {
            this.setState({ notificationInfo: res.data.data });
          }
        }
      }).catch(error => {
        this.setState({ notificationInfo: [] });
      });

    axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/categories/` + localStorage.getItem("companyCode"), config)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.setState({ categories: res.data.data })
        }
      }).catch(error => {

      });
  }

  getFileIcon = fileType => {
    switch (fileType) {
      case Constants.PDF_FILE_TYPE:
        return <i className="ic-file far fa-file-pdf"></i>;
      case Constants.DOC_FILE_TYPE:
        return <i className="ic-file far fa-file-word"></i>;
      case Constants.XLS_FILE_TYPE:
        return <i className="ic-file far fa-file-excel"></i>;
      case Constants.ZIP_FILE_TYPE:
        return <i className="ic-file fas fa-file-archive"></i>;
      case Constants.IMAGE_FILE_TYPE:
        return <i className="ic-file fas fa-file-image"></i>;
      case Constants.AUDIO_FILE_TYPE:
        return <i className="ic-file fas fa-file-audio"></i>;
      case Constants.VIDEO_FILE_TYPE:
        return <i className="ic-file fas fa-file-video"></i>;
      default:
        return <i className="ic-file fas fa-file-alt"></i>;
    }
  }

  getFileSize = fileSize => {
    return `(${fileSize} KB)`;
  }

  hasAttachmentFiles = notificationDocuments => {
    if (notificationDocuments) {
      for (let i = 0, len = notificationDocuments.length; i < len; i++) {
        if (!notificationDocuments[i].isDeleted) {
          return true
        }
      }
      return false
    }
    return false
  }

  showSubmitModal(modalStatus, isEdit = false) {
    this.setState({ isShowSubmitQuestionModal: modalStatus, isEditQuestion: isEdit });
  }
  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
    this.showSubmitModal(false);
  };
  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  render() {
    const { t } = this.props
    const { isEditQuestion, questionContent, categories, isShowSubmitQuestionModal } = this.state
    const isEnableQnA = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.qnA)

    return (
      <>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <SubmitQuestionModal
          isEdit={isEditQuestion}
          editQuestion={questionContent}
          categories={categories}
          show={isShowSubmitQuestionModal} 
          onHide={() => this.showSubmitModal(false)} 
          showStatusModal={this.showStatusModal.bind(this)} />
        <div className="notifications-detail-section mt-5">
          <div className="row">
            <div className="col-md-8 display-inline">
              <h5 className="title-block">{this.state.notificationInfo.title != null ? this.state.notificationInfo.title : ""}</h5>
            </div>
            <div className="col-md-4">
              {
                isEnableQnA ? 
                <button type="button" className="btn btn-primary float-right shadow pl-4 pr-4 mb-3 create-qna" onClick={() => this.showSubmitModal(true)}>{t("CreateQuestions")}</button>
                : null
              }
            </div>
          </div>
          <div className="card notification-detail-card mb-4">
            <div className="card-body">
              <div className="detail-notifications-block">
                <div className="content ck ck-content"
                  dangerouslySetInnerHTML={{
                    __html: purify.sanitize(this.state?.notificationInfo?.content || '', { ADD_TAGS: ["iframe"], ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'scrolling'] }),
                }} />
                {
                  this.hasAttachmentFiles(this.state.notificationInfo.notificationDocuments) ?
                    <>
                      <hr />
                      <div className="list-attachment-files">
                        {
                          (this.state.notificationInfo.notificationDocuments || []).map((item, i) => {
                            return !item.isDeleted ? <span key={i} className="file">
                              {this.getFileIcon(item.type)}
                              <a href={item.link} target="_blank" className="file-name">{item.name}</a>
                              <span className="size">{this.getFileSize(item.size)}</span>
                            </span> : null
                          })
                        }
                      </div>
                    </>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default HOCComponent(withTranslation()(NotificationDetailComponent))
