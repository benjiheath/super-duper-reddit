import { Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';

interface Props extends FlexProps {
  children: React.ReactNode;
}

const PageBox = (props: Props) => {
  const { children, ...rest } = props;

  return (
    <Flex
      borderRadius='lg'
      boxShadow={`0px 0px 10px 1px #8a8a8a28`}
      bg='white'
      flexDir='column'
      alignItems='center'
      w='800px'
      m='0 auto'
      p={8}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default PageBox;
