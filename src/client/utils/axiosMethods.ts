import axios, { Method } from 'axios';
import { Endpoint } from '../../common/types/endpoints';
import { GetPostsResponse, ServerResponse } from '../../common/types/forms';
import { axiosOptions, url } from '../constants';

type axiosRequestOverload = {
  <T>(method: Method, endpoint: Endpoint, data?: T): Promise<ServerResponse>;
  <T>(method: 'GET', endpoint: 'posts', data?: T): Promise<GetPostsResponse>;
};

export const axiosRequest: axiosRequestOverload = async (method, endpoint, data) => {
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
