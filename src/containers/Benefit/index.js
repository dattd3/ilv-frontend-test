import React from 'react';
import BenefitItem from './BenefitItem'

var items = require('./DataTest.json')

function Benefit() {

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

}

export default Benefit;
