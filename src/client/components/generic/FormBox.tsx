import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  p?: string;
  m?: string;
  w?: number | string;
  minH?: string;
  maxW?: string;
  fontSize?: string;
  secondary?: any;
}

const FormBox = ({ children, p, m, w, minH, fontSize, secondary, maxW }: Props) => {
  return (
    <Box
      textAlign='center'
      fontSize={fontSize || 'xl'}
      w={w || 440}
      m={m || '25vh auto 0'}
      justifySelf='center !important'
      p={p || '40px 10px 10px 10px'}
      borderRadius='lg'
      // border={`2px solid ${secondary ? '#00d97728' : '#FFE3F0'}`}
      boxShadow={`0px 0px 10px 1px #8a8a8a28`}
      minH={minH}
      maxW={maxW}
      bg='white'
    >
      {children}
    </Box>
  );
};

export default FormBox;
