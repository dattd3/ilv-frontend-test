import moment from 'moment'
import Constants from 'commons/Constants'
import IconClock from 'assets/img/icon/ic_clock.svg'
import IconBell from 'assets/img/icon/Icon_NotificationList.svg'

const NoticeItem = ({ notice }) => {
    const locale = localStorage.getItem("locale")

    return (
        <div className="notice-item">
            <div className="d-flex align-items-center">
                <span className="img-block">
                    <img alt="Voucher" src={IconBell} />
                </span>
                <div className="main">
                    {
                        notice?.type == Constants.notificationType.VOUCHER_NEW_PROGRAM
                        ? (<a href={`/my-voucher/notices/${notice?.subRequestId}`} title={locale === Constants.LANGUAGE_VI ? notice?.title : notice?.en_Title} className="title">{locale === Constants.LANGUAGE_VI ? notice?.title : notice?.en_Title}</a>)
                        : (<span className="title">{locale === Constants.LANGUAGE_VI ? notice?.title : notice?.en_Title}</span>)
                    }
                    <div className="d-flex date"><img alt="Date" src={IconClock} />{moment(notice?.createdDate).isValid() ? moment(notice?.createdDate).format("DD/MM/YYYY") : ''}</div>
                </div>
            </div>
        </div>
    )
}

export default NoticeItem
