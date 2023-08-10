import { IDropdownValue } from "models/CommonModel";

const PAYMENT_OBJECT = [
    {value: 1, labelVi: 'Bản thân', labelEn: 'Bản thân'},
    {value: 2, labelVi: 'Người thân', labelEn: 'Người thân'},
]

const PAYMENT_SERVICE_TYPE = [
    {value : 1, labelVi: 'Vinwonder&Safari', labelEn: 'Vinwonder&Safari'},
    {value : 2, labelVi: 'Vinwonder', labelEn: 'Vinwonder'},
    {value : 3, labelVi: 'Safari', labelEn: 'Safari'},
    {value : 4, labelVi: 'Golf (Cấp cao,T1,T2)', labelEn: 'Golf (Cấp cao,T1,T2)'},
    {value : 5, labelVi: 'Golf (T3,T4,P1) ko gồm Proshop', labelEn: 'Golf (T3,T4,P1) ko gồm Proshop'},
    {value : 6, labelVi: 'Spa', labelEn: 'Spa'},
    {value : 7, labelVi: 'Ăn uống Buffet', labelEn: 'Ăn uống Buffet'},
    {value : 8, labelVi: 'Giặt là', labelEn: 'Giặt là'},
    {value : 9, labelVi: 'Vận chuyển(CC,T1,T2)', labelEn: 'Vận chuyển(CC,T1,T2)'},
    {value : 10, labelVi: 'Vận chuyển T3,T4,P1(<50km)', labelEn: 'Vận chuyển T3,T4,P1(<50km)'},
    {value : 11, labelVi: 'Đồ uống có cồn', labelEn: 'Đồ uống có cồn'},
    {value : 12, labelVi: 'Ăn uống tại phòng', labelEn: 'Ăn uống tại phòng'},
    {value : 13, labelVi: 'Ăn uống Alacarte', labelEn: 'Ăn uống Alacarte'},
    {value : 14, labelVi: 'Dịch vụ khác (ko gồm tour)', labelEn: 'Dịch vụ khác (ko gồm tour)'},
    {value : 15, labelVi: 'Đêm miễn phí', labelEn: 'Đêm miễn phí'},
    {value : 16, labelVi: 'Đêm giảm giá (từ BAR)', labelEn: 'Đêm giảm giá (từ BAR)'},
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

export const getPaymentServiceTypes = (): IDropdownValue[] => {
    const locale = localStorage.getItem('locale') == 'vi-Vn' ? 'Vi' : 'En';
    return PAYMENT_SERVICE_TYPE.map(item => {
        return {
            value: item.value,
            label: item['label' + locale]
        };
    });    
}
