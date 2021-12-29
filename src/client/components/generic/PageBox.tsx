import { Flex, Heading, HeadingProps, Text } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const PageBox = (props: Props) => {
  const { children } = props;

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
    >
      {children}
    </Flex>
  );
};

export default PageBox;
