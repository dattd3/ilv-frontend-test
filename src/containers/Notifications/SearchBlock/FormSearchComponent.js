import React, { useState, useRef } from "react";
import _ from 'lodash';
import { useTranslation } from "react-i18next";
import Constants from "commons/Constants";

function FormSearchComponent(props) {
    const {t} = useTranslation();
    const sendQuery = query => {
        props.handler(query);
    }
  
    const delayedQuery = useRef(_.debounce(q => sendQuery(q), Constants.TIME_DEBOUNCE_FOR_SEARCH)).current;

    const onChangeTextSearch = (e) => {
        delayedQuery(e.target.value);
    }

    let dataBlock = null;
    if (props && props.phones && props.phones.length > 0) {
        dataBlock = <>
        <div className="contact-block">
            <p className="title">{t("ForAssistance")}</p>
            <div className="phone">
                <ul>
                {
                    props.phones.map((item, idex) => {
                    return <li key={idex}><span className="ic-phone"><i className='fas fa-phone'></i></span><a href={`tel:${item.phoneNumber}`}>{item.supporterName}: {item.phoneNumber}</a></li>
                    })
                }
                </ul>
            </div>
        </div>
        </>
    }
   
    return (
        <div className="search-block">
            <div className="block-left">
                <h1 className="content-page-header">{t("AnnouncementInternal")}</h1>
                <input type="text" name="textSearch" className="text-search shadow" placeholder={t("SearchTextPlaceholder")} onChange={onChangeTextSearch} />
            </div>
            <div className="block-right shadow">{dataBlock}</div>
        </div>
    );
}

export default FormSearchComponent;
