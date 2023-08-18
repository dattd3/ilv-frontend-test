import { IDropdownValue } from "models/CommonModel";

export interface IPaymentUserInfo {
    fullName?: string,
    employeeNo?: string,
    companyName?: string,
    departmentName?: string,
    benefitLevel?: string,
    costCenter?: string,
    employeeEmail?: string
}

export interface IPaymentRequest {
    DateCome?: string;
    DateLeave?: string;
    TripAddress?: string;
    TripCode?: string;
    TotalRefund?: number;
    name:     string;
    isDeleted?:    boolean;
    isCreateMode?: boolean;
    services: IPaymentService[];
}

export interface IPaymentService {
    DateUse?: string;
    Detail?: string;
    UseWelfareType?: IDropdownValue;
    UseFor?: IDropdownValue;
    FeePayment?: string | number;
    FeeUpgrade?: string | number;
    name: string;
    PnlDiscountPercent?: number;
    QuotedPrice?: number;
    FeeBenefit?: number | string;
    FeeReturn?: number | string;
}

// ----------QUOTA INFO ----------------
export interface IQuota extends IResponseQuota{
    freeNightNeedClaim:       number;
    discountNightNeedClaim:       number;
}

export interface IResponseServices {
    services: IResponseServiceItem[];
}

export interface IResponseServiceItem {
    id:                    number;
    serviceCode:           string;
    serviceName:           string;
    serviceNameEn:         string;
    discountPercentForPnl: number;
    isRoomCharge:          boolean;
}

export interface IResponseBenefitInfo {
    info?:  IRequestInfo;
    quota: IResponseQuota;
}

//BENEFIT-INFO

export interface IRequestInfo {
    id:                   number;
    year:                 number;
    userId:               string;
    employeeNo:           string;
    userInfor:            null;
    pnlCode:              string;
    benefitRank:          string;
    freeNightTotal:       number;
    discountNightTotal:   number;
    freeNightClaimed:     number;
    discountNightClaimed: number;
    examTimesUseable:     number;
    examTimesUsed:        number;
    dateCreated:          Date;
    dateModified:         Date;
    createdBy:            string;
    modifiedBy:           string;
    benefitRefundItem:    IRequestDTO[];
}



export interface IRequestDTO {
    benefitRefundID:       number;
    benefitRefundService:  IServiceDTO[];
    code:                  string;
    discountNightsToClaim: number;
    endDate:               string;
    freeNightsToClaim:     number;
    id:                    number;
    place:                 string;
    requestHistory:        IPaymentRequestHistory;
    requestHistoryID:      number;
    startDate:             string;
    totalRefund:           number;
}



export interface IServiceDTO {
    id:                     number;
    date:                   string;
    serviceTypeId:          number;
    userType:               number;
    amountPaid:             number;
    upgradeRoomFee:         number;
    detail:                 string;
    quotedPrice:            number;
    pnlDiscountPercent:     number;
    benefitDiscountPercent: number;
    refundAmount:           number;
    benefitRefundItemId:    number;
}

export interface IResponseQuota {
    freeNightTotal:       number;
    discountNightTotal:   number;
    freeNightClaimed:     number;
    discountNightClaimed: number;
    examTimesUseable:     number;
    examTimesUsed:        number;
}

export interface IPaymentRequestHistory {
    id:                   number;
    platform:             string;
    name:                 string;
    createdDate:          Date;
    approvedDate:         Date;
    assessedDate:         null;
    approverComment:      null | string;
    appraiserComment:     null;
    comment:              null;
    requestInfo:          string;
    processStatusId:      number;
    requestTypeId:        number;
    requestType:          null;
    userId:               string;
    userInfo:             null;
    appraiserId:          null;
    appraiserInfo:        null;
    createField:          string;
    updateField:          string;
    isSuccessSyncFromSap: boolean;
    responseSyncFromSap:  null | string;
    requestDataToSap:     string;
    approverId:           string;
    approverInfo:         string;
    orgLv2Id:             null;
    orgLv2Text:           null;
    divisionId:           number;
    division:             string;
    regionId:             number;
    region:               string;
    unitId:               number;
    unit:                 string;
    partId:               number;
    part:                 null;
    companyCode:          string;
    supervisorId:         null;
    supervisorInfo:       null;
    supervisorDate:       Date;
    dateTick:             number;
    requestOrgsId:        number;
    requestOrgs:          null;
    index:                number;
    substitutionUploads:  null;
    timeOverViews:        null;
    salaryAdjustments:    null;
    otUploads:            null;
    benefitRefundInfos:   null;
}


