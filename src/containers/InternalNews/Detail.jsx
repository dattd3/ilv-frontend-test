import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import purify from "dompurify";
import { useTranslation } from "react-i18next";
import LoadingModal from "components/Common/LoadingModal";
import { getRequestConfigs } from "commons/commonFunctions";
import { formatInternalNewsDataItem, getCurrentLanguage } from "commons/Utils";
import IconTime from "assets/img/icon/Icon-Time.svg";
import IconBack from "assets/img/icon/Icon-Arrow-Left.svg";
import '../../assets/css/ck-editor5.css';

function InternalNewsDetail(props) {
  const id = props.match.params.id;
  const { t } = useTranslation();
  const lang = getCurrentLanguage();
  const [newsDetail, setNewsDetail] = useState(null);

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

  return (
    <>
      {newsDetail ? (
        <div className="internal-news-page">
          <div className="back-block">
            <a href={`/internal-news?type=${newsDetail.newsType}`} title={t("ComeBack")}>
              <img src={IconBack} alt="Back" className="ic-back" />
              {t("ComeBack")}
            </a>
          </div>
          <div className="body" style={{ padding: 12 }}>
            <h1 className="internal-news-title">{newsDetail.title || ''}</h1>
            <div className="source-time-info">
                <img src={IconTime} alt="Time" className="icon" />&nbsp;
                <span className="hour">{newsDetail?.publishedDate ? moment(newsDetail?.publishedDate)?.format("HH:mm | DD/MM/YYYY") : "N/A"}</span>
            </div>
            <div
              className="ck ck-content"
              dangerouslySetInnerHTML={{
                __html: purify.sanitize(newsDetail.content || "", {
                  ADD_TAGS: ["iframe"],
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
