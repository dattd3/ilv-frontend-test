import React from "react";
import { useTranslation } from "react-i18next";
import ClockIcon from "assets/img/icon/ic_clock.svg"
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

export default function TimeKeepingList({ apiResponseData, fromPage }) {
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

  const getCheckinoutTitleFromData = (data) => {
    if (data) {
      const dataObj = JSON.parse(data);
      return `${dataObj.Type?.toUpperCase() === "IN" ? t("CheckedIn") : t("CheckedOut")} ${t("at")} ${dataObj.Device}`;
    }
  }

  return (
    <div className={`timekeeping-list-container ${fromPage ? '' : 'show-scroll'}`}>
      {timeKeepingData &&
        Object.keys(timeKeepingData)?.length > 0 &&
        Object.keys(timeKeepingData)?.map((key, keyIndx) => (
          <div key={keyIndx}>
            <div className="date-card">
              <div className="date-card-header">
                <img src={ClockIcon} alt="icon" />
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
                      <span className="time-span">
                        <span className="bull-symbol">&bull;</span>
                        {item.subRequestId?.split(" ")?.[1]}
                        &nbsp;&nbsp;
                      </span>
                      <div className="infor-container">
                        <b>
                          {getCheckinoutTitleFromData(item.data)}
                        </b>
                        <div className="location-description">
                          {`${t("timekeeping_type")} ${
                            JSON.parse(item.data).Method
                          }`}
                        </div>
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
          </div>
        ))}
    </div>
  );
}
