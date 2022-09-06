import React, { Dispatch, SetStateAction } from 'react';
import { Text, Link } from '@chakra-ui/react';
import { Link as RRLink } from 'react-router-dom';
import { FormMode } from '../../pages/RegisterLoginPage';
import { UseFormReset, FieldValues } from 'react-hook-form';

interface Props {
  formMode: 'Register' | 'Login';
  setFormMode: Dispatch<SetStateAction<FormMode>>;
  reset: UseFormReset<FieldValues>;
}

export const FormModeToggler = ({ formMode, setFormMode, reset }: Props) => {
  const otherFormMode = formMode === 'Register' ? 'Login' : 'Register';

  const handleClick = () => {
    setFormMode(otherFormMode);
    reset();
  };

  return (
    <Text fontSize='sm' mt='25px !important'>
      {formMode === 'Register' ? 'Already have an account?' : "Don't have an account?"}&nbsp;
      <Link
        as={RRLink}
        to={`/${otherFormMode.toLowerCase()}`}
        onClick={handleClick}
        color='prim.600'
        border='1px solid transparent'
        borderRadius='4px'
        p='0px 2px 2px'
        _hover={{ bg: 'prim.50', borderColor: 'prim.300' }}
      >
        {otherFormMode}
      </Link>
    </Text>
  );
};
