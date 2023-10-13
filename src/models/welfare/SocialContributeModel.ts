import { IDropdownValue } from "models/CommonModel";

export interface IMemberInfo {
    relation?: IDropdownValue;
    fullName?: string;
    sex?: IDropdownValue;
    birthDate?: string;
    identityId?: IDropdownValue;
    type?: IDropdownValue;
    status?: number
}

export interface ISocialContributeModel {
    socialNumberType?: IDropdownValue;
    facilityRegisterName?: IDropdownValue;
    houseHoldNumber?: string;
    province?: IDropdownValue;
    district?: IDropdownValue;
    ward?: IDropdownValue;
    street?: string;
    note?: string;
}
const STATUS = {
    NEW: 1,
    UPDATE: 2,
    DELETE: 3
}
let data = {
    relation: STATUS.UPDATE,
    fullName: STATUS.NEW,
    member: []
}