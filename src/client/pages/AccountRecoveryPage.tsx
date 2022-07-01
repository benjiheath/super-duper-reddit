import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { RecoveryEmailForm, PasswordResetForm } from '../components/AccountRecovery';

const AccountRecovery = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      {/* <Flex minH='100vh' alignItems='center'> */}
      <Route path={`${match.path}/:id`}>
        <PasswordResetForm />
      </Route>
      <Route path={match.path}>
        <RecoveryEmailForm />
      </Route>
      {/* </Flex> */}
    </Switch>
  );
};

export default AccountRecovery;
