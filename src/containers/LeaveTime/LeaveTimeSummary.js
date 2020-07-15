import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import 'chart.piecelabel.js'

function displayMeric(total) {
    return total.toString().length == 1 ? '0' + total : total
}

function LeaveTimeGraph(props) {
      const leaveTimeData = (canvas) => {
        const ctx = canvas.getContext("2d")
        const bg1 = ctx.createLinearGradient(500, 0, 100, 0);
        bg1.addColorStop(0, props.data.item1.color);
        bg1.addColorStop(0.5, props.data.item1.color);
        bg1.addColorStop(1, props.data.item1.color);
    
        const bg2 = ctx.createLinearGradient(400, 0, 0, 0);
        bg2.addColorStop(0, props.data.item2.color);
        bg2.addColorStop(0.5, props.data.item2.color);
        bg2.addColorStop(1, props.data.item2.color);
    
        return {
          labels: [props.data.item1.label, props.data.item2.label],
          datasets: [{
            data: [props.data.item1.total, props.data.item2.total],
            title: { display: false },
            backgroundColor: [bg1, bg2]
          }]
        }
      }

    const chartOption = {
        legend: { display: false },
        maintainAspectRatio: false,
        pieceLabel: {
          render: function (args) {
            return args.value;
          },
          fontSize: 11,
          fontColor: '#fff'
        },
        rotation: -45
      }

    return <>
        <div className="title">{props.title}</div>
        <div className="content relative">
            <Doughnut
                data={leaveTimeData}
                options={chartOption}
            />
            <div class="absolute-center text-center">
                <div>Tổng số</div>
                <div style={{color: props.data.item2.color}}>{displayMeric(props.data.total)} ngày</div>
            </div>
        </div>
        <div className="description">
            <div className="d-block clearfix"><span className="float-left"><i class="fas fa-square" style={{color: props.data.item1.color}}>&nbsp;</i>{props.data.item1.label}</span><span className="float-right" style={{color: props.data.item1.color}}><h5>{displayMeric(props.data.item1.total)}</h5></span></div>
            <div className="d-block clearfix"><span className="float-left"><i class="fas fa-square" style={{color: props.data.item2.color}}>&nbsp;</i>{props.data.item2.label}</span><span className="float-right" style={{color: props.data.item2.color}}><h5>{displayMeric(props.data.item2.total)}</h5></span></div>
        </div>
    </>
}

