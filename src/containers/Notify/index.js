import React from 'react';
/*import { useApi, useFetcher } from "../../modules";*/
import result from "./data/notify.json";
import NotifyItem from "./NotifyItem";
import { useTranslation } from "react-i18next";

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
    
    if(items) {        
          return (     
            <div>
                <h1 className="h3 mb-0 text-gray-800"> {t("Notification").toUpperCase()}</h1>
                <p></p>

                <div className="list-group">
                  {           
                      items.map((item,index) =>                                         
                              <NotifyItem key={index} data={item}/> 
                          )
                  }
                 </div>

           </div>
           );
     
    } else {
      return null;
    } 
}

export default Notify;
