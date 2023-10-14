import axios from "axios";
import { formatInternalNewsDataItem, getCurrentLanguage } from "commons/Utils";
import { getRequestConfigs } from "commons/commonFunctions";
import { useEffect, useState } from "react";
import IconInternalNews from "assets/img/icon/internal_news_icon.svg";
import IconMic from "assets/img/icon/mic-icon.svg";
import IconVideo from "assets/img/icon/video-icon.svg";
import purify from "dompurify";
import LoadingModal from "components/Common/LoadingModal";
import IconTime from "assets/img/icon/Icon-Time.svg";
import moment from "moment";

function InternalNewsDetail(props) {
  const id = props.match.params.id;
  const [newsDetail, setNewsDetail] = useState(null);
  const lang = getCurrentLanguage();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_REQUEST_URL}internal-news/detail/${id}`,
        getRequestConfigs()
      )
      .then((response) => {
        const formattedNews = formatInternalNewsDataItem(response.data?.data, lang);
        if (!formattedNews.title || !formattedNews.content) {
          window.location.href = "/";
          return
        }
        setNewsDetail(formattedNews);
      });
  }, [id]);

  const generatIcon = (_type) => {
    switch (_type) {
      case 2:
        return <img src={IconMic} alt="" />;
      case 3:
        return <img src={IconVideo} alt="" />;
      default:
        return <img src={IconInternalNews} alt="" />;
    }
  };

  return (
    <>
      {newsDetail ? (
        <div className="internal-news-page">
          <div className="page-title">
            {generatIcon(newsDetail.newsType)}&nbsp;
            {newsDetail.title}
          </div>
          <div className="body" style={{ padding: 12 }}>
            <div className="source-time-info">
                <img src={IconTime} alt="Time" className="icon" />&nbsp;
                <span className="hour">{newsDetail?.publishedDate ? moment(newsDetail?.publishedDate)?.format("HH:mm | DD/MM/YYYY") : "N/A"}</span>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: purify.sanitize(newsDetail.content || "", {
                  ALLOWED_TAGS: ["iframe"],
                  ADD_ATTR: [
                    "allow",
                    "allowfullscreen",
                    "frameborder",
                    "scrolling",
                  ],
                }),
              }}
            />
          </div>
        </div>
      ) : (
        <LoadingModal show={true} />
      )}
    </>
  );
}

export default InternalNewsDetail;
