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


  setAuthorization = ({  accessToken }) => {
    this.request.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
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

  fetchSabaUser = async (username) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/info`, {
      params: {
        username: username,
      }
    });
  };

  // training 
  fetchSabaCredit = async (username) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/credits?username=${username}`);
  }

  fetchSabaLearning_OnGoing = async (username, pageIndex, pageSize) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/enrollments`, {
      params: {
        username: username,
        page_no: pageIndex,
        page_size: pageSize
      }
    });
  }

  fetchSabaLearning_Transcript = async (username, status, pageIndex, pageSize) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/transcripts`, {
      params: {
        username: username,
        status: status,
        page_no: pageIndex,
        page_size: pageSize
      }
    });
  }

  fetchSabaIntruction = async (user_id, status, pageIndex, pageSize) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/instruction`, {
      params: {
        user_id: user_id,
        status: status,
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
        count: 1000
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

  fetchKPI = async (username) => {
    return await this.request.get(`${process.env.REACT_APP_TRAINING_URL}v1/app/saba/people/credits`,
      {
        params: {
          username: 'quyennd9@vingroup.net'
        }
      }
    );
  }

};