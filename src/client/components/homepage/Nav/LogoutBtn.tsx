import { Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RRLink } from 'react-router-dom';
import { useGlobalUserContext } from '../../../contexts/user/GlobalUserContext';
import { axiosRequest } from '../../../utils/axiosMethods';

const LogoutBtn = () => {
  const { logOut, setResponseError } = useGlobalUserContext();

  const logOutHandler = async () => {
    await axiosRequest('delete', 'session', setResponseError);
    logOut();
  };

  return (
    <Link as={RRLink} mr={5} to='/login' color='white' onClick={logOutHandler}>
      Log out
    </Link>
  );
};

export default LogoutBtn;
