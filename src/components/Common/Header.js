import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function Header(props) {
    const { fullName, email, avatar } = props.user;
    const { setShow, isApp } = props;
    const [isShow, SetIsShow] = useState(false);
    const guard = useGuardStore();

    const userLogOut = () => {
        guard.setLogOut();
        try {
            Auth.signOut({ global: true });
        } catch  {

        }
    }

    const { t } = useTranslation();

    const handleClickSetShow = () => {

        SetIsShow(!isShow);
        setShow(isShow);
    }
    
    const [showNotify, setShowNotify] = useState(false);
    const handleCloseNotify = () => setShowNotify(false);
    const handleShowNotify = () => setShowNotify(true);

    return (
        isApp ? null :
        <div>
            <Navbar expand="lg" className="navigation-top-bar-custom">
                <Button variant="outline-primary" className='d-block d-lg-none' onClick={handleClickSetShow}><i className='fas fa-bars'></i></Button>
                <Form className="form-inline mr-auto navbar-search d-none d-lg-block">
                    <InputGroup className='d-none'>
                        <InputGroup.Prepend>
                            <Button className="bg-light border-0" variant="outline-secondary"><i className="fas fa-sm fa-sm fa-search"></i></Button>
                        </InputGroup.Prepend>
                        <FormControl className="bg-light border-0" placeholder={t("SearchTextPlaceholder")} aria-label="Search" aria-describedby="basic-addon1" />
                    </InputGroup>
                </Form>
                <Dropdown>
                    <div className='mr-2 mt-3 small text-right username'>
                        <span onClick={handleShowNotify} >
                            <i className="notification-custom far fa-bell"></i>
                            <span className="badge-notification mt-5" data-badge="4"></span> &nbsp; | &nbsp;
                             </span>

                        <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header user-info-margin'>
                            <span className="text-gray-600"> {fullName}</span>
                            <img className="ml-2 img-profile rounded-circle" src={`data:image/png;base64, ${avatar}`} alt={fullName}></img>
                        </Dropdown.Toggle>
                    </div>
                    <Dropdown.Menu className='animated--grow-in'>
                        <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{t("Logout")}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>                
            </Navbar>
            <div>                
                  <Modal show={showNotify} onHide={handleCloseNotify}>
                    <Modal.Header>
                      <Modal.Title> &nbsp; Thông báo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="model-body-notify">

                        <div className="list-group">
                          <a href="#" className="list-group-item list-group-item-action list-group-item-notify item-notify-unread"> <i class="fa fa-circle"></i> &nbsp;
                          THÔNG BÁO KHẨN CỦA BAN LÃNH ĐẠO TẬP ĐOÀN!</a>
                          <a href="#" className="list-group-item list-group-item-action list-group-item-notify item-notify-unread"><i class="fa fa-circle"></i> &nbsp;
                          THÔNG BÁO: Nhận đồng phục may đo cho CBNV HO (khu vực Hà Nội)</a>
                          <a href="#" className="list-group-item list-group-item-action list-group-item-notify"><i class="far fa-circle"></i> &nbsp;
                          Thông báo về việc phối hợp nhận diện khuôn mặt ra vào Tòa VP Symphony</a>
                          <a href="#" className="list-group-item list-group-item-action list-group-item-notify"><i class="far fa-circle"></i> &nbsp;
                          (PASSWORD EXPIRATION NOTIFICATION) THONG BAO MAT KHAU SAP HET HAN</a>
                          <a href="#" className="list-group-item list-group-item-action list-group-item-notify"><i class="far fa-circle"></i> &nbsp;
                          Thông báo nhận HĐ thuê xe</a>
                          <a href="#" className="list-group-item list-group-item-action list-group-item-notify"><i class="far fa-circle"></i> &nbsp;
                          Tạo tài khoản ví VinID Pay thành công</a>
                          
                        </div>

                    </Modal.Body>
                    <Modal.Footer className="model-footer-notify">                       
                       <center>
                           <Button className="btn btn-default" onClick={ handleCloseNotify }>
                              Hiển thị tất cả thông báo
                          </Button>
                      </center>                      
                    </Modal.Footer>
                  </Modal>
            </div>
        </div>
    );
}

export default Header;
