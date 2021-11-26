import { ServerResponse } from './../../../common/types/forms';
import axios, { Method } from 'axios';
import { axiosOptions, url } from '../constants';

export const axiosRequest = async <T extends unknown>(
  method: Method,
  endpoint: string,
  data?: T
): Promise<ServerResponse> => {
  try {
    const { data: res } = await axios({
      method,
      url: `${url}/${endpoint}`,
      data,
      ...axiosOptions,
    });
    return res;
  } catch (err) {
    throw err;
  }
};
