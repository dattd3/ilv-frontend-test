import { lazy } from "react";
import map from "./map.config";

export const RouteSettings = {
  authorization: {
    defaultRoute: map.Root,
    routes: [map.Root, map.Dashboard],
  },
  unauthorization: {
    defaultRoute: [],
    routes: [],
  },
  authentication: {
    defaultRoute: map.Login,
    routes: [map.Login, map.Auth, map.NewsDetailApp, map.TermPolicy, map.Maintenance, map.GuestNews, map.HistoryVinGroupMobile],
  },
};

const ROUTES = [
  {
    key: "login",
    routeProps: {
      exact: true,
      path: map.Login,
    },
    component: lazy(() => import("./Login")),
  },
  {
    key: "auth",
    routeProps: {
      exact: true,
      path: map.Auth,
    },
    component: lazy(() => import("./Login/authozire")),
  },
  {
    key: "guest-news",
    routeProps: {
      exact: true,
      path: map.GuestNews,
    },
    component: lazy(() => import("./GuestNews")),
  },
  {
    key: "newsdetailapp",
    routeProps: {
      exact: true,
      path: map.NewsDetailApp,
    },
    component: lazy(() => import("./Corporation/News/App/NewsDetailApp")),
  },
  {
    key: "termpolicy",
    routeProps: {
      exact: true,
      path: map.TermPolicy,
    },
    component: lazy(() => import("./Dashboard/Policy")),
  },
  {
    key: "maintenance",
    routeProps: {
      exact: true,
      path: map.Maintenance
    },
    component: lazy(() => import("../containers/Maintenance"))
  },
  {
    key: "vin30-chronicles-mobile",
    routeProps: {
      exact: true,
      path: map.HistoryVinGroupMobile
    },
    component: lazy(() => import("./Vin30Chronicles/MyBook"))
  },
  {
    key: "main",
    routeProps: {
      path: map.Root,
    },
    component: lazy(() => import("./Main/Main")),
    contentProps: {
      routes: [
        {
          key: "dashboard",
          routeProps: {
            exact: true,
            path: map.Root,
          },
          component: lazy(() => import("./Dashboard")),
        },
        {
          key: "dashboard-2",
          routeProps: {
            exact: true,
            path: map.Dashboard,
          },
          component: lazy(() => import("./Dashboard")),
        },
        {
          key: "training-roadmap",
          routeProps: {
            exact: true,
            path: map.Roadmap,
          },
          component: lazy(() => import("./Training/roadmap")),
        },
        {
          key: "training-roadmap-details",
          routeProps: {
            exact: true,
            path: map.RoadmapDetails,
          },
          component: lazy(() => import("./Training/roadmapdetails")),
        },
        {
          key: "training-learning",
          routeProps: {
            exact: true,
            path: map.Learning,
          },
          component: lazy(() => import("./Training/Learning")),
        },
        {
          key: "training-instruction",
          routeProps: {
            exact: true,
            path: map.Instruction,
          },
          component: lazy(() => import("./Training/Instruction")),
        },
        {
          key: "training-kpi",
          routeProps: {
            exact: true,
            path: map.TraniningKPI,
          },
          component: lazy(() => import("./Training/TrainingKPI")),
        },
        {
          key: "checklist-create",
          routeProps: {
            exact: true,
            path: map.CheckListCreate,
          },
          component: lazy(() => import("./CheckList/Create")),
        },
        {
          key: "checklist-workflow",
          routeProps: {
            exact: true,
            path: map.CheckListWorkflow,
          },
          component: lazy(() => import("./CheckList/Workflow")),
        },
        {
          key: "personal-info",
          routeProps: {
            exact: true,
            path: map.PersonalInfo
          },
          component: lazy(() => import("./PersonalInfo"))
        },
        {
          key: "edit-personal-info",
          routeProps: {
            exact: true,
            path: map.EditPersonalInfo
          },
          component: lazy(() => import("./PersonalInfo/edit/PersonalInfoEdit"))
        },
        {
          key: "position-recruiting",
          routeProps: {
            exact: true,
            path: map.PositionRecruiting
          },
          component: lazy(() => import("./InternalRecruitment/Jobs"))
        },
        {
          key: "position-applied",
          routeProps: {
            exact: true,
            path: map.PositionApplied
          },
          component: lazy(() => import("./InternalRecruitment/history/PositionApplied"))
        },
        {
          key: "position-introduced",
          routeProps: {
            exact: true,
            path: map.PositionIntroduced
          },
          component: lazy(() => import("./InternalRecruitment/history/IntroductedPositionList"))
        },
        {
          key: "position-recruiting-detail",
          routeProps: {
            exact: true,
            path: map.PositionRecruitingDetail
          },
          component: lazy(() => import("./InternalRecruitment/PositionRecruitingDetail"))
        },
        {
          key: "task",
          routeProps: {
            exact: true,
            path: map.Task
          },
          component: lazy(() => import("./Task/"))
        },
        {
          key: "request-task",
          routeProps: {
            exact: true,
            path: map.RequestTask
          },
          component: lazy(() => import("./Task/Request"))
        },
        {
          key: "request-task-edit",
          routeProps: {
            exact: true,
            path: map.RequestTaskEdit
          },
          component: lazy(() => import("./Task/TaskEdit"))
        },
        {
          key: "request-task-detail",
          routeProps: {
            exact: true,
            path: map.RequestTaskDetail
          },
          component: lazy(() => import("./Task/RequestDetail"))
        },
        {
          key: "approval-task",
          routeProps: {
            exact: true,
            path: map.ApprovalTask
          },
          component: lazy(() => import("./Task/Approval"))
        },
        {
          key: "approval-task-detail",
          routeProps: {
            exact: true,
            path: map.ApprovalTaskDetail
          },
          component: lazy(() => import("./Task/ApprovalDetail"))
        },
        {
          key: "timesheet",
          routeProps: {
            exact: true,
            path: map.Timesheet
          },
          component: lazy(() => import("./Timesheet"))
        },
        {
          key: "timekeeping-history",
          routeProps: {
            exact: true,
            path: map.TimeKeepingHistory
          },
          component: lazy(() => import("./TimeKeepingHistory"))
        },
        {
          key: "leaveTime",
          routeProps: {
            exact: true,
            path: map.LeaveTime
          },
          component: lazy(() => import("./LeaveTime"))
        },
        {
          key: "payslips",
          routeProps: {
            exact: true,
            path: map.PaySlips
          },
          component: lazy(() => import("./PaySlips/"))
        },
        {
          key: "working-process",
          routeProps: {
            exact: true,
            path: map.WorkingProcess
          },
          component: lazy(() => import("./PersonalInfo/workingprocess"))
        },
        {
          key: "job",
          routeProps: {
            exact: true,
            path: map.Job,
          },
          component: lazy(() => import("./job")),
        },
        {
          key: "job-description",
          routeProps: {
            exact: true,
            path: map.JobDescription,
          },
          component: lazy(() => import("./JobDescription")),
        },
        {
          key: "job-upload",
          routeProps: {
            exact: true,
            path: map.JobUpload,
          },
          component: lazy(() => import("./job/upload")),
        },
        {
          key: "news",
          routeProps: {
            exact: true,
            path: map.News,
          },
          component: lazy(() => import("./Corporation/News/ListNews")),
        },
        {
          key: "newsdetail",
          routeProps: {
            exact: true,
            path: map.NewsDetail,
          },
          component: lazy(() => import("./Corporation/News/NewsDetail")),
        },
        {
          key: "about-vingroup",
          routeProps: {
            exact: true,
            path: map.Vingroup,
          },
          component: lazy(() => import("./Corporation/Vingroup")),
        },
        {
          key: "about-vinpearl",
          routeProps: {
            exact: true,
            path: map.Vinpearl,
          },
          component: lazy(() => import("./Corporation/Vinpearl")),
        },
        {
          key: "about-vinfast",
          routeProps: {
            exact: true,
            path: map.Vinfast,
          },
          component: lazy(() => import("./Corporation/Vinfast")),
        },
        {
          key: "about-vinmec",
          routeProps: {
            exact: true,
            path: map.Vinmec,
          },
          component: lazy(() => import("./Corporation/Vinmec")),
        },
        {
          key: "notifications",
          routeProps: {
            exact: true,
            path: map.Notifications
          },
          component: lazy(() => import("./Notifications/index"))
        },
        {
          key: "notifications-unread",
          routeProps: {
            exact: true,
            path: map.NotificationsUnRead
          },
          component: lazy(() => import("./Notifications/ListNotificationsUnRead/ListNotificationsUnRead"))
        }, 
        {
          key: "notification-detail",
          routeProps: {
            exact: true,
            path: map.NotificationDetail
          },
          component: lazy(() => import("./Notifications/Detail/Detail"))
        },
        // {
        //   key: "benefit",
        //   routeProps: {
        //     exact: true,
        //     path: map.Benefit
        //   },
        //   component: lazy(() => import("./Benefit"))
        // },        
        {
          key: "kpi",
          routeProps: {
            exact: true,
            path: map.Kpi
          },
          component: lazy(() => import("./KPI"))
        },        
        {
          key: "kpi-detail",
          routeProps: {
            exact: true,
            path: map.KpiDetail
          },
          component: lazy(() => import("./KPI/KPIDetail"))
        },
        {
          key: "forbidden",
          routeProps: {
            exact: true,
            path: "/access-denied",
          },
          component: lazy(() => import("./AccessDenied")),
        },
        {
          key: "not-found",
          routeProps: {
            exact: true,
            path: "/not-found",
          },
          component: lazy(() => import("./NotFound")),
        },
        {
          key: "handover",
          routeProps: {
            exact: true,
            path: map.HandOverForm,
          },
          component: lazy(() => import("./Handover")),
        },
        {
          key: "registration",
          routeProps: {
            exact: true,
            path: map.Registration
          },
          component: lazy(() => import("./Registration"))
        },
        {
          key: "registration-detail-request",
          routeProps: {
            exact: true,
            path: map.RegistrationDetailRequest
          },
          component: lazy(() => import("./Registration/RegistrationDetailComponent"))
        },
        {
          key: "registration-detail-approval",
          routeProps: {
            exact: true,
            path: map.RegistrationDetailApproval
          },
          component: lazy(() => import("./Registration/RegistrationDetailComponent"))
        },
        {
          key: "registration-detail-consent",
          routeProps: {
            exact: true,
            path: map.RegistrationDetailConsent
          },
          component: lazy(() => import("./Registration/RegistrationDetailComponent"))
        },
        {
          key: "edit-registration",
          routeProps: {
            exact: true,
            path: map.RegistrationEdit
          },
          component: lazy(() => import("./Registration/RegistrationEditComponent"))
        },
        {
          key: "evalution-edit",
          routeProps: {
            exact: true,
            path: map.Evaluation
          },
          component: lazy(() => import("./Registration/ContractEvaluation"))
        },
        {
          key: "question-and-answer",
          routeProps: {
            exact: true,
            path: map.QuestionAndAnswer
          },
          component: lazy(() => import("./QuestionAndAnswer"))
        },
        {
          key: "question-and-answer-details",
          routeProps: {
            exact: true,
            path: map.QuestionAndAnswerDetails
          },
          component: lazy(() => import("./QuestionAndAnswer/QuestionAndAnswerDetails"))
        },

        {
          key: "leave-fund",
          routeProps: {
            exact: true,
            path: map.LeaveFund
          },
          component: lazy(() => import("./LeaveFund"))
          // component: lazy(() => import("./WorkflowManagement/DepartmentManagement/LeaveFund"))
        },
        {
          key: "personal-details",
          routeProps: {
            exact: true,
            path: map.PersonalDetails
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/PersonalDetails"))
        },
        {
          key: "change-shift-report",
          routeProps: {
            exact: true,
            path: map.ChangeShiftReport
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/ChangeShiftReport"))
        },
        {
          key: "employee-timesheets",
          routeProps: {
            exact: true,
            path: map.EmployeeTimeSheets
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/EmployeeTimesheets/index"))
        },
        {
          key: "proposal-management",
          routeProps: {
            exact: true,
            path: map.ProposalManagement
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/ProposalManagement"))
        },
        {
          key: "salaryadjustment",
          routeProps: {
            exact: true,
            path: map.SalaryAdjustmentPropse
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/ProposalManagement/SalaryAdjustmentPropse"))
        },
        {
          key: "proposed-transfer",
          routeProps: {
            exact: true,
            path: map.TransferProposal
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/ProposalManagement/SalaryAdjustmentPropse"))
        },
        {
          key: "proposed-appointment",
          routeProps: {
            exact: true,
            path: map.AppointProposal
          },
          component: lazy(() => import("./WorkflowManagement/DepartmentManagement/ProposalManagement/SalaryAdjustmentPropse"))
        },
        {
          key: "vaccination",
          routeProps: {
            exact: true,
            path: map.VaccineList
          },
          component: lazy(() => import("./Vaccination/List"))
        },
        {
          key: "instruct",
          routeProps: {
            exact: true,
            path: map.Instruct
          },
          component: lazy(() => import("./Instruct"))
        },
        {
          key: "dtls",
          routeProps: {
            exact: true,
            path: map.VinmecDTLS
          },
          component: lazy(() => import("./VinmecDTLS"))
        },
        {
          key: "clinic-vinmec",
          routeProps: {
            exact: true,
            path: map.ClinicVinmec,
          },
          component: lazy(() => import("./Corporation/Vinmec")),
        },
        {
          key: "list-projects",
          routeProps: {
            exact: true,
            path: map.ListProjects,
          },
          component: lazy(() => import("./ProjectInformation/ListProjects")),
        },
        {
          key: "my-projects",
          routeProps: {
            exact: true,
            path: map.MyProjects,
          },
          component: lazy(() => import("./ProjectInformation/MyProjects")),
        },
        {
          key: "my-project-detail",
          routeProps: {
            exact: true,
            path: map.MyProjectDetail,
          },
          component: lazy(() => import("./ProjectInformation/ProjectDetail")),
        },
        {
          key: "project-detail",
          routeProps: {
            exact: true,
            path: map.ProjectDetail,
          },
          component: lazy(() => import("./ProjectInformation/ProjectDetail")),
        },
        {
          key: "my-profile",
          routeProps: {
            exact: true,
            path: map.MyProfile,
          },
          component: lazy(() => import("./ProjectInformation/MyProfile")),
        },
        {
          key: `evaluation-target-management`,
          routeProps: {
            exact: true,
            path: map.TargetManagement,
          },
          component: lazy(() => import("./Evaluation/TargetManagement/")),
        },
        {
          key: "my-evaluation",
          routeProps: {
            exact: true,
            path: map.MyEvaluation,
          },
          component: lazy(() => import("./Evaluation/MyEvaluation")),
        },
        {
          key: "evaluation-approval",
          routeProps: {
            exact: true,
            path: map.EvaluationApproval,
          },
          component: lazy(() => import("./Evaluation/EvaluationApproval")),
        },
        {
          key: "evaluation-detail",
          routeProps: {
            exact: true,
            path: map.EvaluationDetail,
          },
          // component: lazy(() => import("./Evaluation/Detail")),
          component: lazy(() => import("./Evaluation/Detail/")),
        },
        {
          key: "support-onboard",
          routeProps: {
            exact: true,
            path: map.SupportOnBoarding
          },
          component: lazy(() => import("./TaskRecruitment/SupportOnboard"))
        },
        {
          key: "evaluation-onboard",
          routeProps: {
            exact: true,
            path: map.EvaluationManager
          },
          component: lazy(() => import("./TaskRecruitment/Evalution"))
        },
        {
          key: "registration-management",
          routeProps: {
            exact: true,
            path: map.RegistrationManagement
          },
          component: lazy(() => import("./Registration/RegistrationManagement/index"))
        },
        {
          key: "registration-salary-adjustment",
          routeProps: {
            exact: true,
            path: map.RegistrationSalaryAdjustment
          },
          component: lazy(() => import("./Registration/RegistrationManagement/SalaryAdjustmentPropose"))
        },
        {
          key: "registration-transfer",
          routeProps: {
            exact: true,
            path: map.RegistrationTransferAppoint
          },
          component: lazy(() => import("./Registration/RegistrationManagement/SalaryAdjustmentPropose"))
        },
        {
          key: "registration-employment-termination",
          routeProps: {
            exact: true,
            path: map.RegistrationEmploymentTermination
          },
          component: lazy(() => import("./Registration/RegistrationEmploymentTermination/RegistrationTermination"))
        },
        {
          key: "proposed-resignation",
          routeProps: {
            exact: true,
            path: map.ProposedResignation
          },
          component: lazy(() => import("./Registration/RegistrationEmploymentTermination/ProposedResignation"))
        },
        {
          key: "resignation-requests-management",
          routeProps: {
            exact: true,
            path: map.ResignationRequestsManagement
          },
          component: lazy(() => import("./Registration/RegistrationEmploymentTermination/ResignationRequestsManagement"))
        },
        {
          key: "contract-termination-interview",
          routeProps: {
            exact: true,
            path: map.ContractTerminationInterview
          },
          component: lazy(() => import("./Registration/RegistrationEmploymentTermination/ContractTerminationInterview"))
        },
        {
          key: "create-contract-termination-interview",
          routeProps: {
            exact: true,
            path: map.CreateContractTerminationInterview
          },
          component: lazy(() => import("./Registration/RegistrationEmploymentTermination/ContractTerminationInterview"))
        },
        {
          key: "contract-termination-interview-export",
          routeProps: {
            exact: true,
            path: map.ContractTerminationInterviewExport
          },
          component: lazy(() => import("./Registration/RegistrationEmploymentTermination/ContractTerminationInterview"))
        },
        {
          key: "internal-welfare",
          routeProps: {
            exact: true,
            path: map.InteralWelfare
          },
          component: lazy(() => import("./Welfare/InternalWelfare"))
        },
        {
          key: "insurance-regime",
          routeProps: {
            exact: true,
            path: map.InsuranceRegime
          },
          component: lazy(() => import("./Welfare/InsuranceRegime"))
        },
        {
          key: "create-insurance-social",
          routeProps: {
            exact: true,
            path: map.CreateInsuranceSocial
          },
          component: lazy(() => import("./Welfare/CreateInsuranceSocial"))
        },
        {
          key: "create-insurance-health",
          routeProps: {
            exact: true,
            path: map.CreateInsuranceHealth
          },
          component: lazy(() => import("./Welfare/CreateInsuranceHealth"))
        },
        {
          key: "export-insurance-social",
          routeProps: {
            exact: true,
            path: map.ExportInsuranceSocial
          },
          component: lazy(() => import("./Welfare/InsuranceDetailComponents/ExportInsuranceSocial"))
        },
        {
          key: "detail-insurance-social",
          routeProps: {
            exact: true,
            path: map.DetailInsuranceSocial
          },
          component: lazy(() => import("./Welfare/InsuranceDetailComponents/DetailInsuranceSocial"))
        },
        {
          key: "detail-insurance-health",
          routeProps: {
            exact: true,
            path: map.DetailInsuranceHealth
          },
          component: lazy(() => import("./Welfare/DetailInsuranceHealth"))
        },
        {
          key: "evaluation-salary-propse",
          routeProps: {
            exact: true,
            path: map.SalaryPropse
          },
          component: lazy(() => import("./Registration/ContractEvaluation/SalaryPropose"))
        },
        {
          key: "Vin30-chronicles",
          routeProps: {
            exact: true,
            path: map.Vin30Chronicles
          },
          component: lazy(() => import("./Vin30Chronicles/index"))
        },
        {
          key: "registration-internal-payment",
          routeProps: {
            exact: true,
            path: map.RegistrationInternalPayment
          },
          component: lazy(() => import("./Welfare/InternalPayment/CreateInternalPayment"))
        },
        {
          key: "employee-privileges",
          routeProps: {
            exact: true,
            path: map.EmployeePrivileges
          },
          component: lazy(() => import("./Dashboard/EmployeePrivileges"))
        },
        {
          key: "employee-privilege-detail",
          routeProps: {
            exact: true,
            path: map.EmployeePrivilegeDetail,
          },
          component: lazy(() => import("./Corporation/News/EmployeePrivilegeDetail")),
        },
        {
          key: "vingroup-history",
          routeProps: {
            exact: true,
            path: map.HistoryVingroup,
          },
          component: lazy(() => import("./VingroupCulture/VingroupHistory")),
        },
        {
          key: "vingroup-history-gallery",
          routeProps: {
            exact: true,
            path: map.HistoryVingroupGallery
          },
          component: lazy(() => import("./VingroupCulturalGallery"))
        },
        {
          key: "vingroup-culture-gallery",
          routeProps: {
            exact: true,
            path: map.VingroupCultureGallery
          },
          component: lazy(() => import("./VingroupCulturalGallery"))
        },
        {
          key: "6-values-gallery",
          routeProps: {
            exact: true,
            path: map.SixCoreValuesGallery
          },
          component: lazy(() => import("./VingroupCulturalGallery"))
        },
        {
          key: "6-gorv-gallery",
          routeProps: {
            exact: true,
            path: map.SixGovernancePrinciplesGallery
          },
          component: lazy(() => import("./VingroupCulturalGallery"))
        },
        {
          key: "working-env-gallery",
          routeProps: {
            exact: true,
            path: map.WorkingEnvironmentGallery
          },
          component: lazy(() => import("./VingroupCulturalGallery"))
        },
        // {
        //   key: "great-start-up-spirit-gallery",
        //   routeProps: {
        //     exact: true,
        //     path: map.GreatStartUpSpiritGallery
        //   },
        //   component: lazy(() => import("./VingroupCulturalGallery"))
        // },
        {
          key: "vingroup-culture",
          routeProps: {
            exact: true,
            path: map.VingroupCulture,
          },
          component: lazy(() => import("./VingroupCulture/VingroupCulture")),
        },
        {
          key: "6-core-values",
          routeProps: {
            exact: true,
            path: map.SixCoreValues,
          },
          component: lazy(() => import("./VingroupCulture/6CoreValues")),
        },
        {
          key: "6-governance-principles",
          routeProps: {
            exact: true,
            path: map.SixGovernancePrinciples,
          },
          component: lazy(() => import("./VingroupCulture/6GovernancePrinciples")),
        },
        {
          key: "working-environment",
          routeProps: {
            exact: true,
            path: map.WorkingEnvironment,
          },
          component: lazy(() => import("./VingroupCulture/WorkingEnvironment")),
        },
        {
          key: "great-start-up-spirit",
          routeProps: {
            exact: true,
            path: map.GreatStartUpSpirit,
          },
          component: lazy(() => import("./VingroupCulture/GreatStartUpSpirit")),
        },
        {
          key: "internal-news-list",
          routeProps: {
            exact: true,
            path: map.InternalNewsList,
          },
          component: lazy(() => import("./InternalNews")),
        },
        {
          key: "internal-news-detail",
          routeProps: {
            exact: true,
            path: map.InternalNewsDetail,
          },
          component: lazy(() => import("./InternalNews/Detail")),
        },
        {
          key: "registration-detail-contribution",
          routeProps: {
            exact: true,
            path: map.SocialContributeDetail,
          },
          component: lazy(() => import("./Welfare/WelfareComponents/SocialContributeInfoDetail")),
        },
        {
          key: "registration-detail-support-insurance",
          routeProps: {
            exact: true,
            path: map.SocialSupportDetail,
          },
          component: lazy(() => import("./Welfare/WelfareComponents/SocialSupportInfoDetail")),
        },
        {
          key: "recruitment",
          routeProps: {
            exact: true,
            path: map.Recruitment,
          },
          component: lazy(() => import("./Recruitment/")),
        },
      ],
    },
  },
];

export default ROUTES;