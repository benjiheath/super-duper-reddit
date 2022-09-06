import { Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/user/AuthContext';
import { axiosDELETE } from '../../../utils/axiosMethods';
import { AlertPopup } from '../../generic';
import { useToggle } from '../../../hooks/useToggle';

const UserMenu = () => {
  const auth = useAuthContext();
  const queryClient = useQueryClient();
  const [alertIsOpen, toggleAlert] = useToggle();

  const logOutHandler = async () => {
    await axiosDELETE('session');
    queryClient.removeQueries();
    auth.logOut();
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={Button}
        color='prim.800'
        bg='white'
        _hover={{ bg: 'prim.50' }}
        _active={{ bg: 'prim.50' }}
        leftIcon={<FaUser />}
        rightIcon={<FaChevronDown />}
      >
        {auth.username}
      </MenuButton>
      <MenuList borderColor='prim.100'>
        <MenuItem variant='primary' _hover={{ bg: 'prim.50' }} onClick={toggleAlert}>
          Account
        </MenuItem>
        <MenuDivider />
        <Link to='/login'>
          <MenuItem onClick={logOutHandler} _hover={{ bg: 'prim.50' }}>
            Logout
          </MenuItem>
        </Link>
      </MenuList>
      <AlertPopup
        body='To be implemented!'
        onConfirm={toggleAlert}
        isOpen={alertIsOpen}
        title='Sowwy'
        benign
      />
    </Menu>
  );
};

export default UserMenu;
