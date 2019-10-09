import axios from "axios";
import { getPermissions } from "./mockCallApi";

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
      timeout: 20000
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
  fetchSabaCredit = async (username) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/transcripts?username=namnt32@vingroup.net`);
  }

  fetchSabaEnrollments = async (username, pageIndex, pageSize) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/enrollments`, {
      params: {
        username: username,
        page_no: pageIndex,
        page_size: pageSize
      }
    });
  }

  fetchRoadmapList = async () => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/curriculums`, {
      params: {
        username: 'trangdt28@vingroup.net',
        startPage: 1,
        count: 10
      }
    });
  }

  fetchRoadmapDetails = async (id, username) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/curriculums/${id}`,
      {
        params: {
        username: username
      }
      }
    );
  }

};