function LeaveTimeSummary(props) {
    const thisYear = new Date().getFullYear()
    const annualLeaveOfThisYear =  props.data.annual_leave ? props.data.annual_leave.find(a => a.year == thisYear) : undefined
    const annualLeaveOfLastYear =  props.data.annual_leave ? props.data.annual_leave.find(a => a.year == (thisYear - 1)) : undefined

    const compensatoryLeaveOfThisYear =  props.data.compensatory_leave ? props.data.compensatory_leave.find(a => a.year == thisYear) : undefined
    const compensatoryLeaveOfLastYear =  props.data.compensatory_leave ? props.data.compensatory_leave.find(a => a.year == (thisYear - 1)) : undefined

    return (
        <div class="summary">
            <div className="row">
                <div className="col box shadow">
                    <div className="row">
                        <div className="col-md-6 border-right">
                            <LeaveTimeGraph 
                                title="NGÀY PHÉP TỒN NĂM TRƯỚC"
                                data={
                                    {
                                        total: annualLeaveOfLastYear ? annualLeaveOfLastYear.used_annual_leave + annualLeaveOfLastYear.unused_annual_leave : 0,
                                        item1: {label: 'Số ngày phép đã sử dụng', total: annualLeaveOfLastYear ? annualLeaveOfLastYear.used_annual_leave : 0, color: '#B9B8B8'},
                                        item2: {label: 'Số ngày phép được sử dụng', total: annualLeaveOfLastYear ? annualLeaveOfLastYear.unused_annual_leave : 0, color: '#f6c23e'}
                                    }
                                }
                            />
                        </div>

                        <div className="col-md-6">
                        <LeaveTimeGraph 
                                title="NGÀY PHÉP NĂM NAY"
                                data={
                                    {
                                        total: annualLeaveOfThisYear ? annualLeaveOfThisYear.used_annual_leave + annualLeaveOfThisYear.unused_annual_leave : 0,
                                        item1: {
                                            label: 'Số ngày phép đã sử dụng',
                                            total: annualLeaveOfThisYear ? annualLeaveOfThisYear.used_annual_leave : 0,
                                            color: '#B9B8B8'
                                        },
                                        item2: {
                                            label: 'Số ngày phép được sử dụng',
                                            total: annualLeaveOfThisYear ? annualLeaveOfThisYear.unused_annual_leave : 0,
                                            color: '#4e73df'
                                        }
                                    }
                                }
                            />
                        </div>
                        
                    </div>
                    <hr/>
                    <div className="d-block text-center">
                        TỔNG SỐ NGÀY PHÉP CÒN ĐƯỢC SỬ DỤNG
                    </div>
                    <div className="d-block text-center text-danger"><h3>
                        {displayMeric((annualLeaveOfLastYear ? annualLeaveOfLastYear.unused_annual_leave : 0) + (annualLeaveOfThisYear ? annualLeaveOfThisYear.unused_annual_leave : 0))}
                        </h3></div>
                </div>
                <div className="col box shadow">
                <div className="row">
                        <div className="col-md-6 border-right">
                            <LeaveTimeGraph 
                                    title="NGÀY PHÉP BÙ NĂM TRƯỚC"
                                    data={
                                        {
                                            total: compensatoryLeaveOfLastYear ? compensatoryLeaveOfLastYear.used_compensatory_leave + compensatoryLeaveOfLastYear.unused_compensatory_leave : 0,
                                            item1: {
                                                label: 'Số ngày bù đã sử dụng',
                                                total: compensatoryLeaveOfLastYear ? compensatoryLeaveOfLastYear.used_compensatory_leave : 0,
                                                color: '#B9B8B8'
                                            },
                                            item2: {
                                                label: 'Số ngày bù được sử dụng',
                                                total: compensatoryLeaveOfLastYear ? compensatoryLeaveOfLastYear.unused_compensatory_leave : 0,
                                                color: '#f6c23e'
                                            }
                                        }
                                    }
                                />
                        </div>

                        <div className="col-md-6">
                            <LeaveTimeGraph 
                                    title="SỐ NGÀY BÙ NĂM NAY"
                                    data={
                                        {
                                            total: compensatoryLeaveOfThisYear ? compensatoryLeaveOfThisYear.used_compensatory_leave + compensatoryLeaveOfThisYear.unused_compensatory_leave : 0,
                                            item1: {
                                                label: 'Số ngày bù đã sử dụng',
                                                total: compensatoryLeaveOfThisYear ? compensatoryLeaveOfThisYear.used_compensatory_leave : 0,
                                                color: '#B9B8B8'
                                            },
                                            item2: {
                                                label: 'Số ngày bù được sử dụng',
                                                total: compensatoryLeaveOfThisYear ? compensatoryLeaveOfThisYear.unused_compensatory_leave : 0,
                                                color: '#4e73df'
                                            }
                                        }
                                    }
                                />
                        </div>
                        
                    </div>
                    <hr/>
                    <div className="d-block text-center">
                        TỔNG SỐ NGÀY BÙ CÒN ĐƯỢC SỬ DỤNG
                    </div>
                    <div className="d-block text-center text-danger"><h3>
                        {displayMeric((compensatoryLeaveOfThisYear ? compensatoryLeaveOfThisYear.unused_compensatory_leave : 0) + (compensatoryLeaveOfLastYear ? compensatoryLeaveOfLastYear.unused_compensatory_leave : 0))}
                        </h3></div>
                </div>
            </div>
        </div>
    )
}

export default LeaveTimeSummary