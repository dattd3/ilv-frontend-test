import React from "react";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useGuardStore } from "./hooks";

const Root = "/";

export default observer(function Guard({ children, settings, ...routeProps }) {
  const { path } = routeProps.match;
  const guardStore = useGuardStore();
  const { unauthorization, authorization, authentication } = settings;
  // if (path === Root && routeProps.location.pathname !== Root) {
  //   return children(routeProps);
  // }
  // debugger 
  if (unauthorization.routes.includes(path)) {
    return children(routeProps);
  }

  if (guardStore.isAuthenticated) {
    if (authorization.routes.includes(path)) 
    {
      return children(routeProps);
    }
    else {
      return <Redirect to={authorization.defaultRoute} />;
    }
  }

  if (authentication.routes.includes(path)) {
    return children(routeProps);
  }
  else {
    return <Redirect to={authentication.defaultRoute} />;
  }
  
});