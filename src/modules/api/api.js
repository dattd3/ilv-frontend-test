import axios from "axios";
import { demoCallApi, getPermissions, signinApi } from "./mockCallApi";

export default class Api {
  inject = {
    request: (listener) => {
      return this.request.interceptors.request.use(
        function (config) {
          listener(null, config);
          return config;
        },
        function (error) {
          listener(error);
          return Promise.reject(error);
        }
      );
    },
    response: (listener) => {
      return this.request.interceptors.response.use(
        function (response) {
          listener(null, response);
          return response;
        },
        function (error) {
          listener(error);
          return Promise.reject(error);
        }
      );
    }
  };

  eject = {
    request: (interceptorId) => {
      this.request.interceptors.request.eject(interceptorId);
    },
    response: (interceptorId) => {
      this.request.interceptors.response.eject(interceptorId);
    }
  };
  constructor(url) {
    this.request = axios.create({
      baseURL: url,
      timeout: 5000
    });
  }

  setAuthorization = ({ tokenType, accessToken }) => {
    this.request.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`;
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

  fetchUser = async () => {
    return await this.request.get('/api/user');
  }
}
