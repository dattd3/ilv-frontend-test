
export const TaxAuthorizationOptions = {
    AUTHORIZE_TAX: '2301',
    EXPOSE_TAX: '2302'
};

export const getTaxAuthrizationOptions = (t: any) => {
    return [
        {value: '2301', label: t('uy_quyen_thue')},
        {value: '2302', label: t('xuat_chung_tu_thue')} 
    ]
};

export const getTaxIncomeOptions = (t: any) => {
    return [
        {value: '1', label: t('tax_authorization_1')},
        {value: '2', label: t('tax_authorization_2')},
        {value: '3', label: t('tax_authorization_3')} 
    ]
}

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

export const getRelationshipWithInsured = (t) => {
        return [
        {value: 'V001', label: t("RelationshipFather")},
        {value: 'V002', label: t("RelationshipMother")},
        {value: 'V003', label: t("RelationshipStepFather")},
        {value: 'V004', label: t("RelationshipStepMother")},
        {value: 'V005', label: t("RelationshipWife")},
        {value: 'V006', label: t("RelationshipHusbandFather")},
        {value: 'V007', label: t("RelationshipHusbandMother")},
        {value: 'V008', label: t("RelationshipWifeFather")},
        {value: 'V009', label: t("RelationshipWifeMother")},
        {value: 'V010', label: t("RelationshipElderBrother")},
        {value: 'V011', label: t("RelationshipElderSister")},
        {value: 'V012', label: t("RelationshipYoungerSibling")},
        {value: 'V013', label: t("RelationshipHusband")},
        {value: 'V014', label: t("RelationshipSon")},
        {value: 'V015', label: t("RelationshipDaughter")},
        { value: 'V016', label: t('RelationshipOther') },
    ]
}