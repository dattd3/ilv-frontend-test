import React from 'react';
import axios from 'axios';
import ConfirmPasswordModal from './ConfirmPasswordModal/ConfirmPasswordModal';
import FormSearchComponent from './SearchBlock/FormSearchComponent';
import MainResultComponent from './ResultBlock/MainResultComponent';
import OtherResultComponent from './ResultBlock/OtherResultComponent';
import './Css/Main.scss'

class PaySlipsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowConfirmPasswordModal: true,
      jobs: [],
      search: {
        position: 0,
        placeOfWork: 0
      },
      pageNumber: 1
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
      <ConfirmPasswordModal show={this.state.isShowConfirmPasswordModal} onHide={this.hideConfirmPasswordModal} />
      <div className="payslips-section">
        <div className="card shadow mb-4">
          <div className="card-body">
            <FormSearchComponent />
            <MainResultComponent />
          </div>
        </div>
        <OtherResultComponent />
      </div>
      </>
    )
  }
}

export default PaySlipsComponent
