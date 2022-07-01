import { Spinner, SpinnerProps } from '@chakra-ui/react';

const SrSpinner = (props: SpinnerProps) => (
  <Spinner
    pos='fixed'
    top='30%'
    left='50%'
    transform='translate(-50%, -50%)'
    color='prim.800'
    marginLeft='auto'
    marginRight='auto'
    textAlign='center'
    {...props}
  />
);

export default SrSpinner;
