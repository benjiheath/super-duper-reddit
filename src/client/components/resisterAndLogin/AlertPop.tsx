import { Alert, AlertIcon, AlertProps, AlertTitle } from '@chakra-ui/react';
import { primaryColors } from '../../theme';

interface Props extends AlertProps {
  title: string;
}

export default function AlertPop(props: Props) {
  const { title, ...rest } = props;
  return (
    <Alert status='error' borderRadius={6} height={8} bg='prim.50' {...rest}>
      <AlertIcon color='prim.800' />
      <AlertTitle mr={2} fontSize={12} color='prim.800'>
        {title}
      </AlertTitle>
    </Alert>
  );
}
