import { actionNames } from '../actions/index'

export default (state, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case actionNames.FULL_SCREEN:
            return {
                ...state,
                isFullScreen: action?.payload
            }
    
        default: return state
    }
}

const initialState = {
    isFullScreen: false,
}
