import React,{ useState, useRef } from 'react';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import NotifyItem from "./NotifyListItem";
import { useTranslation } from "react-i18next";
import {Button, ButtonToolbar, OverlayTrigger, Overlay, Popover } from "react-bootstrap";
import CustomPaging from '../../components/Common/CustomPaging';

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotifyList,
        autoRun: true,
        params: params
    });
    return data;
};
 
function Notify() {    
    
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [titlePopOver, setTitlePopOver] = useState(null);
    const [contentPopOver, setContentPopOver] = useState(null);
    const ref = useRef(null);

    const [pageIndex, SetPageIndex] = useState(1);
    const [pageSize, SetPageSize] = useState(10);    
    

    const guard = useGuardStore();
    const user = guard.getCurentUser();

    const result = usePreload([user.email, pageIndex, pageSize]); 

    if (result == null || result.data == null) {
      return null;
    }

    var items = result.data.notifications;

    const totalRecord = result.data.total; 
    
    /*Get top pageSize elements*/

    if (items && items.length > pageSize) {
        items = items.slice(0, pageSize);
    }

    function onChangePage(page) {
        SetPageIndex(page);
    } 
    
    const handleClick = event => {
      setShow(!show);
      setTarget(event.target);
    };

    const onSelectItemDetail = (event, title, content) => {        
        console.log("click :",title);
        handleClick(event);
        setTitlePopOver(title);
        setContentPopOver(content);
    }

    if(items) {        
          return (     
            <div>
                <h1 className="h3 mb-0 text-gray-800"> {t("Notification").toUpperCase()}</h1>
                <br/>

                <div className="list-group">
                  {    
                     !items ? null :     
                     items.map((item,index) =>                                                                 
                               <NotifyItem onSelectItemDetail={ onSelectItemDetail } key={index} data={item}/>                                                
                          )
                  }
                 </div>
                
                 <ButtonToolbar ref={ref}>
                    {/*<Button onClick={handleClick}>Holy guacamole!</Button>*/}
                    <Overlay
                      show={show}
                      target={target}
                      placement="bottom"
                      container={ref.current}
                      containerPadding={20}
                    >
                      <Popover id="popover-contained" className="pop-over-notify-custom">
                        <Popover.Title as="h4" className="pop-over-header-notify-custom"> 
                            <i className="fas icon-term_policy"></i> &nbsp; { titlePopOver } 
                        </Popover.Title>
                        <Popover.Content className="pop-over-body-notify-custom">
                           { contentPopOver }                          
                        </Popover.Content>
                      </Popover>
                    </Overlay>
                  </ButtonToolbar>
                  <br/>
                  <div className="row">
                      <div className="col-sm"> </div>
                      <div className="col-sm">                      
                          <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={totalRecord} />
                      </div>
                      <div className="col-sm text-right">
                          {t("Total")}: {totalRecord}
                      </div>
                  </div>

           </div>
           );
     
    } else {
      return null;
    } 
}

export default Notify;
