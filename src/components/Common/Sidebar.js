/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import logo from '../../assets/img/myvp-logo-white.png';
import 'react-metismenu/dist/react-metismenu-standart.min.css';
import MetisMenu from 'react-metismenu';
import { Navigation } from '../../modules';
import { useGuardStore } from '../../modules';
import { useTranslation } from "react-i18next";
 
function SideBar(props) {
    const guard = useGuardStore();
    const { t } = useTranslation();
    const user = guard.getCurentUser();
    const { show } = props;

    const getNavigation = (role) => {
        let allNav = Navigation.filter(x => (x.role === 'A' || x.role === 'U' || x.role.indexOf(role) >= 0));
        return getSubNav(allNav, 0);
    }

    const getSubNav = (allNav, parentId) => {
        let rootNav = allNav.filter(x => x.parentId === parentId);
        if (rootNav.length > 0) {
            for (let i = 0; i < rootNav.length; i++) {
                rootNav[i].label = t(rootNav[i].label);
                rootNav[i].content = getSubNav(allNav, rootNav[i].id);
            }
        }
        return rootNav;
    }

    const content = getNavigation(user.jobType); 

    return (
        <div className={show ? 'bg-vp-blue sidebar d-none d-lg-block shadow' : 'bg-vp-blue sidebar shadow'}>
            <a href="/">
                <img className='vp-logo' src={logo} alt='My Vinpearl' />
            </a>
            <MetisMenu
                className='sidebar sidebar-dark'
                content={content}
                activeLinkFromLocation
                iconNameStateVisible="arrow_expand"
                iconNameStateHidden="arrow_collapse"
                iconNamePrefix="icon-"
            />
        </div>
    );
}
export default SideBar;