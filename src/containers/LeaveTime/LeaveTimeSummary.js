import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import 'chart.piecelabel.js'
import { useTranslation } from "react-i18next"

function displayMeric(total) {
    return total.toString().length == 1 ? '0' + total : total.toFixed(2)
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
        <div className="title text-uppercase">{props.title}</div>
        {/* <div className="content relative">
            <Doughnut
                data={leaveTimeData}
                options={chartOption}
            />
            <div className="absolute-center text-center">
                <div>Tổng số</div>
                <div style={{color: props.data.item2.color}}>{displayMeric(props.data.total)} ngày</div>
            </div>
        </div> */}
        <div className="description">
            <div className="d-block clearfix"><span className="float-left"><i className="fas fa-square" style={{color: props.data.item1.color}}>&nbsp;</i>{props.data.item1.label}</span><span className="float-right" style={{color: props.data.item1.color}}><h5>{displayMeric(props.data.item1.total)}</h5></span></div>
            <div className="d-block clearfix"><span className="float-left"><i className="fas fa-square" style={{color: props.data.item2.color}}>&nbsp;</i>{props.data.item2.label}</span><span className="float-right" style={{color: props.data.item2.color}}><h5>{displayMeric(props.data.item2.total)}</h5></span></div>
            <div className="d-block clearfix"><span className="float-left"><i className="fas fa-square" style={{color: props.data.item3.color}}>&nbsp;</i>{props.data.item3.label}</span><span className="float-right text-success">{props.data.item3.expiredDate ? props.data.item3.expiredDate.replace(/-/g, '/'): ''}</span></div>
        </div>
    </>
}

