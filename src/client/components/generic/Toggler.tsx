import { Flex, FlexProps, FormLabel, Switch } from '@chakra-ui/react';
import { HorizontalCollapse } from './HorizontalCollapse';

interface Props extends FlexProps {
  label: string;
  htmlFor?: string;
  id?: string;
  onToggle: () => void;
  show: boolean;
}

export const Toggler = (props: Props) => {
  const { label, htmlFor, id, onToggle, show, ...rest } = props;

  return (
    <HorizontalCollapse show={show}>
      <Flex alignItems='center' minW={150} ml={4} {...rest}>
        <FormLabel htmlFor={htmlFor} mb='0'>
          {label}
        </FormLabel>
        <Switch id={id} onChange={onToggle} colorScheme='pink' />
      </Flex>
    </HorizontalCollapse>
  );
};
