import React from "react";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useGuardStore } from "./hooks";

const Root = "/";

export default observer(function Guard({ children, settings, ...routeProps }) {
  const { path } = routeProps.match;
  const guardStore = useGuardStore();
  let callBackUrl = null;
  const { unauthorization, authorization, authentication } = settings;
  // if (path === Root && routeProps.location.pathname !== Root) {
  //   return children(routeProps);
  // }
  // debugger 
  if (unauthorization.routes.includes(path)) {
    return children(routeProps);
  }

  if (guardStore.isAuthenticated) {
    if (localStorage.getItem("callbackUrl")) {
      callBackUrl = localStorage.getItem("callbackUrl");
      localStorage.removeItem('callbackUrl');
      return <Redirect to={callBackUrl} />;
    }
    else if (authorization.routes.includes(path)) 
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
    if (routeProps.location.pathname != "/" && !authentication.routes.includes(routeProps.location.pathname)) {
      localStorage.setItem('callbackUrl', routeProps.location.pathname);
    }
    return <Redirect to={authentication.defaultRoute} />;
  }
  
});