import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { Table, Row, Col, Form } from 'react-bootstrap';
import CustomPaging from '../../../components/Common/CustomPaging';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import { useTranslation } from "react-i18next";
import './w3.css';
import './news.css';
import ItemNews from './ItemNews.jsx';

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleList,
        autoRun: true,
        params: params
    });
    return data;
};

function News() {

const { t } = useTranslation();
const [pageIndex, SetPageIndex] = useState(1);
const [pageSize, SetPageSize] = useState(9);

const objDataRes = usePreload([pageIndex, pageSize]);

function onChangePage(page) {
    SetPageIndex(page);
}

if (objDataRes && objDataRes.listArticles) {

 return (
     <div className="w3-main w3-padding w3-center">

       {/* ĐÂY LÀ DÒNG TIÊU ĐỀ */}
         <h3 className="news-title w3-left"> {t("NewsAndEvent")} </h3>
         <hr id="hr-style"></hr>

         <div className="row">
           {
             objDataRes.listArticles.map((item, i) => {
               var publishedDate = item.publishedDate;
               publishedDate = publishedDate.replace('T00:00:00', '')
               return (
                     <div  key={item.id} className="col-lg-4 col-sm-12 content-margin-bottom">
                         <ItemNews key={item.id} title = {item.title} description= {item.description} thumbnail= {item.thumbnail} sourceSite = {item.sourceSite} publishedDate = {publishedDate}/>
                    </div>
                  );
                })
             }
          </div>

     {/* ĐÂY LÀ MỤC PHÂN TRANG */}
      <div class="container">
          <div class="row">
              <div class="col-sm"> </div>
              <div class="col-sm">
                  <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={objDataRes.totalRecord} />
              </div>
              <div class="col-sm">
                  {t("Total")}: {objDataRes.totalRecord} ({t("Menu_News")})
              </div>
          </div>
       </div>

     </div>
  );

 } else {
    return null;
 }

}

export default News;
