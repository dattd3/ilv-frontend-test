import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import moment from 'moment';
import Constants from '../../../commons/Constants';
import CustomPaging from '../../../components/Common/CustomPaging';
import FormSearchComponent from '../SearchBlock/FormSearchComponent'

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchListNotifications,
        autoRun: true,
        params: params
    });
    return data;
};

const usePreloadGetPhoneSupport = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.getPhoneSupportForRegion,
        autoRun: true,
        params: params
    });
    return data;
};
 
function ListNotifications(props) {
    const [page, SetPage] = useState(Constants.NOTIFICATION_PAGE_INDEX_DEFAULT);
    const [pageSize, SetPageSize] = useState(Constants.NOTIFICATION_PAGE_SIZE_DEFAULT);
    const [keyword, SetKeyword] = useState("");

    const lv3 = localStorage.getItem('organizationLv3');
    const lv4 = localStorage.getItem('organizationLv4');
    const lv5 = localStorage.getItem('organizationLv5');
    const response = usePreload([page, pageSize, lv3, lv4, lv5, keyword]);
    const phonesSupportForRegion = usePreloadGetPhoneSupport([parseInt(lv4)]);
    
    const onChangePage = (page) => {
        SetPage(page);
    }

    const preparePhoneSupport = () => {
        if (phonesSupportForRegion && phonesSupportForRegion.data) {
            return phonesSupportForRegion.data;
        }
        return [];
    }

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

    const handler = value => {
        SetKeyword(value);
    }

    let dataBlock = null;
    let total = 0;

    if (response && response.data && response.result) {
        const result = response.result;
        if (result.code != Constants.API_ERROR_CODE) {
            total = response.data.total;
            const notifications = response.data.notifications;
            dataBlock = <>
            {
                notifications.map((item, i) => {
                    const timePost = getTimePost(item.createdDate);
                    return <div key={i} className="item">
                        <span className="ic-notification"><i className="far fa-bell"></i></span>
                        <div className="content">
                        <a href={`/notifications/${item.id}`} title={item.title} className={!item.isRead ? 'title' : 'title readed'}>{item.title}</a>
                        <p className="description">{item.description != null ? item.description : ''}</p>
                        <div className="time-attachment-detail-block">
                            <div className="time-attachment-block">
                            <span className="time-block">
                                <i className='far fa-clock ic-clock'></i>
                                <span>{timePost}</span>
                            </span>
                            {item.hasAttachmentFiles ?
                            <span className="attachment-block">
                                <i className="fas fa-paperclip ic-attachment"></i>
                                <span>Có tệp tin đính kèm</span>
                            </span>
                            : null
                            }
                            </div>
                            <a href={`/notifications/${item.id}`} title="Xem chi tiết" className="detail-link">Xem chi tiết</a>
                        </div>
                        </div>
                    </div>
                })
            }
            </>;
        }
    }

    return (
        <>
        <div className="list-notifications-section">
            <FormSearchComponent handler={handler} phones={preparePhoneSupport()} />
            <div className="card shadow mb-4">
            <div className="card-body">
                <div className="list-notifications-block">
                {dataBlock}
                </div>
                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
            </div>
            </div>
        </div>
        </>
    )
}

export default ListNotifications
