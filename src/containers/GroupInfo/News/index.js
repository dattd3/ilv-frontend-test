import React from "react";
import { useTranslation } from "react-i18next";
import './w3.css';
import './news.css';
import ItemNews from './ItemNews.jsx';
import data from "./news-data";

function News() {
 return (
    <div className="w3-main w3-padding w3-center">
      {/* ĐÂY LÀ DÒNG TIÊU ĐỀ */}
        <h4 className="news-title w3-left">TIN TỨC SỰ KIỆN</h4>
        <hr></hr>
        
        <div className="row">
          {
            data.items.map((item, i) => {
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
}

export default News;
