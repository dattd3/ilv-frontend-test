import React from "react"
import { Image } from 'react-bootstrap'
import moment from 'moment'
import IconUser from '../../../assets/img/icon/Icon-User.svg'
import IconTime from '../../../assets/img/icon/Icon-Time.svg'

function convertToSlug(input) {
    let slug = input.toLowerCase();

    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd')
        .replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
        .replace(/ /gi, " - ")
        .replace(/\-\-\-\-\-/gi, '-')
        .replace(/\-\-\-\-/gi, '-')
        .replace(/\-\-\-/gi, '-')
        .replace(/\-\-/gi, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/\@\-|\-\@|\@/gi, '');
    return slug;
}

const getTimeByRawTime = rawTime => {
    const time = moment(rawTime).isValid() ? moment(rawTime) : null
    return {
        time: time?.format("HH:mm") || "",
        date: time?.format("DD/MM/YYYY") || ""
    }
}

export default function NewsItemGrid(props) {
    const { id, title, thumbnail, description, sourceSite, publishedDate } = props.article;
    const { col } = props;
    var column = 4;
    if (col) column = col;

    const timePublished = getTimeByRawTime(publishedDate)

    return (
        <div key={id} className={`col-md-6`}>
            <div className="item" key={id}>
                <a href={`/news/${convertToSlug(title)}/${id}`} title={title} className="link-image-detail">
                    <Image src={thumbnail} className="thumbnail"
                        onError={(e) => {
                            e.target.src = "/vingroup-logo.svg"
                            e.target.className = `thumbnail error`
                        }} 
                    />
                </a>
                <div className="title-source-time-info">
                    <a href={`/news/${convertToSlug(title)}/${id}`} title={title} className="title">{title}</a>
                    <div className="source-time-info">
                        <span className="source"><Image src={IconUser} alt="Source" className="icon" /><span className="source-name">{sourceSite || ""}</span></span>
                        <span className="time"><Image src={IconTime} alt="Time" className="icon" /><span className="hour">{timePublished.date}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
