import { Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useGlobalUserContext } from '../../../contexts/user/GlobalUserContext';
import { axiosRequest } from '../../../utils/axiosMethods';

const UserMenu = () => {
  const { logOut, username, setResponseError } = useGlobalUserContext();

  const logOutHandler = async () => {
    await axiosRequest('DELETE', 'session', setResponseError);
    logOut();
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={Button}
        color='prim.800'
        _hover={{ color: 'white', bg: 'prim.800' }}
        _active={{ color: 'white', bg: 'prim.800' }}
        leftIcon={<FaUser />}
        rightIcon={<FaChevronDown />}
      >
        {username}
      </MenuButton>
      <MenuList borderColor='prim.100'>
        <MenuItem variant='primary' _hover={{ bg: 'prim.50' }}>
          Account
        </MenuItem>
        <MenuDivider />
        <Link to='/login'>
          <MenuItem onClick={logOutHandler} _hover={{ bg: 'prim.50' }}>
            Logout
          </MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
