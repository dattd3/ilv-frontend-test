import React, { useState } from "react";
import { useApi, useFetcher } from "../../modules";
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import CustomPaging from '../../components/Common/CustomPaging';
import { Link } from "react-router-dom";

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

    console.log(objDataRes);

    const total = result.data.total;
          
    tableData = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
    
      <thead>
        <tr>                          
          <th style={{"width":"25%"}}>{t("Notification_Title")}</th>
          <th>NỘI DUNG </th>                            
          <th style={{"width":"20%"}}>{t("Notification_Created_Date")}</th>                 
        </tr>
      </thead>

      <tbody>
        {
          objDataRes.map((item, i) => {
            return <tr key={i}>                            
              <td>                                     
                  {item.title}
                  
                  {/*
                      <Link to={`/notify/${item.id}`}> {item.title} </Link>
                  */}                  

              </td> 
               <td>{item.content }</td>                                         
              <td>{item.created_date }</td>
            </tr>;
          })
        }
      </tbody>
     
      <tfoot>
        <tr>
          <td colSpan={3}>
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
