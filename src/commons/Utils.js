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
    return (value === null || value === undefined || value === "" || value === "#" || value === "null") ? "" : value?.toString()?.trim()
}

const formatStringDateTimeByMuleValue = value => {
    return (value === null || value === undefined || value === "" || value === "#" || value === "000000" || value === "00000000") ? "" : value.trim()
}

const formatStringDateByMuleValue = value => {
    return (value === null || value === undefined || value === "" || value === "#" || value === "00000000") ? "" : value.trim()
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

const checkOffset = (canvas, canvasWidth, canvasHeight, heightLeft, needOffset) => {
    if(!needOffset) return 0;
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

const exportToPDF = (elementViewById, fileName, needOffset = true) => {
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
        let offset = checkOffset(canvas, canvasWidth, canvasHeight, heightLeft - pageHeight, needOffset);
        doc.addImage(image, 'JPEG', marginX, position + offset, canvasWidth, canvasHeight)
        heightLeft -= pageHeight;
        heightLeft += offset;

        while (heightLeft >= 0) {
            position = heightLeft - canvasHeight + 1;
            doc.addPage();
            if (heightLeft < pageHeight) {
                offset = 0;
            } else {
                offset = checkOffset(canvas, canvasWidth, canvasHeight, heightLeft - pageHeight, needOffset);
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
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1, Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinFast, 
                Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinAI, Constants.pnlVCode.VinHome]
            break
        case Constants.listFunctionsForPnLACL.editProfile:
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, 
                Constants.pnlVCode.VinITIS, Constants.pnlVCode.VinUni, Constants.pnlVCode.Vin3S, Constants.pnlVCode.VinAI, Constants.pnlVCode.VinES, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinSchool]
            break
        case Constants.listFunctionsForPnLACL.editEducation:
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, 
                Constants.pnlVCode.VinITIS, Constants.pnlVCode.VinUni, Constants.pnlVCode.Vin3S, Constants.pnlVCode.VinAI, Constants.pnlVCode.VinES, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinSchool]
            break
        case Constants.listFunctionsForPnLACL.editRelationship:
            listPnLAccepted = [Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinITIS, Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1,
                Constants.pnlVCode.VinUni, Constants.pnlVCode.Vin3S, Constants.pnlVCode.VinAI, Constants.pnlVCode.VinES, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, 'V096', Constants.pnlVCode.VinSchool]
            break
        case Constants.listFunctionsForPnLACL.changeStaffShift:
            listPnLAccepted = [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading]
            break
        case Constants.listFunctionsForPnLACL.selectWorkingShift24h:
            listPnLAccepted = [Constants.pnlVCode.VinMec]
            break
        case Constants.listFunctionsForPnLACL.foreignSickLeave:
            listPnLAccepted = [Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinES]
            break
    }

    return listPnLAccepted.includes(companyCode)
}

const getValueParamByQueryString = (queryString, key) => {
    // const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const value = params.get(key)
    return value
}

const calculateBackDateByPnLVCodeAndFormatType = (orgLv2Id, formatType) => {
    try {
        const orgLv2IdDayMapping = {
            [Constants.ORG_ID_VINPEARL]: 1,
            [Constants.ORG_ID_VINPEARL_MELIA]: 1,
        }
        if (!orgLv2IdDayMapping[orgLv2Id]) {
            return null
        }
        const date = moment().subtract(orgLv2IdDayMapping[orgLv2Id], 'days').format(formatType)

        return date
    } catch (e) {
        return null
    }
}

const isEnableShiftChangeFunctionByPnLVCode = PnLVCode => {
    return ![Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinSmart, Constants.pnlVCode.VinSchool].includes(PnLVCode) ? true : false
}

const isEnableInOutTimeUpdateFunctionByPnLVCode = PnLVCode => {
    return ![Constants.pnlVCode.VinSchool, Constants.pnlVCode.VinAI].includes(PnLVCode) ? true : false
}

const isEnableOTFunctionByPnLVCode = PnLVCode => {
  return [Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading].includes(PnLVCode);
}

