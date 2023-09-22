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
    id: 9951,
    parentId: 995,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "VingroupHistory",
    //to: map.HistoryVingroup,
    role: "U",
  },
  {
    id: 9952,
    parentId: 995,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "VingroupHistoryGeneral",
    // to: map.HistoryVingroup,
    role: "U",
  },
  {
    id: 9953,
    parentId: 995,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "SixCoreValues",
    // to: map.HistoryVingroup,
    role: "U",
  },
  {
    id: 9953,
    parentId: 995,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "SixManagementRules",
    // to: map.HistoryVingroup,
    role: "U",
  },
  {
    id: 9953,
    parentId: 995,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "VingroupWorkingEnvironment",
    // to: map.HistoryVingroup,
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
    role: [Constants.pnlVCode.VinMec],
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
    role: ["C2", "C1","C", "P2", "P1", "T4", "T3", "T2", "T1", "T0"]
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
    role: ["C2", "C1","C", "P2", "P1", "P","T","P2", "P1", "T4", "T3", "T2", "T1"]
  },
  {
    id: 4,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_Intruction",
    to: map.Instruction,
    role: ["P","T","P2", "P1", "T4", "T3", "T2", "T1"],
  },
  {
    id: 5,
    parentId: 2,
    icon: "menu-bullet-lv2 icon-sub-menu-lv2",
    label: "Menu_TrainingRoadmap",
    to: map.Roadmap,
    role: ["P","T","P2", "P1", "T4", "T3", "T2", "T1"],
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
  {
    id: 99999,
    parentId: 17,
    icon: 'menu-bullet-lv2 icon-sub-menu-lv2',
    label: "vaccination",
    to: map.VaccineList,
    role: 'U'
  },

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

{
  "searchType": "Images",
  "query": "github",
  "totalResults": 459,
  "nextOffset": 36,
  "currentOffset": 0,
  "value": [
      {
          "title": "GitHub Logo, symbol, meaning, history, PNG, brand",
          "thumbnail": "https://img-api.weoja.com/api/v1/images/image.jpg?id=OIP.8SVgggxQcO5L6Dw_61ac4QHaEK&pid=Api",
          "publishedAt": "2020-12-02T21:12:00.0000000Z",
          "contentUrl": "https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png",
          "hostPageUrl": "https://logos-world.net/github-logo/",
          "size": "20226 B",
          "format": "png",
          "width": 3840,
          "height": 2160,
          "thumbnailWidth": 474,
          "thumbnailHeight": 474,
          "imageToken": "ccid_8SVgggxQ*cp_D255B3778A74310B0C95387AD426DE44*mid_A4B3536F2F2962CEB2CC25C3A9AA99F8F4F3D597*simid_608044623837332858*thid_OIP.8SVgggxQcO5L6Dw!_61ac4QHaEK",
          "imageId": "A4B3536F2F2962CEB2CC25C3A9AA99F8F4F3D597",
          "accentColor": "666666"
      }
  ],
  "expansions": [
      {
          "text": "GitHub Icon",
          "displayText": "Icon",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Icon&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Icon%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Icon&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Icon%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Icon&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub SVG",
          "displayText": "SVG",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+SVG&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22SVG%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+SVG&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22SVG%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+SVG&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub PNG",
          "displayText": "PNG",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+PNG&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22PNG%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+PNG&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22PNG%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+PNG&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Mascot",
          "displayText": "Mascot",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Mascot&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Mascot%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Mascot&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Mascot%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Mascot&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub UI",
          "displayText": "UI",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+UI&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22UI%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+UI&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22UI%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+UI&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub API",
          "displayText": "API",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+API&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22API%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+API&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22API%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+API&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Software",
          "displayText": "Software",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Software&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Software%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Software&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Software%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Software&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Emoji",
          "displayText": "Emoji",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Emoji&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Emoji%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Emoji&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Emoji%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Emoji&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "Microsoft GitHub",
          "displayText": "Microsoft",
          "webSearchUrl": "https://www.weoja.com/images/search?q=Microsoft+GitHub&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Microsoft%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=Microsoft+GitHub&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Microsoft%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Microsoft+GitHub&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Banner",
          "displayText": "Banner",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Banner&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Banner%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Banner&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Banner%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Banner&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Jpg",
          "displayText": "Jpg",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Jpg&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Jpg%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Jpg&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Jpg%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Jpg&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Desktop",
          "displayText": "Desktop",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Desktop&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Desktop%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Desktop&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Desktop%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Desktop&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Pages",
          "displayText": "Pages",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Pages&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Pages%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Pages&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Pages%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Pages&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Readme",
          "displayText": "Readme",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Readme&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Readme%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Readme&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Readme%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Readme&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Background",
          "displayText": "Background",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Background&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Background%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Background&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Background%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Background&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Projects",
          "displayText": "Projects",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Projects&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Projects%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Projects&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Projects%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Projects&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Profile Picture",
          "displayText": "Profile",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Profile+Picture&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Profile%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Profile+Picture&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Profile%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Profile+Picture&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "Git and GitHub",
          "displayText": "Git",
          "webSearchUrl": "https://www.weoja.com/images/search?q=Git+and+GitHub&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Git%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=Git+and+GitHub&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Git%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Git+and+GitHub&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Button",
          "displayText": "Button",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Button&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Button%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Button&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Button%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Button&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Workflow",
          "displayText": "Workflow",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Workflow&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Workflow%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Workflow&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Workflow%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Workflow&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      }
  ],
  "pivotSuggestions": [
      {
          "pivot": "github",
          "suggestions": [
              {
                  "text": "Zoho Office Suite",
                  "displayText": "Zoho Office Suite",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Zoho+Office+Suite&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Zoho+Office+Suite%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Zoho+Office+Suite&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Zoho+Office+Suite%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Zoho+Office+Suite&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "Bitbucket",
                  "displayText": "Bitbucket",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Bitbucket&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Bitbucket%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Bitbucket&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Bitbucket%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Bitbucket&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "ZDNet",
                  "displayText": "ZDNet",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=ZDNet&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22ZDNet%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=ZDNet&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22ZDNet%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=ZDNet&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "Trello",
                  "displayText": "Trello",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Trello&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Trello%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Trello&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Trello%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Trello&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "Quora",
                  "displayText": "Quora",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Quora&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Quora%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Quora&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Quora%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Quora&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "Tuenti",
                  "displayText": "Tuenti",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Tuenti&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Tuenti%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Tuenti&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Tuenti%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Tuenti&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "Gitorious",
                  "displayText": "Gitorious",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Gitorious&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Gitorious%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Gitorious&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Gitorious%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Gitorious&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              },
              {
                  "text": "Rackspace",
                  "displayText": "Rackspace",
                  "webSearchUrl": "https://www.weoja.com/images/search?q=Rackspace&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Rackspace%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
                  "searchLink": "https://www.weoja.com/api/v1/images/search?q=Rackspace&tq=%7b%22pq%22%3a%22github+-site%3abbc.com+-site%3avoatiengviet.com+-site%3arfi.fr+-site%3aviettan.org+-site%3arfa.org+-site%3ahung-viet.org+-site%3ai.pinimg.com+-site%3a3.bp.blogspot.com+-site%3aamnesty.org+-site%3abbc.co.uk+-site%3avoanews.com+-site%3ablogspot.com+-site%3adanchimviet.info+-site%3acanhco.net+-site%3ahochiminh69.wordpress.com+-site%3asachhiem.net%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22github%22%2c%22pv%22%3a%22github%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.com%22%2c%22pv%22%3a%22-site%3abbc.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoatiengviet.com%22%2c%22pv%22%3a%22-site%3avoatiengviet.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfi.fr%22%2c%22pv%22%3a%22-site%3arfi.fr%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aviettan.org%22%2c%22pv%22%3a%22-site%3aviettan.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3arfa.org%22%2c%22pv%22%3a%22-site%3arfa.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahung-viet.org%22%2c%22pv%22%3a%22-site%3ahung-viet.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ai.pinimg.com%22%2c%22pv%22%3a%22-site%3ai.pinimg.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22pv%22%3a%22-site%3a3.bp.blogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3aamnesty.org%22%2c%22pv%22%3a%22-site%3aamnesty.org%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3abbc.co.uk%22%2c%22pv%22%3a%22-site%3abbc.co.uk%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3avoanews.com%22%2c%22pv%22%3a%22-site%3avoanews.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ablogspot.com%22%2c%22pv%22%3a%22-site%3ablogspot.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3adanchimviet.info%22%2c%22pv%22%3a%22-site%3adanchimviet.info%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3acanhco.net%22%2c%22pv%22%3a%22-site%3acanhco.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22pv%22%3a%22-site%3ahochiminh69.wordpress.com%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22-site%3asachhiem.net%22%2c%22pv%22%3a%22-site%3asachhiem.net%22%2c%22hps%22%3afalse%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Rackspace%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&setLang=vi",
                  "thumbnail": {
                      "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Rackspace&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
                  }
              }
          ]
      },
      {
          "pivot": "-site:bbc.com",
          "suggestions": []
      },
      {
          "pivot": "-site:voatiengviet.com",
          "suggestions": []
      },
      {
          "pivot": "-site:rfi.fr",
          "suggestions": []
      },
      {
          "pivot": "-site:viettan.org",
          "suggestions": []
      },
      {
          "pivot": "-site:rfa.org",
          "suggestions": []
      },
      {
          "pivot": "-site:hung-viet.org",
          "suggestions": []
      },
      {
          "pivot": "-site:i.pinimg.com",
          "suggestions": []
      },
      {
          "pivot": "-site:3.bp.blogspot.com",
          "suggestions": []
      },
      {
          "pivot": "-site:amnesty.org",
          "suggestions": []
      },
      {
          "pivot": "-site:bbc.co.uk",
          "suggestions": []
      },
      {
          "pivot": "-site:voanews.com",
          "suggestions": []
      },
      {
          "pivot": "-site:blogspot.com",
          "suggestions": []
      },
      {
          "pivot": "-site:danchimviet.info",
          "suggestions": []
      },
      {
          "pivot": "-site:canhco.net",
          "suggestions": []
      },
      {
          "pivot": "-site:hochiminh69.wordpress.com",
          "suggestions": []
      },
      {
          "pivot": "-site:sachhiem.net",
          "suggestions": []
      }
  ],
  "relatedSearches": [
      {
          "text": "GitHub Icon",
          "displayText": "GitHub Icon",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Icon&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Icon&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Icon&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub SVG",
          "displayText": "GitHub SVG",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+SVG&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+SVG&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+SVG&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub UI",
          "displayText": "GitHub UI",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+UI&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+UI&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+UI&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub API",
          "displayText": "GitHub API",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+API&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+API&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+API&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Mascot",
          "displayText": "GitHub Mascot",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Mascot&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Mascot&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Mascot&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub PNG",
          "displayText": "GitHub PNG",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+PNG&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+PNG&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+PNG&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Emoji",
          "displayText": "GitHub Emoji",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Emoji&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Emoji&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Emoji&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Software",
          "displayText": "GitHub Software",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Software&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Software&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Software&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Jpg",
          "displayText": "GitHub Jpg",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Jpg&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Jpg&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Jpg&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "Microsoft GitHub",
          "displayText": "Microsoft GitHub",
          "webSearchUrl": "https://www.weoja.com/images/search?q=Microsoft+GitHub&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=Microsoft+GitHub&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Microsoft+GitHub&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Banner",
          "displayText": "GitHub Banner",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Banner&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Banner&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Banner&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Projects",
          "displayText": "GitHub Projects",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Projects&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Projects&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Projects&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Desktop",
          "displayText": "GitHub Desktop",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Desktop&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Desktop&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Desktop&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Readme",
          "displayText": "GitHub Readme",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Readme&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Readme&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Readme&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Pages",
          "displayText": "GitHub Pages",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Pages&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Pages&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Pages&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Button",
          "displayText": "GitHub Button",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Button&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Button&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Button&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "Git and GitHub",
          "displayText": "Git and GitHub",
          "webSearchUrl": "https://www.weoja.com/images/search?q=Git+and+GitHub&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=Git+and+GitHub&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=Git+and+GitHub&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Background",
          "displayText": "GitHub Background",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Background&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Background&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Background&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Workflow",
          "displayText": "GitHub Workflow",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Workflow&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Workflow&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Workflow&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Profile Picture",
          "displayText": "GitHub Profile Picture",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Profile+Picture&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Profile+Picture&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Profile+Picture&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Badges",
          "displayText": "GitHub Badges",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Badges&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Badges&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Badges&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Desktop Logo",
          "displayText": "GitHub Desktop Logo",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Desktop+Logo&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Desktop+Logo&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Desktop+Logo&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub CoPilot",
          "displayText": "GitHub CoPilot",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+CoPilot&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+CoPilot&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+CoPilot&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Branch",
          "displayText": "GitHub Branch",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Branch&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Branch&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Branch&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Interface",
          "displayText": "GitHub Interface",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Interface&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Interface&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Interface&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Stickers",
          "displayText": "GitHub Stickers",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Stickers&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Stickers&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Stickers&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Vector",
          "displayText": "GitHub Vector",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Vector&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Vector&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Vector&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Branching",
          "displayText": "GitHub Branching",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Branching&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Branching&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Branching&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Cloud",
          "displayText": "GitHub Cloud",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Cloud&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Cloud&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Cloud&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      },
      {
          "text": "GitHub Meme",
          "displayText": "GitHub Meme",
          "webSearchUrl": "https://www.weoja.com/images/search?q=GitHub+Meme&FORM=IRPATC",
          "searchLink": "https://www.weoja.com/api/v1/images/search?q=GitHub+Meme&setLang=vi",
          "thumbnail": {
              "thumbnailUrl": "https://img-api.weoja.com/api/v1/images/image.jpg?q=GitHub+Meme&pid=Api&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&thvar=defctrl"
          }
      }
  ]
}