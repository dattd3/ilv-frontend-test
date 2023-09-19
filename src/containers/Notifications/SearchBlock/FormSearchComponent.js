import React, { useRef } from "react";
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
    
    return (
        <div className="search-block">
            <div className="block-left">
                <h1 className="content-page-header">{t("AnnouncementInternal")}</h1>
                <input type="text" name="textSearch" className="text-search" placeholder={t("SearchTextPlaceholder")} onChange={onChangeTextSearch} autoComplete="off" />
            </div>
            <div className="block-right"></div>
        </div>
    );
}

export default FormSearchComponent;