const getRequestTypeIdsAllowedToReApproval = () => {
    return [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.OT_REQUEST, Constants.UPDATE_PROFILE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET, Constants.WELFARE_REFUND]
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

function parsteStringToHtml(arrHtml) {
    try {
        let htmlReturn = '';
        JSON.parse(arrHtml).forEach(objHtml => {
            if (objHtml.Text === '\r\n' || objHtml.Text === '\n') {
                htmlReturn += '<br />'
            } else {
                let objCss = '';
                if (objHtml.B) objCss += `font-weight: bold;`
                if (objHtml.U) objCss += `text-decoration: underline;`
                if (objHtml.I) objCss += `font-style: italic;`
                htmlReturn += `<span style="${objCss}">${objHtml.Text}</span>`
            }
        })
        return htmlReturn;
    } catch (e) {
        return arrHtml
    }
}

const isValidDateRequest = date => {
    const userLoggedCompanyCode = localStorage.getItem('companyCode')
    if ([Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1].includes(userLoggedCompanyCode)) {
        const timeline = 17
        const currentTime = moment().hour()
        const currentDate = moment().format("DD/MM/YYYY")
        const range = moment(currentDate, 'DD/MM/YYYY').diff(moment(date, 'DD/MM/YYYY'), 'days')
        if (currentTime < timeline) {
            if (range > 1) {
                return false
            }
        } else {
            if (range > 0) {
                return false
            }
        }
    }

    return true
}

const getRegistrationMinDateByConditions = () => {
    const userLoggedOrgLv2Id = localStorage.getItem('organizationLv2')
    let firstDay = null
    if ([Constants.ORG_ID_VINPEARL, Constants.ORG_ID_VINPEARL_MELIA].includes(userLoggedOrgLv2Id)) {
        // let indexWednesdayInWeek = 3
        // let indexCurrentDayInWeek = moment().day()
        // firstDay = moment().startOf('week').isoWeekday(1) // Từ thứ 4 trở đi của tuần hiện tại đến cuối tuần hiện tại thì sẽ lấy ngày đầu tiên của tuần hiện tại
        // if (indexCurrentDayInWeek <= indexWednesdayInWeek) { // Từ thứ 4 trở về trước thì sẽ lấy ngày đầu tiên của tuần trước đó
        //     firstDay = moment().subtract(1, 'weeks').startOf('week').isoWeekday(1)
        // }

        const timeline = 17
        const currentTime = moment().hour()
        if (currentTime < timeline) {
            firstDay = moment().subtract(1, "days")
        } else {
            firstDay = moment()
        }
    }

    return firstDay
}

const isVinFast = () => {
    const companyCode = localStorage.getItem("companyCode")
    return [Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading].includes(companyCode)
}

const getCurrentLanguage = () => {
    const languageKeyMapping = {
        [Constants.LANGUAGE_EN]: 'en',
        [Constants.LANGUAGE_VI]: 'vi'
    }
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI;
    return languageKeyMapping[[locale]];
}

const getResignResonsMasterData = () => {
    const masterData = [
        {
            "code01": "ZG",
            "code02": "GA",
            "text": "Do cá nhân/gia đình",
            "text_en": "Personal/family matters"
        },
        {
            "code01": "ZG",
            "code02": "GB",
            "text": "Do sức khỏe",
            "text_en": "Health matters"
        },
        {
            "code01": "ZG",
            "code02": "GC",
            "text": "Do thời gian làm việc",
            "text_en": "Working schedule"
        },
        {
            "code01": "ZG",
            "code02": "GD",
            "text": "Do thu nhập",
            "text_en": "Income matters"
        },
        {
            "code01": "ZG",
            "code02": "GE",
            "text": "Do có công việc khác",
            "text_en": "Have other jobs"
        },
        {
            "code01": "ZG",
            "code02": "GF",
            "text": "Do không phù hợp với công việc",
            "text_en": "Jobs not suitable"
        },
        {
            "code01": "ZG",
            "code02": "GG",
            "text": "Không phù hợp với môi trường",
            "text_en": "Environments not suitable"
        },
        {
            "code01": "ZG",
            "code02": "GH",
            "text": "Do không phù hợp với lãnh đạo",
            "text_en": "Manager matters"
        },
        {
            "code01": "ZG",
            "code02": "GI",
            "text": "Chấm dứt t.việc/h.việc-NV nghỉ",
            "text_en": "Chấm dứt t.việc/h.việc-NV nghỉ"
        },
        {
            "code01": "ZG",
            "code02": "GJ",
            "text": "Nghỉ hưu",
            "text_en": "Retire"
        },
        {
            "code01": "ZG",
            "code02": "GK",
            "text": "Hết hạn HĐLĐ-NV không gia hạn",
            "text_en": "Contract expired - Employee don't want to renew contract"
        },
        {
            "code01": "ZG",
            "code02": "GL",
            "text": "Nghỉ do đang nghỉ thai sản",
            "text_en": "Nghỉ do đang nghỉ thai sản"
        },
        {
            "code01": "ZG",
            "code02": "GM",
            "text": "Nghỉ do đang nghỉ ốm đau",
            "text_en": "Nghỉ do đang nghỉ ốm đau"
        },
        {
            "code01": "ZG",
            "code02": "GN",
            "text": "Nghỉ do đang nghỉ không lương",
            "text_en": "Nghỉ do đang nghỉ không lương"
        },
        {
            "code01": "ZG",
            "code02": "GO",
            "text": "Nghỉ do chết",
            "text_en": "Nghỉ do chết"
        },
        {
            "code01": "ZG",
            "code02": "GP",
            "text": "Đ.phương chấm dứt HĐLĐ trái PL",
            "text_en": "Employee unilateral termination of the labor contract illegally"
        },
        {
            "code01": "ZH",
            "code02": "HA",
            "text": "Không đạt HĐ thử việc/học việc",
            "text_en": "Fail probationary/apprenticeship contract"
        },
        {
            "code01": "ZH",
            "code02": "HB",
            "text": "Không gia hạn hợp đồng lao động",
            "text_en": "Not extend contract"
        },
        {
            "code01": "ZH",
            "code02": "HC",
            "text": "Sa thải",
            "text_en": "Dismissal"
        },
        {
            "code01": "ZH",
            "code02": "HD",
            "text": "Tái cơ cấu/Giải thể",
            "text_en": "Restructuring/dissolution"
        },
        {
            "code01": "ZH",
            "code02": "HE",
            "text": "Tự ý bỏ việc 5 ngày liên tục",
            "text_en": "Off 5 days without permit"
        },
        {
            "code01": "ZH",
            "code02": "HF",
            "text": "Người lao động thường xuyên không hoàn thành công việc",
            "text_en": "Work performance"
        },
        {
            "code01": "ZH",
            "code02": "HG",
            "text": "Khác",
            "text_en": "Other"
        }
    ];
    let result = {};
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI;
    masterData.map(item => {
        result[item.code02] = locale == Constants.LANGUAGE_VI ? item.text : item.text_en;
    });
    return result;
}

const genderConfig = () => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const isVietnamese = locale === Constants.LANGUAGE_VI
    return {
        male: isVietnamese ? 'Nam' : 'Male',
        female: isVietnamese ? 'Nữ' : 'Female',
    }
}

