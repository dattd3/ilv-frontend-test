import React from 'react';
import BenefitItem from './BenefitItem'
import { useApi, useFetcher } from "../../modules";
import NoteItem from './NoteItem'
import IconLevelUrl from '../../assets/img/icon-level.svg'

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
  var benefitLevel = localStorage.getItem('benefitLevel');  
  var benefitTitle = localStorage.getItem('benefitTitle'); 
  
  var result = usePreload([benefitLevel.toLowerCase()]);
  if(result && result.data) {
    var items = result.data;
      return (     
        <div>
          <span className="level-job-title">
              <img src={IconLevelUrl} alt="Icon Level" className="icon-level"/>
              <span style={{'color':'red'}}> Cấp Phúc Lợi: <b>{benefitTitle}</b> &nbsp; </span>
          </span>
          <br/>
          <br/>
          {      
            items.map((item,index) =>  
               <div key={index}>  
                   <BenefitItem key={index} data={item}/>                   
                   <NoteItem title={item.title}/>
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
