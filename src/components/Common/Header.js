import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "../../modules";
import moment from 'moment';

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotificationsUnReadLimitation,
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

    let totalNotificationUnRead = 0;
    const lv3 = localStorage.getItem('organizationLv3');
    const lv4 = localStorage.getItem('organizationLv4');
    const lv5 = localStorage.getItem('organizationLv5');

    const getTimePost = (createdDateInput) => {
        let timePost = moment(createdDateInput).format("DD/MM/YYYY");
        const createdDate = moment(createdDateInput);
        const now = moment();
        const duration = moment.duration(now.diff(createdDate));
        const minutes = duration.asMinutes();
        const hours = duration.asHours();
        if (minutes < 60) {
          timePost = Math.floor(minutes) + " phút trước";
        } else if (hours < 24) {
          timePost = Math.floor(hours) + " giờ trước";
        }
        return timePost;
    }

    let dataNotificationsUnRead = "";
    const result = usePreload([lv3, lv4, lv5]);
    if(result && result.data && result.result) {
        const res = result.result;
        const data = result.data;
        if (res.code != 1) {
            if (data.notifications.length > 0) {
                if (data.total > 99) {
                    totalNotificationUnRead = "+99";
                } else if (data.total == 0) {
                    totalNotificationUnRead = "";
                } else {
                    totalNotificationUnRead = data.total;
                }
                dataNotificationsUnRead = <>
                {
                    data.notifications.map((item, i) => {
                        const timePost = getTimePost(item.createdDate);
                        return <div key={i} className="item">
                            <a className="title" href={`/notifications/${item.id}`} title={item.title}>{item.title}</a>
                            <p className="description">{item.description != null ? item.description : ""}</p>
                            <div className="time-file">
                                <span className="time"><i className='far fa-clock ic-clock'></i><span>{timePost}</span></span>
                                { item.hasAttachmentFiles ? <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>Có tệp tin đính kèm</span></span> : ""}
                            </div>
                        </div>
                    })
                }
                </>;
            }
        }
    }

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
                            {totalNotificationUnRead != "" ? <span className="count">{totalNotificationUnRead}</span> : "" }
                        </span>
                    </Dropdown.Toggle>
                    {dataNotificationsUnRead != "" ?
                    <Dropdown.Menu className="list-notification-popup">
                        <div className="title-block">thông báo nội bộ</div>
                        <div className="all-items">
                            {dataNotificationsUnRead}
                        </div>
                        <a href="/notifications-unread" title="Xem tất cả" className="view-all">Xem tất cả</a>
                    </Dropdown.Menu>
                    : null
                    }
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

export default Header
