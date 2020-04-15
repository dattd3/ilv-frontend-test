import React, { useState } from "react";
import { useApi, useFetcher } from "../../modules";
import { Button, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import CustomPaging from '../../components/Common/CustomPaging';

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchNotifyList,
    autoRun: true,
    params: params
  });
  return data;
};

function string_of_notification_type(typeId) {
    switch(typeId) {
    case 0:
      return "General";
      break;
    case 1:
      return "News";
      break;
      case 2:
      return "Report";
      break;
      case 3:
      return "Recommend";
      break;
    default:
      return "";
    }
}

function Notification(props) {
  const { t } = useTranslation();
  document.title = t("Menu_Notification");    
  const [pageIndex, SetPageIndex] = useState(1);
  const [pageSize, SetPageSize] = useState(10);
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
    const total = result.data.total;
    
    tableData = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
    
      <thead>
        <tr>                
          <th>{t("Notification_Title")}</th>
          <th>{t("Notification_Content")}</th>   
          <th>{t("Notification_Type")}</th>

          {/* 
            <th>{t("Notification_Created_By")}</th> 
          */}
          
          <th>{t("Notification_Created_Date")}</th>          
        </tr>
      </thead>
     
      <tbody>
        {
          objDataRes.map((item, i) => {
            return <tr key={i}>              
              <td>{item.title}</td>              
              {/* <td className="form-text text-muted" dangerouslySetInnerHTML={{ __html: item.content}}></td> */}
              <td>{item.content}</td>
              <td>{ string_of_notification_type(item.type)}</td>              
              {/* 
               <td>{item.userEmail}</td>  
              */}            
              <td>{moment(item.createdDate).format('DD/MM/YYYY')}</td>
            </tr>;
          })
        }
      </tbody>
     
      <tfoot>
        <tr>
          <td colSpan={4}>
            <Row>
              <Col className='total'>
                {t("Total")}: {total}
              </Col>
              <Col className='paging'>
                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
              </Col>
              <Col></Col>
            </Row>
          </td>
        </tr>

      </tfoot>

    </table>;
  }

  return (
    <div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">{t("Menu_Notification")} </h1>  
      </div>
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            {tableData}
          </div>
        </div>
      </div>          
    </div>
  );
}

export default Notification;
