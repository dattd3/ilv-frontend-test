import moment from 'moment';

function SubStringDescription(input) {
    if (input.length > 150) {
        return input.substr(0, 149);
    } else {
        return input;
    }
}

export default function NewsItemGridApp(props) {
    const { id, title, thumbnail, description, sourceSite, publishedDate } = props.article;
    const { col } = props;
    var column = 4;
    if(col) column = col;
    return (
        <div key={id} className={`col-xl-${column} content-margin-bottom`}>
            <div className="w3-quarter shadow-sm news-item">
                <a href={`/news-app/${id}`}>
                    <div className="news-thumbnail" style={{ backgroundImage: `url(${thumbnail})` }}></div>
                </a>
                <div className="content-padding">
                    <a href={`/news-app/${id}`}><h5>{title}</h5> </a>
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