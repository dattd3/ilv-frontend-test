import React from "react"

function LeaveInformationComponent(props) {
    const leaveInformation = props.payslip.leave_information
   

    return (
        <>
            <table className="leave-days-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="4">b. thông tin ngày nghỉ phép, nghỉ bù</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="same-width title">Loại phép năm/phép bù</td>
                        <td className="same-width title">Tổng số ngày/giờ phát sinh</td>
                        <td className="same-width title">Số ngày/giờ nghỉ đã sử dụng/thanh toán</td>
                        <td className="same-width title">Số ngày/giờ nghỉ còn lại</td>
                    </tr>
                    <tr>
                        <td className="same-width">Phép năm (Ngày)</td>
                        <td className="same-width">{leaveInformation[0] ? leaveInformation[0].total_leave_entitlement : 0}</td>
                        <td className="same-width">{leaveInformation[0] ? leaveInformation[0].used_leave : 0}</td>
                        <td className="same-width">{leaveInformation[0] ? leaveInformation[0].unused_leave : 0}</td>
                    </tr>
                    <tr>
                        <td className="same-width">OT quy bù (Giờ)</td>
                        <td className="same-width">{leaveInformation[1] ? leaveInformation[1].total_leave_entitlement : 0}</td>
                        <td className="same-width">{leaveInformation[1] ? leaveInformation[1].used_leave : 0}</td>
                        <td className="same-width">{leaveInformation[1] ? leaveInformation[1].unused_leave : 0}</td>
                    </tr>
                    <tr>
                        <td className="same-width">OT thanh toán (Giờ)</td>
                        <td className="same-width">{leaveInformation[2] ? leaveInformation[2].total_leave_entitlement : 0}</td>
                        <td className="same-width">{leaveInformation[2] ? leaveInformation[2].used_leave : 0}</td>
                        <td className="same-width">{leaveInformation[2] ? leaveInformation[2].unused_leave : 0}</td>
                    </tr>
                </tbody>
            </table>
            <div className="clear"></div>
        </>
    )
}

export default LeaveInformationComponent
