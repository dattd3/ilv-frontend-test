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
        let allNav = Navigation.filter(x => (x.role === 'A' || x.role === 'U' || x.role.indexOf(role) >= 0 || x.role.indexOf(user.companyCode) >= 0));
        return getSubNav(allNav, 0);
    }

    const getSubNav = (allNav, parentId) => {
        let rootNav = allNav.filter(x => x.parentId === parentId);
        if (rootNav.length > 0) {
            for (let i = 0; i < rootNav.length; i++) {
                rootNav[i].label = t(rootNav[i].label);
                if (user.companyCode != "V030" && rootNav[i].label2) {
                    rootNav[i].label = t(rootNav[i].label2);
                }
                rootNav[i].content = getSubNav(allNav, rootNav[i].id);
            }
        }
        return rootNav;
    }

    const content = getNavigation(user.jobType);

    return (
        <>
            <div>
                <div style={{borderColor: localStorage.getItem("companyThemeColor")}} className={show ? 'bg-vp-blue sidebar shadow' : 'bg-vp-blue sidebar shadow d-none'}>
                    <Animated animationIn="rubberBand" isVisible={show} >
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