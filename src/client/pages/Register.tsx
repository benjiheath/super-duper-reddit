import React, { useState } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Form from '../components/register/Form';
import { FormMode } from '../types/general';
import { capitalize } from '../utils/misc';
import FormBox from '../components/generic/FormBox';

const Register = () => {
  // using pathname for formMode ('register' or 'login') to allow naviation to /login or /register via browser url
  const { pathname } = useLocation();
  const formattedPathname = capitalize(pathname) as FormMode;
  const [formMode, setFormMode] = useState<FormMode>(formattedPathname);

  return (
    <FormBox minH='430px'>
      <Heading as='h1' mb={1} color='prim.800'>
        Super Reddit
      </Heading>
      <Text>{formMode}</Text>
      <Form formMode={formMode} setFormMode={setFormMode} />
    </FormBox>
  );
};

export default Register;
