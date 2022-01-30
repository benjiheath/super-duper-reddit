import { Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/user/AuthContext';
import { axiosDELETE } from '../../../utils/axiosMethods';

const UserMenu = () => {
  const { logOut, username } = useAuthContext();
  const queryClient = useQueryClient();

  const logOutHandler = async () => {
    await axiosDELETE('session');
    queryClient.removeQueries();
    logOut();
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={Button}
        color='prim.800'
        bg='white'
        _hover={{ bg: 'prim.25' }}
        _active={{ bg: 'prim.25' }}
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
