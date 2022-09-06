import React from 'react';
import { useLocation } from 'react-router-dom';
import FormBox from '../components/generic/FormBox';
import Form from '../components/resisterAndLogin/RegisterLoginForm';
import { capitalize } from '../utils/misc';

export type FormMode = 'Register' | 'Login';

const RegisterOrLogin = () => {
  const { pathname } = useLocation(); // using pathname for formMode ('register' or 'login') to allow naviation to /login or /register via browser url
  const formattedPathname = capitalize(pathname) as FormMode;
  const [formMode, setFormMode] = React.useState<FormMode>(formattedPathname);

  const minH = formMode === 'Login' ? '450px' : '490px';

  return (
    <FormBox title='Super Reddit' subTitle={formMode} minH={minH}>
      <Form formMode={formMode} setFormMode={setFormMode} />
    </FormBox>
  );
};

export default RegisterOrLogin;
