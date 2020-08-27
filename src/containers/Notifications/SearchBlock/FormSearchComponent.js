import React, { useState, useRef } from "react";
import _ from 'lodash';

function FormSearchComponent(props) {

    const sendQuery = query => {
        props.handler(query);
    }
  
    const delayedQuery = useRef(_.debounce(q => sendQuery(q), 1000)).current;

    const onChangeTextSearch = (e) => {
        delayedQuery(e.target.value);
    }

    return (
        <div className="search-block">
            <div className="block-left">
                <h4 className="h4 title-search-block">thông báo nội bộ</h4>
                <input type="text" name="textSearch" className="text-search" placeholder="Tìm kiếm ..." onChange={onChangeTextSearch} />
            </div>
            <div className="block-right">
                <div className="contact-block">
                    <p className="title">Thắc mắc vui lòng liên hệ</p>
                    <div className="phone">
                        <span className="ic-phone"><i className='fas fa-phone'></i></span>
                        <span>01234567899</span>
                        <span className="separate">/</span>
                        <span>01234567899</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormSearchComponent;
