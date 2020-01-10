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
const objDataRes = usePreload([]);

if (objDataRes && objDataRes.listArticles) {

 return (
     <div className="w3-main w3-padding w3-center">

       {/* ĐÂY LÀ DÒNG TIÊU ĐỀ */}
         <h4 className="news-title w3-left"> {t("NewsAndEvent")} </h4>
         <hr></hr>

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
         <div className="w3-center w3-padding-32">
           <div className="w3-bar">
             <a href="#" className="w3-bar-item w3-button w3-hover-black">«</a>
             <a href="#" className="w3-bar-item w3-black w3-button">1</a>
             <a href="#" className="w3-bar-item w3-button w3-hover-black">2</a>
             <a href="#" className="w3-bar-item w3-button w3-hover-black">3</a>
             <a href="#" className="w3-bar-item w3-button w3-hover-black">4</a>
             <a href="#" className="w3-bar-item w3-button w3-hover-black">»</a>
           </div>
        </div>
     </div>
  );
} else {
  return null;
}

}

export default News;
