import React from "react";
import { useTranslation } from "react-i18next";
import Constants from "commons/Constants";
import moment from "moment";

const convertDataNotiToObj = (data) => {
  const response = {};
  if (data?.length > 0) {
    data.forEach((element) => {
      if (response[element.subRequestId?.split(" ")[0]]) {
        response[element.subRequestId?.split(" ")[0]].push(element);
      } else {
        response[element.subRequestId?.split(" ")[0]] = [element];
      }
    });
  }
  return response;
};

export default function TimeKeepingList({ apiResponseData }) {
  const { t } = useTranslation();
  const timeKeepingData = convertDataNotiToObj(apiResponseData);
  const lang = localStorage.getItem("locale");

  const getDayNameFromDate = (date) => {
    const days = [
      t("Sun"),
      t("Mon"),
      t("Tue"),
      t("Wed"),
      t("Thu"),
      t("Fri"),
      t("Sat"),
    ];
    return days[
      new Date(
        moment(date, "YYYY-MM-DD").format("MM/DD/YYYY").toString()
      ).getDay()
    ];
  };

  return (
    <div className="timekeeping-list-container">
      {timeKeepingData &&
        Object.keys(timeKeepingData)?.length > 0 &&
        Object.keys(timeKeepingData)
          ?.reverse()
          ?.map((key, keyIndx) => (
            <>
              <div className="date-card" key={key}>
                <div className="date-card-header">
                  <i className="fa fa-clock-o" />
                  &nbsp;
                  {getDayNameFromDate(key)}
                  &nbsp;
                  {lang === Constants.LANGUAGE_VI ? t("Day") : null}{" "}
                  {moment(key, "YYYY-MM-DD").format("DD/MM/YYYY")}
                </div>
                <div className="date-card-body-container">
                  {timeKeepingData[key].map((item, index) => (
                    <div className="date-card-body" key={item.id}>
                      <div className="infor-block">
                        <div>
                          <span className="time-span">
                            <span className="bull-symbol">&bull;</span>
                            &nbsp;&nbsp;
                            {item.subRequestId?.split(" ")?.[1]} &nbsp;&nbsp;
                            <b>
                              {lang === Constants.LANGUAGE_VI
                                ? item.title
                                : item.en_Title}
                            </b>
                          </span>
                        </div>
                        <div className="location-description">
                          {JSON.parse(item.data).Device}
                        </div>
                      </div>
                      {index !== timeKeepingData[key]?.length - 1 && (
                        <div className="divider" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {keyIndx !== Object.keys(timeKeepingData)?.length - 1 && (
                <div className="divider margin-bt-20" />
              )}
            </>
          ))}
    </div>
  );
}
