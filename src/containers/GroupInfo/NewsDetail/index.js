import React from "react";
import { useApi, useFetcher } from "../../../modules";
import './NewsDetail.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NewsRelation from './NewsRelation.jsx';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchArticleDetail,
        autoRun: true,
        params: params
    });
    return data;
};

 function NewsDetailElement({match, location}) {
   const {
     params: { Id }
   } = match;

  const result = usePreload([Id]);

  if(result && result.data) {
    const detail =result.data;
    var content = detail.content;
     content = content.replace('\\r\\n', '<br/>');
     content = content.replace('\\', '');
     var publishedDate = detail.publishedDate ? detail.publishedDate : '';
     publishedDate = publishedDate.replace('T00:00:00', '');

    return (
           <div id="mainNewsDetail">

           {/* TIÊU ĐỀ PHẦN TIN TỨC */}
           <div>
              <a href="/"><i className="fas fa-home"></i></a> &nbsp;
              <i className="fas fa-chevron-right"></i> &nbsp;
              <a href="/groupinfo/news">TIN TỨC SỰ KIỆN</a>
           </div>

              <div className="titleNewsDetail">
                 <h2> { detail.title } </h2>
                   <div>
                      <span className="datetime-info w3-left">
                          <i className="far fa-user"></i> &nbsp;
                            {detail.sourceSite}
                       </span>
                       &nbsp;&nbsp;&nbsp;
                       <span className="datetime-info">
                          <i className="far">&#xf017;</i> &nbsp;
                             {publishedDate}
                        </span>
                    </div>
              </div>
               <div id="contentNewsDetail" contentEditable='false'
                    dangerouslySetInnerHTML = { { __html: content } } >
               </div>

               {/* CHIA SẺ TIN TỨC */}

               <div className="sharePost">
                 <p>Chia sẻ:</p>
                  <a className="fb" href={`https://www.facebook.com/sharer/sharer.php?u=${detail.sourceUrl}`} target="_blank">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="gp" href={`https://plus.google.com/share?url=${detail.sourceUrl}`} target="_blank">
                    <i className="fab fa-google-plus-g"></i>
                  </a>
                  <a className="mail" href={`mailto:?subject=${detail.title}&amp;body=${detail.sourceUrl}`} target="_blank">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>

                {/*HIỂN THỊ CÁC TIN LIÊN QUAN */}
                <NewsRelation />

           </div>
    );

  } else {
    return <LoadingSpinner />;
  }
}

function NewsDetail(props) {
  return (
    <div>
      <Router>
          <Route path="/groupinfo/newsdetail/:Id" component={NewsDetailElement} />
      </Router>
    </div>
  );
}
export default NewsDetail;
