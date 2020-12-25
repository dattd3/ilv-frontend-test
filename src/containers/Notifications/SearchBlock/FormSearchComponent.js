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

    let dataBlock = null;
    if (props && props.phones && props.phones.length > 0) {
        dataBlock = <>
        <div className="contact-block">
            <p className="title">Thắc mắc vui lòng liên hệ</p>
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
                <h4 className="h4 title-search-block">thông báo nội bộ</h4>
                <input type="text" name="textSearch" className="text-search shadow" placeholder="Tìm kiếm ..." onChange={onChangeTextSearch} />
            </div>
            <div className="block-right shadow">
                {dataBlock}
            </div>
        </div>
    );
}

export default FormSearchComponent;
