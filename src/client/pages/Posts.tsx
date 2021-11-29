import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { NavBar } from '../components/homepage';
import { NewPost } from '../components/posts';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { axiosRequest } from '../utils/axiosMethods';

const Posts = () => {
  const match = useRouteMatch();
  const { setResponseError } = useGlobalUserContext();

  const [data, setData] = useState(null);

  const getPosts = async () => {
    try {
      const posts: any = await axiosRequest('GET', 'posts');
      setData(posts);
    } catch (err) {
      setResponseError(err);
    }
  };

  getPosts();

  // if (!authorized) {
  //   location.push({ pathname: '/login' });
  // }

  return (
    <Switch>
      <>
        <NavBar />
        <Route path={`${match.path}/create`}>
          <NewPost />
        </Route>
      </>
    </Switch>
  );
};

export default Posts;
