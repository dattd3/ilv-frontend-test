import React from "react";
import { Card, ListGroup } from 'react-bootstrap';
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";
import moment from 'moment';

const usePreload = (params) => {
    const api = useApi();
    const [listArticles = undefined, err] = useFetcher({
        api: api.fetchNewsOnHome,
        autoRun: true,
        params: params
    });
    return listArticles;
};

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

function NewsOnHome(props) {

    const { t } = useTranslation();
    const listArticles = usePreload();
    return (
        <Card className="mb-4 news-home shadow">
            <Card.Body className="card-body pd-0">
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <span className="db-card-header color-pink"><i className="fas icon-groupnotice"></i> {t("CompanyAnnouncement")}</span>
                    </ListGroup.Item>
                    {
                        listArticles && listArticles.data ?
                            listArticles.data.map(function (obj, i) {
                                return (

                                    <ListGroup.Item key={i} className="news-home-item">
                                        <a href={`/news/${convertToSlug(obj.title)}/${obj.id}`}>
                                            <div className="nhome-thumbnail" style={{ backgroundImage: `url(${obj.thumbnail})` }}></div>
                                        </a>
                                        <div className="nhome-infor">
                                            <a href={`/news/${convertToSlug(obj.title)}/${obj.id}`}>
                                                <Card.Title>{obj.title}</Card.Title>
                                            </a>
                                            <Card.Text className="small text-gray-600">{SubStringDescription(obj.description)}...</Card.Text>
                                            <span className="small"><i className="far fa-clock"></i> {moment(obj.publishedDate).format('DD/MM/YYYY')}</span>
                                        </div>
                                    </ListGroup.Item>

                                );
                            })
                            : <ListGroup.Item><LoadingSpinner /></ListGroup.Item>
                    }
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default NewsOnHome;