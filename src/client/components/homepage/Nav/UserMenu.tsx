import { Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { usePostsContext } from '../../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../../contexts/user/GlobalUserContext';
import { axiosDELETE } from '../../../utils/axiosMethods';

const UserMenu = () => {
  const { logOut, username } = useGlobalUserContext();
  const { setPosts } = usePostsContext();

  const logOutHandler = async () => {
    await axiosDELETE('session');
    logOut();
    setPosts(null);
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
