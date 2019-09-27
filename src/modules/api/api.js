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

  removeAuthorization = () => {
    delete this.request.defaults.headers.Authorization;
  }

  getPermissions = async () => {
    return await getPermissions();
  };

  // user
  fetchUser = async () => {
    return await this.request.get('/api/v1/user/me');
  };

  // training
  fetchCertification = async (type, includeDetails) => {
    let param = {
      type: type,
      includeDetails: includeDetails
    };
    return await this.request.get('https://gcofk70fsh.execute-api.ap-southeast-1.amazonaws.com/dev/saba/v1/people/username=tunglt16@vingroup.net/certifications/search?type=internal&includeDetails=true', param);
  }

  fetchSabaCredit = async (username) => {
    return await this.request.get(`https://dnyxeec805.execute-api.ap-southeast-1.amazonaws.com/dev/v1/app/saba/people/transcripts?username=namnt32@vingroup.net`);
  }

}
