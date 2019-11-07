/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import map from '../../containers/map.config';
import logo from '../../assets/img/myvp-logo-white.png';
import 'react-metismenu/dist/react-metismenu-standart.min.css';
import MetisMenu from 'react-metismenu';
import { useTranslation } from "react-i18next";

function SideBar(props) {
    const { show } = props;
    const { t } = useTranslation();
    const content = [
        {
            icon: 'bars',
            label: t("Menu"),
            to: '/',
        },
        {
            icon: 'graduation-cap',
            label: t("Menu_Training"),
            content: [
                {
                    icon: 'no-icon',
                    label: t("Menu_Learning"),
                    to: map.Learning,
                },
                {
                    icon: 'no-icon',
                    label: t("Menu_Intruction"),
                    to: map.Instruction,
                },
                {
                    icon: 'no-icon',
                    label: t("Menu_TrainingRoadmap"),
                    to: map.RoadmapDetails,
                },
                {
                    icon: 'no-icon',
                    label: t("Menu_ExeTest"),
                    to: "#",
                },
                {
                    icon: 'no-icon',
                    label: t("Menu_TrainingKPI"),
                    to: "#",
                    content: [
                        {
                            icon: 'no-icon',
                            label: t("Menu_Learning"),
                            to: map.LearningKPI,
                        },
                        {
                            icon: 'no-icon',
                            label: t("Menu_Intruction"),
                            to: map.TeachingKPI,
                        }
                    ]
                },
            ],
        },
        {
            icon: 'user',
            label: t("Menu_HumanResource"),
            to: '/hr',
        },
        {
            icon: 'address-book',
            label: t("Menu_ContactAddress"),
            to: '/contact',
        },
        {
            icon: 'clipboard',
            label: t("Menu_TermPolicy"),
            to: '/term-policy',
        },
        {
            icon: 'bullhorn',
            label: t("Menu_CompanyAnnouncement"),
            to: '/announcement',
        },
    ];

    return (
        <div className={show ? 'bg-vp-blue sidebar d-none d-lg-block' : 'bg-vp-blue sidebar'}>
            <a className="d-flex align-items-center justify-content-center" href="/">
                <img className='vp-logo' src={logo} alt='My Vinpearl' />
            </a>
            <MetisMenu
                className='sidebar sidebar-dark'
                content={content}
                activeLinkFromLocation
                iconNameStateVisible="angle-down"
                iconNameStateHidden="angle-right"
            />
        </div>
    );
}
export default SideBar;
