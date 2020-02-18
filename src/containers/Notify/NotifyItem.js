import React from "react";
import Moment from 'react-moment';

export default function NotifyItem(props) {    
    var data = props.data;

   const onSelectItemDetail = (event) => {  
        props.onSelectItemDetail(event, data.title, data.content);            
    }

    if (data && data.title) {
        if (data.isRead && data.isRead == false) {
          return (
              <a href="#" onClick={ onSelectItemDetail } className="list-group-item list-group-item-action list-group-item-notify item-notify-unread"> 
                 <div>
                      <i className="fas icon-term_policy"></i> &nbsp;
                      { data.title }
                  </div>
                  <div className="news-author mb-2 item-notify-group-datetime-info">                        
                        <span className="datetime-info w3-right item-notify-datetime-info">
                            <i className="far">&#xf017;</i> &nbsp;                            
                            <Moment date={data.createdDate} format="DD/MM/YYYY HH:mm"/>
                        </span>
                  </div>
              </a>
           )
        } else {          
          return (
                <a href="#" onClick={ onSelectItemDetail } className="list-group-item list-group-item-action list-group-item-notify"> 
                    <div>
                        <i className="fas icon-term_policy"></i> &nbsp;
                        { data.title }
                    </div>
                    <div className="news-author mb-2 item-notify-group-datetime-info">                          
                          <span className="datetime-info w3-right item-notify-datetime-info">                               
                               <i className="far">&#xf017;</i> &nbsp;                                
                              <Moment date={data.createdDate} format="DD/MM/YYYY HH:mm"/>
                          </span>
                    </div>
              </a>
            )
        }
    } else {
        return null;
    }
}