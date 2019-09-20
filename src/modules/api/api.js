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
    const val = await this.request.get('/api/v1/user/me');
    console.log(val);
    return val;
  };

  // training
  fetchCertification = async (type, includeDetails) => {
    let param = {
      type: type, 
      includeDetails: includeDetails
    };
    return await this.request.post('https://gcofk70fsh.execute-api.ap-southeast-1.amazonaws.com/dev/saba/v1/people/username=tunglt16@vingroup.net/certifications/search?type=internal&includeDetails=true', param);
  }

}
