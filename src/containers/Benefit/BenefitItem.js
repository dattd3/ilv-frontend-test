import React from "react";

export default function BenefitItem(props) {
    var data = props.data;
    if (data && data.title && data.benefits) {
      return (
        <div className="p-2 bg-white">
             <div id="benefit-title"> {data.title} </div>                                
              <table className="table table-striped">
                    <thead className="benefit-title-row">
                      <tr>
                        <th>STT</th>
                        <th>Dịch vụ</th>
                        <th>Chế độ phúc lợi</th>
                      </tr>
                    </thead>    
                    <tbody>                                
                        {                                                   
                         data.benefits.map((item,index) =>                                                                 
                           <tr key= {index}>
                                <td> {index + 1} </td>
                                <td>
                                    <div dangerouslySetInnerHTML={{ __html: item.user }}>
                                    </div>
                                </td>   
                                <td>                                 
                                    <div dangerouslySetInnerHTML={{ __html: item.content }}>
                                    </div>
                                </td>
                            </tr>
                           )
                         }
                     </tbody>       
              </table>
      </div>
    );
    
    } else {
        return null;
    }
}