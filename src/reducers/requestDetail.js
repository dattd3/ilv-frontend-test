import { actionNames } from '../actions';

//vuongvt - reducers specify how the application's state changes in response to action sent to the store

export default (state, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case actionNames.UPDATE_PERSONAL_DATA:
            return {
                ...state,
                information: { ...state.information, ...action.payload.information },
                education: action.payload.education,
                newEducation: action.payload.newEducation
            }
        case actionNames.UPDATE_NEW_EDUCATION:
            return {
                ...state,
                newEducation: action.payload.newEducation
            }

        case actionNames.UPDATE_EDUCATION:
            return {
                ...state,
                education: action.payload.education
            }

        case actionNames.UPDATE_INFORMATION_DATA:
            return {
                ...state,
                information: { ...state.information, ...action.payload }
            };

        case actionNames.UPDATE_PROVINCE:
            return {
                ...state,
                provinces: [...state.provinces, ...action.payload.provinces]
            }

        case actionNames.UPDATE_SCHOOL:
            return {
                ...state,
                schools: action.payload.schools
            }

        default: return state;
    }
}

const initialState = {
    information: {
        isAddressEdit: false,
        isTmpAddressEdit: false
    },
    education: [],
    newEducation: [],
    provinces: [],
    schools: [],
};