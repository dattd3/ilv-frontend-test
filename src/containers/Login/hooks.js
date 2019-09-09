import { useGuardStore } from "../../modules";
import { useEffect } from "react";

export const useNavigate = data => {
  const guard = useGuardStore();
  const navigateEffect = () => {
    if (data) {
      guard.setIsAuth(true);
      guard.setActivity("ChangeUser", true);
    }
  };
  useEffect(navigateEffect, [data]);
};