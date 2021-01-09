import React from "react"

function WorkingInformationComponent(props) {
    const workingInformations = props.payslip.working_information

    return (
        <>
            <table className="workday-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="14">a. thông tin công</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="second-title">
                        <td className="title title-second kcc" colSpan="2">Kỳ chấm công</td>
                        <td className="title title-second" colSpan="5">Chi tiết thu nhập trên HĐLĐ</td>
                        <td className="title title-second cc" rowSpan="2">Công chuẩn</td>
                        <td className="title title-second" colSpan="4">Chi tiết ngày công</td>
                        <td className="title same-width title-second tchl" rowSpan="2">Tổng công hưởng lương</td>
                        <td className="title same-width title-second sgcd" rowSpan="2">Số giờ công đêm</td>
                    </tr>
                    <tr className="three-title">
                        <td className="title same-width title-second tn">Từ ngày</td>
                        <td className="title same-width title-second dn">Đến ngày</td>
                        <td className="title same-width title-second lcb">Mức lương</td>
                        <td className="title same-width title-second">Thưởng YTCLCV</td>
                        {
                            localStorage.getItem("companyCode") == "V030" ? <>
                                <td className="title same-width title-second ttng">Thưởng tay nghề</td>
                                <td className="title same-width title-second">Thưởng SC/Thưởng Caddie Fee</td>
                            </> : null
                        }
                        <td className="title same-width title-second ttn">Tổng</td>
                        <td className="title same-width title-second clvtt">Công làm việc thực tế</td>
                        <td className="title same-width title-second snnchl">Số ngày nghỉ có hưởng lương</td>
                        <td className="title same-width title-second cnv">Công ngừng việc</td>
                        <td className="title same-width title-second snnkhl">Số ngày nghỉ không hưởng lương</td>
                    </tr>
                    {workingInformations.map((workingInformation, key) => {
                        return <tr className="data-row" key={key}>
                            <td className="same-width tn">{workingInformation.start_date}</td>
                            <td className="same-width dn">{workingInformation.end_date}</td>
                            <td className="same-width lcb">{parseInt(workingInformation.base_salary).toLocaleString()}</td>
                            <td className="same-width">{parseInt(workingInformation.behaviour_bonus).toLocaleString()}</td>
                            {
                                localStorage.getItem("companyCode") == "V030" ? <>
                                    <td className="same-width ttng">{parseInt(workingInformation.vp_proficiency_bonus).toLocaleString()}</td>
                                    <td className="same-width">{parseInt(workingInformation.service_charge_bonus).toLocaleString()}</td>
                                </> : null
                            }
                            <td className="same-width ttn">{(parseInt(workingInformation.base_salary) + parseInt(workingInformation.behaviour_bonus) + parseInt(workingInformation.vp_proficiency_bonus) + parseInt(workingInformation.service_charge_bonus)).toLocaleString()}</td>
                            <td className="same-width cc">{workingInformation.standard_day ? workingInformation.standard_day : 0}</td>
                            <td className="same-width clvtt">{workingInformation.actual_day ? workingInformation.actual_day : 0}</td>
                            <td className="same-width snnchl">{workingInformation.leave_day ? workingInformation.leave_day : 0}</td>
                            <td className="same-width clvtt">{workingInformation.suspension_day ? workingInformation.suspension_day : 0}</td>
                            <td className="same-width snnkhl">{workingInformation.unpaid_day ? workingInformation.unpaid_day : 0}</td>
                            <td className="same-width cnv">{workingInformation.total_paid_working_days ? workingInformation.total_paid_working_days : 0}</td>
                            <td className="same-width sgcd">{workingInformation.night_shift_hours ? workingInformation.night_shift_hours : 0}</td>
                        </tr>
                    })}

                </tbody>
            </table>
            <div className="clear"></div>
        </>
    );
}

export default WorkingInformationComponent;
