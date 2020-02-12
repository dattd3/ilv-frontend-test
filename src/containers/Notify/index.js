import React,{ useState, useRef } from 'react';
/*import { useApi, useFetcher } from "../../modules";*/
import result from "./data/notify.json";
import NotifyItem from "./NotifyItem";
import { useTranslation } from "react-i18next";
import {Button, ButtonToolbar, OverlayTrigger, Overlay, Popover } from "react-bootstrap";

/*const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchBenefit,
        autoRun: true,
        params: params
    });
    return data;
};*/
 
function Notify() {    
     /*var result = usePreload([jobType.toLowerCase()]);*/

    const { t } = useTranslation();
    var items = result.data;

    var placement = " button test";
    
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [titlePopOver, setTitlePopOver] = useState(null);

    const ref = useRef(null);

    const handleClick = event => {
      setShow(!show);
      setTarget(event.target);
    };


    const handleLanguage = (event,title) => {        
        console.log("click :",title);
        handleClick(event);
        setTitlePopOver(title);
    }

    if(items) {        
          return (     
            <div>
                <h1 className="h3 mb-0 text-gray-800"> {t("Notification").toUpperCase()}</h1>
                <p></p>

                <div className="list-group">
                  {           
                      items.map((item,index) =>                                                                 
                               <NotifyItem onSelectLanguage={ handleLanguage } key={index} data={item}/>                                                
                          )
                  }
                 </div>
                
                 <ButtonToolbar ref={ref}>
                    <Button onClick={handleClick}>Holy guacamole!</Button>

                    <Overlay
                      show={show}
                      target={target}
                      placement="bottom"
                      container={ref.current}
                      containerPadding={20}
                    >
                      <Popover id="popover-contained">
                        <Popover.Title as="h3"> {titlePopOver} </Popover.Title>
                        <Popover.Content>
                          <strong>Holy guacamole!</strong> Check this info.
                        </Popover.Content>
                      </Popover>
                    </Overlay>
                  </ButtonToolbar>

           </div>
           );
     
    } else {
      return null;
    } 
}

export default Notify;
