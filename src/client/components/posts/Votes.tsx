import { HStack, Icon, IconProps, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { CommentType, PostType } from '../../../common/types/entities';
import { useUpdateCommentVotesMutation, useUpdatePostVotesMutation } from '../../hooks/fetching';

interface VoteIconProps extends IconProps {
  icon: IconType;
  voteValue: -1 | 1;
  itemId: string;
  currentVoteValue: -1 | 1 | null;
  mode: 'comment' | 'post';
}

const VoteIcon = (props: VoteIconProps) => {
  const { icon, voteValue, itemId, currentVoteValue, mode, ...rest } = props;
  const actualVoteValue = voteValue === currentVoteValue ? 0 : voteValue;
  const updatePostVotesMutation = useUpdatePostVotesMutation(itemId, actualVoteValue);
  const updateCommentVotesMutation = useUpdateCommentVotesMutation(itemId, actualVoteValue);

  const handleClick = async () => {
    try {
      mode === 'post' ? updatePostVotesMutation.mutate() : updateCommentVotesMutation.mutate();
    } catch (err) {
      console.error('PostVotes update err:', err);
    }
  };

  const hoverFill = voteValue === 1 ? 'sec.800' : 'prim.600';
  const hoverBg = voteValue === 1 ? 'sec.100' : 'prim.50';

  return (
    <Icon
      as={icon}
      h={8}
      w={8}
      p={1}
      transition='0.15s'
      _hover={{ bg: hoverBg, fill: hoverFill }}
      cursor='pointer'
      borderRadius={4}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      {...rest}
    />
  );
};

interface ContainerProps {
  children: React.ReactNode;
  mode: 'post' | 'comment';
}

const Container = (props: ContainerProps) =>
  props.mode === 'post' ? (
    <VStack spacing={0}>{props.children}</VStack>
  ) : (
    <HStack spacing={1}>{props.children}</HStack>
  );

interface VotesProps {
  item: PostType | CommentType;
  mode: 'post' | 'comment';
}

const Votes = (props: VotesProps) => {
  const { item, mode } = props;
  const { points, id, userVoteStatus } = item;

  const pointsColor = points && points >= 1 ? 'sec.800' : 'prim.800';

  const upFill = userVoteStatus === 1 ? 'sec.800' : 'gray.200';
  const downFill = userVoteStatus === -1 ? 'prim.900' : 'gray.200';

  return (
    <Container mode={mode}>
      <VoteIcon
        icon={FaAngleUp}
        voteValue={1}
        itemId={id}
        fill={upFill}
        currentVoteValue={userVoteStatus}
        mode={mode}
      />
      <Text
        color={!points ? 'gray.100' : pointsColor}
        minW={mode === 'comment' ? '20px' : 'unset'}
        textAlign='center'
      >
        {points ?? 0}
      </Text>
      <VoteIcon
        icon={FaAngleDown}
        voteValue={-1}
        itemId={id}
        fill={downFill}
        currentVoteValue={userVoteStatus}
        mode={mode}
      />
    </Container>
  );
};

export default Votes;
