import React, { useState } from "react";
import { useApi, useFetcher } from "../../modules";
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import CustomPaging from '../../components/Common/CustomPaging';

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListNotification,
    autoRun: true,
    params: params
  });
  return data;
};

function string_of_notification_type(typeId) {
    switch(typeId) {            
      case 1:
        return "Tin tức";
        break;

      case 2:
        return "Chúc mừng sinh nhật";
        break;

      case 3:
        return "Thông tin đào tạo";
        break;

      case 4:
        return "Khác";
        break;

      default:
        return "";
    }
}

function Notification(props) {
  const { t } = useTranslation();  
  document.title = t("Menu_Notification");  
  const [pageIndex, SetPageIndex] = useState(1);
  const [pageSize, SetPageSize] = useState(5);
  const result = usePreload([pageIndex, pageSize]);
  
  const onChangePage = (page) => {
    SetPageIndex(page);
  }

  const onChangePageSize = (evt) => {
    SetPageSize(evt.target.value);
    SetPageIndex(1);
  }

  var tableData;

  if (result && result.data && result.data.notifications && result.data.total) {    
    
    const objDataRes = result.data.notifications;

    console.log(objDataRes);

    const total = result.data.total;
        
    tableData = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
    
      <thead>
        <tr>                
          <th className="text-success h6 small font-weight-bold mt-0 pt-0 w-25">{t("Notification_Title")}</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">{t("Notification_Content")}</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">{t("TOPIC")}</th>   
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">{t("Notification_Type")}</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">{t("Notification_Created_By")}</th>            
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">{t("Notification_Created_Date")}</th>          
        </tr>
      </thead>

      <tbody>
        {
          objDataRes.map((item, i) => {
            return <tr key={i}>              
              <td>{item.title}</td>                            
              <td>{item.content}</td>
              <td>{item.topic_name}</td>
              <td>{ string_of_notification_type(item.type)}</td>
              <td>{item.created_by}</td>              
              <td>{item.created_date }</td>              
            </tr>;
          })
        }
      </tbody>
     
      <tfoot>
        <tr>
          <td colSpan={4} className="pb-0 pt-4">
            <Row>
              <Col className='total'>
                {t("Total")}: {total}
              </Col>
              <Col className='paging'>
                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
              </Col>              
            </Row>
          </td>
        </tr>

      </tfoot>

    </table>;
  }

  return (
    <div className="card border border-success shadow mb-4 mt-2">      
        <div className="bg-success text-white p-3 h4">{t("Menu_Notification")}</div>
        <div className="card-body pt-2 pb-0">
            <div className="table-responsive">
              {tableData}
            </div>
        </div>
    </div>
  );
}

export default Notification;
