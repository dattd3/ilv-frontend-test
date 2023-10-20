import { Image } from "react-bootstrap";
import moment from "moment";
import purify from "dompurify";
import { useTranslation } from "react-i18next";
import { useApi, useFetcher } from "modules";
import LoadingSpinner from "components/Forms/CustomForm/LoadingSpinner";
import IconBack from "assets/img/icon/Icon-Arrow-Left.svg";
import IconUser from "assets/img/icon/Icon-User.svg";
import IconTime from "assets/img/icon/Icon-Time.svg";
import IconDiamond from "assets/img/icon/Icon-Diamond.svg";
import { prepareNews } from "../Corporation/News/NewsUtils";

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchArticleDetail,
    autoRun: true,
    params: params,
  });
  return data;
};

function GuestNewsPage({ match, location, history }) {
  const {
    params: { id },
  } = match;
  const newsData = location?.state?.newsData;
  const { t } = useTranslation();
  const result = usePreload([id]);
  console.log(newsData);
  const getTimeByRawTime = (rawTime) => {
    const time = moment(rawTime).isValid() ? moment(rawTime) : null;
    return {
      time: time?.format("HH:mm") || "",
      date: time?.format("DD/MM/YYYY") || "",
    };
  };

  const handleClickNewsCard = (id) => {
    history.push({
      pathname: `/guest-news/${id}`,
      state: {
        newsData
      }
    });
  }

  if (result && result.data) {
    const detail = result.data;
    const content = detail.content;
    const timePublished = getTimeByRawTime(detail.publishedDate);

    return (
      <div className="container-fluid guest-news-page">
        <div className="back-block">
          <a href="/" title={t("ComeBack")}>
            <Image src={IconBack} alt="Back" className="ic-back" />
            {t("ComeBack")}
          </a>
        </div>
        <div className="news-detail-page">
          {/* {
                    isApp ? null : <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/"><i className="fas fa-home"></i> {t("Menu")}</a> </li>
                            <li className="breadcrumb-item"><a href="/news">{t("NewsAndEvent")}</a></li>
                        </ol>
                    </nav>
                } */}
          <div className="news-content">
            <h1 className="news-title">{detail.title}</h1>
            <div className="source-time-info">
              <span className="source">
                <Image src={IconUser} alt="Source" className="icon" />
                <span className="source-name">{detail?.sourceSite || ""}</span>
              </span>
              <span className="time">
                <Image src={IconTime} alt="Time" className="icon" />
                <span className="hour">{timePublished?.date}</span>
              </span>
            </div>
            <h2 className="news-description">{detail.description}</h2>
            <div
              className="news-detail"
              dangerouslySetInnerHTML={{
                __html: purify.sanitize(content || ""),
              }}
            ></div>
            <div className="news-source">
              {t("Source")}: {detail.sourceSite}
            </div>
          </div>
          <hr />
          {newsData && newsData.length > 0 && (
            <div className="news-others">
              <h4 className="page-title">
                <Image src={IconDiamond} alt="News" />
                <span style={{ marginTop: 4 }}>{t("OtherNews")}</span>
              </h4>
              <div className="row list-news">
                {(newsData || [])
                  .filter((item) => item.id != id)
                  ?.slice(0, 4)
                  .map((item, i) => {
                    const news = prepareNews(item);
                    return (
                      <div 
                        key={item.id} 
                        className="col-md-6 news-card"
                        onClick={() => handleClickNewsCard(item.id)}   
                      >
                        <div className="item" key={id}>
                          <div
                            className="link-image-detail"
                          >
                            <Image
                              src={news.thumbnail}
                              className="thumbnail"
                              onError={(e) => {
                                e.target.src = "/logo-normal.svg";
                                e.target.className = `thumbnail error`;
                              }}
                            />
                          </div>
                          <div className="title-source-time-info">
                            <div
                              className="title"
                            >
                              {news.title}
                            </div>
                            <div className="source-time-info">
                              <span className="source">
                                <Image
                                  src={IconUser}
                                  alt="Source"
                                  className="icon"
                                />
                                <span className="source-name">
                                  {news.sourceSite || ""}
                                </span>
                              </span>
                              <span className="time">
                                <Image
                                  src={IconTime}
                                  alt="Time"
                                  className="icon"
                                />
                                <span className="hour">
                                  {getTimeByRawTime(news.publishedDate)?.time +
                                    " | " +
                                    getTimeByRawTime(news.publishedDate)?.date}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-fluid guest-news-page">
        <LoadingSpinner />
      </div>
    );
  }
}

export default GuestNewsPage;
