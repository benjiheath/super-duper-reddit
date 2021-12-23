import { Button, Flex, Icon, Link } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link as RRLink } from 'react-router-dom';

interface Props {
  text: string;
  to: string;
  subtle?: boolean;
  icon?: any;
  onClick?: () => void;
}

const RoutingLink = (props: Props) => {
  const { subtle, icon, text, to, onClick } = props;

  const color = subtle ? '#caaec6' : 'inherit';

  return (
    <Link as={RRLink} to={to} color={color} onClick={onClick} fontSize={12}>
      <Flex alignItems='center' justifyContent='center'>
        {icon ? <Icon as={icon} mr={1} /> : null}
        {text}
      </Flex>
    </Link>
  );
};

export default RoutingLink;
