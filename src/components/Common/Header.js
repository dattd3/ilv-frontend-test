import React, { useState, useEffect, useContext } from "react";
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Image } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import axios from 'axios'
import moment from 'moment';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Constants from "../../commons/Constants"
import { Animated } from "react-animated-css";
import { useLocalizeStore } from '../../modules';
import CheckinNotificationIcon from '../../assets/img/icon/ic-checkin-noti.svg';
import UseGuideIcon from '../../assets/img/icon/Icon-useGuide.svg';
import UploadAvatar from '../../containers/UploadAvatar'
import { getRequestConfigurations, getRequestTypesList } from "../../commons/Utils"
import TimeKeepingList from "containers/TimeKeepingHistory/TimeKeepingList";
import RedArrowIcon from 'assets/img/icon/red-arrow-right.svg';
import CloseIcon from 'assets/img/icon/icon_x.svg';
import BellIcon from 'assets/img/icon/bell-icon.svg';
import VingroupIcon from 'assets/img/icon/vingroup-icon.svg';
import ArrowDownIcon from 'assets/img/icon/arrow-down.svg';
import NewestNotificationContext from "modules/context/newest-notification-context";
import { handleFullScreen } from "actions/index"
import UseGuideModal from "./UseGuideModal";

const getOrganizationLevelByRawLevel = level => {
    return (level == undefined || level == null || level == "" || level == "#") ? 0 : level
}

const currentLocale = localStorage.getItem("locale")
const timeKeepingHistoryEndpoint = `${process.env.REACT_APP_REQUEST_URL}notifications/in/out/listbydate`;
const APIConfig = getRequestConfigurations();

