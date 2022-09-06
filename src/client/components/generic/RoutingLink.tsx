import { Flex, Icon, Link, LinkProps } from '@chakra-ui/react';
import { Link as RRLink } from 'react-router-dom';

interface Props extends LinkProps {
  text: string;
  to: string;
  subtle?: boolean;
  icon?: any;
  onClick?: () => void;
}

const RoutingLink = (props: Props) => {
  const { subtle, icon, text, to, onClick, ...rest } = props;

  const color = subtle ? '#caaec6' : 'inherit';

  return (
    <Link as={RRLink} to={to} color={color} onClick={onClick} fontSize={12} {...rest}>
      <Flex alignItems='center' justifyContent='center' mt={2}>
        {icon ? <Icon as={icon} mr={1} /> : null}
        {text}
      </Flex>
    </Link>
  );
};

export default RoutingLink;
