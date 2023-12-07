
export const MATERNITY_REGIME = [ //Trường hợp hưởng chế độ thai sản
    { value: 'T1', label: 'Khám thai' },
    { value: 'T2', label: 'Sẩy thai, nạo hút thai, thai chết lưu hoặc phá thai bệnh lý' },
    { value: 'T3', label: 'Kế hoạch hóa gia đình' },
    { value: 'T4.1', label: 'Sinh con thông thường' },
    { value: 'T4.2', label: 'Sinh con trong trường hợp mẹ phải nghỉ dưỡng thai' },
    { value: 'T6.1', label: 'Con chết sau sinh (Trường hợp mẹ sinh con)' },
    { value: 'T6.2', label: 'Con chết sau sinh (Trường hợp lao động nữ mang thai hộ)' },
    { value: 'T6.3', label: 'Con chết sau sinh (Trường hợp người mẹ nhờ mang thai hộ)' },
    { value: 'T7.1', label: 'Mẹ chết sau sinh/gặp rủi ro sau sinh (Trường hợp mẹ sinh con)' },
    { value: 'T7.2', label: 'Mẹ chết sau sinh/gặp rủi ro sau sinh (Trường hợp người mẹ nhờ mang thai hộ)' },
    { value: 'T8', label: 'Nhận nuôi con nuôi' },
    { value: 'T10', label: 'Lao động nữ mang thai hộ' },
    { value: 'T11', label: 'Người mẹ nhờ mang thai hộ' },
    { value: 'T12', label: 'Lao động nam nghỉ việc khi vợ sinh' },
    { value: 'T13', label: 'Lao động nam hưởng trợ cấp 1 lần khi vợ sinh con' }
];

export const YES_NO = [
    {value: '0', label: 'Không'},
    {value : '1',  label: 'Có'}
];

export const DECLARE_FORM_OPTIONS = [ //Danh mục hình thức phát sinh
    { value: 'P1', label: 'DS hưởng chế độ mới phát sinh' },
    { value: 'P2', label: 'DS đề nghị điều chỉnh số đã được giải quyết' }
];

export const SICK_PLAN = [ //Phương án Ốm đau
    { value: 'O1', label: 'Ốm thông thường' },
    { value: 'O2', label: 'Con ốm' },
    { value: 'O3', label: 'Ốm dài ngày' }
];

export const MATERNITY_PLAN = [ //Phương án Thai sản
    { value: 'ST1', label: ' Thai dưới 5 tuần tuổi' },
    { value: 'ST2', label: 'Thai từ 5 tuần tuổi đến dưới 13 tuần tuổi' },
    { value: 'ST3', label: 'Trường hợp thai từ 13 tuần tuổi đến dưới 25 tuần tuổi' },
    { value: 'ST4', label: 'Thai từ 25 tuần tuổi trở lên' },
    { value: 'SC1', label: 'Trường hợp sinh con thông thường' },
    { value: 'SC2', label: 'Sinh đôi' },
    { value: 'SC3', label: 'Sinh từ 3 con trở lên' },
    { value: 'SC4', label: 'Sinh con trong trường hợp mẹ phải nghỉ dưỡng thai' },
    { value: 'CC1', label: 'Con dưới 2 tháng tuổi chết' },
    { value: 'CC2', label: 'Con từ 2 tháng tuổi trở lên chết' },
    { value: 'CC3', label: 'Sinh từ 02 con trở lên mà vẫn có con còn sống' },
    { value: 'SC4', label: 'Trường hợp sinh con phải phẫu thuật, sinh con dưới 32 tuần tuổi' },
    { value: 'SC5', label: 'Sinh đôi trở lên phải phẫu thuật' },
    { value: 'RR1', label: 'Trường hợp mẹ chết hoặc gặp rủi ro sau khi sinh' },
    { value: 'RR2', label: 'Trường hợp mẹ gặp rủi ro sau khi sinh' },
    { value: 'NCN1', label: 'Nhận nuôi 1 con' },
    { value: 'NCN2', label: 'Nhận nuôi từ 2 con trở lên' },
    { value: 'KNV', label: 'Trường hợp NLĐ nhận nuôi con nuôi nhưng không nghỉ việc/  Trường hợp người mẹ nhờ mang thai hộ không nghỉ việc' },
    { value: 'TT1', label: 'Tránh thai' },
    { value: 'TT2', label: 'Triệt sản' }
]; 

