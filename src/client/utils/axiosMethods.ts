import axios, { AxiosRequestConfig } from 'axios';
import { axiosOptions, apiUrl } from '../constants';
import { Endpoint, ServerResponse } from './../../common/types/fetching';

enum AxiosMethods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

interface Options extends AxiosRequestConfig {
  queries?: { [key: string]: any };
  params?: string;
}

export const axiosRequest = (method: AxiosMethods) => {
  const request = async <T = ServerResponse>(endpoint: Endpoint, options?: Options): Promise<T> => {
    const requestUrl = options?.params ? `${apiUrl}/${endpoint}/${options?.params}` : `${apiUrl}/${endpoint}`;

    console.log('AXR - apiURL:', apiUrl);
    console.log('AXR - endpoint:', endpoint);
    console.log('AXR - REQUEST URL:', requestUrl);

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

export const axiosGET = axiosRequest(AxiosMethods.GET);
export const axiosPOST = axiosRequest(AxiosMethods.POST);
export const axiosPATCH = axiosRequest(AxiosMethods.PATCH);
export const axiosDELETE = axiosRequest(AxiosMethods.DELETE);
export const axiosPUT = axiosRequest(AxiosMethods.PUT);
