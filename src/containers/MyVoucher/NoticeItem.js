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
                    <a href={`/my-voucher/notices/${notice?.evoucherProgramId || 0}`} title={notice?.title || ''} className="title">{locale === Constants.LANGUAGE_VI ? notice?.contentVi : notice?.contentEn}</a>
                    <div className="d-flex date"><img alt="Date" src={IconClock} />{moment(notice?.createdDate).isValid() ? moment(notice?.createdDate).format("DD/MM/YYYY") : ''}</div>
                </div>
            </div>
        </div>
    )
}

export default NoticeItem
