import { lazy } from "react";
import map from "./map.config";

export const RouteSettings = {
  authorization: {
    defaultRoute: map.Root,
    routes: [map.Main, map.Root, map.Dashboard]
  },
  unauthorization: {
    defaultRoute: map.About,
    routes: [map.About]
  },
  authentication: {
    defaultRoute: map.Login,
    routes: [map.Login, map.Auth]
  }
}; 

export default [
  {
    key: "home",
    routeProps: {
      path: map.Root,
      exact: true
    },
    component: lazy(() => import("./Home"))
  },
  {
    key: "main",
    routeProps: {
      path: map.Main
    },
    component: lazy(() => import("./Main/Main")),
    contentProps: {
      routes: [
        {
          key: "dashboard",
          routeProps: {
            exact: true,
            path: map.Dashboard
          },
          component: lazy(() => import("./Dashboard/index"))
        }
      ]
    }
  },
  {
    key: "about",
    routeProps: {
      exact: true,
      path: map.About
    },
    component: lazy(() => import("./About"))
  }, 
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
  // NotFound must at end of the routes
  {
    key: "not-found",
    component: lazy(() => import("./NotFound"))
  }
];
