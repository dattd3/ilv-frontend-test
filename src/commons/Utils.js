import Constants from '../commons/Constants'

const getRequestConfigurations = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }
}

export { getRequestConfigurations }
