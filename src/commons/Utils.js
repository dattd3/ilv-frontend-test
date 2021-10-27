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
    const totalEdgeDistance = 10

    html2canvas(elementViewById, {
        allowTaint: true,
        width: elementViewById.clientWidth,
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

export {
    getRequestConfigurations, removeAccents, formatStringByMuleValue, formatNumberInteger, exportToPDF, isEnableFunctionByFunctionName, getValueParamByQueryString,
    calculateBackDateByPnLVCodeAndFormatType, isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode
}
