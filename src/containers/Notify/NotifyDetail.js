import React from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotificationDetail,
        autoRun: true,
        params: params
    });
    return data;
};
 
function NotifyDetail({ match }) {
    
    const {
        params: { id }
    } = match;

    const { t } = useTranslation();
    const result = usePreload([id]);

    const styleHtml = {
      'backgroundColor' : '#fff',
      'border' : '1px solid #d1d3e2',
      'borderRadius' : '0.35rem',
      'display' : 'block',
      'padding' : '0.375rem 0.75rem'
    };

    if (result && result.data) {
      const notify = result.data;
        return (
            <form>            
                
                 <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Chi tiết thông báo</h1>
                </div>
                <div className="form-group">
                    <label> Tiêu đề </label>
                    <input type="text" className="form-control" value={ notify.title } placeholder="" onChange={() => {}}/>                   
                </div>
                <div className="form-group">
                    <label> Nội dung </label>                    
                     <div style={styleHtml} dangerouslySetInnerHTML={{__html: notify.content}} />
                </div>
                <div className="form-group">
                    <label> Cơ sở </label>                    
                     <input type="text" className="form-control" value={ notify.topic_name } placeholder="" onChange={() => {}}/>  
                </div>
                <div className="form-group">
                    <label> Người tạo </label>
                    <input type="text" className="form-control" value={ notify.created_by } placeholder="" onChange={() => {}}/>
                </div> 
                <div className="form-group">
                    <label> Ngày tạo </label>
                    <input type="text" className="form-control" value={ notify.created_date } placeholder="" onChange={() => {}}/>
                </div>
            
            </form>            
        );

    } else {
        return null;
    } 
}

export default NotifyDetail;
