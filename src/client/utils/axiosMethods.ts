import axios, { AxiosRequestConfig } from 'axios';
import { axiosOptions, url } from '../constants';
import { Endpoint, ServerResponse } from './../../common/types/fetching';

enum AxiosMethods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export const axiosRequest = (method: AxiosMethods) => {
  const request = async <T>(
    endpoint: Endpoint,
    data?: any,
    param?: string,
    options?: AxiosRequestConfig
  ): Promise<T> => {
    const paramWithSlash = param ? `/${param}` : '';

    try {
      const { data: res } = await axios({
        method,
        url: `${url}/${endpoint}${paramWithSlash}`,
        data,
        ...axiosOptions,
        ...options,
      });

      return res;
    } catch (err) {
      throw err;
    }
  };

  return request;
};

export const axiosGET = axiosRequest(AxiosMethods.GET);
export const axiosPOST = axiosRequest(AxiosMethods.POST);
export const axiosPATCH = axiosRequest(AxiosMethods.PATCH);
export const axiosDELETE = axiosRequest(AxiosMethods.DELETE);
export const axiosPUT = axiosRequest(AxiosMethods.PUT);
