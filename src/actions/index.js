//vuongvt- actions only describe what happended

export function updatePersonalDataAction(payload) {
    return actionCreator(actionNames.UPDATE_PERSONAL_DATA, payload);
}

export function updateNewEducationAction(payload) {
    return actionCreator(actionNames.UPDATE_NEW_EDUCATION, payload);
}

export function updateEducationAction(payload) {
    return actionCreator(actionNames.UPDATE_EDUCATION, payload);
}

export function updateInformationDataAction(payload) {
    return actionCreator(actionNames.UPDATE_INFORMATION_DATA, payload);
}

export function updateSchoolDataAction(payload) {
    return actionCreator(actionNames.UPDATE_SCHOOL, payload);
}

export function updateProvinceAction(payload) {
    return actionCreator(actionNames.UPDATE_PROVINCE, payload);
}

export function updateSapDataAddressAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_ADDRESS, payload);
}

export function updateSapDataInformationAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_INFORMATION, payload);
}

export function updateSapDataBankAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_BANK, payload);
}

export function updateSapDataContactAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_CONTACT, payload);
}

export function updateSapDataDocumentAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_DOCUMENT, payload);
}

export function updateSapDataRaceAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_RACE, payload);
}

export function updateSapDataEducationAction(payload) {
    return actionCreator(actionNames.UPDATE_SAPDATA_EDUCATION, payload);
}

function actionCreator(type, payload) {
    return {
        type: type,
        payload: payload
    }
}

export const actionNames = {
    UPDATE_PERSONAL_DATA: 'UPDATEPERSONALDATA',
    UPDATE_NEW_EDUCATION: 'UPDATENEWEDUCATION',
    UPDATE_INFORMATION_DATA: 'UPDATEINFORMATIONDATA',
    UPDATE_PROVINCE: 'UPDATEPROVINCE',
    UPDATE_EDUCATION: 'UPDATEEDUCATION',
    UPDATE_SCHOOL: 'UPDATESCHOOL'
};