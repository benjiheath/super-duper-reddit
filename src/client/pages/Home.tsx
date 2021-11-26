import React, { useEffect } from 'react';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { usePostsContext } from '../contexts/posts/PostsContext';
import { NavBar } from '../components/homepage';
import { Switch } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { axiosRequest } from '../utils/axiosMethods';

const Home = () => {
  const { authorized, setResponseError, err } = useGlobalUserContext();
  const { setPosts, posts } = usePostsContext();

  useEffect(() => {
    const getPosts = () => {
      axiosRequest('get', 'posts')
        .then((res) => setPosts(res))
        .catch((err) => setResponseError(err));
    };
    getPosts();
  }, []);

  return (
    <Switch>
      {authorized && (
        <Box>
          <NavBar />
          ddd
        </Box>
      )}
    </Switch>
  );
};

export default Home;
