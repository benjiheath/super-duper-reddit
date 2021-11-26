import React from 'react';
import { Text, Link } from '@chakra-ui/react';
import { Link as RRLink } from 'react-router-dom';
import { FormProps } from '../../types/general';

export const FormModeToggler = ({ formMode, setFormMode, reset }: FormProps) => {
  const otherFormMode = formMode === 'Register' ? 'Login' : 'Register';

  return (
    <Text fontSize='sm' mt='25px !important'>
      {formMode === 'Register' ? 'Already have an account?' : "Don't have an account?"}&nbsp;
      <Link
        as={RRLink}
        to={`/${otherFormMode.toLowerCase()}`}
        color='prim.600'
        onClick={() => {
          setFormMode(otherFormMode);
          reset();
        }}
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
