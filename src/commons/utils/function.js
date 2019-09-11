
export const setLoginLocalStorage = (obj) => {
    if (obj[constants.AuthenKey])
        localStorage.setItem(constants.AuthenKey, obj[constants.AuthenKey]);
    if (obj[constants.RefreshToken])
        localStorage.setItem(constants.RefreshToken, obj[constants.RefreshToken]);
    if (obj[constants.Email])
        localStorage.setItem(constants.Email, obj[constants.Email]);
    if (obj[constants.CurrentUserId])
        localStorage.setItem(constants.CurrentUserId, obj[constants.CurrentUserId]);
    if (obj[constants.TokenExpiration])
        localStorage.setItem(constants.TokenExpiration, obj[constants.TokenExpiration]);
};