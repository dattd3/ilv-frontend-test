import { createContext, useContext, useMemo, useState, useEffect } from "react";
import Api from "./api";

export const ApiContext = createContext();

export const useApiMemo = url => {
  return useMemo(() => new Api(url), [url]);
};

export const useApi = () => {
  return useContext(ApiContext);
};

export const useFetcher = settings => {
  const { api, autoRun = false, params = [] } = settings;
  const [data, setData] = useState();
  const [error, setError] = useState();

  const request = useMemo(() => {
    return async function request(...args) {
    setError();
      try {
        const response = await api.apply(undefined, args);
        setData(() => response.data);
      } catch (e) {
        setError(() => e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  useEffect(() => {
    if (autoRun) request(...params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, ...params]);

  return [data, error, request];
};