const marriageConfig = () => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const isVietnamese = locale === Constants.LANGUAGE_VI
    return {
        single: isVietnamese ? 'Đ.thân' : 'Single',
        married: isVietnamese ? 'K.hôn' : 'Married',
        divorced: isVietnamese ? 'Ly hôn' : 'Divorced',
    }
}

function setURLSearchParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({ path: url.href }, '', url.href);
}

const getCulture = () => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    return locale === Constants.LANGUAGE_VI ? "vi" : "en";
}

const formatProcessTime = (time) => {
  if (time === "0001-01-01T00:00:00" || !time) return ""
  return `${moment(time).format("DD/MM/YYYY")} | ${moment(time).format("HH:mm:ss")}`
}

const prepareOrganization = (level3Text = '', level4Text = '', level5Text = '', level6Text = '') => {
    let result = ''
    switch (true) {
        case formatStringByMuleValue(level3Text) !== '' && formatStringByMuleValue(level4Text) !== '' && formatStringByMuleValue(level5Text) !== '' && formatStringByMuleValue(level6Text) !== '':
            result = `${formatStringByMuleValue(level3Text)}/${formatStringByMuleValue(level4Text)}/${formatStringByMuleValue(level5Text)}/${formatStringByMuleValue(level6Text)}`
            break;
        case formatStringByMuleValue(level3Text) !== '' && formatStringByMuleValue(level4Text) !== '' && formatStringByMuleValue(level5Text) !== '':
            result = `${formatStringByMuleValue(level3Text)}/${formatStringByMuleValue(level4Text)}/${formatStringByMuleValue(level5Text)}`
            break;
        case formatStringByMuleValue(level3Text) !== '' && formatStringByMuleValue(level4Text) !== '':
            result = `${formatStringByMuleValue(level3Text)}/${formatStringByMuleValue(level4Text)}`
            break;
    }
    return result
}

