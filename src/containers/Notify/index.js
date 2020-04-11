import React,{ useState, useRef } from 'react';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import NotifyItem from "./NotifyListItem";
import { useTranslation } from "react-i18next";
import {Button, ButtonToolbar, OverlayTrigger, Overlay, Popover } from "react-bootstrap";
import CustomPaging from '../../components/Common/CustomPaging';
import { Row, Col, Form } from 'react-bootstrap';

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
    const [pageSize, SetPageSize] = useState(5);    
    const [isOnGoing, SetIsOnGoing] = useState(false);

    const guard = useGuardStore();
    const user = guard.getCurentUser();

    const result = usePreload([user.email, pageIndex, pageSize]); 

    if (result == null || result.data == null) {
      return null;
    }

    try {
        if (result && result.data.notifications.length > 0) {
            SetIsOnGoing(true);
        }
    } catch { }


    var items = result.data.notifications;
    const totalRecord = result.data.total; 
    
    function onChangePage(page) {
        SetPageIndex(page);
        console.log("onChangePage:"+page);
    } 

    function onChangePageSize(evt) {
        SetPageSize(parseInt(evt.target.value));
        SetPageIndex(1);
    }
    
    function handleClick(event) {
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
                  {
                       isOnGoing ?
                          <Row>
                                <Col className='total'>
                                    {t("Total")}: {totalRecord} {t("Notification")}
                                </Col>
                                <Col className='paging'>
                                    <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={totalRecord} />
                                </Col>
                                <Col>
                                    <Form.Control as="select" onChange={onChangePageSize} className='w-auto float-right'>
                                        <option value={5}>{t("Display5Classes")}</option>
                                        <option value={10}>{t("Display10Classes")}</option>
                                        <option value={15}>{t("Display15Classes")}</option>
                                    </Form.Control>
                                </Col>
                          </Row> : null
                  }
                 
           </div>
           );
     
    } else {
      return null;
    } 
}

export default Notify;
