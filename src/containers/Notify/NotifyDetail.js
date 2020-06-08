import React from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotificationDetail,
        autoRun: true,
        params: params
    });
    return data;
};
 
function NotifyDetail({ match }) {
    
    const {
        params: { id }
    } = match;

    const { t } = useTranslation();
    const result = usePreload([id]);


    console.log("result:",result);
    
    //if (result && result.data) {                
        return (
             <div>
                 DAY LA TRANG CHI TIET
             </div>
        );
    //} 
}
export default NotifyDetail;
