import map from "../../containers/map.config";

export const Navigation = [
  {
    id: 1,
    parentId: 0,
    icon: "menu",
    label: "Menu",
    to: "/",
    role: "U",
  },
  {
    id: 10,
    parentId: 0,
    icon: "hr",
    label: "Menu_HumanResource",
    role: "U",
  },
  {
    id: 2,
    parentId: 0,
    icon: "training",
    label: "Menu_Training",
    role: "U",
  },
  {
    id: 3,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_Learning",
    to: map.Learning,
    role: "U",
  },
  {
    id: 4,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_Intruction",
    to: map.Instruction,
    role: "U",
  },
  {
    id: 5,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_TrainingRoadmap",
    to: map.Roadmap,
    role: ["P", "T"],
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
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_TrainingKPI",
    to: map.TraniningKPI,
    role: "U",
  },
  // {
  //     id: 9,
  //     parentId: 0,
  //     icon: 'menu',
  //     label: "Menu_CheckList",
  //     to: '/checklist/workflow',
  //     role: 'U'
  // },
  // {
  //     id: 11,
  //     parentId: 0,
  //     icon: 'contact',
  //     label: "Menu_ContactAddress",
  //     to: '/contact',
  //     role: 'U'
  // },
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
    icon: "groupinfo",
    label: "Menu_GroupInformation",
    to: "/announcement",
    role: "U",
  },
  {
    id: 14,
    parentId: 13,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_GroupIntroduction",
    to: map.Vingroup,
    role: 'U'
  },
  {
    id: 15,
    parentId: 13,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_VinpearlIntroduction",
    to: map.Vinpearl,
    role: 'U'
  },
  {
    id: 16,
    parentId: 13,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_News",
    to: map.News,
    role: "U",
  },
  {
    id: 17,
    parentId: 10,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "PersonalInformation",
    to: map.PersonalInfo,
    role: 'U'
  }, {
    id: 30,
    parentId: 17,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "BasicInformation",
    to: map.PersonalInfo,
    role: 'U'
  }, {
    id: 32,
    parentId: 17,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "WorkingProcess",
    to: map.WorkingProcess,
    role: 'U'
  },
  {
    id: 99,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Phúc lợi",
    to: map.Benefit,
    role: "U"
  },
  {
    id: 19,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "JobDescription",
    to: map.Job,
    role: "U"
  },
  {
    id: 20,
    parentId: 0,
    icon: "notification",
    label: "Notification",
    to: map.Notify,
    role: "U"
  },
  {
    id: 21,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_KPI",
    to: map.Kpi,
    role: "U"
  },

  {
    id: 22,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_Timesheet",
    to: map.Timesheet,
    role: "U"
  } 
  
];
