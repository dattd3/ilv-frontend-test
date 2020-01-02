import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingModal from '../../components/Common/LoadingModal';
import map from "../map.config";

export default function NestedRoute({ routes }) {
  return routes.map(({ key, component: Content, routeProps }) => {
    return (
      <Route key={key} {...routeProps}
        render={childProps => {
          return (
            <Suspense fallback={<LoadingModal show={true} />}>
              <Content {...childProps} />
            </Suspense>
          );
        }}
      />
    );
  });
}
