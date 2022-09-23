import axios from "axios";
import { getPermissions } from "./mockCallApi";
import { getMuleSoftHeaderConfigurations } from "../../commons/Utils"

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
    },
  };

  eject = {
    request: (interceptorId) => {
      this.request.interceptors.request.eject(interceptorId);
    },
    response: (interceptorId) => {
      this.request.interceptors.response.eject(interceptorId);
    },
  };

  constructor(url) {
    this.request = axios.create({
      baseURL: url,
      timeout: 20000,
    });
  }

  setAuthorization = ({ accessToken }) => {
    this.request.defaults.headers.common["Authorization"] = `${accessToken}`;
  };

  setLanguage = (language) => {
    this.request.defaults.headers.common["accept-language"] = language;
  };

  removeAuthorization = () => {
    delete this.request.defaults.headers.Authorization;
  };

  getPermissions = async () => {
    return await getPermissions();
  };

  // user
  // fetchUser = async () => {
  //   return await this.request.get("user/me");
  // };

  // fetchSabaUser = async () => {
  //   return await this.request.get(
  //     `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/info`
  //   );
  // };

  // training
  fetchSabaCredit = async () => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/credits`
    );
  };

  fetchSabaLearning_OnGoing = async (pageIndex, pageSize, year) => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/enrollments`,
      {
        params: {
          page_no: pageIndex,
          page_size: pageSize,
          year: year
        },
      }
    );
  };

  fetchSabaLearning_Transcript = async (status, pageIndex, pageSize, year) => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/transcripts`,
      {
        params: {
          status: status,
          page_no: pageIndex,
          page_size: pageSize,
          year: year
        },
      }
    );
  };

  fetchSabaIntruction = async (user_id, status, pageIndex, pageSize, year) => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/instruction`,
      {
        params: {
          user_id: '',//user_id,
          status: status,
          page_no: pageIndex,
          page_size: pageSize,
          year: year
        },
      }
    );
  };

  fetchRoadmapList = async () => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/curriculums`,
      {
        params: {
          startPage: 1,
          count: 1000,
        },
      }
    );
  };

  fetchRoadmapDetails = async (id) => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/curriculums/detail`,
      {
        params: {
          id: id,
        },
      }
    );
  };

  fetchKPI = async () => {
    return await this.request.get(
      `${process.env.REACT_APP_TRAINING_URL}v2/app/saba/people/credits`
    );
  };

  fetchPersonCommonInfo = async () => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}user/GetPersonCommonInfo`
    );
  };

  /* News  */
  fetchNewsOnHome = async () => {
    return await this.request.get(`/article/listhome`);
  };

  fetchArticleList = async (pageIndex, pageSize) => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}article/list`,
      {
        params: {
          domain: "",
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      }
    );
  };

  fetchArticleDetail = async (id) => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}article/detail`,
      {
        params: {
          id: id,
        },
      }
    );
  };

  fetchArticleOthers = async (id, count) => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}article/listothers`,
      {
        params: {
          id: id,
          count: count,
        },
      }
    );
  };

  fetchBenefit = async (jobType) => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}basicinfo/benefit/${jobType}`,
      {
        params: {},
      }
    );
  };

  uploadBenefit = async (data, config) => {
    return await this.request.post(
      `${process.env.REACT_APP_REQUEST_URL}basicinfo/benefit/upload`,
      data,
      config
    );
  };

  uploadJobDescription = async (data, config) => {
    return await this.request.post(
      `${process.env.REACT_APP_REQUEST_URL}basicinfo/job/upload-description`,
      data,
      config
    );
  };

  uploadJobIds = async (data, config) => {
    return await this.request.post(
      `${process.env.REACT_APP_REQUEST_URL}basicinfo/job/upload-ids`,
      data,
      config
    );
  };

  fetchJobDescription = async (jobCode) => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}basicinfo/job/${jobCode}`,
      {
        params: {},
      }
    );
  };

  fetchJobDescriptionByJobType = async (jobtype) => {
    return await this.request.get(
      `${process.env.REACT_APP_REQUEST_URL}basicinfo/job`,
      {
        params: { jobtype },
      }
    );
  };

  fetchListNotifications = async (companyCode, page, pageSize, level3, level4, level5, keyword) => {
     return await this.request.get(`${process.env.REACT_APP_REQUEST_URL}notifications`, {
        params: {     
          companyCode: companyCode,     
          page: page,
          pageSize: pageSize,
          level3: level3,
          level4: level4,
          level5: level5,
          keyword: keyword
        }
      });
  };

  fetchNotificationsUnReadLimitation = async (companyCode, level3, level4, level5) => {
    return await this.request.get(`${process.env.REACT_APP_REQUEST_URL}notifications-unread-limitation`, {
      params: {     
        companyCode: companyCode,     
        level3: level3,
        level4: level4,
        level5: level5
      }
    });
  };

  getPhoneSupportForRegion = async (region) => {
    return await this.request.post(`${process.env.REACT_APP_REQUEST_URL}hotline/list?regionName=${region}`, {
      params: {}
    });
  };

  fetchNotificationsUnRead = async (companyCode, page, pageSize, level3, level4, level5, keyword) => {
    return await this.request.get(`${process.env.REACT_APP_REQUEST_URL}notifications-unread`, {
      params: {
        companyCode: companyCode,
        page: page,
        pageSize: pageSize,
        level3: level3,
        level4: level4,
        level5: level5,
        keyword: keyword
      }
    });
  };

  getPeriodKpiGeneral = async () => {
    const config = getMuleSoftHeaderConfigurations()
    return await this.request.get(`${process.env.REACT_APP_MULE_HOST}api/sap/successfactor/v2/period/general`, config);
  };
  
  fetchListKpiGeneralAll = async () => {
    const config = getMuleSoftHeaderConfigurations()
    return await this.request.get(`${process.env.REACT_APP_MULE_HOST}api/sap/successfactor/v2/kpi/general/all`, config);
  };

  fetchNotificationDetail = async (notifyId) => {
     return await this.request.get(`${process.env.REACT_APP_REQUEST_URL}notification/detail`, {
        params: {          
          notifyId: notifyId          
        }
      });
  }

  // fetch vacancies
  fetchVacancies = async (page_no, page_size) => {
    return await this.request.get(`${process.env.REACT_APP_REQUEST_URL}api/vacancies`, {
      params: {          
        page_no: page_no,
        page_size: page_size
      }
    })
 };

 fetchIntroduce = async (id) => {
   return await this.request.get(`${process.env.REACT_APP_REQUEST_URL}article/detail`, {
     params: {
       id: id
     }
   })
 }

}
