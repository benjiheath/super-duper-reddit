import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { primaryColors } from '../../theme';

interface Props {
  title: string;
}

export default function AlertPop({ title }: Props) {
  return (
    <Alert status='error' borderRadius={6} height={8} bg='prim.50'>
      <AlertIcon color='prim.800' />
      <AlertTitle mr={2} fontSize={12} color='prim.800'>
        {title}
      </AlertTitle>
    </Alert>
  );
}
