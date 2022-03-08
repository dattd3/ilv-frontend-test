const status = {
    draft: 0,
    denyApproval: 1,
    open: 2,
    inProgress: 3,
    cancelled: 4,
    pendingApproval: 5,
    pendingSchedule: 6,
    deny: 7,
    pendingReview: 8,
    reOpen: 9,
    closed: 10
}

const levelColorMapping = {
    High: {className: 'high'},
    Medium: {className: 'medium'},
    Low: {className: 'low'}
}

const statusStyleMapping = {
    [status.draft]: { label: 'Nháp', className: 'draft' },
    [status.denyApproval]: { label: 'Từ chối phê duyệt', className: 'deny-approval' },
    [status.open]: { label: 'Mở', className: 'open' },
    [status.inProgress]: { label: 'Đang tiến hành', className: 'in-progress' },
    [status.cancelled]: { label: 'Đã hủy', className: 'cancelled' },
    [status.pendingApproval]: { label: 'Chờ phê duyệt', className: 'pending-approval' },
    [status.pendingSchedule]: { label: 'Pending Schedule', className: 'pending-schedule' },
    [status.deny]: { label: 'Từ chối thẩm định', className: 'deny' },
    [status.pendingReview]: { label: 'Chờ thẩm định', className: 'waiting-appraisal' },
    [status.reOpen]: { label: 'Mở lại', className: 're-open' },
    [status.closed]: { label: 'Đóng', className: 'closed' },
}

const complexityColorMapping = {
    Low: {className: 'low'},
    Medium: {className: 'medium'},
    High: {className: 'high'}
}

const criticalityColorMapping = {
    Critical: {className: 'critical'},
    NoCritical: {className: 'no-critical'}
}

const reviewColorMapping = {
    0: {label: 'Không đạt', className: 'fail'},
    1: {label: 'Đạt', className: 'ok'},
    2: {label: 'Vượt trội', className: 'outstanding'}
}

const myProjectPageKey = 'my-project'
const ILoveVinGroupSite = 0

export { status, statusStyleMapping, myProjectPageKey, levelColorMapping, complexityColorMapping, criticalityColorMapping, reviewColorMapping, ILoveVinGroupSite }
