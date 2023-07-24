import Constants from "commons/Constants"

const evaluationStatus = {
    initialization: 1,
    launch: 2,
    selfAssessment: 3,
    qlttAssessment: 4,
    cbldApproved: 5,
}
const evaluation360Status = {
    waitingEvaluation: 3,
    evaluated: 4,
    completed: 5,
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
const processStep = {
    zeroLevel: '0NF',
    oneLevel: '1NF',
    twoLevels: '2NF',
    level360: '360NF',
}
const languageCodeMapping = {
    [Constants.LANGUAGE_VI]: 'vi',
    [Constants.LANGUAGE_EN]: 'en',
}
const stepEvaluation360Config = [
    { value: evaluation360Status.waitingEvaluation, label: "WaitingForEvaluation" },
    { value: evaluation360Status.evaluated, label: "Feedbacked" },
    { value: evaluation360Status.completed, label: "Completed" },
]

export { evaluationStatus, evaluation360Status, actionButton, formType, groupConfig, formulaConfig, processStep, languageCodeMapping, stepEvaluation360Config }