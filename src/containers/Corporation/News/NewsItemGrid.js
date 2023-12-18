import { Image } from 'react-bootstrap'
import moment from 'moment'
import IconUser from '../../../assets/img/icon/Icon-User.svg'
import IconTime from '../../../assets/img/icon/Icon-Time.svg'

const getTimeByRawTime = rawTime => {
    const time = moment(rawTime).isValid() ? moment(rawTime) : null
    return {
        time: time?.format("HH:mm") || "",
        date: time?.format("DD/MM/YYYY") || ""
    }
}

export default function NewsItemGrid(props) {
    const { id, title, thumbnail, sourceSite, publishedDate } = props.article;
    const { col, isEmployeePrivilege } = props;
    var column = 4;
    if (col) column = col;

    const timePublished = getTimeByRawTime(publishedDate)

    return (
        <div key={id} className={`col-md-6`}>
            <div className="item" key={id}>
                <a href={`/${isEmployeePrivilege ? 'employee-privileges' : 'news'}/detail/${id}`} className="link-image-detail">
                    <Image src={thumbnail} className="thumbnail"
                        onError={(e) => {
                            e.target.src = "/logo-normal.svg"
                            e.target.className = `thumbnail error`
                        }} 
                    />
                </a>
                <div className="title-source-time-info">
                    <a href={`/${isEmployeePrivilege ? 'employee-privileges' : 'news'}/detail/${id}`} className="title">{title}</a>
                    <div className="source-time-info">
                        { !isEmployeePrivilege && (<span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{sourceSite || ""}</span></span>) }
                        <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{isEmployeePrivilege ? (timePublished?.time + ' | ' + timePublished?.date) : timePublished?.date}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
