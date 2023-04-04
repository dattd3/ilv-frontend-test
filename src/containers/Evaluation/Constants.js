const evaluationStatus = {
    initialization: 1,
    launch: 2,
    selfAssessment: 3,
    qlttAssessment: 4,
    cbldApproved: 5,
}
const actionButton = {
    save: 1,
    approve: 2,
    reject: 3
}

const formType = {
    MANAGER: 'LD',
    EMPLOYEE: 'NV',
}

const groupConfig = {
    ATTITUDE: 'G1',
    WORKING_PERFORMANCE_RESULT: 'G2',
}

const formulaConfig = {
    CT1: 'VINBUS_CT1',
    CT2: 'VINBUS_CT2',
    CT3: 'VINBUS_CT3',
    CT4: 'VINBUS_CT4',
}

export { evaluationStatus, actionButton, formType, groupConfig, formulaConfig }