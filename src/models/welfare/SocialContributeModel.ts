import { IDropdownValue } from "models/CommonModel";

export interface IMemberInfo {
    relation?: IDropdownValue;
    fullName?: string;
    sex?: IDropdownValue;
    birthDate?: string;
    identityId?: string;
    type?: IDropdownValue;
}

export interface ISocialContributeModel {
    socialNumberType?: IDropdownValue;
    facilityRegisterName?: string;
    houseHoldNumber?: string;
    province?: IDropdownValue;
    district?: IDropdownValue;
    ward?: IDropdownValue;
    street?: string;
    note?: string;
}