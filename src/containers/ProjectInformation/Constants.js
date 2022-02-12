const status = {
    draft: 0, // Nháp
    refuseApproval: 1, // Từ chối phê duyệt
    open: 2, // Mở
    inProgress: 3, // Đang tiến hành
    cancelled: 4, // Đã hủy
    waitingApproval: 5, // Chờ phê duyệt
    refuseAppraisal: 7, // Từ chối thẩm định
    waitingAppraisal: 8, // Chờ thẩm định
    reOpen: 9, // Mở lại
    closed: 10 // Đóng
}

const statusStyleMapping = {
    [status.draft]: { label: 'Nháp', className: 'draft' },
    [status.refuseApproval]: { label: 'Từ chối phê duyệt', className: 'refuse-approval' },
    [status.open]: { label: 'Mở', className: 'open' },
    [status.inProgress]: { label: 'Đang tiến hành', className: 'in-progress' },
    [status.cancelled]: { label: 'Đã hủy', className: 'cancelled' },
    [status.waitingApproval]: { label: 'Chờ phê duyệt', className: 'waiting-approval' },
    [status.refuseAppraisal]: { label: 'Từ chối thẩm định', className: 'refuse-appraisal' },
    [status.waitingAppraisal]: { label: 'Chờ thẩm định', className: 'waiting-appraisal' },
    [status.reOpen]: { label: 'Mở lại', className: 're-open' },
    [status.closed]: { label: 'Đóng', className: 'closed' },
}

const myProjectPageKey = 'my-project'

export { status, statusStyleMapping, myProjectPageKey }
