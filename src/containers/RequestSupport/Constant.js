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

export { status, feedBackLine }
