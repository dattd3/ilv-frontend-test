import React, { Suspense } from "react";
import { Route } from "react-router-dom";

export default function NestedRoute({ routes }) {
  return routes.map(({ key, component: Content, routeProps }) => {
    return (
      <Route
        key={key}
        {...routeProps}
        render={childProps => {
          return (
            <Suspense fallback={"loading..."}>
              <Content {...childProps} />
            </Suspense>
          );
        }}
      />
    );
  });
}
