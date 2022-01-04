import { Spinner, SpinnerProps } from '@chakra-ui/react';

const SrSpinner = (props: SpinnerProps) => {
  const { ...rest } = props;

  return <Spinner pos='absolute' top='40%' left='50%' color='prim.800' {...rest} />;
};

export default SrSpinner;
