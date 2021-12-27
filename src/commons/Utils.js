import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import moment from 'moment'
import Constants from '../commons/Constants'

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

const checkOffset = (canvas, canvasWidth, canvasHeight, heightLeft,) => {
    var image1 = new Image();
    var context = canvas.getContext('2d');
    context.drawImage(image1, 0, 0);
    const heightCutting = canvas.width / canvasWidth
    const heightCount = heightCutting * 20;
    const startHeight = Math.ceil(-1 * (heightLeft - canvasHeight + heightCount) * heightCutting);
    var imageData = context.getImageData(0, startHeight, canvas.width, Math.floor(heightCutting * heightCount));

    let result = heightCount + 1;
    for (let line = heightCount; line > 0; line--) {
        let count = 0;
        if (result != heightCount + 1)
            continue;
        for (let y = Math.floor(line * heightCutting); y > Math.floor((line - 1) * heightCutting); y--) {
            for (let x = 0; x < imageData.width; x++) {
                let index = (y * imageData.width + x) * 4;

                count += imageData.data[index] == 0 ? 1 : 0
                count += imageData.data[index + 1] == 0 ? 1 : 0
                count += imageData.data[index + 2] == 0 ? 1 : 0

            }
        }
        if (count < 10) {
            result = line;
        }
    }
    return heightCount - result;
    //return 0;

}

const exportToPDF = (elementViewById, fileName) => {
    // const elementView = document.getElementById('frame-for-export')
    // const ratio = elementViewById.clientHeight / elementViewById.clientWidth
    const totalEdgeDistance = 14

    html2canvas(elementViewById, {
        allowTaint: true,
        width: elementViewById.clientWidth + 18,
        height: elementViewById.clientHeight,
        windowWidth: window.innerWidth,//elementViewById.clientWidth, 
        windowHeight: window.innerHeight,//elementViewById.clientHeight,

        scale: 3
    }).then(canvas => {
        var position = 0;
        const image = canvas.toDataURL('image/jpeg')

        // const doc = new jsPDF('p', 'px', 'a2')
        const doc = new jsPDF('p', 'px', 'a4')

        const pageWidth = doc.internal.pageSize.getWidth() - totalEdgeDistance
        const pageHeight = doc.internal.pageSize.getHeight()

        const widthRatio = pageWidth / canvas.width
        const heightRatio = pageHeight / canvas.height
        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio

        const canvasWidth = pageWidth
        const canvasHeight = canvas.height * canvasWidth / canvas.width;
        var heightLeft = canvasHeight;

        const marginX = totalEdgeDistance / 2
        const marginY = (pageHeight - canvasHeight) / 2
        let offset = checkOffset(canvas, canvasWidth, canvasHeight, heightLeft - pageHeight);
        doc.addImage(image, 'JPEG', marginX, position + offset, canvasWidth, canvasHeight)
        heightLeft -= pageHeight;
        heightLeft += offset;

        while (heightLeft >= 0) {
            position = heightLeft - canvasHeight + 1;
            doc.addPage();
            if (heightLeft < pageHeight) {
                offset = 0;
            } else {
                offset = checkOffset(canvas, canvasWidth, canvasHeight, heightLeft - pageHeight);
            }
            doc.addImage(image, 'JPEG', marginX, position + offset, canvasWidth, canvasHeight)
            heightLeft -= pageHeight;
            heightLeft += offset;
        }
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
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinITIS, Constants.pnlVCode.VinUni]
            break
        case Constants.listFunctionsForPnLACL.editEducation:
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinITIS, Constants.pnlVCode.VinUni]
            break
        case Constants.listFunctionsForPnLACL.editRelationship:
            listPnLAccepted = [Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinITIS, Constants.pnlVCode.VinPearl, Constants.pnlVCode.VinUni]
            break
        case Constants.listFunctionsForPnLACL.changeStaffShift:
            listPnLAccepted = [Constants.pnlVCode.VinPearl]
            break
        case Constants.listFunctionsForPnLACL.selectWorkingShift24h:
            listPnLAccepted = [Constants.pnlVCode.VinMec]
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
    return ![Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VinSchool, Constants.pnlVCode.Vin3S].includes(PnLVCode) ? true : false
}

const isEnableInOutTimeUpdateFunctionByPnLVCode = PnLVCode => {
    return ![Constants.pnlVCode.VinSchool].includes(PnLVCode) ? true : false
}

