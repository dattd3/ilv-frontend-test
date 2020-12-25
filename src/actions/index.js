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