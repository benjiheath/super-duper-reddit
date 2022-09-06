import axios, { AxiosRequestConfig } from 'axios';
import { apiUrl } from '../constants';
import { Endpoint } from './../../common/types/fetching';

enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export const axiosRequest = (method: HttpMethods) => {
  const request = async <A>(endpoint: Endpoint, options?: AxiosRequestConfig): Promise<A> => {
    const url = options?.params ? `${apiUrl}/${endpoint}/${options?.params}` : `${apiUrl}/${endpoint}`;

    const res = await axios({
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      method,
      url,
      ...options,
    });

    return res.data;
  };

  return request;
};

export const axiosGET = axiosRequest(HttpMethods.GET);
export const axiosPOST = axiosRequest(HttpMethods.POST);
export const axiosPATCH = axiosRequest(HttpMethods.PATCH);
export const axiosDELETE = axiosRequest(HttpMethods.DELETE);
export const axiosPUT = axiosRequest(HttpMethods.PUT);
