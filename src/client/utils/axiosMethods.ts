import axios, { AxiosRequestConfig } from 'axios';
import { axiosOptions, apiUrl } from '../constants';
import { Endpoint } from './../../common/types/fetching';

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

interface Options extends AxiosRequestConfig {
  queries?: Record<string, any>;
  params?: string;
}

export const axiosRequest = (method: HttpMethod) => {
  const request = async <A = unknown>(endpoint: Endpoint, options?: Options): Promise<A> => {
    const requestUrl = options?.params ? `${apiUrl}/${endpoint}/${options?.params}` : `${apiUrl}/${endpoint}`;

    try {
      const { data: res } = await axios({
        method,
        url: requestUrl,
        params: options?.queries,
        data: options?.data,
        ...options,
        ...axiosOptions,
      });

      return res;
    } catch (err) {
      throw err;
    }
  };

  return request;
};

export const axiosGET = axiosRequest(HttpMethod.GET);
export const axiosPOST = axiosRequest(HttpMethod.POST);
export const axiosPATCH = axiosRequest(HttpMethod.PATCH);
export const axiosDELETE = axiosRequest(HttpMethod.DELETE);
export const axiosPUT = axiosRequest(HttpMethod.PUT);
