import axios, { Method } from 'axios';
import { Endpoint } from '../../common/types/endpoints';
import { ServerResponse } from '../../common/types/forms';
import { axiosOptions, url } from '../constants';

export const axiosRequest = async <T extends unknown>(
  method: Method,
  endpoint: Endpoint,
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
