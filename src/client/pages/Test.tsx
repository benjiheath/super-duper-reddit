import React, { useState } from 'react';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { axiosRequest } from '../utils/axiosMethods';

const Test = () => {
  const { setResponseError } = useGlobalUserContext();
  const [data, setData] = useState(null);

  const getPosts = async () => {
    const posts: any = await axiosRequest('GET', 'posts', setResponseError);
    setData(posts);
  };

  getPosts();

  return <div>secret data: {data ? data : 'not auth'}</div>;
};

export default Test;