function Header(props) {
    const localizeStore = useLocalizeStore();
    const { isApp, user } = props
    const { fullName, avatar } = user || {};
    const [activeLang, setActiveLang] = useState(currentLocale);
    const [totalNotificationUnRead, setTotalNotificationUnRead] = useState("");
    const [totalNotificationCount, setTotalNotificationCount] = useState(0);
    const [isShowUploadAvatar, setIsShowUploadAvatar]= useState(false);
    const [latestTimekeeping, setLatestTimeKeeping]= useState(null);
    const [checkinOutNoti, setCheckinOutNoti] = useState(false);
    const [showUseGuideModal, setShowUseGuideModal] = useState(false);
    const [showUseGuideIcon, setShowUseGuideIcon] = useState(false);
    const [lastNotificationIdSeen, setLastNotificationIdSeen] = useState(0);
    const [notices, setNotices] = useState([]);
    const newestNotification = useContext(NewestNotificationContext);
    const accessToken = localStorage.getItem('accessToken')

    useEffect(() => {
      localizeStore.setLocale(activeLang || Constants.LANGUAGE_VI)
    }, [activeLang, localizeStore]);

    useEffect(() => {
      if (newestNotification && accessToken) {
        if (["IN", "OUT"].includes(newestNotification.data?.detailType)) {
          fetchLatestTimeKeeping();
        } else {
          fetchNotification();
        }
      }
    }, [JSON.stringify(newestNotification)]);

    useEffect(() => {
        if (accessToken) {
            fetchNotification();
            fetchLatestTimeKeeping();
        }
    }, [])

    const guard = useGuardStore();
    const { t } = useTranslation();
    const lang = localStorage.getItem("locale");

    // let lastNotificationIdSeen = 0;
    // let dataNotificationsUnRead = "";
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
            timePost = Math.floor(minutes) + " " + t("minutesAgo");
        } else if (hours < 24) {
            timePost = Math.floor(hours) + " " + t("hoursAgo");
        }
        return timePost;
    }

    const fetchNotification = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_REQUEST_URL}notifications-unread-limitation`, {
                params: {     
                    companyCode: companyCode,     
                    level3: lv3,
                    level4: lv4,
                    level5: lv5,
                    culture: lang
                },
                ...APIConfig,
            });
            if (result.data?.data && result.data?.result) {
                const res = result.data.result;
                const data = result.data.data;

                if (res.code != 1) {
                    setNotices(data?.notifications || [])
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
                            setLastNotificationIdSeen(data.notifications[0].id);
                        }
                    }
                }
            }
        } catch (error) {
            if (error?.response?.status === 401 || error?.response?.data?.result?.code == 401) {
                guard.setLogOut();
                window.location.href = process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL;
            }
        }
    }

    const renderNoticeUI = () => {
        return (
            (notices || []).map((item, i) => {
                const timePost = getTimePost(item.createdDate);
                const requestId = item?.subRequestId?.toString().includes('.') ? item?.subRequestId?.toString()?.split('.')?.[0] : item?.subRequestId
                const subRequestId = item?.subRequestId?.toString().includes('.') ? item?.subRequestId?.toString()?.split('.')?.[1] : 1
                const qnaDetailType = 'TICKET'

                let notificationLink = (type) => {
                    console.log(type)
                    
                    switch (type) {
                        case Constants.notificationType.NOTIFICATION_DEFAULT:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 11:
                            return `/notifications/${item.id}`
                        case Constants.notificationType.NOTIFICATION_OTHER:
                            if (item?.detailType == qnaDetailType) {
                                return `${item.url}`
                            }
                            return `/notifications/${item.id}`
                        case Constants.notificationType.NOTIFICATION_REGISTRATION: 
                            if([Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT].includes(item.requestTypeId)) {
                                let subId = item.subRequestId?.includes('.') ? item.subRequestId.split('.')[1] : item.subRequestId;
                                let suffix = item.detailType == 'APPRAISAL' ? 'assess' : item.detailType == 'APPROVAL' ? 'approval' : 'request';
                                let urls = {
                                    '14-1': 'registration-transfer',
                                    '15-1': 'registration-transfer',
                                    '14-2': 'proposed-transfer',
                                    '15-2': 'proposed-appointment',
                                };
                                return `/${urls[`${item.requestTypeId}-${item.formType}`]}/${subId}/${suffix}`;
                            }

                            if (item?.detailType == 'REQUEST')
                                return `/tasks${item?.groupId ? `?requestTypes=${getRequestTypesList(item.groupId, false).join(",")}` : ''}`
                            else if (item?.detailType == 'APPRAISAL')
                                return `/tasks?tab=consent${item?.groupId ? `&requestTypes=${getRequestTypesList(item.groupId, false).join(",")}&id=${item?.subRequestId}` : ''}`
                            else
                                return `/tasks?tab=approval${item?.groupId ? `&requestTypes=${getRequestTypesList(item.groupId, false).join(",")}` : ''}&id=${item?.subRequestId}`
                        case 6:
                            return '/personal-info?tab=document'
                        case Constants.notificationType.NOTIFICATION_APPROVED:
                            return `/registration/${requestId}/${subRequestId}/request`
                        case Constants.notificationType.NOTIFICATION_AUTO_JOB:
                            return `/tasks?tab=approval${item.groupId ? `&requestTypes=${getRequestTypesList(item.groupId, false).join(",")}` : ''}`
                        case Constants.notificationType.NOTIFICATION_SHIFT_CHANGE:
                            const param = getDateShiftChange(item?.title || '');
                            return `/timesheet${param}`
                        case 20:
                             return '/personal-info?tab=document'
                        case Constants.notificationType.NOTIFICATION_ADD_MEMBER_TO_PROJECT:
                            return `/my-projects/project/${item?.userProfileHistoryId}` 
                        case Constants.notificationType.NOTIFICATION_MY_EVALUATION:
                            return `/my-evaluation`
                        case Constants.notificationType.NOTIFICATION_LEAD_EVALUATION:
                            return `/evaluation-approval`
                        case Constants.notificationType.NOTIFICATION_MY_KPI_REGISTRATION_REQUEST:
                            return `/target-management?tab=OWNER&id=${item?.subRequestId || 0}`
                        case Constants.notificationType.NOTIFICATION_MY_KPI_REGISTRATION_APPROVAL_REQUEST:
                            return `/target-management?tab=REQUEST&id=${item?.subRequestId || 0}`
                        default:
                            return `${item.url}`
                    }
                }
                let titleNotice = [Constants.notificationType.NOTIFICATION_MY_EVALUATION, Constants.notificationType.NOTIFICATION_LEAD_EVALUATION].includes(item?.type)
                ? currentLocale == Constants.LANGUAGE_VI ? item?.title : item?.en_Title || ''
                : item?.title || ''
                let descriptionNotice = [Constants.notificationType.NOTIFICATION_MY_EVALUATION, Constants.notificationType.NOTIFICATION_LEAD_EVALUATION].includes(item?.type)
                ? currentLocale == Constants.LANGUAGE_VI ? item?.description : item?.en_Description || ''
                : item?.description || ''

                return <div key={i} className="item">
                    <a onClick={() => clickNotification(item.id)} className="title" href={notificationLink(item.type)} title={titleNotice}>{titleNotice}</a>
                    <p className="description">{descriptionNotice}</p>
                    <div className="time-file">
                        <span className="time"><i className='far fa-clock ic-clock'></i><span>{timePost}</span></span>
                        {item.hasAttachmentFiles ? <span className="attachment-files"><i className='fa fa-paperclip ic-attachment'></i><span>{t("HasAttachments")}</span></span> : ""}
                    </div>
                </div>
            })
        )
    }

    const getDateShiftChange = (title) => {
        const validDates = title.match(/(\d{1,4}([.\//])\d{1,2}([.\//])\d{1,4})/g);
        let param = '';
        if(validDates?.length == 1) {
            param = `?start=${moment(validDates[0], 'DD/MM/YYYY').format('DDMMYYYY')}`;
        } else if (validDates?.length == 2) {
            param = `?start=${moment(validDates[0], 'DD/MM/YYYY').format('DDMMYYYY')}&end=${moment(validDates[1], 'DD/MM/YYYY').format('DDMMYYYY')}`;
        }
        return param;
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

    const userLogOut = async () => {
        try {
          await axios.post(
            `${process.env.REACT_APP_REQUEST_URL}device/logoutToken`,
            {
              deviceToken: localStorage.getItem('firebaseToken') || '',
              companyCode: localStorage.getItem('companyCode'),
              orgLv3: localStorage.getItem('organizationLv3'),
              orgLv4: localStorage.getItem('organizationLv4'),
              orgLv5: localStorage.getItem('organizationLv5'),
              platform: 'Web',
            },
            getRequestConfigurations()
          );
          localStorage.removeItem("firebaseToken");
          localStorage.removeItem("userFirebaseToken");
          guard.setLogOut();
          window.location.href = process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL;
          // Auth.signOut({ global: true });
        } catch {
          // localStorage.removeItem("firebaseToken");
          // localStorage.removeItem("userFirebaseToken");
          guard.setLogOut();
          window.location.reload();
        }
    }

    const tokenExpired = localStorage.getItem('tokenExpired')
    
    // Auth.currentUserInfo().then(currentAuthUser => {
    //     if (currentAuthUser === undefined || currentAuthUser === null) {
    //         Auth.signOut({ global: true });
    //         guard.setLogOut();
    //         window.location.reload();
    //     }
    // });

    if (accessToken && (!tokenExpired || !moment(tokenExpired, 'YYYYMMDDHHmmss').isValid() || moment().isAfter(moment(tokenExpired, 'YYYYMMDDHHmmss')))) {
        userLogOut()
    }

    const onChangeLocale = async lang => {
        const isChangedLanguage = await updateLanguageByCode(lang)
        if (isChangedLanguage) {
            setActiveLang(lang)
            window.location.reload()
            // if (window.location.pathname.match('vaccination') || window.location.pathname.match('evaluations')) {
            //     window.location.reload()
            // }
        }
    }

    const updateLanguageByCode = async lang => {
        if (lang) {
            try {
                const languageKeyMapping = {
                    [Constants.LANGUAGE_EN]: 'en',
                    [Constants.LANGUAGE_VI]: 'vi'
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

    const onHideUploadAvatar = () => {
        setIsShowUploadAvatar(false);
    }
  
    const fetchLatestTimeKeeping = async () => {
      try {
        const currentDate = moment().format('YYYY-MM-DD')
        const response = await axios.get(timeKeepingHistoryEndpoint, {
          params: {
            companyCode: localStorage.getItem("companyCode"),
            culture: lang === "vi-VN" ? "vi" : "en",
            date: currentDate,
          },
          ...APIConfig,
        });
        setLatestTimeKeeping(response.data?.data?.notifications);
      } catch (error) {}
    };

    return (
      <>
        <UseGuideModal show={showUseGuideModal} onHide={() => setShowUseGuideModal(false)} setShowUseGuideIcon={setShowUseGuideIcon} />
        {!isApp &&
        <div className="page-header">
            <UploadAvatar show={isShowUploadAvatar} onHide={onHideUploadAvatar} />
            <Navbar expand="lg" className="navigation-top-bar-custom">
                <Button variant="outline-secondary" className='d-block' onClick={() => props.handleFullScreen(!props?.isFullScreen)}><i className='fas fa-bars'></i></Button>
                <Form className="form-inline mr-auto navbar-search d-none d-lg-block">
                    <InputGroup className='d-none'>
                        <InputGroup.Prepend>
                            <Button className="bg-light border-0" variant="outline-secondary"><i className="fas fa-sm fa-sm fa-search"></i></Button>
                        </InputGroup.Prepend>
                        <FormControl className="bg-light border-0" placeholder={t("SearchTextPlaceholder")} aria-label="Search" aria-describedby="basic-addon1" />
                    </InputGroup>
                </Form>
                <div className="notification-icons-block">
                    {
                      showUseGuideIcon && <Image
                        className="mr-3 guide-icon"
                        alt="checkin notification"
                        src={UseGuideIcon}
                        onClick={() => setShowUseGuideModal(true)}
                      />
                    }
                    <Dropdown id="notifications-block" 
                    className="notification-guide" 
                    show={checkinOutNoti} 
                    onToggle={() => setCheckinOutNoti(!checkinOutNoti)}
                    >
                        <Animated animationIn="lightSpeedIn" animationOutDuration={10}>
                            <Dropdown.Toggle>
                                <Image
                                className="guide-icon"
                                alt="checkin notification"
                                src={CheckinNotificationIcon}
                                />
                            </Dropdown.Toggle>
                        </Animated>
                        <Dropdown.Menu className="list-notification-popup">
                            <div className="timekeeping-title-block">
                                {t('timekeeping_history')?.toUpperCase()}
                                <Image
                                onClick={() => setCheckinOutNoti(false)}
                                className="close-icon"
                                alt="details notification"
                                src={CloseIcon}
                                />
                            </div>
                            <br />
                            {
                            latestTimekeeping?.length > 0 ? <>
                                <TimeKeepingList apiResponseData={latestTimekeeping} />
                                <br />
                                <a href={"/timekeeping-history"} className="details-link">
                                    {t("Details")} &nbsp;
                                    <Image
                                    // className="guide-icon"
                                    alt="details notification"
                                    src={RedArrowIcon}
                                    />
                                </a>
                            </> : <div className="text-danger no-data-div">
                                {t("NodataExport")}
                                </div>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown id="notifications-block" onToggle={(isOpen) => OnClickBellFn(isOpen)}>
                        <Animated animationIn="lightSpeedIn" isVisible={notices?.length > 0} animationOutDuration={10} >
                            <Dropdown.Toggle>
                                <span className="notifications-block">
                                    {/* <i className="far fa-bell ic-customize"></i> */}
                                    <Image
                                    // className="guide-icon"
                                    alt="details notification"
                                    src={BellIcon}
                                    />
                                    {totalNotificationUnRead != "" ? <span className="count">{totalNotificationUnRead}</span> : ""}
                                </span>
                            </Dropdown.Toggle>
                        </Animated>
                        {notices?.length > 0 ?
                            <Dropdown.Menu className="list-notification-popup">
                                <div className="title-block text-center">{t("AnnouncementInternal")}</div>
                                <div className="all-items">
                                    {renderNoticeUI()}
                                </div>
                                {/* <a href="/notifications-unread" title="Xem tất cả" className="view-all">Xem tất cả</a> */}
                            </Dropdown.Menu>
                            : null
                        }
                    </Dropdown>
                </div>
                <Dropdown>
                    <div className='mr-2 small text-right username'>
                        <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header user-info-margin'>
                            {
                                (avatar != null && avatar !== '' && avatar !== 'null') ?
                                    <img className="img-profile rounded-circle" src={`data:image/png;base64, ${avatar}`} alt={fullName} />
                                    :
                                    <span className="text-gray-600 img-profile no-avt">
                                        <Image src={VingroupIcon} alt="default-icon" />
                                    </span>
                            }
                            &nbsp;&nbsp;
                            <span className="full-name">{fullName}</span>
                            &nbsp;&nbsp;
                            <Image
                                alt="more"
                                src={ArrowDownIcon}
                            />
                        </Dropdown.Toggle>
                    </div>
                    <Dropdown.Menu className='animated--grow-in'>
                        {/* <Dropdown.Item onClick={openUploadAvatarPopup}>
                            <img alt="cam" src={uploadAvatarIcon} className="mr-2"/>
                            {t("ChangeAvatar")}
                        </Dropdown.Item> */}
                        <Dropdown.Item onClick={() => onChangeLocale(Constants.LANGUAGE_VI)}>
                            <i className="fas fa-circle fa-sm fa-fw mr-2" style={{ color: activeLang === Constants.LANGUAGE_VI ? "#347ef9" : "#FFFFFF" }}></i>
                            {t("LangViet")}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onChangeLocale(Constants.LANGUAGE_EN)}>
                            <i className="fas fa-circle fa-sm fa-fw mr-2" style={{ color: activeLang === Constants.LANGUAGE_EN ? "#347ef9" : "#FFFFFF" }}></i>
                            {t("LangEng")}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            {t("Logout")}
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar>
        </div>}
      </>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFullScreen: state?.globalStatuses?.isFullScreen,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleFullScreen: bindActionCreators(handleFullScreen, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
