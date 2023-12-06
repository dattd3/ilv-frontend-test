const MapConfig = {
  Root: "/",
  Dashboard: "/dashboard",
  Login: "/login",
  Auth: "/auth",
  TermPolicy: "/policy",
  GuestNews: "/guest-news/:id",

  // Training
  Roadmap: "/training-roadmap",
  RoadmapDetails: "/training/roadmap-detail/:id",
  Learning: "/training-learning",
  Instruction: "/training-instruction",
  TraniningKPI: "/training-kpi",
  PersonalInfo: "/personal-info",
  EditPersonalInfo: "/personal-info/edit",
  Timesheet: "/timesheet",
  TimeKeepingHistory: "/timekeeping-history",
  LeaveTime: "/leaveTime",
  WorkingProcess: "/working-process",
  // Benefit: "/benefit",

  Notifications: "/notifications",
  NotificationsUnRead: "/notifications-unread",
  NotificationDetail: "/notifications/:id",

  //Checklist
  CheckListCreate: "/checklist/create",
  CheckListWorkflow: "/checklist/workflow",

  NewsDetailApp: "/news-app/:id",
  News: "/news",
  NewsDetail: "/news/:slug/:id",
  EmployeePrivileges: "/employee-privileges",
  EmployeePrivilegeDetail: "/employee-privileges/:slug/:id",

  //about us
  Vingroup: "/about-vingroup",
  Vinpearl: "/about-vinpearl",
  Vinfast: "/about-vinfast",
  Vinmec: "/about-vinmec",

  NotFound: "/not-found",
  AccessDenied: "/access-denied",
  // BenefitUpload: "/benefit/upload",
  JobUpload: "/job/upload",
  Job: "/job",
  JobDescription: '/job-description',
  Kpi: "/kpi",
  KpiDetail: "/kpi/:id",
  PositionRecruiting: "/position-recruiting",
  PositionApplied: "/position-applied",
  PositionIntroduced: "/position-introduced",
  PositionRecruitingDetail: "/position-recruiting-detail/:id",
  PaySlips: "/payslips",

  //Task
  Task: "/tasks",
  RequestTask: "/tasks/request",
  ApprovalTask: "/tasks/approval",
  RequestTaskDetail: "/tasks-request/:id",
  ApprovalTaskDetail: "/tasks-approval/:id",

  //stream 2
  SupportOnBoarding: "/support-onboard",
  EvaluationManager: "/evaluation-manager",

  //Registration
  Registration: "/registration",
  RegistrationEdit: "/registration/:id/edit",
  RequestTaskEdit: "/tasks-request/:id/:childId/edit",
  ApprovalTaskDetail: "/tasks-approval/:id",
  RegistrationDetailRequest: "/registration/:id/:childId/request",
  RegistrationDetailApproval: "/registration/:id/:childId/approval",
  RegistrationDetailConsent: "/registration/:id/:childId/consent",

  // Registration Management for employee proposal
  RegistrationManagement: "/registration-management",
  RegistrationSalaryAdjustment: "/registration-salary-adjustment/:id/:type",
  RegistrationTransferAppoint: "/registration-transfer/:id/:type",
  RegistrationEmploymentTermination: "/registration-employment-termination",

  ProposedResignation: "/proposed-resignation",
  ResignationRequestsManagement: "/management-resignation-requests",
  CreateContractTerminationInterview: "/contract-termination-interview",
  ContractTerminationInterview: "/contract-termination-interview/:id",
  ContractTerminationInterviewExport: "/contract-termination-interview/:id/:type",
  //Evalution
  Evaluation: '/evaluation/:id/:type',

  //Handover
  HandOverForm: "/handover/:id/request",

  //Q&A
  QuestionAndAnswer: "/question-and-answer",
  QuestionAndAnswerDetails:"/question-and-answer-details/:id",

  //workflow management
  EmployeeTimeSheets: "/employee-timesheet-management",
  LeaveFund: "/leave-fund-management",
  PersonalDetails: "/personal-detail-management",
  ProposalManagement: "/proposal-management",
  SalaryAdjustmentPropse: "/salaryadjustment/:id/:type",
  TransferProposal: "/proposed-transfer/:id/:type",
  AppointProposal: "/proposed-appointment/:id/:type",

  //Vaccine
  VaccineList: "/vaccination",
  Instruct: "/instruct",
  VinmecDTLS: "/VinmecDTLS",
  ClinicVinmec: "/clinic-vinmec",
  ChangeShiftReport: "/change-shift-report-management",

  // Thông tin dự án
  ListProjects: "/list-projects",
  MyProjects: "/my-projects",
  ProjectDetail: "/project/:id",
  MyProfile: "/my-profile",

  // Đánh giá
  // Evaluation: "",
  TargetManagement: "/target-management",
  EvaluationDetail: "/evaluations/:id/:formCode/:version",
  MyEvaluation: "/my-evaluation",
  EvaluationApproval: "/evaluation-approval",
  
  MyProjectDetail: "/my-projects/project/:id",

  //Phúc lợi
  InteralWelfare: '/welfare-manager',
  InsuranceRegime: '/insurance-manager',
  CreateInsuranceSocial: '/insurance-manager/createSocialInsurance',
  CreateInsuranceHealth: '/insurance-manager/createHealthInsurance',
  DetailInsuranceSocial: '/insurance-manager/detail/:id/:action',
  ExportInsuranceSocial: '/insurance-manager/export/:id',
  DetailInsuranceHealth: '/insurance-manager/detail-health/:id',
  SalaryPropse: '/salarypropse/:idContract/:idSalary/:type',

  Maintenance: '/maintenance',
  
  // Thanh toán phúc lợi nội bộ
  RegistrationInternalPayment: "/benefit-claim-request",

  // Vingroup culture
  Vin30Chronicles: "/vin30-chronicles",
  Vin30ChroniclesMobile: "/vin30-chronicles-mobile",

  // Internal news
  InternalNewsList: "/internal-news",
  InternalNewsDetail: "/internal-news/detail/:id",
  CreateSocialDistributeInfo: "/insurance-manager/social-contribute-info",
  //thông tin đóng BHXH
  SocialContributeDetail: "/social-contribute/:id/:type",
  //thông tin liên quan BH
  SocialSupportDetail: "/social-support/:id/:type",

  VingroupEmployeePrivileges: "/vingroup-employee-privileges",
  MyVoucher: "/my-voucher",
  MyVoucherNoticeDetail: "/my-voucher/notices/:id",
};

export default MapConfig;