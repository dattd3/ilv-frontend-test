import IconMailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconMailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconMailCyan from 'assets/img/icon/ic_mail-cyan.svg'

const status = {
    new: 1,
    processing: 2,
    paused: 3,
    cancelled: 4,
    processed: 5,
    closed: 6,
    reopen: 7,
}

const feedBackLine = {
    requester: 0,
    receiveInformationTogether: 1,
    sameGroup: 2,
}

const tabConfig = {
    createdReceiving: 'created-receiving',
    processing: 'processing',
}

const groupUsersConfig = {
    sameGroup: { label: 'Kĩ thuật viên', icon: IconMailGreen },
    receiveInformationTogether: { label: 'Người nhận thông tin', icon: IconMailBlue },
    requester: { label: 'Người yêu cầu', icon: IconMailCyan },
}

const typeColorMapping = {
    urgent: "#FF0014",
    high: "#FF5370",
    medium: "#FF7F00",
    low: "#C2C2C2",
}

export { status, feedBackLine, tabConfig, groupUsersConfig, typeColorMapping }
