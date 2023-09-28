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

const SocialContributeInfo = (props: any) => {
        const { t } = props;
        const [data, setData] = useState<ISocialContributeModel>({});
        const [members, setMembers] = useState<IMemberInfo[]>([]);
        const [supervisors, setSupervisors] = useState<any[]>([])
        const [approver, setApprover] = useState<any>();
        const [loading, setLoading] = useState(false);
        const [statusModal, setStatusModal] = useState({
            isShowStatusModal: false,
            content: '',
            isSuccess: false
        })
        const [files, setFiles] = useState<any[]>([]);

        return (<>
            <div className="health-info-page">
                <div className="clearfix edit-button w-100 pb-2">
                    <a href="/insurance-manager/social-contribute-info"><div className="btn bg-white btn-create"
                    ><i className="fas fa-plus"></i> {t('createRequest')}</div></a>
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
                    isCreateMode = {true}
                />
            </div>
        </>)
}
export default withTranslation()(SocialContributeInfo)