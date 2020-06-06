import React from "react";
import moment from 'moment';

function convertToSlug(input) {
    var slug = input.toLowerCase();

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

function SubStringDescription(input) {
    if (input.length > 150) {
        return input.substr(0, 149);
    } else {
        return input;
    }
}

export default function NewsItemGrid(props) {
    const { id, title, thumbnail, description, sourceSite, publishedDate } = props.article;
    const { col } = props;
    var column = 4;
    if (col) column = col;
    return (
        <div key={id} className={`col-xl-${column} content-margin-bottom`}>
            <div className="w3-quarter shadow-sm news-item">
                <a href={`/news/${convertToSlug(title)}/${id}`}>
                    {thumbnail ?
                        <div className="news-thumbnail" style={{ backgroundImage: `url(${thumbnail})` }}></div> :
                        <div className="news-thumbnail" style={{ backgroundImage: `url('/noimage.png')`, backgroundSize: '250px 250px' }}></div>
                    }

                </a>
                <div className="content-padding">
                    <a href={`/news/${convertToSlug(title)}/${id}`}><h5>{title}</h5> </a>
                    <div className="news-author mb-2">
                        <span className="datetime-info w3-left">
                            <i className="far fa-user"></i> &nbsp; {sourceSite}
                        </span>
                        <span className="datetime-info w3-right">
                            <i className="far">&#xf017;</i> &nbsp;{moment(publishedDate).format('DD/MM/YYYY')}
                        </span>
                    </div>
                    <p className="text-sm">{SubStringDescription(description)}...</p>
                </div>
            </div>
        </div>
    );
}