const getRequestTypesList = (category = 1, isRequestTab = false) => {
  if (category == 1 && isRequestTab) {
    return Object.keys(Constants.REQUEST_CATEGORY_1_LIST)?.filter(key => key != Constants.ONBOARDING)
  }
  return Object.keys(category == 1 ? Constants.REQUEST_CATEGORY_1_LIST : Constants.REQUEST_CATEGORY_2_LIST)
}

const isExistCurrentUserInWhiteList = () => {
    const currentUserEmail = localStorage.getItem('email')?.toLowerCase()
    const whiteListAccessToSystem = process.env.REACT_APP_ENVIRONMENT === "PRODUCTION"
    ? [
        "vuongvt2@vingroup.net",
        "thuypx2@vingroup.net",
        "chiendv4@vingroup.net",
        "minhkv1@vingroup.net",
        "tammt9@vingroup.net",
        "hoalp2@vingroup.net",
        "chiennd4@vingroup.net",
        "dattd3@vingroup.net",
        "datth3@vingroup.net",
        "hieunm25@vingroup.net",
        "loint8@vingroup.net",
        "sonlt5@vingroup.net",
    ]
    : ["hrms_test1@vingroup.net"]
    return whiteListAccessToSystem?.includes(currentUserEmail)
}

const isVinITIS = () => {
    const companyCode = localStorage.getItem("companyCode")
    return Constants.pnlVCode.VinITIS === companyCode
}

const formatNumberSpecialCase = (val) => {
    if (val === "" || val === null || val === undefined) {
      return "";
    }
    val = val + "";
    const temp = val?.replaceAll(" ", "");
    return temp.replace(/./g, (c, i, a) => {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? " " + c : c;
    });
};

const formatInternalNewsData = (data = [], currentLang = "vi") => {
  return data.map(item => formatInternalNewsDataItem(item, currentLang));
};

const formatInternalNewsDataItem = (item, currentLang = "vi") => {
  return {
    ...item,
    thumbnail: currentLang === "vi" ? item.thumbnailVi : item.thumbnailEn,
    title: currentLang === "vi" ? item.titleVi : item.titleEn,
    description: currentLang === "vi" ? item.descriptionVi : item.descriptionEn,
    content: currentLang === "vi" ? item.contentVi : item.contentEn,
  }
}

const getPublishedTimeByRawTime = (rawTime) => {
  const time = moment(rawTime).isValid() ? moment(rawTime) : null;
  return {
    time: time?.format("HH:mm") || "",
    date: time?.format("DD/MM/YYYY") || "",
  };
};

export {
    getRequestConfigurations, removeAccents, formatStringByMuleValue, formatNumberInteger, exportToPDF, isEnableFunctionByFunctionName, getValueParamByQueryString, getDateByRangeAndFormat,
    calculateBackDateByPnLVCodeAndFormatType, isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode, getRequestTypeIdsAllowedToReApproval, getMuleSoftHeaderConfigurations,
    isAdjacentDateBy2Date, showRangeDateGroupByArrayDate, generateTaskCodeByCode, parsteStringToHtml, getRegistrationMinDateByConditions, isVinFast, isEnableOTFunctionByPnLVCode, getCurrentLanguage, 
    getResignResonsMasterData, formatStringDateTimeByMuleValue, genderConfig, marriageConfig, formatProcessTime, setURLSearchParam, getCulture, isValidDateRequest, prepareOrganization, getRequestTypesList,
    formatStringDateByMuleValue, isExistCurrentUserInWhiteList, isVinITIS, formatNumberSpecialCase, formatInternalNewsData, getPublishedTimeByRawTime, formatInternalNewsDataItem
}