export const CONVALES_PLAN = [ //Phương án Dưỡng sức
    { value: 'D1', label: 'Dưỡng sức sau ốm' },
    { value: 'D101', label: 'Dưỡng sức ốm dài ngày' },
    { value: 'D102', label: 'Dưỡng sức sau phẫu thuật' },
    { value: 'D103', label: 'Dưỡng sức sau ốm khác' },
    { value: 'D201', label: 'Dưỡng sức sau sinh từ 2 con trở lên' },
    { value: 'D202', label: 'Dưỡng sức sau sinh phẫu thuật' },
    { value: 'D203', label: 'Dưỡng sức sau sinh khác' },
    { value: 'D204', label: 'Dưỡng sức sau sẩy, nạo, hút thai' },
    { value: 'D301', label: 'Suy giảm khả năng lao động tỉ lệ >= 51%' },
    { value: 'D302', label: 'Suy giảm khả năng lao động tỉ lệ từ 31% đến 50%' },
    { value: 'D303', label: 'Suy giảm khả năng lao động tỉ lệ từ 15% đến 30%' }
];

export const WORKING_CONDITION = [ //điều kiện làm việc
    { value: '1', label: 'Điều kiện bình thường' },
    { value: '2', label: 'Làm việc trong đk NNĐH' },
    { value: '3', label: 'Nơi có PCKV > 0.7' },
];

export const HOSPITAL_LINE = [ //tuyến bệnh viện
    { value: '1', label: 'Bệnh truyền nhiễm' },
    { value: '2', label: 'Bệnh xá các đơn vị LLVT' },
    { value: '3', label: 'BV quân khu, quân đoàn' },
    { value: '4', label: 'BV trực thuộc bộ, ngành' },
    { value: '5', label: 'Cơ sở KCB tư nhân' },
    { value: '6', label: 'Nội trú' },
    { value: '7', label: 'Phòng khám đa khoa khu vực' },
    { value: '8', label: 'Trạm y tế xã, phường, đơn vị' },
    { value: '9', label: 'Trung tâm y tế Quận, Huyện' },
    { value: '10', label: 'Trung ương' },
    { value: '11', label: 'Tuyến tỉnh' },
    { value: '12', label: 'Y tế cơ quan (không chuyên trách)' }
];

export const RECEIVE_TYPE = [ //hinh thức nhận
    { value: '1', label: 'Chi trả qua đơn vị' },
    { value: '2', label: 'Chi trả qua ATM' },
    { value: '3', label: 'BHXH thực hiện chi trả' },
    { value: '4', label: 'Đại diện chi thực hiện chi trả' }
];

export const MATERNITY_CONDITION = [ // điều kiện khám thai
    { value: '1', label: 'Thai bình thường' },
    { value: '2', label: 'Xa cơ sở y tế' },
    { value: '3', label: 'Thai có bệnh lý không bình thường' },
];

export const BIRTH_CONDITION = [ //điều kiện sinh
    { value: '1', label: 'Điều kiện bình thường' },
    { value: '2', label: 'Làm việc theo chế độ 3 ca' },
    { value: '3', label: 'Làm việc thường xuyên ở nơi có phụ cấp KV >0.7' },
    { value: '4', label: 'Nặng nhọc, độc hại, nguy hiểm' },
    { value: '5', label: 'Người tàn tật suy giảm >=21% khả năng lao động' },
    { value: '6', label: 'Nữ quân nhân, nữ Công an nhân dân' },
];

