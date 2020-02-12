import React from "react";

export default function NotifyItem(props) {    
    var data = props.data;
    if (data && data.content) {
        if (data.read && data.read == "false") {
          return (
              <a href="#" className="list-group-item list-group-item-action list-group-item-notify item-notify-unread"> 
                 <div>
                      <i className="fas icon-term_policy"></i> &nbsp;
                      { data.content }
                  </div>
                  <div className="news-author mb-2 item-notify-group-datetime-info">
                        <span className="datetime-info w3-left item-notify-datetime-info">
                            <i className="far fa-user"></i> &nbsp; { data.source }
                        </span>
                        <span className="datetime-info w3-right item-notify-datetime-info">
                            <i className="far">&#xf017;</i> &nbsp; { data.timeCreated }
                        </span>
                  </div>
              </a>
           )
        } else {          
          return (
                <a href="#" className="list-group-item list-group-item-action list-group-item-notify"> 
                    <div>
                        <i className="fas icon-term_policy"></i> &nbsp;
                        { data.content }
                    </div>
                    <div className="news-author mb-2 item-notify-group-datetime-info">
                          <span className="datetime-info w3-left item-notify-datetime-info">
                              <i className="far fa-user"></i> &nbsp; { data.source }
                          </span>
                          <span className="datetime-info w3-right item-notify-datetime-info">
                              <i className="far">&#xf017;</i> &nbsp; {data.timeCreated}
                          </span>
                    </div>
              </a>
            )
        }
    } else {
        return null;
    }
}