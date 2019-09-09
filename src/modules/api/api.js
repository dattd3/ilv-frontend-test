import axios from "axios";
import { demoCallApi, getPermissions, signinApi } from "./mockCallApi";

export default class Api {
  inject = {
    request: (listener: Listener): number => {
      return this.instance.interceptors.request.use(
        function(config) {
          listener(null, config);
          return config;
        },
        function(error) {
          listener(error);
          return Promise.reject(error);
        }
      );
    },
    response: (listener: Listener): number => {
      return this.instance.interceptors.response.use(
        function(response) {
          listener(null, response);
          return response;
        },
        function(error) {
          listener(error);
          return Promise.reject(error);
        }
      );
    }
  };

  eject = {
    request: (interceptorId: number) => {
      this.instance.interceptors.request.eject(interceptorId);
    },
    response: (interceptorId: number) => {
      this.instance.interceptors.response.eject(interceptorId);
    }
  };
  constructor(url) {
    this.request = axios.create({
      baseURL: url,
      timeout: 5000
    });
  }

  getPermissions = async () => {
    return await getPermissions();
  };

  signin = (username, password) => {
    return signinApi(username, password);
  };

  fetchDemo = async (id, id2) => {
    return demoCallApi(id, id2);
  };
}