export const SUROGACY = [ // mang thai hộ
    { value: '1', label: 'Không mang thai hộ và không nhờ mang thai hộ' },
    { value: '2', label: 'Mang thai hộ' },
    { value: '3', label: 'Nhờ mang thai hộ' },
]

export const UPDATE_KEYS_MAP = {
    "sickData.note": "description",
    "sickData.total": "certificateInsuranceBenefit.total",
    "sickData.seri": "certificateInsuranceBenefit.seriNumber",
    "sickData.toDate": "certificateInsuranceBenefit.toDate",
    "sickData.fromDate": "certificateInsuranceBenefit.fromDate",
    "sickData.hospitalLine": "certificateInsuranceBenefit.hospitalLine",
    "sickData.fullName": "fullName",
    "sickData.socialId": "insuranceNumber",
    "sickData.IndentifiD": "idNumber",
    "sickData.employeeNo": "employeeNo",
    "sickData.bankId": "receiveSubsidiesInfo.bankCode",
    "sickData.bankName": "receiveSubsidiesInfo.bankName",
    "sickData.accountName": "receiveSubsidiesInfo.accountName",
    "sickData.accountNumber": "receiveSubsidiesInfo.bankAccountNumber",
    "sickData.receiveType": "receiveSubsidiesInfo.receiveSubsidiesInfo",
    "sickData.resolveContent": "SettlementContent",
    "sickData.addtionContent": "AdditionalPhaseContent",
    "sickData.plan": "planInfo",
    "sickData.declareForm": "formTypeInfo",
    "sickData.dateRequest": "recommendEnjoyDate",
    "sickData.resolveDate": "SettlementPeriod",
    "sickData.addtionDate": "AdditionalPhasePeriod",
    "sickData.dateLastResolved": "solvedFirstDate",
    "sickData.hrComment": "hrComment",
 
    "sickData.sickId": "diagnosisDiseaseInfo.diseaseCode",
    "sickData.sickName": "diagnosisDiseaseInfo.diseaseName",
    "sickData.leaveOfWeek": "weeklyRestDay",
    "sickData.childSickNumbers": "sickChildrenInfo.sickChildrenNumber",
    "sickData.childInsuranceNumber": "sickChildrenInfo.healthInsuranceNumber",
    "sickData.childBirth": "sickChildrenInfo.childDob",
    "sickData.workingCondition": "workingConditionInfo",
 
    "maternityData.note": "description",
    "maternityData.seri": "indicationSickLeaveInfo.seriNumber",
    "maternityData.total": "indicationSickLeaveInfo.total",
    "maternityData.fromDate": "indicationSickLeaveInfo.fromDate",
    "maternityData.toDate": "indicationSickLeaveInfo.toDate",
    "maternityData.fullName": "fullName",
    "maternityData.socialId": "insuranceNumber",
    "maternityData.IndentifiD": "idNumber",
    "maternityData.employeeNo": "employeeNo",
    "maternityData.bankId": "receiveSubsidiesInfo.bankCode",
    "maternityData.bankName": "receiveSubsidiesInfo.bankName",
    "maternityData.accountName": "receiveSubsidiesInfo.accountName",
    "maternityData.receiveType": "receiveSubsidiesInfo.receivingForm",
    "maternityData.accountNumber": "receiveSubsidiesInfo.bankAccountNumber",
    "maternityData.resolveContent": "SettlementContent",
    "maternityData.addtionContent": "AdditionalPhaseContent",
    "maternityData.plan": "planInfo",
    "maternityData.declareForm": "formTypeInfo",
    "maternityData.dateRequest": "recommendEnjoyDate",
    "maternityData.resolveDate": "SettlementPeriod",
    "maternityData.addtionDate": "AdditionalPhasePeriod",
    "maternityData.dateLastResolved": "solvedFirstDate",
    "maternityData.hrComment": "hrComment",
 
    "maternityData.dadCare": "childcareLeaveInfo",
    "maternityData.startWork": "backToWorkDate",
    "maternityData.hasRainser": "motherDataInfo.surrogacy",
    "maternityData.resultDate": "motherDataInfo.conclusionDate",
    "maternityData.momDeadDate": "motherDataInfo.motherDiedDate",
    "maternityData.momIdNumber": "motherDataInfo.motherIdNumber",
    "maternityData.hasSurgery": "motherDataInfo.surgeryOrPregnancy",
    "maternityData.assessment": "motherDataInfo.medicalAssessmentFee",
    "maternityData.maternityLeave": "motherDataInfo.pregnancyVacation",
    "maternityData.momHealthNumber": "motherDataInfo.healthInsuranceNumber",
    "maternityData.momInsuranceNumber": "motherDataInfo.socialInsuranceNumber",
    "maternityData.age": "childrenDataInfo.ageOfFetus",
    "maternityData.childBirth": "childrenDataInfo.childDob",
    "maternityData.childDead": "childrenDataInfo.childDiedDate",
    "maternityData.childReceiveDate": "childrenDataInfo.adoptionDate",
    "maternityData.childNumbers": "childrenDataInfo.numberOfChildren",
    "maternityData.childDeadNumbers": "childrenDataInfo.numberOfDeadChildren",
    "maternityData.childHealthNumber": "childrenDataInfo.healthInsuranceNumber",
    "maternityData.childInsuranceNumber":
      "childrenDataInfo.socialInsuranceNumber",
    "maternityData.childRaiseDate":
      "childrenDataInfo.dateReceivingBiologicalChild",
    "maternityData.birthCondition": "conditionsChildbirth",
    "maternityData.maternityRegime": "maternityRegimeInfo",
    "maternityData.maternityCondition": "pregnancyCheckUpInfo",
    "maternityData.reason": "reasonRequestingAdjustment",
    "maternityData.leaveOfWeek": "weeklyRestDay",
    "maternityData.raiserInsuranceNumber": "nurturerInsuranceNumber",
 
    "convalesData.note": "description",
    "convalesData.total": "receiveBenefitsUnitInfo.total",
    "convalesData.seri": "receiveBenefitsUnitInfo.seriNumber",
    "convalesData.toDate": "receiveBenefitsUnitInfo.toDate",
    "convalesData.fromDate": "receiveBenefitsUnitInfo.fromDate",
    "convalesData.fullName": "fullName",
    "convalesData.socialId": "insuranceNumber",
    "convalesData.IndentifiD": "idNumber",
    "convalesData.employeeNo": "employeeNo",
    "convalesData.bankId": "receiveSubsidiesInfo.bankCode",
    "convalesData.bankName": "receiveSubsidiesInfo.bankName",
    "convalesData.accountName": "receiveSubsidiesInfo.accountName",
    "convalesData.receiveType": "receiveSubsidiesInfo.receivingForm",
    "convalesData.accountNumber": "receiveSubsidiesInfo.bankAccountNumber",
    "convalesData.resolveContent": "SettlementContent",
    "convalesData.addtionContent": "AdditionalPhaseContent",
    "convalesData.plan": "planInfo",
    "convalesData.declareForm": "formTypeInfo",
    "convalesData.dateRequest": "recommendEnjoyDate",
    "convalesData.resolveDate": "SettlementPeriod",
    "convalesData.addtionDate": "AdditionalPhasePeriod",
    "convalesData.dateLastResolved": "solvedFirstDate",
    "convalesData.hrComment": "hrComment",
 
    "convalesData.declineRate": "inspectionDataInfo.rateOfDecline",
    "convalesData.assessmentDate": "inspectionDataInfo.inspectionDate",
    "convalesData.startWork": "backToWorkDate",
  }


