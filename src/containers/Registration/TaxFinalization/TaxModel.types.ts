import { IDropdownValue } from "models/CommonModel";

export interface ITaxMemberInfo {
    relation?: IDropdownValue;
    fullName?: string;
    fromDate?: string;
    toDate?: string;
    status?: number
}

export interface ITaxInfoModel {
    PitNo?: string;
    dependentNumber?: string;
    typeRequest?: IDropdownValue; // ủy quyền or xuất chứng từ thuế
    incomeType?: IDropdownValue;
    email?: string;
    address?: string;
    idNumber?: string;
    dateIssue?: string;
    placeIssue?: string;
}