import { useHistory } from 'react-router-dom';

interface LocationState {
  unauthedUrl?: string;
}

export const useSrHistory = () => {
  const history = useHistory<LocationState>();

  return history;
};
