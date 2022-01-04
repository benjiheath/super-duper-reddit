import { Flex, FlexProps, Heading, HeadingProps, Text } from '@chakra-ui/react';
import React from 'react';

interface Props extends FlexProps {
  children: React.ReactNode;
  secondary?: any;
  title: string;
  subTitle?: string;
  minH?: string;
  headingSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const FormBox = (props: Props) => {
  const { children, secondary, title, subTitle, headingSize, minH, ...rest } = props;

  const heaadingStyles: HeadingProps = secondary
    ? { as: 'h1', color: 'sec.900' }
    : { as: 'h2', color: 'prim.800' };

  return (
    <Flex
      textAlign='center'
      m='auto'
      p='50px'
      borderRadius='lg'
      boxShadow={`0px 0px 10px 1px #8a8a8a28`}
      bg='white'
      flexDir='column'
      alignItems='center'
      minH={minH}
      {...rest}
    >
      <Heading {...heaadingStyles} mb={3} size={headingSize || 'xl'}>
        {title}
      </Heading>
      <Text>{subTitle}</Text>
      {children}
    </Flex>
  );
};

export default FormBox;
