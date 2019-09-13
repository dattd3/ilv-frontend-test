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
    this.request.defaults.headers.common['SabaCertificate'] = `41353031534E42303037372D33313336363436323636333633353338333233353334354532333545344534313444344535343333333234303536343934453437353234463535353032453445343535343545323335453431333533303331353334453432333033303337333735453233354536353645354635353533354532333545353336313632363135453233354532443331354532333545323434313432343033303244303231353030383939303043423139423039364442434136313634363032463331393236433539393835413833463032313437463638303839364245434246394436363845333046334136344634313244353238453337344135`;
    this.request.defaults.headers.common['Bearer'] = `${accessToken}`;
  }

  removeAuthorization = () => {
    delete this.request.defaults.headers.Authorization;
  }

  getPermissions = async () => {
    return await getPermissions();
  };

  signin = (username, password) => {
    return signinApi(username, password);
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
    return await this.request.post('https://gcofk70fsh.execute-api.ap-southeast-1.amazonaws.com/dev/saba/v1/people/username=tunglt16@vingroup.net/certifications/search?type=internal&includeDetails=true', param);
  }

}
