import { IDropdownValue } from "models/CommonModel";

export const SOCIAL_NUMBER_INPUT = '-1';
export const socialNumberType: IDropdownValue[] = [
    {
        value: '1',
        label: 'Đề nghị cấp sổ',
    },
    {
        value: SOCIAL_NUMBER_INPUT,
        label: 'Khác',
        code: ''
    }
]

export const RELATIONSHIP_WITH_INSURED = [
    { value: SOCIAL_NUMBER_INPUT, label: 'Khác' },
    { value: 'V001', label: 'Cha ruột' },
    { value: 'V002', label: 'Mẹ ruột' },
    { value: 'V005', label: 'Vợ' },
    { value: 'V006', label: 'Cha chồng' },
    { value: 'V007', label: 'Mẹ chồng' },
    { value: 'V008', label: 'Cha vợ' },
    { value: 'V009', label: 'Mẹ vợ' },
    { value: 'V013', label: 'Chồng' },
    { value: 'V014', label: 'Con trai' },
    { value: 'V015', label: 'Con gái' },
];
export const IDENTITY_LIST = [
    {value: SOCIAL_NUMBER_INPUT, label: 'Có'},
    {value: '2', label: 'Không có'}
]

export const GENDER_LIST = [
    {value: '1', label: 'Nam'},
    {value: '2', label: 'Nữ'},
]
export const ROLE_TYPE = [
    {value: '1', label: 'Chủ hộ'},
    {value: '2', label: 'Thành viên'},
]

export const STATUS = {
    OLD: 0,
    NEW: 1,
    UPDATE: 2,
    DELETE: 3
}