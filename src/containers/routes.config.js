import { lazy } from "react";
import map from "./map.config";

export const RouteSettings = {
  authorization: {
    defaultRoute: map.Root,
    routes: [map.Root, map.Dashboard]
  },
  unauthorization: {
    defaultRoute: [],
    routes: []
  },
  authentication: {
    defaultRoute: map.Login,
    routes: [map.Login, map.Auth]
  }
}; 

export default [ 
  {
    key: "login",
    routeProps: {
      exact: true,
      path: map.Login
    },
    component: lazy(() => import("./Login"))
  },
  {
    key: "auth",
    routeProps: {
      exact: true,
      path: map.Auth
    },
    component: lazy(() => import("./Login/authozire"))
  },
  {
    key: "main",
    routeProps: { 
      path: map.Root
    },
    component: lazy(() => import("./Main/Main")),
    contentProps: {
      routes: [
        {
          key: "dashboard",
          routeProps: {
            exact: true,
            path: map.Root
          },
          component: lazy(() => import("./Dashboard"))
        },
        {
          key: "dashboard-2",
          routeProps: {
            exact: true,
            path: map.Dashboard
          },
          component: lazy(() => import("./Dashboard"))
        },
        {
          key: "training-certification",
          routeProps: {
            exact: true,
            path: map.Certification
          },
          component: lazy(() => import("./Training/certification"))
        },
        {
          key: "training-roadmap",
          routeProps: {
            exact: true,
            path: map.Roadmap
          },
          component: lazy(() => import("./Training/roadmap"))
        },
        {
          key: "training-learning",
          routeProps: {
            exact: true,
            path: map.Learning
          },
          component: lazy(() => import("./Training/learning"))
        }
      ]
    }
  },
  // NotFound must at end of the routes
  {
    key: "not-found",
    component: lazy(() => import("./NotFound"))
  }
];
