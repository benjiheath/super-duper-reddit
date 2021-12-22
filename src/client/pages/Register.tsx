import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormBox from '../components/generic/FormBox';
import Form from '../components/register/Form';
import { FormMode } from '../types/general';
import { capitalize } from '../utils/misc';

const Register = () => {
  // using pathname for formMode ('register' or 'login') to allow naviation to /login or /register via browser url
  const { pathname } = useLocation();
  const formattedPathname = capitalize(pathname) as FormMode;
  const [formMode, setFormMode] = useState<FormMode>(formattedPathname);

  return (
    <FormBox title='Super Reddit' subTitle={formMode}>
      <Form formMode={formMode} setFormMode={setFormMode} />
    </FormBox>
  );
};

export default Register;
