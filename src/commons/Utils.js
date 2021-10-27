import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import moment from 'moment'
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

const exportToPDF = (elementViewById, fileName) => {
    const quality = 1.0
    const paperSize = 'a4'
    const totalEdgeDistance = 20

    html2canvas(elementViewById).then(canvas => {
        const image = canvas.toDataURL('image/jpeg', quality)
        const doc = new jsPDF('p', 'px', paperSize)
        const pageWidth = doc.internal.pageSize.getWidth() - totalEdgeDistance
        const pageHeight = doc.internal.pageSize.getHeight() - totalEdgeDistance
        // const pageWidth = doc.internal.pageSize.getWidth()
        // const pageHeight = doc.internal.pageSize.getHeight() 

        const widthRatio = pageWidth / canvas.width
        const heightRatio = pageHeight / canvas.height
        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio

        const canvasWidth = canvas.width * ratio
        const canvasHeight = canvas.height * ratio

        const marginX = totalEdgeDistance / 2
        const marginY = totalEdgeDistance / 2
        // const marginX = (pageWidth - canvasWidth) / 2
        // const marginY = (pageHeight - canvasHeight) / 2
        
        doc.addImage(image, 'JPEG', marginX, marginY, canvasWidth, canvasHeight)
        doc.save(`${fileName}.pdf`)
    })
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

const getValueParamByQueryString = (queryString, key) => {
    // const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const date = params.get(key)
    return date
}

const calculateBackDateByPnLVCodeAndFormatType = (pnlVCode, formatType) => {
    try {
        const PnLVCodeDayMapping = {
            [Constants.pnlVCode.VinPearl]: 1
        }
        if (!PnLVCodeDayMapping[pnlVCode]) {
            return null
        }
        const date = moment().subtract(PnLVCodeDayMapping[pnlVCode], 'days').format(formatType)

        return date
    } catch (e) {
        return null
    }
}

const isEnableShiftChangeFunctionByPnLVCode = PnLVCode => {
    return ![Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VinSchool].includes(PnLVCode) ? true : false
}

const isEnableInOutTimeUpdateFunctionByPnLVCode = PnLVCode => {
    return ![Constants.pnlVCode.VinSchool].includes(PnLVCode) ? true : false
}

const getRequestTypeIdsAllowedToReApproval = () => {
    return [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE]
}

export { getRequestConfigurations, removeAccents, formatStringByMuleValue, formatNumberInteger, exportToPDF, isEnableFunctionByFunctionName, getValueParamByQueryString, 
    calculateBackDateByPnLVCodeAndFormatType, isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode, getRequestTypeIdsAllowedToReApproval }
