import React from "react";
import Moment from 'react-moment';

export default function NotifyListItem(props) {    
    var data = props.data;

   const onSelectItemDetail = (event) => {  
        props.onSelectItemDetail(event, data.title, data.content);            
    }
   
    if (data) {
        if (data.isRead === false) {
          return (
              <a href="#" onClick={ onSelectItemDetail } className="list-group-item list-group-item-action list-group-item-notify item-notify-unread">                  
                     <div>            
                        <i className="fas icon-term_policy"></i> &nbsp;
                        { data.title }
                       <span className="w3-right item-notify-datetime-info list-item-notify-datetime">
                            <i className="far">&#xf017;</i> &nbsp;                            
                            <Moment date={data.createdDate} format="DD/MM/YYYY HH:mm"/>
                        </span>
                     </div>                         
                    <div className="list-item-notify-content text-clip-2lines">                      
                        { data.content }
                    </div>                                    
              </a>
           )
        } else {          
          return (
                <a href="#" onClick={ onSelectItemDetail } className="list-group-item list-group-item-action list-group-item-notify"> 
                     <div>            
                        <i className="fas icon-term_policy"></i> &nbsp;
                        { data.title }
                       <span className="w3-right item-notify-datetime-info list-item-notify-datetime">
                            <i className="far">&#xf017;</i> &nbsp;                            
                            <Moment date={data.createdDate} format="DD/MM/YYYY HH:mm"/>
                        </span>
                     </div>                         
                    <div className="list-item-notify-content text-clip-2lines">                      
                        { data.content }
                    </div>     
              </a>
            )
        }
    } else {
        return null;
    }
}