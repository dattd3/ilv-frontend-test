
export const TaxAuthorizationOptions = {
    AUTHORIZE_TAX: '2301',
    EXPOSE_TAX: '2302'
};

export const TAX_TYPE_CONSTANT = {
    CREATE: "create",
};

export const STATUS = {
    OLD: 0,
    NEW: 1,
    UPDATE: 2,
    DELETE: 3
}

export const SOCIAL_NUMBER_INPUT = '-1';

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