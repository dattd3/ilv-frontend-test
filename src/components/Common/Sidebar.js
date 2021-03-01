/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
// import logo from '../../assets/img/LogoVinsoftware.svg';
import 'react-metismenu/dist/react-metismenu-standart.min.css';
import MetisMenu from 'react-metismenu';
import { Navigation } from '../../modules';
import { useGuardStore } from '../../modules';
import { useTranslation } from "react-i18next";
import { Animated } from "react-animated-css";

function SideBar(props) {
    const guard = useGuardStore();
    const { t } = useTranslation();
    const user = guard.getCurentUser();
    const { companyLogoUrl } = props.user;

    const { show } = props;

    const getNavigation = (role) => {
        debugger
        let allNav = Navigation.filter(x => (x.role === 'A' || x.role === 'U' || x.role.includes(role) || x.role.indexOf(user.companyCode) >= 0));
        return getSubNav(allNav, 0);
    }

    const getSubNav = (allNav, parentId) => {
        let rootNav = allNav.filter(x => x.parentId === parentId);
        if (rootNav.length > 0) {
            for (let i = 0; i < rootNav.length; i++) {
                rootNav[i].label = t(rootNav[i].label);
                if (user.companyCode === "V096" && rootNav[i].label2) {
                    rootNav[i].label = t(rootNav[i].label2);
                }
                if(user.companyCode === "V073")
                {
                    if(rootNav[i].label === t('Menu_Task')) rootNav[i].label = t('Menu_RequestManage')  
                    if(rootNav[i].label === t('Registration')) rootNav[i].label = t('Registration_V073')  
                }
                rootNav[i].content = getSubNav(allNav, rootNav[i].id);
            }
        }
        return rootNav;
    }

    const content = getNavigation(user.benefitLevel);

    return (
        <>
            <div>
                <div style={{borderColor: localStorage.getItem("companyThemeColor")}} className={show ? 'bg-vp-blue sidebar shadow' : 'bg-vp-blue sidebar shadow d-none'}>
                    <Animated animationIn="fadeIn" isVisible={show} >
                        <div className="text-center">
                            <a href="/">
                                <img className='vp-logo' src={companyLogoUrl ? companyLogoUrl : 'https://vingroup.net/assets/images/logo.png'} alt='My VinGroup' />
                            </a>
                        </div>
                    </Animated>
                    <MetisMenu
                        className='sidebar sidebar-dark'
                        content={content}
                        activeLinkFromLocation
                        iconNameStateVisible="arrow_expand"
                        iconNameStateHidden="arrow_collapse"
                        iconNamePrefix="icon-"
                    />
                </div>
            </div>
        </>
    );
}
export default SideBar;