function LeaveTimeSummary(props) {
    const { t } = useTranslation()

    const thisYear = new Date().getFullYear()
    const usedAnnualLeaveOfThisYear = props.data.used_annual_leave ? props.data.used_annual_leave.find(a => a.year == thisYear) : undefined
    const usedAnnualLeaveOfLastYear = props.data.used_annual_leave ? props.data.used_annual_leave.find(a => a.year == (thisYear - 1)) : undefined

    const unusedAnnualLeaveOfThisYear = props.data.unused_annual_leave ? props.data.unused_annual_leave.find(a => a.year == thisYear) : undefined
    const unusedAnnualLeaveOfLastYear = props.data.unused_annual_leave ? props.data.unused_annual_leave.find(a => a.year == (thisYear-1)) : undefined

    const usedCompensatoryLeaveOfThisYear = props.data.used_compensatory_leave ? props.data.used_compensatory_leave.find(a => a.year == thisYear) : undefined
    const usedCompensatoryLeaveOfLastYear = props.data.used_compensatory_leave ? props.data.used_compensatory_leave.find(a => a.year == (thisYear-1)) : undefined

    const unusedCompensatoryLeaveOfThisYear = props.data.unused_compensatory_leave ? props.data.unused_compensatory_leave.find(a => a.year == thisYear) : undefined
    const unusedCompensatoryLeaveOfLastYear = props.data.unused_compensatory_leave ? props.data.unused_compensatory_leave.find(a => a.year == (thisYear-1)) : undefined

    return (
        <div className="summary">
            <div className="row">
                <div className="col box shadow">
                    <div className="row">
                        <div className="col-md-6 border-right">
                            <LeaveTimeGraph 
                                title={t("RemainingLeavesFromLastYear")}
                                data={
                                    {
                                        total:  (usedAnnualLeaveOfLastYear ? usedAnnualLeaveOfLastYear.days : 0) + (unusedAnnualLeaveOfLastYear ? unusedAnnualLeaveOfLastYear.days : 0),
                                        item1: {label: t("Used"), total: usedAnnualLeaveOfLastYear ? usedAnnualLeaveOfLastYear.days : 0, color: '#B9B8B8'},
                                        item2: {label: t("Available"), total: unusedAnnualLeaveOfLastYear ? unusedAnnualLeaveOfLastYear.days : 0, color: '#f6c23e'},
                                        item3: {label: t("ExpireDate"), expiredDate: unusedAnnualLeaveOfLastYear ? unusedAnnualLeaveOfLastYear.expire_date : '', color: '#28a745'},
                                    }
                                }
                            />
                        </div>

                        <div className="col-md-6">
                        <LeaveTimeGraph 
                                title={t("LeavesThisYear")}
                                data={
                                    {
                                        total: (usedAnnualLeaveOfThisYear ? usedAnnualLeaveOfThisYear.days : 0) + (unusedAnnualLeaveOfThisYear ? unusedAnnualLeaveOfThisYear.days : 0),
                                        item1: {
                                            label: t("Used"),
                                            total: usedAnnualLeaveOfThisYear ? usedAnnualLeaveOfThisYear.days : 0,
                                            color: '#B9B8B8'
                                        },
                                        item2: {
                                            label: t("Available"),
                                            total: unusedAnnualLeaveOfThisYear ? unusedAnnualLeaveOfThisYear.days : 0,
                                            color: '#4e73df'
                                        },
                                        item3: {label: t("ExpireDate"), expiredDate: unusedAnnualLeaveOfThisYear ? unusedAnnualLeaveOfThisYear.expire_date : '', color: '#28a745'},
                                    }
                                }
                            />
                        </div>
                        
                    </div>
                    <hr/>
                    <div className="d-block text-center text-uppercase">
                        <b>{t("TotalAvaiableLeaves")}</b>
                    </div>
                    <div className="d-block text-center text-danger"><h3>
                        {displayMeric((unusedAnnualLeaveOfThisYear ? unusedAnnualLeaveOfThisYear.days : 0) + (unusedAnnualLeaveOfLastYear ? unusedAnnualLeaveOfLastYear.days : 0))}
                        </h3></div>
                </div>
                <div className="col box shadow">
                <div className="row">
                        <div className="col-md-6 border-right">
                            <LeaveTimeGraph 
                                    title={t("RemaingToilHoursLastYear")}
                                    data={
                                        {
                                            total: (usedCompensatoryLeaveOfLastYear ? usedCompensatoryLeaveOfLastYear.days : 0) + (unusedCompensatoryLeaveOfLastYear ? unusedCompensatoryLeaveOfLastYear.days : 0),
                                            item1: {
                                                label: t("Used"),
                                                total: usedCompensatoryLeaveOfLastYear ? usedCompensatoryLeaveOfLastYear.days : 0,
                                                color: '#B9B8B8'
                                            },
                                            item2: {
                                                label: t("Available"),
                                                total: unusedCompensatoryLeaveOfLastYear ? unusedCompensatoryLeaveOfLastYear.days : 0,
                                                color: '#f6c23e'
                                            },
                                            item3: {label: t("ExpireDate"), expiredDate: unusedCompensatoryLeaveOfLastYear ? unusedCompensatoryLeaveOfLastYear.expire_date : '', color: '#28a745'},
                                        }
                                    }
                                />
                        </div>

                        <div className="col-md-6">
                            <LeaveTimeGraph 
                                    title={t("ToilHoursThisYear")}
                                    data={
                                        {
                                            total: (usedCompensatoryLeaveOfThisYear ? usedCompensatoryLeaveOfThisYear.days : 0) + (unusedCompensatoryLeaveOfThisYear ? unusedCompensatoryLeaveOfThisYear.days : 0),
                                            item1: {
                                                label: t("Used"),
                                                total: usedCompensatoryLeaveOfThisYear ? usedCompensatoryLeaveOfThisYear.days : 0,
                                                color: '#B9B8B8'
                                            },
                                            item2: {
                                                label: t("Available"),
                                                total: unusedCompensatoryLeaveOfThisYear ? unusedCompensatoryLeaveOfThisYear.days : 0,
                                                color: '#4e73df'
                                            },
                                            item3: {label: t("ExpireDate"), expiredDate: unusedCompensatoryLeaveOfThisYear ? unusedCompensatoryLeaveOfThisYear.expire_date : '', color: '#28a745'},
                                        }
                                    }
                                />
                        </div>
                        
                    </div>
                    <hr/>
                    <div className="d-block text-center text-uppercase">
                        <b>{t("TotalAvailableToilHours")}</b>
                    </div>
                    <div className="d-block text-center text-danger"><h3>
                        {displayMeric((unusedCompensatoryLeaveOfThisYear ? unusedCompensatoryLeaveOfThisYear.days : 0) + (unusedCompensatoryLeaveOfLastYear ? unusedCompensatoryLeaveOfLastYear.days : 0))}
                        </h3></div>
                </div>
            </div>
        </div>
    )
}

export default LeaveTimeSummary