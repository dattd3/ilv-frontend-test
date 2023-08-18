import { IDropdownValue } from "models/CommonModel";

const PAYMENT_OBJECT = [
    {value: 1, labelVi: 'Bản thân', labelEn: 'Bản thân'},
    {value: 2, labelVi: 'Người thân', labelEn: 'Người thân'},
]

export const getPaymentObjects = () : IDropdownValue[] => {
    const locale = localStorage.getItem('locale') == 'vi-Vn' ? 'Vi' : 'En';
    return PAYMENT_OBJECT.map(item => {
        return {
            value: item.value,
            label: item['label' + locale]
        };
    });
}
