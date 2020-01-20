import map from '../../containers/map.config';

export const Navigation = [
    {
        id: 1,
        parentId: 0,
        icon: 'menu',
        label: "Menu",
        to: '/',
        role: 'U'
    },
    {
        id: 10,
        parentId: 0,
        icon: 'hr',
        label: "Menu_HumanResource",
        to: map.PersonInfo,
        role: 'U'
    },
    {
        id: 2,
        parentId: 0,
        icon: 'training',
        label: "Menu_Training",
        role: 'U'
    },
    {
        id: 3,
        parentId: 2,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_Learning",
        to: map.Learning,
        role: 'U'
    },
    {
        id: 4,
        parentId: 2,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_Intruction",
        to: map.Instruction,
        role: 'U'
    },
    {
        id: 5,
        parentId: 2,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_TrainingRoadmap",
        to: map.Roadmap,
        role: 'U'
    },
    // {
    //     id: 6,
    //     parentId: 2,
    //     icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    //     label: "Menu_ExeTest",
    //     to: "#",
    //     role: 'U'
    // },
    {
        id: 7,
        parentId: 2,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_TrainingKPI",
        to: map.TraniningKPI,
        role: 'U'
    },
    // {
    //     id: 9,
    //     parentId: 0,
    //     icon: 'menu',
    //     label: "Menu_CheckList",
    //     to: '/checklist/workflow',
    //     role: 'U'
    // },
    {
        id: 11,
        parentId: 0,
        icon: 'contact',
        label: "Menu_ContactAddress",
        to: '/contact',
        role: 'U'
    },
    // {
    //     id: 12,
    //     parentId: 0,
    //     icon: 'term_policy',
    //     label: "Menu_TermPolicy",
    //     to: '/term-policy',
    //     role: 'U'
    // },
    {
        id: 13,
        parentId: 0,
        icon: 'groupinfo',
        label: "Menu_GroupInformation",
        to: '/announcement',
        role: 'U'
    },
    {
        id: 14,
        parentId: 13,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_GroupIntroduction",
        to: "#",
        role: 'U'
    },
    {
        id: 15,
        parentId: 13,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_VinpearlIntroduction",
        to: "#",
        role: 'U'
    },
    {
        id: 16,
        parentId: 13,
        icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
        label: "Menu_News",
        to: map.News,
        role: 'U'
    }
];
