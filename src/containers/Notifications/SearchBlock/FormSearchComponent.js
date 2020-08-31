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

    const getPhone = () => {
        const phonesData = props.phones;
        phonesData.forEach(element => {
            
        });
    }

    let dataBlock = null;
    if (props && props.phones) {
        dataBlock = <>
        {
            props.phones.map((item, idex) => {
                return <li key={idex}><span className="ic-phone"><i className='fas fa-phone'></i></span><a href="tel:5551234567">{item}</a></li>
            })
        }
        </>
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
                        <ul>
                        {dataBlock}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormSearchComponent;
