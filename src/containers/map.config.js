export default {
  Root: "/",
  Dashboard: "/dashboard",
  Login: "/login",
  Auth: "/auth",
  TermPolicy: "/policy",

  // Training
  Roadmap: "/training/roadmap",
  RoadmapDetails: "/training/roadmap-detail/:id",
  Learning: "/training/learning",
  Instruction: "/training/instruction",
  TraniningKPI: "/training/kpi",
  PersonalInfo: "/personal-info",
  EditPersonalInfo: "/personal-info/edit",
  Timesheet: "/timesheet",
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

  //Registration
  Registration: "/registration",
  RegistrationEdit: "/registration/:id/edit",
  RequestTaskEdit: "/tasks-request/:id/:childId/edit",
  ApprovalTaskDetail: "/tasks-approval/:id",
  RegistrationDetailRequest: "/registration/:id/:childId/request",
  RegistrationDetailApproval: "/registration/:id/:childId/approval",
  RegistrationDetailConsent: "/registration/:id/:childId/consent",
  RegistrationEmploymentTermination: "/registration-employment-termination",
  ProposedResignation: "/proposed-resignation",
  ResignationRequestsManagement: "/management-resignation-requests",
  //Evalution
  Evaluation: '/evaluation/:id/:type',

  //Q&A
  QuestionAndAnswer: "/question-and-answer",
  QuestionAndAnswerDetails:"/question-and-answer-details/:id"
};
