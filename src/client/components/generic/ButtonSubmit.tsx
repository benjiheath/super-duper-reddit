import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  text: string;
  variant?: string;
  loading?: boolean;
  m?: string;
}

const ButtonSubmit = (props: Props) => {
  const { text, variant, loading, m, ...rest } = props;

  return (
    <Button
      borderRadius='md'
      variant={variant || 'primary'}
      color='white'
      type='submit'
      p='15px 30px'
      m={m ? `${m} !important` : '25px 0 0 !important'}
      isDisabled={loading}
      _disabled={{ cursor: 'not-allowed' }}
      isLoading={loading}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default ButtonSubmit;
