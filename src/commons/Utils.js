import Constants from '../commons/Constants'

const getRequestConfigurations = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }
}

const removeAccents = value => {
    if (value === "" || value == null || value == undefined) {
        return ""
    }

    const accentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ]

    for (let i = 0; i < accentsMap.length; i++) {
        var result = new RegExp('[' + accentsMap[i].substr(1) + ']', 'g')
        var char = accentsMap[i][0]
        value = value.replace(result, char)
    }

    return value
}

const formatStringByMuleValue = value => {
    return (value === null || value === undefined || value === "" || value === "#") ? "" : value.trim()
}

const formatNumberInteger = value => {
    if (isNaN(value)) {
        return 0
    }
    const number = parseInt(value)
    if (number < 10) {
        return `0${number}`
    }
    return number.toString()
}

const isEnableFunctionByFunctionName = name => {
    const companyCode = localStorage.getItem("companyCode")
    let listPnLAccepted = []
    
    switch (name) {
        case Constants.listFunctionsForPnLACL.qnA:
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail]
            break
        case Constants.listFunctionsForPnLACL.editProfile:
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VincomRetail]
            break
    
    }

    return listPnLAccepted.includes(companyCode)
}

export { getRequestConfigurations, removeAccents, formatStringByMuleValue, formatNumberInteger, isEnableFunctionByFunctionName }
