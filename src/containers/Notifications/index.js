import React from 'react';
import axios from 'axios';
// import ConfirmPasswordModal from './ConfirmPasswordModal/ConfirmPasswordModal';
import FormSearchComponent from './SearchBlock/FormSearchComponent';

class NotificationsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowConfirmPasswordModal: true
    }
  }

  componentWillMount() {
    
  }

  handleSubmitSearch = (e) => {

  }

  hideConfirmPasswordModal = () => {
    this.setState({isShowConfirmPasswordModal: false});
    // window.location.reload();
  };

  render() {
    return (
      <>
      <div className="list-notifications-section">
        <FormSearchComponent />
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="list-notifications-block">
              <div className="item">
                <span className="ic-notification"><i className="far fa-bell"></i></span>
                <div className="content">
                  <a href="notification/1" title="Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)" className="title readed">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</a>
                  <p className="description">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</p>
                  <div className="time-attachment-detail-block">
                    <div className="time-attachment-block">
                      <span className="time-block">
                        <i className='far fa-clock ic-clock'></i>
                        <span>1 giờ trước</span>
                      </span>
                      <span className="attachment-block">
                        <i className="fas fa-paperclip ic-attachment"></i>
                        <span>Có tệp tin đính kèm</span>
                      </span>
                    </div>
                    <a href="#" title="Xem chi tiết" className="detail-link">Xem chi tiết</a>
                  </div>
                </div>
              </div>

              <div className="item">
                <span className="ic-notification"><i className="far fa-bell"></i></span>
                <div className="content">
                  <a href="notification/1" title="Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)" className="title">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</a>
                  <p className="description">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</p>
                  <div className="time-attachment-detail-block">
                    <div className="time-attachment-block">
                      <span className="time-block">
                        <i className='far fa-clock ic-clock'></i>
                        <span>1 giờ trước</span>
                      </span>
                      <span className="attachment-block">
                        <i className="fas fa-paperclip ic-attachment"></i>
                        <span>Có tệp tin đính kèm</span>
                      </span>
                    </div>
                    <a href="#" title="Xem chi tiết" className="detail-link">Xem chi tiết</a>
                  </div>
                </div>
              </div>

              <div className="item">
                <span className="ic-notification"><i className="far fa-bell"></i></span>
                <div className="content">
                  <a href="notification/1" title="Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)" className="title readed">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</a>
                  <p className="description">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</p>
                  <div className="time-attachment-detail-block">
                    <div className="time-attachment-block">
                      <span className="time-block">
                        <i className='far fa-clock ic-clock'></i>
                        <span>1 giờ trước</span>
                      </span>
                      <span className="attachment-block">
                        <i className="fas fa-paperclip ic-attachment"></i>
                        <span>Có tệp tin đính kèm</span>
                      </span>
                    </div>
                    <a href="#" title="Xem chi tiết" className="detail-link">Xem chi tiết</a>
                  </div>
                </div>
              </div>

              <div className="item">
                <span className="ic-notification"><i className="far fa-bell"></i></span>
                <div className="content">
                  <a href="notification/1" title="Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)" className="title">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</a>
                  <p className="description">Lịch tiêm phòng cúm - HO tại Hà Nội (đợt 3)</p>
                  <div className="time-attachment-detail-block">
                    <div className="time-attachment-block">
                      <span className="time-block">
                        <i className='far fa-clock ic-clock'></i>
                        <span>1 giờ trước</span>
                      </span>
                      <span className="attachment-block">
                        <i className="fas fa-paperclip ic-attachment"></i>
                        <span>Có tệp tin đính kèm</span>
                      </span>
                    </div>
                    <a href="#" title="Xem chi tiết" className="detail-link">Xem chi tiết</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default NotificationsComponent