const getRequestTypeIdsAllowedToReApproval = () => {
    return [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE]
}

const getRequestConfigurations = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }
}

const getMuleSoftHeaderConfigurations = () => {
    const requestConfigurations = getRequestConfigurations()
    requestConfigurations.headers['client_id'] = process.env.REACT_APP_MULE_CLIENT_ID
    requestConfigurations.headers['client_secret'] = process.env.REACT_APP_MULE_CLIENT_SECRET
    
    return requestConfigurations
}

const getDateByRangeAndFormat = (startDate, endDate, format) => {
    if (startDate && endDate) {
        let start = moment(startDate, format)
        let end = moment(endDate, format)
        let now = start.clone(), dates = []
        while (now.isSameOrBefore(end)) {
            dates.push(now.format(format))
            now.add(1, 'days')
        }
        return dates
    }
    return []
}

// Check is adjacent date by 2 date (for format DD/MM/YY)
const isAdjacentDateBy2Date = (start, end) => {
    const startToCompare = moment(start, 'DD/MM/YYYY')
    if (startToCompare.add(1, 'days').format('DD/MM/YYYY') == end) {
        return true
    }
    return false
}

// Show range date as string group by date array. Ex: ['10/10/2021', '12/10/2021', '13/10/2021', '14/10/2021', '16/10/2021'] => return 10/10/2021, 12/10/2021 - 14/10/2021, 16/10/2021
// Apply for format DD/MM/YYYY
const showRangeDateGroupByArrayDate = (arrayDate) => {
    const dateSorted = arrayDate && arrayDate.length > 0 ?  [...new Set(arrayDate)].sort((pre, next) => moment(pre, 'DD/MM/YYYY') - moment(next, 'DD/MM/YYYY')) : []
    if (dateSorted.length === 0) {
        return ""
    }
    let rangeDate = []
    let result = []
    for (let i = 0; i < dateSorted.length; i++) {
        let item = dateSorted[i]
        if (i === 0) {
            if (isAdjacentDateBy2Date(item, dateSorted[i + 1])) {
                rangeDate[0] = item
                rangeDate[1] = dateSorted[i + 1]
            } else {
                result = result.concat(item)
                rangeDate[0] = null
                rangeDate[1] = dateSorted[i + 1]
            }
            i = i + 1
            if (i === dateSorted.length - 1) {
                result = result.concat([[...rangeDate]])
            }
        } else {
            if (isAdjacentDateBy2Date(rangeDate[1], item)) {
                if (rangeDate[0] == null) {
                    rangeDate[0] = rangeDate[1]
                }
                rangeDate[1] = item
                if (i === dateSorted.length - 1) {
                    if (rangeDate[0]) {
                        result = result.concat([[...rangeDate]])
                    } else {
                        result = result.concat(rangeDate[1])
                    }
                }
            } else {
                if (rangeDate[0]) {
                    result = result.concat([[...rangeDate]])
                } else {
                    result = result.concat(rangeDate[1])
                }
                rangeDate = [null, item]
                if (i === dateSorted.length - 1) {
                    result = result.concat(item)
                }
            }
        }
    }

    return result.reduce((initial, item, index) => {
        if (Array.isArray(item)) {
            if (index === 0) {
                initial = initial.concat(item.join(" - "))
            } else {
                initial = initial.concat(", <br>", item.join(" - "))
            }
        } else {
            if (index === 0) {
                initial = initial.concat(item)
            } else {
                initial = initial.concat(", <br>", item)
            }
        }
        return initial
    }, "")
}

const generateTaskCodeByCode = code => {
    if (code > 0 && code < 10) {
        return "0000" + code
    } else if (code >= 10 && code < 100) {
        return "000" + code
    } else if (code >= 100 && code < 1000) {
        return "00" + code
    } else if (code >= 1000 && code < 10000) {
        return "0" + code
    } else {
        return code
    }
}

export { getRequestConfigurations, removeAccents, formatStringByMuleValue, formatNumberInteger, exportToPDF, isEnableFunctionByFunctionName, getValueParamByQueryString, getDateByRangeAndFormat,
    calculateBackDateByPnLVCodeAndFormatType, isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode, getRequestTypeIdsAllowedToReApproval, getMuleSoftHeaderConfigurations, 
    isAdjacentDateBy2Date, showRangeDateGroupByArrayDate, generateTaskCodeByCode }
