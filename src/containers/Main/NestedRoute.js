import { Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingModal from '../../components/Common/LoadingModal';

export default function NestedRoute({ routes, show }) {
  return routes.map(({ key, component: Content, routeProps }) => {
    return (
      <Route key={key} {...routeProps}
        render={childProps => {
          return (
            <Suspense fallback={<LoadingModal show={true} />}>
              <Content {...childProps} isExpand={show} />
            </Suspense>
          );
        }}
      />
    );
  });
}
