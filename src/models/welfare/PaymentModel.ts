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
    DateCome?: Date;
    DateLeave?: Date;
    TripAddress?: string;
    TripCode?: string;
    name:     string;
    isDeleted?:    boolean;
    isCreateMode?: boolean;
    services: IPaymentService[];
}

export interface IPaymentService {
    DateUse?: Date;
    UseWelfareType?: IDropdownValue;
    UseFor?: IDropdownValue;
    FeePayment?: string;
    FeeUpgrade?: string;
    name: string;
}
