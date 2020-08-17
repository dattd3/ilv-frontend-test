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
      <div className="notifications-detail-section">
        <h4 className="h4 title-block">lịch tiêm phòng cúm - ho tại hà nội (đợt 3)</h4>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="detail-notifications-block">
              <div className="content">
                <div>Kính gửi Anh/Chị - phth</div>
                <div>CC Anh/Chị - ntt</div>
                <div>Tiếp theo thông báo tiêm phòng cúm cho toàn thể CBNV, PNS, HO gửi triển khai cho CBNV HO tại Hà Nội</div>
                <div>1. Đối tượng tiêm phòng</div>
                <div>- Chưa tiêm vắc xin cúm hoặc đã tiêm vắc xin cúm trước ngày 01/09/2019</div>
                <div>- Không dị ứng với trứng gà</div>
                <div>2. Các công việc cần chuẩn bị</div>
                <div>- Anh/Chị đảm bảo đến tiêm phòng theo lịch</div>
                <div>3. Địa điểm: Phòng White Diamond và Yellow Diamond - Trung tâm hội nghị Almaz</div>
                <div>4. Ngày giờ khám: chi tiết file đính kèm</div>
                <div>5. Quy trình tiêm chủng:</div>
              </div>
              <div className="list-attachment-files">
                <span className="file">
                  <i className="ic-file far fa-file-word"></i>
                  <span className="file-name">Mẫu phiếu thu thập thông tin từ CBNV_V2.docx</span>
                  <span className="size">(150 KB)</span>
                </span>

                <span className="file">
                  <i className="ic-file far fa-file-pdf"></i>
                  <span className="file-name">WHAT_TO_SKNOW_ABOUT_VACCINE.pdf</span>
                  <span className="size">(450 KB)</span>
                </span>

                <span className="file">
                  <i className="ic-file far fa-file-excel"></i>
                  <span className="file-name">DS Lịch tiêm đợt 3.xlsx</span>
                  <span className="size">(250 KB)</span>
                </span>
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
