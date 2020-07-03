import React from 'react';
import axios from 'axios';
import KPIDetailGroupItem from './KPIDetailGroupItem';
import SuccessFactorInfo from "./SuccessFactorInfo"

class ShowKPIDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      KpiQuarter1: {},
      KpiQuarter2: {},
      KpiQuarter3: {},
      KpiQuarter4: {},
      KpiIsLeader1: "false",
      KpiIsLeader2: "false",
      KpiIsLeader3: "false",
      KpiIsLeader4: "false",
      Period: props.Period
    };    
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {    
    this.loadData(this.state.Period);    
  }

  resetData() {
    this.setState(
      { 
        KpiQuarter1: {},
        KpiQuarter2: {},
        KpiQuarter3: {},
        KpiQuarter4: {},
        KpiIsLeader1: "false",
        KpiIsLeader2: "false",
        KpiIsLeader3: "false",
        KpiIsLeader4: "false",        
      });
  }

  loadData(Period) {
    if(!Period) {
      return;
    }

    this.resetData();
    this.setState({ Period: Period });
    
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/successfactor/v1/kpi/general?Period=${Period}`, config)
      .then(res => {        
        if (res && res.data && res.data.data) {
          if (res.data.data.length > 0) {
            this.saveData(res.data.data);
          }
        }
      }).catch(error => console.log("Call API error:", error));
  }

  saveData(items) {

    items.forEach(item => {
      const quarter = item.Period.substring(0, 2).toUpperCase(); // convert "Q1/2020" => "Q1"

      if (quarter == "Q1") {
        this.setState({ KpiQuarter1: item });
        if (item.NLLDweight != null && item.NLLDweight != "" && item.NLLDweight != "0" && item.NLLDweight.length > 0) {
          this.setState({ KpiIsLeader1: "true" });
        }

      } else if (quarter == "Q2") {
        this.setState({ KpiQuarter2: item });
        if (item.NLLDweight != null && item.NLLDweight != "" && item.NLLDweight != "0" && item.NLLDweight.length > 0) {
          this.setState({ KpiIsLeader2: "true" });
        }

      } else if (quarter == "Q3") {
        this.setState({ KpiQuarter3: item });
        if (item.NLLDweight != null && item.NLLDweight != "" && item.NLLDweight != "0" && item.NLLDweight.length > 0) {
          this.setState({ KpiIsLeader3: "true" });
        }

      } else if (quarter == "Q4") {
        this.setState({ KpiQuarter4: item });
        if (item.NLLDweight != null && item.NLLDweight != "" && item.NLLDweight != "0" && item.NLLDweight.length > 0) {
          this.setState({ KpiIsLeader4: "true" });
        }
      }
    });
  }

  render() {
    return (
      <div className="kpi-detail">
        <div className="title-group mb-4">
          KẾT QUẢ ĐÁNH GIÁ CHI TIẾT
          </div>

        <KPIDetailGroupItem IsLeader={this.state.KpiIsLeader1} kpiInfo={this.state.KpiQuarter1} Period={this.state.Period} Quarter="1" Color="#347EF9" />

        <KPIDetailGroupItem IsLeader={this.state.KpiIsLeader2} kpiInfo={this.state.KpiQuarter2} Period={this.state.Period} Quarter="2" Color="#05BD29" />

        <KPIDetailGroupItem IsLeader={this.state.KpiIsLeader3} kpiInfo={this.state.KpiQuarter3} Period={this.state.Period} Quarter="3" Color="#FF7F00" />

        <KPIDetailGroupItem IsLeader={this.state.KpiIsLeader4} kpiInfo={this.state.KpiQuarter4} Period={this.state.Period} Quarter="4" Color="#00999E" />

        {/* Thực hiện đánh giá / Thông tin chi tiết về kết quả đánh giá truy cập Success Factor */}
        <SuccessFactorInfo />

      </div>
    )
  }
}

export default ShowKPIDetail;
