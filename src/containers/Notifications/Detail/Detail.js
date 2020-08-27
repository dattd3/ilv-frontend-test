import React from 'react';
import axios from 'axios';
import Constants from '../../../commons/Constants';

class NotificationDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      notificationInfo: []
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
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}notifications/${this.getNotificationId()}`, config)
    .then(res => {                        
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          this.setState({notificationInfo : res.data.data });
        }
      }
    }).catch(error => {
      this.setState({notificationInfo : []});
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

  render() {
    return (
      <>
      <div className="notifications-detail-section">
        <h4 className="h4 title-block">{this.state.notificationInfo.title != null ? this.state.notificationInfo.title : ""}</h4>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="detail-notifications-block">
              <div className="content" 
              dangerouslySetInnerHTML={{__html: this.state.notificationInfo.content != null ? this.state.notificationInfo.content : ""}} />
              {Array.isArray(this.state.notificationInfo.notificationDocuments) &&  this.state.notificationInfo.notificationDocuments.length > 0 ? 
              <div className="list-attachment-files">
                {
                this.state.notificationInfo.notificationDocuments.map((item, i) => {
                  return <span key={i} className="file">
                    {this.getFileIcon(item.type)}
                    <a href={item.link} className="file-name">{item.name}</a>
                    <span className="size">{this.getFileSize(item.size)}</span>
                  </span>
                })
                }
              </div>
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

export default NotificationDetailComponent
