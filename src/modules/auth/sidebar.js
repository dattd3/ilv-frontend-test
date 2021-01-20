import map from "../../containers/map.config";

export const Navigation = [
  {
    id: 1,
    parentId: 0,
    icon: "c-home",
    label: "Menu",
    to: "/",
    role: "U",
  },
  {
    id: 10,
    parentId: 0,
    icon: "c-hr",
    label: "Menu_HumanResource",
    role: "U",
  },
  {
    id: 2,
    parentId: 0,
    icon: "c-dt",
    label: "Menu_Training",
    role: "U",
  },
  {
    id: 11,
    parentId: 0,
    icon: 'c-recruiment',
    label: "Menu_InternalRecruitment",
    to: map.InternalRecruitment,
    role: ['V030']
  },
  {
    id: 12,
    parentId: 0,
    icon: 'c-task',
    label: "Menu_Task",
    to: map.Task,
    role: 'U'
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
  {
    id: 7,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_TrainingKPI",
    to: map.TraniningKPI,
    role: "U",
  },
  {
    id: 13,
    parentId: 0,
    icon: "c-group",
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
    role: ['V030']
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
  },
  {
    id: 18,
    parentId: 10,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "MyJob",
    to: map.Job,
    role: 'U'
  },
  {
    id: 30,
    parentId: 17,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "BasicInformation",
    to: map.PersonalInfo,
    role: 'U'
  },
  {
    id: 32,
    parentId: 17,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "WorkingProcess",
    to: map.WorkingProcess,
    role: 'U'
  },
  {
    id: 24,
    parentId: 11,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_PositionRecruiting",
    to: map.PositionRecruiting,
    role: 'U'
  },
  {
    id: 25,
    parentId: 11,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_PositionApplied",
    to: map.PositionApplied,
    role: 'U'
  },
  {
    id: 26,
    parentId: 11,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Các vị trí đã giới thiệu",
    to: map.PositionIntroduced,
    role: 'U'
  },
  {
    id: 99,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Phúc lợi",
    to: map.Benefit,
    role: ['V030']
  },
  {
    id: 19,
    parentId: 18,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "JobDescription",
    to: map.Job,
    role: "U"
  },
  {
    id: 20,
    parentId: 0,
    icon: "c-notification",
    label: "Notification",
    to: map.Notifications,
    role: "U"
  },
  {
    id: 21,
    parentId: 18,
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
  },
  {
    id: 23,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_LeaveTime",
    to: map.LeaveTime,
    role: "U"
  },
  {
    id: 27,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_PaySlip",
    to: map.PaySlips,
    role: "U"
  },
  {
    id: 97,
    parentId: 10,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Registration",
    label2: "RegistrationSeconds",
    to: map.Registration,
    role: 'U'
  },
  {
    id: 98,
    parentId: 0,
    icon: 'c-qa',
    label: "QuestionAndAnswer",
    to: map.QuestionAndAnswer,
    role: 'U'
  },
];
