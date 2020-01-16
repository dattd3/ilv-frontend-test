import React from "react";
import { useTranslation } from "react-i18next";
import ItemNews from '../News/ItemNews.jsx';
import { Table, Row, Col, Form } from 'react-bootstrap';
import '../News/w3.css';
import '../News/news.css';
import { useApi, useFetcher } from "../../../modules";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleList,
        autoRun: true,
        params: params
    });
    return data;
};

export default function NewsRelation(props) {

  const { t } = useTranslation();

  const result = usePreload([1, 3]);
  if (result && result.data) {
    const objDataRes =  result.data;
      return (
        <div>
              <div>
                  <h2 className="titleNewsRelation"> {t("OtherNews")} </h2>
              </div>
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
        </div>
    );

  } else {
    return null;
  }
}
