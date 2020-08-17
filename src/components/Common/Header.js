import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "../../modules";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotifyList,
        autoRun: true,
        params: params
    });
    return data;
};

function Header(props) {

    const { fullName, email, avatar } = props.user;
    const { setShow, isApp } = props;
    const [isShow, SetIsShow] = useState(false);
    const guard = useGuardStore();

    const userLogOut = () => {
        try {
            guard.setLogOut();
            Auth.signOut({ global: true });
        } catch  {
            guard.setLogOut();
            window.location.reload();
        }
    }

    const { t } = useTranslation();

    Auth.currentUserInfo().then(currentAuthUser => {
        if (currentAuthUser === undefined || currentAuthUser === null) {
            Auth.signOut({ global: true });
            guard.setLogOut();
            window.location.reload();
        }
    });

    const handleClickSetShow = () => {
        SetIsShow(!isShow);
        setShow(isShow);
    }
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
                    <Dropdown id="notifications-block">
                        <Dropdown.Toggle>
                            <span className="notifications-block">
                                <i className="far fa-bell ic-customize"></i>
                                <span className="count">+99</span>
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="list-notification-popup">
                            <div className="title-block">thông báo nội bộ</div>
                            <div className="all-items">
                                <div className="item">
                                    <a className="title" href="#" title="Thống kê tình hình sử dụng điện thoại Vsmart">Thống kê tình hình sử dụng điện thoại Vsmart</a>
                                    <p className="description">Thống kê tình hình sử dụng điện thoại Vsmart</p>
                                    <div className="time-file">
                                        <span className="time"><i className='far fa-clock ic-clock'></i><span>1 giờ trước</span></span>
                                        <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>Có tệp tin đính kèm</span></span>
                                    </div>
                                </div>
                                <div className="item">
                                    <a className="title" href="#" title="Thống kê tình hình sử dụng điện thoại Vsmart">Thống kê tình hình sử dụng điện thoại Vsmart</a>
                                    <p className="description">Thống kê tình hình sử dụng điện thoại Vsmart</p>
                                    <div className="time-file">
                                        <span className="time"><i className='far fa-clock ic-clock'></i><span>1 giờ trước</span></span>
                                        <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>Có tệp tin đính kèm</span></span>
                                    </div>
                                </div>
                                <div className="item">
                                    <a className="title" href="#" title="Thống kê tình hình sử dụng điện thoại Vsmart">Thống kê tình hình sử dụng điện thoại Vsmart</a>
                                    <p className="description">Thống kê tình hình sử dụng điện thoại Vsmart</p>
                                    <div className="time-file">
                                        <span className="time"><i className='far fa-clock ic-clock'></i><span>1 giờ trước</span></span>
                                        <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>Có tệp tin đính kèm</span></span>
                                    </div>
                                </div>
                                <div className="item">
                                    <a className="title" href="#" title="Thống kê tình hình sử dụng điện thoại Vsmart">Thống kê tình hình sử dụng điện thoại Vsmart</a>
                                    <p className="description">Thống kê tình hình sử dụng điện thoại Vsmart</p>
                                    <div className="time-file">
                                        <span className="time"><i className='far fa-clock ic-clock'></i><span>1 giờ trước</span></span>
                                        <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>Có tệp tin đính kèm</span></span>
                                    </div>
                                </div>
                            </div>
                            <a href="#" title="Xem tất cả" className="view-all">Xem tất cả</a>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <div className='mr-2 small text-right username'>
                            <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header user-info-margin'>
                                <span className="text-gray-600">{fullName}</span>
                                {
                                    (avatar != null && avatar !== '' && avatar !== 'null') ?
                                        <img className="ml-2 img-profile rounded-circle" src={`data:image/png;base64, ${avatar}`} alt={fullName} />
                                        :
                                        <span className="text-gray-600 ml-2 img-profile no-avt"><i className="fas fa-user-circle"></i></span>
                                }
                            </Dropdown.Toggle>
                        </div>
                        <Dropdown.Menu className='animated--grow-in'>
                            <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{t("Logout")}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
            </div>
    );
}

export default Header;
