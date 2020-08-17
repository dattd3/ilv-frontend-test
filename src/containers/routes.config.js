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
    routes: [map.Login, map.Auth, map.NewsDetailApp, map.TermPolicy],
  },
};

export default [
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
          key: "position-applied",
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
          key: "timesheet",
          routeProps: {
            exact: true,
            path: map.Timesheet
          },
          component: lazy(() => import("./Timesheet"))
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
          component: lazy(() => import("./PaySlips"))
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
          key: "notify",
          routeProps: {
            exact: true,
            path: map.Notify
          },
          component: lazy(() => import("./Notifications"))
        }, 
        {
          key: "notify-detail",
          routeProps: {
            exact: true,
            path: map.NotifyDetail
          },
          component: lazy(() => import("./Notifications/detail"))
        },
        {
          key: "benefit",
          routeProps: {
            exact: true,
            path: map.Benefit
          },
          component: lazy(() => import("./Benefit"))
        },        
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
      ],
    },
  },
];
