import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
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

export { getRequestConfigurations, removeAccents, formatStringByMuleValue, formatNumberInteger, exportToPDF }
