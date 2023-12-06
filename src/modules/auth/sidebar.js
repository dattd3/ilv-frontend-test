import map from "../../containers/map.config";
import Constants from "../../commons/Constants"

const companyVCodeUserLogged = localStorage.getItem('companyCode')

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
    id: 995,
    parentId: 0,
    icon: "c-vingroup-history",
    label: "VingroupCultural",
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
    role: [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1]
  },
  // {
  //   id: 12,
  //   parentId: 0,
  //   icon: 'c-task',
  //   label: "Menu_Task",
  //   to: map.Task,
  //   role: 'U'
  // },
  {
    id: 3,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_Learning",
    to: map.Learning,
    role: "U",
  },
  // {
  //   id: 48,
  //   parentId: 0,
  //   icon: 'c-task',
  //   label: "Menu_Clinic_Learning",
  //   to: map.ClinicVinmec,
  //   role: ['V060']
  // },
  {
    id: 998,
    parentId: 0,
    icon: 'project-info',
    to: "",
    label: "MenuProjectInformation",
    role: ['V005'],
  },
  {
    id: 99802,
    parentId: 998,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.MyProjects,
    label: "MenuMyProjects",
    role: "U",
  },
  {
    id: 99801,
    parentId: 998,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.ListProjects,
    label: "MenuListProjects",
    role: "U",
  },
  {
    id: 99803,
    parentId: 998,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.MyProfile,
    label: "MenuMyProfile",
    role: "U",
  },
  // Đánh giá
  {
    id: 997,
    parentId: 0,
    icon: 'evaluation',
    to: "",
    label: "MenuEvaluation",
    // role: ['V070', 'V077', 'V060'],
    role: "U",
  },
  {
    id: 99701,
    parentId: 997,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.TargetManagement,
    label: "MenuTargetManagement",
    role: [Constants.pnlVCode.VinMec, Constants.pnlVCode.VinUni],
  },
  {
    id: 99702,
    parentId: 997,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.MyEvaluation,
    label: "MenuMyEvaluation",
    role: "U",
  },
  {
    id: 99703,
    parentId: 997,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.EvaluationApproval,
    label: "MenuEvaluationApproval",
    role: "U",
  },
  // {
  //   id: 99702,
  //   parentId: 997,
  //   icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
  //   to: map.ListProjects,
  //   label: "MenuListProjects",
  //   role: "U",
  // },
  //workflow management
  {
    id: 999,
    parentId: 0,
    icon: 'c-task',
    to: "",
    label: "MenuTaskManagement",
    role: "U",
  },
  {
    id: 1099999,
    parentId: 0,
    icon: 'c-examination',
    label: "dtls",
    to: map.VinmecDTLS,
    role: ['V060']
  },
  {
    id:1000,
    parentId: 999,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.Task,
    label: 'MenuRequestManagement',
    role: 'U'
  },
  {
    id:1001,
    parentId: 999,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: "",
    label: 'MenuMyTeam',
    // role: ["C2", "C1","C", "P2", "P1", "T4", "T3", "T2", "T1", "T0"]
    role: ["C2", "C1", "C", "P2", "P1", "T7", "T6", "T5", "T4", "T3", "T2", "T1", "T0"]
  },
  {
    id:1002,
    parentId: 1001,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.EmployeeTimeSheets,
    label: [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1].includes(companyVCodeUserLogged) ? "SubMenuTimesheetManagementDivision" : "SubMenuTimesheetManagement",
    role: 'U'
  },
  {
    id:1003,
    parentId: 1001,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.LeaveFund,
    label: 'MenuLeaveTOILManagement',
    role: 'U'
  },
  {
    id:1004,
    parentId: 1001,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.PersonalDetails,
    label: 'MenuIndividualManagement',
    role: 'U'
  },
  {
    id:1005,
    parentId: 1001,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.ChangeShiftReport,
    label: 'MenuChangeShiftReport',
    role: 'U'
  },
  {
    id:1006,
    parentId: 999,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.SupportOnBoarding,
    label: 'support_in_preparing_for_job',
    role: 'U'
  },
  {
    id:1007,
    parentId: 999,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.EvaluationManager,
    label: 'manage_evaluating',
    //role:  ['V061', 'V053', 'V040', 'V005']
    role:  [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.DANHGIA_TAIKI]]
  },
  {
    id: 104,
    parentId: 999,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "ResignationRequestsManagement",
    to: map.ResignationRequestsManagement,
    role: [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.NGHIVIEC]]
    //role: 'NA'
  },
  {
    id:1008,
    parentId: 1001,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    to: map.ProposalManagement,
    label: 'CreateProposal',
    //role: ["C2", "C1","C", "P2", "P1", "P","T","P2", "P1", "T4", "T3", "T2", "T1"]
    role: ["C2", "C1","C", "P2", "P1","P2", "P1", "T7", "T6", "T5", "T4", "T3", "T2", "T1"]
  },
  {
    id: 4,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_Intruction",
    to: map.Instruction,
    // role: ["P","T","P2", "P1", "T4", "T3", "T2", "T1"],
    role: ["P2", "P1", "T6", "T5", "T4", "T3", "T2", "T1"]
  },
  {
    id: 5,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_TrainingRoadmap",
    to: map.Roadmap,
    //role: ["P","T","P2", "P1", "T4", "T3", "T2", "T1"],
    role: ["P2", "P1", "T6", "T5", "T4", "T3", "T2", "T1"]
  },
  {
    id: 7,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_TrainingKPI",
    to: map.TraniningKPI,
    role: "U",
  },
  // {
  //   id: 13,
  //   parentId: 0,
  //   icon: "c-group",
  //   label: "Menu_GroupInformation",
  //   to: "/announcement",
  //   role: "U",
  // },
  {
    id: 14,
    parentId: 13,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_GroupIntroduction",
    to: map.Vingroup,
    role: 'U'
  },
  {
    id: 101,
    parentId: 13,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_VinpearlIntroduction",
    to: map.Vinpearl,
    role: [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1]
  },
  {
    id: 102,
    parentId: 13,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_VinfastIntroduction",
    to: map.Vinfast,
    role: ['V070','V077']
  },
  {
    id: 103,
    parentId: 13,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Menu_VinmecIntroduction",
    to: map.Vinmec,
    role: ['V060']
  },
  // {
  //   id: 16,
  //   parentId: 13,
  //   icon: "menu-bullet-lv2 icon-sub-menu-lv2",
  //   label: "Menu_News",
  //   to: map.News,
  //   role: "U",
  // },
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
    id: 110,
    parentId: 10,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "Welfare",
    role: [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.PHUCLOI], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.BAOHIEM]]
  },
  {
    id: 111,
    parentId: 110,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "InteralWelfare",
    to: map.InteralWelfare,
    role: [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.PHUCLOI]]
  },
  {
    id: 112,
    parentId: 110,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "InsuranceRegime",
    to: map.InsuranceRegime,
    role: [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.BAOHIEM]]
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
    label: "ReferredPositions",
    to: map.PositionIntroduced,
    role: 'U'
  },
  // {
  //   id: 99,
  //   parentId: 10,
  //   icon: "menu-bullet-lv2 icon-sub-menu-lv2",
  //   label: "Phúc lợi",
  //   to: map.Benefit,
  //   role: [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1]
  // },
  {
    id: 19,
    parentId: 18,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "JobRequirements",
    to: map.Job,
    role: [Constants.pnlVCode.VinSmart, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading]
  },
  {
    id: 181,
    parentId: 18,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "JobDescription",
    to: map.JobDescription,
    role: [Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading]
  },
  {
    id: 20,
    parentId: 0,
    icon: "c-notification",
    label: "Menu_Notification",
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
    id: 28,
    parentId: 10,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "timekeeping_history",
    to: map.TimeKeepingHistory,
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
    label2: "Registration",
    to: map.Registration,
    role: 'U'
  },
  {
    id: 98,
    parentId: 0,
    icon: 'c-qa',
    label: "QuestionAndAnswer",
    to: map.QuestionAndAnswer,
    role: [Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1, Constants.pnlVCode.VinSoftware, Constants.pnlVCode.VinMec, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading,
      Constants.pnlVCode.VinSmart, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinAI, Constants.pnlVCode.Vin3S, Constants.pnlVCode.VinHome]
  },
  // {
  //   id: 99999,
  //   parentId: 17,
  //   icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
  //   label: "vaccination",
  //   to: map.VaccineList,
  //   role: 'U'
  // },

  {
    id: 109999,
    parentId: 0,
    icon: 'c-instruct',
    label: "instruct",
    to: map.Instruct,
    role: 'U'
  },
  {
    id: 119999,
    parentId: 10,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "RequestCreate",
    to: map.RegistrationManagement,
    role: [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.NGHIVIEC], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.DIEUCHUYEN], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.BONHIEM], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.THANHTOAN_NOIBO]]
    //role: 'NA'
  },
  // {
  //     id: 129999,
  //     parentId: 10,
  //     icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
  //     label: "ProposedResignation",
  //     to: map.ProposedResignation,
  //     role: ["P","T","P2", "P1", "T4", "T3", "T2", "T1"]
  //     //role: 'NA'
  //   },
];