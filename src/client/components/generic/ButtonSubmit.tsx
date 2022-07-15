import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  text: string;
  variant?: string;
  loading?: boolean;
  m?: string;
}

const ButtonSubmit = (props: Props) => {
  const { text, variant, loading, m, size, ...rest } = props;

  return (
    <Button
      borderRadius='md'
      variant={variant || 'primary'}
      color='white'
      type='submit'
      p={size === 'sm' ? '6px 12px' : '15px 30px'} // Todo - refactor to make this less dirty
      m={m ? `${m} !important` : '25px 0 0 !important'}
      h={size === 'sm' ? '30px' : undefined}
      isDisabled={loading}
      isLoading={loading}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default ButtonSubmit;
