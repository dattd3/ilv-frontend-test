import React from 'react';
import BenefitItem from './BenefitItem'
import { useApi, useFetcher } from "../../modules";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchBenefit,
        autoRun: true,
        params: params
    });
    return data;
};
 

function Benefit() {
  var jobType = localStorage.getItem('jobType');
  var result = usePreload([jobType.toLowerCase()]);
  if(result && result.data) {
    var items = result.data;
      return (     
        <div> 
          {      
            items.map((item,index) =>  
               <div key={index}>  
                   <BenefitItem key={index} data={item}/>
                   <br/>
               </div>
            )
          }
         </div>
       );
   
  } else {
    return null;
  }

}

export default Benefit;
