import React, { useState } from "react";
import { Button, Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Constants from "../../../commons/Constants";
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import _ from "lodash";
import { formatNumberSpecialCase, getRequestConfigurations } from "../../../commons/Utils"

import Download from "../../../assets/img/icon/ic_download_blue.svg";
import CustomPaging from "../../../components/Common/CustomPaging";
import CreateSocialContributeInfo from "../InsuranceSocialContribute/CreateSocialContributeInfo";
import { IMemberInfo, ISocialContributeModel } from "models/welfare/SocialContributeModel";
import { STATUS } from "../InsuranceSocialContribute/SocialContributeData";

const SocialContributeInfo = (props: any) => {
        const { t } = props;
        const [isCreateMode, setIsCreateMode] = useState(false);
        const [oldData, setOldData] = useState<ISocialContributeModel>({});
        const [data, setData] = useState<ISocialContributeModel>({
            "socialNumberType": {
                "value": "1",
                "label": "Đề nghị cấp sổ"
            },
            "facilityRegisterName": {
                "value": "O1",
                "label": "Ốm thông thường"
            },
            "houseHoldNumber": "aaaaa",
            "province": {
                "value": "89",
                "label": "An Giang"
            },
            "district": {
                "value": "8903",
                "label": "Huyện An Phú"
            },
            "ward": {
                "value": "890314",
                "label": "Thị Trấn Long Bình"
            },
            "note": "noi dung"
        });
        const [oldMembers, setOldMembers] = useState<IMemberInfo[]>([]);
        const [members, setMembers] = useState<IMemberInfo[]>([
            {
                "relation": {
                    "value": "V002",
                    "label": "Mẹ ruột"
                },
                "fullName": "444",
                "sex": {
                    "value": "2",
                    "label": "Nữ"
                },
                "birthDate": "28/09/2023",
                "identityId": "778",
                "type": {
                    "value": "1",
                    "label": "Chủ hộ"
                }
            },
            {
                "relation": {
                    "value": "V006",
                    "label": "Cha chồng"
                },
                "fullName": "rrrr",
                "sex": {
                    "value": "1",
                    "label": "Nam"
                },
                "birthDate": "24/09/2023",
                "identityId": "234234",
                "type": {
                    "value": "2",
                    "label": "Thành viên"
                }
            }
        ]);
        const [supervisors, setSupervisors] = useState<any[]>([])
        const [approver, setApprover] = useState<any>();
        const [loading, setLoading] = useState(false);
        const [statusModal, setStatusModal] = useState({
            isShowStatusModal: false,
            content: '',
            isSuccess: false
        })
        const [files, setFiles] = useState<any[]>([]);

        const checkDataChange = () => {
            const change = {};
            const memberChange : any[] = [];
            const keyDropDown = ['socialNumberType', 'province', 'district', 'ward', 'facilityRegisterName'];
            
            Object.keys(data).forEach(key => {
                if(data[key] && !oldData[key]) {
                    change[key] = STATUS.NEW;
                } else if (!data[key] && oldData[key]) {
                    change[key] = STATUS.DELETE
                } else if(data[key] && keyDropDown.includes(key)){
                    if(oldData[key].value != data[key].value || oldData[key].label != data[key].label || oldData[key].code != data[key].code) {
                        change[key] = STATUS.UPDATE;
                    }
                } else if(data[key] && !keyDropDown.includes(key)) {
                    if(data[key] != oldData[key]) {
                        change[key] = STATUS.UPDATE
                    }
                }
                if(change[key]) {
                    change[key +'_value'] = data[key];
                }
            });
            members.map((mem, index) => {
                if(mem.status == STATUS.OLD) {
                    memberChange.push({status: STATUS.OLD});
                }
                if(mem.status == STATUS.NEW) {
                    memberChange.push({status: STATUS.NEW, value: mem});
                }
                if(mem.status == STATUS.DELETE) {
                    memberChange.push({status: STATUS.DELETE});
                }
                if(mem.status == STATUS.UPDATE) {
                    let _newMem = {};
                    Object.keys(mem).map(key => {
                        if(key == 'status') return;
                        if(typeof mem[key] == 'string' && mem[key] != oldMembers[index][key]) {
                            _newMem[key] = mem[key];
                        }
                        if(typeof mem[key] == 'object' && mem[key].value != oldMembers[index][key].value) {
                            _newMem[key] = mem[key];
                        }
                    });
                    memberChange.push({status: STATUS.UPDATE, value: _newMem});
                }
            })

            console.log('change>>>', change, memberChange);
        }

        const onEdit = () => {
            let newEditable = !isCreateMode;
            if(newEditable) {
                setOldData({
                    ...data,
                })
                let _oldmember = members.map(mem => {
                    return {
                        ...mem,
                        status: STATUS.OLD
                    };
                })
                setOldMembers(_oldmember);
            }
            setIsCreateMode(newEditable);
        }

        const onSubmit = () => {
            console.log('data>>', data);
            console.log('members>>>', members);
            checkDataChange();
        }
        return (<>
            <div className="health-info-page">
                <div className="clearfix edit-button w-100 pb-2">
                    <a href="/insurance-manager/social-contribute-info"><div className="btn bg-white btn-create"
                    ><i className="fas fa-plus"></i> {t('createRequest')}</div></a>
                    <a onClick={() => onEdit()}><div className="btn bg-white btn-create"
                    ><i className="fas fa-plus"></i> {t('Edit')}</div></a>
                </div>
                <CreateSocialContributeInfo
                    t={t}
                    data = {data}
                    setData={setData}
                    supervisors={supervisors}
                    setSupervisors={setSupervisors}
                    approver={approver}
                    setApprover={setApprover}
                    files = {files}
                    updateFiles={setFiles}
                    removeFile={()=>{}}
                    members = {members}
                    setMembers={setMembers}
                    onSubmit={onSubmit}
                    isCreateMode = {isCreateMode}
                />
            </div>
        </>)
}
export default withTranslation()(SocialContributeInfo)