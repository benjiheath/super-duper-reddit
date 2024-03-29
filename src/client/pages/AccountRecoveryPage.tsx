import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PasswordResetForm, RecoveryEmailForm } from '../components/AccountRecovery';

const AccountRecovery = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:id`}>
        <PasswordResetForm />
      </Route>
      <Route path={match.path}>
        <RecoveryEmailForm />
      </Route>
    </Switch>
  );
};

export default AccountRecovery;
