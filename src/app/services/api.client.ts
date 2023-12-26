import { NzMessageService } from 'ng-zorro-antd/message';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { Result } from 'app/store/types/api';
import { ResultEnum } from 'app/store/types/enum';
import { environment } from 'environment/environment';

const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer Token';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) throw new Error(('sys.api.apiRequestFailed'));

    const { status, data, message } = res.data;
    const hasSuccess = data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }
    throw new Error(message || 'sys.api.apiRequestFailed');
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {};
    let errMsg = '';
    try {
      errMsg = response?.data?.message || message;
    } catch (error) {
      throw new Error(error as unknown as string);
    }
    if (!(errMsg)) {
      // checkStatus
      // errMsg = checkStatus(response.data.status);
      errMsg = ('sys.api.errorMessage');
    }
    console.error(errMsg);
    return Promise.reject(error);
  },
);



export class APIClient {
  constructor(private messageService: NzMessageService){}
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}