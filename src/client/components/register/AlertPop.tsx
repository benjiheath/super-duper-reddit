import React from 'react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';

interface Props {
    title: string;
}

export default function AlertPop({ title}: Props) {
  return (
    <Alert status='error' borderRadius={6}>
      <AlertIcon />
      <AlertTitle mr={2} fontSize={12}>
        {title}
      </AlertTitle>
    </Alert>
  );
}