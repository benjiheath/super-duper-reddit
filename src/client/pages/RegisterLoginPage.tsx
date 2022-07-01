import { Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormBox from '../components/generic/FormBox';
import Form from '../components/register/RegisterLoginForm';
import { FormMode } from '../types/general';
import { capitalize } from '../utils/misc';

const RegisterOrLogin = () => {
  // using pathname for formMode ('register' or 'login') to allow naviation to /login or /register via browser url
  const { pathname } = useLocation();
  const formattedPathname = capitalize(pathname) as FormMode;
  const [formMode, setFormMode] = useState<FormMode>(formattedPathname);

  const minH = formMode === 'Login' ? '450px' : '490px';

  return (
    // <Flex minH='100vh' alignItems='center'>
    <FormBox title='Super Reddit' subTitle={formMode} minH={minH}>
      <Form formMode={formMode} setFormMode={setFormMode} />
    </FormBox>
    // </Flex>
  );
};

export default RegisterOrLogin;
