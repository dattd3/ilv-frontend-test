import React, { Suspense, useEffect } from "react";
import clsx from "clsx";
import NestedRoute from "./NestedRoute";
import {
  GuardianComponent,
  useApi,
  useFetcher,
  useGuardStore
} from "../../modules";
import { observer } from "mobx-react-lite";

const usePreload = () => {
  const api = useApi();
  const guard = useGuardStore();
  const [data] = useFetcher({
    api: api.getPermissions,
    autoRun: true
  });

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach(activity =>
        guard.setActivity(activity, data[activity])
      );
    }
  }, [data]);
};

function MainLayout(props) {
  usePreload();

  return (
    <>
      <NestedRoute routes={props.routes} />
    </>
  );
}

export default observer(MainLayout);