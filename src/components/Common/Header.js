import React, { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "../../modules";
import axios from 'axios'
import moment from 'moment';
import Constants from "../../commons/Constants"
import { Animated } from "react-animated-css";
import { useLocalizeStore } from '../../modules';
import uploadAvatarIcon from '../../assets/img/icon/camera-sm.svg'
import UploadAvatar from '../../containers/UploadAvatar'
import { getRequestConfigurations } from "../../commons/Utils"

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotificationsUnReadLimitation,
        autoRun: true,
        params: params
    });
    return data;
};

const getOrganizationLevelByRawLevel = level => {
    return (level == undefined || level == null || level == "" || level == "#") ? 0 : level
}

function Header(props) {
    const localizeStore = useLocalizeStore();
    const { fullName, email, avatar } = props.user;
    const { setShow, isApp } = props;
    const [isShow, SetIsShow] = useState(false);
    const [activeLang, setActiveLang] = useState(localStorage.getItem("locale"));
    const [totalNotificationUnRead, setTotalNotificationUnRead] = useState("");
    const [totalNotificationCount, setTotalNotificationCount] = useState(0);
    const [isShowUploadAvatar, setIsShowUploadAvatar]= useState(false);
    const guard = useGuardStore();
    const { t } = useTranslation();

    let lastNotificationIdSeen = 0;
    let dataNotificationsUnRead = "";
    const companyCode = localStorage.getItem('companyCode');
    const lv3 = localStorage.getItem('organizationLv3');
    const lv4 = getOrganizationLevelByRawLevel(localStorage.getItem('organizationLv4'))
    const lv5 = getOrganizationLevelByRawLevel(localStorage.getItem('organizationLv5'))

    const getTimePost = (createdDateInput) => {
        let timePost = moment(createdDateInput).format("DD/MM/YYYY");
        const createdDate = moment(createdDateInput);
        const now = moment();
        const duration = moment.duration(now.diff(createdDate));
        const minutes = duration.asMinutes();
        const hours = duration.asHours();
        if (minutes < 60) {
            timePost = Math.floor(minutes) + t("minutesAgo");
        } else if (hours < 24) {
            timePost = Math.floor(hours) + t("hoursAgo");
        }
        return timePost;
    }

    const clickNotification = (id) => {
        var axios = require('axios');
        var data = '';
        var config = {
            method: 'post',
            url: `${process.env.REACT_APP_REQUEST_URL}notifications/readnotification/` + id,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(function (response) {

            })
            .catch(function (error) {

            });
    }

    const OnClickBellFn = (isOpen) => {
        if (isOpen && lastNotificationIdSeen > 0 && totalNotificationUnRead) {
            var axios = require('axios');
            var data = '';
            var config = {
                method: 'post',
                url: `${process.env.REACT_APP_REQUEST_URL}notifications/SetLastNotificationIdSeen/` + lastNotificationIdSeen,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios(config)
                .then(function (response) {
                    setTotalNotificationUnRead("");
                })
                .catch(function (error) {
                    setTotalNotificationUnRead("");
                });
        }
    }

    const result = usePreload([companyCode, lv3, lv4, lv5]);
    if (result && result.data && result.result) {
        const res = result.result;
        const data = result.data;
        if (res.code != 1) {
            if (data.notifications && data.notifications.length > 0) {
                if (data.total > 99 && data.total !== totalNotificationCount) {
                    setTotalNotificationCount(data.total)
                    setTotalNotificationUnRead("+99");
                } else if (data.total == 0 && data.total !== totalNotificationCount) {
                    setTotalNotificationCount(data.total)
                    setTotalNotificationUnRead("");
                } else if (data.total !== totalNotificationCount) {
                    setTotalNotificationCount(data.total)
                    setTotalNotificationUnRead(data.total);
                }
                if (data.notifications[0]) {
                    lastNotificationIdSeen = data.notifications[0].id;
                }

                dataNotificationsUnRead = <>
                    {
                        data.notifications.map((item, i) => {
                            const timePost = getTimePost(item.createdDate);
                            let notificationLink = (type) => {
                                switch (type) {
                                    case Constants.notificationType.NOTIFICATION_DEFAULT:
                                    case 12:
                                    case 13:
                                    case 14:
                                    case 15:
                                    case 11:
                                        return `/notifications/${item.id}`
                                    case Constants.notificationType.NOTIFICATION_REGISTRATION:
                                        if (item.title.indexOf("thẩm định") > 0)
                                            return `/tasks?tab=consent`
                                        else
                                            return `/tasks?tab=approval`
                                    case 6:
                                        return '/personal-info?tab=document'
                                    case Constants.notificationType.NOTIFICATION_REJECT:
                                        return `/tasks`
                                    case Constants.notificationType.NOTIFICATION_AUTO_JOB:
                                        return `/tasks?tab=approval`
                                    case Constants.notificationType.NOTIFICATION_SHIFT_CHANGE:
                                        return `/timesheet`
                                    case 20:
                                         return '/personal-info?tab=document'
                                    default:
                                        return `${item.url}`
                                }
                            }
                            return <div key={i} className="item">
                                <a onClick={() => clickNotification(item.id)} className="title" href={notificationLink(item.type)} title={item.title}>{item.title}</a>
                                <p className="description">{item.description != null ? item.description : ""}</p>
                                <div className="time-file">
                                    <span className="time"><i className='far fa-clock ic-clock'></i><span>{timePost}</span></span>
                                    {item.hasAttachmentFiles ? <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>{t("HasAttachments")}</span></span> : ""}
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
        } catch {
            guard.setLogOut();
            window.location.reload();
        }
    }


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

    const onChangeLocale = async lang => {
        const isChangedLanguage = await updateLanguageByCode(lang)
        if (isChangedLanguage) {
            setActiveLang(lang)
            if (window.location.pathname.match('vaccination')) {
                window.location.reload()
            }
        }
    }

    const updateLanguageByCode = async lang => {
        if (lang) {
            try {
                const languageKeyMapping = {
                    'en-US': 'en',
                    'vi-VN': 'vi'
                }
                const config = getRequestConfigurations()
                const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/setlanguage?culture=${languageKeyMapping[[lang]]}`, null, config)
                if (response && response.data) {
                    const result = response.data.result
                    if (result.code == Constants.API_SUCCESS_CODE) {
                        return true
                    }
                    return false
                }
                return false
            } catch (e) {
                return false
            }
        }
        return false
    }

    const openUploadAvatarPopup = () => {
        setIsShowUploadAvatar(true);
    }

    const onHideUploadAvatar = () => {
        setIsShowUploadAvatar(false);
    }
    useEffect(() => {
        localizeStore.setLocale(activeLang || "vi-VN")
    }, [activeLang, localizeStore]);

    return (
        isApp ? null :
            <div className="page-header">
                <UploadAvatar show={isShowUploadAvatar} onHide={onHideUploadAvatar} />
                <Navbar expand="lg" className="navigation-top-bar-custom">
                    <Button variant="outline-secondary" className='d-block' onClick={handleClickSetShow}><i className='fas fa-bars'></i></Button>
                    <Form className="form-inline mr-auto navbar-search d-none d-lg-block">
                        <InputGroup className='d-none'>
                            <InputGroup.Prepend>
                                <Button className="bg-light border-0" variant="outline-secondary"><i className="fas fa-sm fa-sm fa-search"></i></Button>
                            </InputGroup.Prepend>
                            <FormControl className="bg-light border-0" placeholder={t("SearchTextPlaceholder")} aria-label="Search" aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Form>
                    <Dropdown id="notifications-block" onToggle={(isOpen) => OnClickBellFn(isOpen)}>
                        <Animated animationIn="lightSpeedIn" isVisible={dataNotificationsUnRead != ""} animationOutDuration={10} >
                            <Dropdown.Toggle>
                                <span className="notifications-block">
                                    <i className="far fa-bell ic-customize"></i>
                                    {totalNotificationUnRead != "" ? <span className="count">{totalNotificationUnRead}</span> : ""}
                                </span>
                            </Dropdown.Toggle>
                        </Animated>
                        {dataNotificationsUnRead != "" ?
                            <Dropdown.Menu className="list-notification-popup">
                                <div className="title-block text-center">{t("AnnouncementInternal")}</div>
                                <div className="all-items">
                                    {dataNotificationsUnRead}
                                </div>
                                {/* <a href="/notifications-unread" title="Xem tất cả" className="view-all">Xem tất cả</a> */}
                            </Dropdown.Menu>
                            : null
                        }
                    </Dropdown>
                    <Dropdown>
                        <div className='mr-2 small text-right username'>
                            <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header user-info-margin'>
                                <span className="text-gray-600 full-name">{fullName}</span>
                                {
                                    (avatar != null && avatar !== '' && avatar !== 'null') ?
                                        <img className="ml-2 img-profile rounded-circle" src={`data:image/png;base64, ${avatar}`} alt={fullName} />
                                        :
                                        <span className="text-gray-600 ml-2 img-profile no-avt"><i className="fas fa-user-circle"></i></span>
                                }
                            </Dropdown.Toggle>
                        </div>
                        <Dropdown.Menu className='animated--grow-in'>
                            {/* <Dropdown.Item onClick={openUploadAvatarPopup}>
                                <img alt="cam" src={uploadAvatarIcon} className="mr-2"/>
                                {t("ChangeAvatar")}
                            </Dropdown.Item> */}
                            <Dropdown.Item onClick={() => onChangeLocale("vi-VN")}>
                                <i className="fas fa-circle fa-sm fa-fw mr-2" style={{ color: activeLang === "vi-VN" ? "#347ef9" : "white" }}></i>
                                {t("LangViet")}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => onChangeLocale("en-US")}>
                                <i className="fas fa-circle fa-sm fa-fw mr-2" style={{ color: activeLang === "en-US" ? "#347ef9" : "white" }}></i>
                                {t("LangEng")}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                {t("Logout")}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
            </div >
    );
}

export default Header
