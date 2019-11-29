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
        id: 2,
        parentId: 0,
        icon: 'training',
        label: "Menu_Training",
        role: 'U'
    },
    {
        id: 3,
        parentId: 2,
        icon: 'no-icon',
        label: "Menu_Learning",
        to: map.Learning,
        role: 'U'
    },
    {
        id: 4,
        parentId: 2,
        icon: 'no-icon',
        label: "Menu_Intruction",
        to: map.Instruction,
        role: 'U'
    },
    {
        id: 5,
        parentId: 2,
        icon: 'no-icon',
        label: "Menu_TrainingRoadmap",
        to: map.RoadmapDetails,
        role: ['T', 'P']
    },
    {
        id: 6,
        parentId: 2,
        icon: 'no-icon',
        label: "Menu_ExeTest",
        to: "#",
        role: 'U'
    },
    {
        id: 7,
        parentId: 2,
        icon: 'no-icon',
        label: "Menu_TrainingKPI",
        role: 'U'
    },
    {
        id: 8,
        parentId: 7,
        icon: 'no-icon',
        label: "Menu_Learning",
        to: map.LearningKPI,
        role: 'U'
    },
    {
        id: 9,
        parentId: 7,
        icon: 'no-icon',
        label: "Menu_Intruction",
        to: map.TeachingKPI,
        role: ['T', 'P', 'C']
    },
    {
        id: 10,
        parentId: 0,
        icon: 'hr',
        label: "Menu_HumanResource",
        to: '/hr',
        role: 'U'
    },
    {
        id: 11,
        parentId: 0,
        icon: 'contact',
        label: "Menu_ContactAddress",
        to: '/contact',
        role: 'U'
    },
    {
        id: 12,
        parentId: 0,
        icon: 'term_policy',
        label: "Menu_TermPolicy",
        to: '/term-policy',
        role: 'U'
    },
    {
        id: 13,
        parentId: 0,
        icon: 'groupinfo',
        label: "Menu_CompanyAnnouncement",
        to: '/announcement',
        role: 'U'
    }
];