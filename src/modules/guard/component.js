import React from "react";
import { observer } from "mobx-react-lite";
import { useGuardStore } from "./hooks";

export default observer(function GuardComponent({ children, activity }) {
  const guardStore = useGuardStore();
  if (guardStore.canAccess(activity)) return children;
  return false;
});
