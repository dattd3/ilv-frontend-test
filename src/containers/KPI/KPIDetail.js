import React from 'react';
import axios from 'axios';

class KPIDetail extends React.Component {

  constructor(props) {    
    super(props);
    this.state = {
      kpiInfo: {},
      Period: props.match.params.id
    };   
  }

  componentDidMount() {  
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }    
    const url = process.env.REACT_APP_MULE_LOCAL + 'kpi/general?Period=' + this.state.Period;        
    axios.get(url, config)
      .then(res => {
        if (res && res.data && res.data.data) {
           if(res.data.data.length > 0) {
              let kpiInfo = res.data.data[0];              
             this.setState({ kpiInfo: kpiInfo });
           }          
        }
      }).catch(error => console.log("Call API error:", error));
  }

  render() {    
    return (      
       <div className="kpi-detail container-fluid w-100 mb-4">
          <div className="row">
              {/*HIỂN THỊ KẾT QUẢ ĐÁNH GIÁ THEO QUÝ*/}
              <div className="col-8 panel" style={{'paddingLeft':'0px'}}>                                                      
                    <div className="card border border-primary shadow">        
                        <div className="bg-primary text-white p-3 h6 text-uppercase text-center">Quý 1 năm {this.state.Period}</div>                      
                        <div className="card-body">          
                            <table className="table table-bordered" >
                               <tbody>         
                                   <tr>                
                                        <td className="text-left text-primary item-row"><strong>STT</strong></td>
                                        <td className="text-left text-primary item-row"><strong>Hạng mục đánh giá</strong></td>
                                        <td className="text-center text-primary item-row"><strong>CBNV tự đánh giá</strong></td>
                                        <td className="text-center text-primary item-row"><strong>CBQL đánh giá</strong></td>              
                                    </tr> 
                                    <tr>
                                        <td className="item-row">01</td>   
                                        <td className="text-left item-row">Tinh thần thái độ</td>
                                        <td className="item-row"> {this.state.kpiInfo.TTTDself} </td>
                                        <td className="item-row"> {this.state.kpiInfo.TTTDmanager} </td>
                                    </tr>
                                    <tr>
                                        <td className="item-row">02</td>   
                                        <td className="text-left item-row">Năng lực lãnh đạo</td>
                                        <td className="item-row">{this.state.kpiInfo.NLLDself}</td>
                                        <td className="item-row">{this.state.kpiInfo.NLLDmanager}</td>
                                    </tr>
                                    <tr>
                                        <td className="item-row">03</td>   
                                        <td className="item-row" className="text-left">Năng lực chuyên môn</td>
                                        <td className="item-row">{this.state.kpiInfo.NLCMself}</td>
                                        <td className="item-row">{this.state.kpiInfo.NLCMmanager}</td>
                                    </tr> 
                                    <tr>
                                        <td className="item-row">04</td>   
                                        <td className="item-row" className="text-left">Nội dung công việc</td>
                                        <td className="item-row">{this.state.kpiInfo.NDCVself}</td>
                                        <td className="item-row">{this.state.kpiInfo.NDCVmanager}</td>
                                    </tr>
                                    <tr>                
                                        <td className="item-row"><strong>05</strong></td>
                                        <td className="item-row" className="text-left"><strong>Điểm tổng thể</strong></td>
                                        <td className="item-row"><strong>{this.state.kpiInfo.SelfOverAll}</strong></td>
                                        <td className="item-row"><strong>{this.state.kpiInfo.Score}</strong></td>              
                                    </tr>   
                                </tbody>                                       
                            </table>
                        </div>
                    </div>                      
              </div>

              <div className="col-4 panel" style={{'paddingRight':'0px'}}>                    
              {/* ĐÁNH GIÁ & PHÊ DUYỆT */}
                    <div className="card border border-primary shadow" style={{'height':'100%'}}> 
                         <div className="bg-primary text-white p-3 h6 text-uppercase text-center">ĐÁNH GIÁ & PHÊ DUYỆT</div> 
                         <div className="card-body" style={{'padding':'0px'}}>
                            <div className="text-center" style={{'color':'#FF0000'}}>Kết qủa</div>
                            <div className="text-center" style={{'color':'#FF0000'}}>đánh giá tổng thể</div>
                            <div className="text-center font-weight-bold" style={{'color':'#FF0000','fontSize':'60px'}}>{this.state.kpiInfo.Score}</div>   
                            <hr></hr>                             
                         </div>
                        <div className="card-body" style={{'padding':'0px'}}>
                            <div className="text-center">CBQL đánh giá:</div>
                            <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{this.state.kpiInfo.ManagerFullName}</div>
                            <hr></hr>
                        </div>
                        <div className="card-body" style={{'padding':'0px'}}>
                            <div className="text-center">CBLĐ phê duyệt:</div>
                            <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{this.state.kpiInfo.MatrixFullName}</div>
                        </div>                    
                    </div>                    
               </div>
          </div> 
       </div>
    )
  }
}

export default KPIDetail;
