import { HStack, Icon, IconProps, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { CommentType, PostType } from '../../../common/types/entities';
import { useUpdateCommentVotesMutation } from '../../hooks/mutations/useUpdateCommentVotesMutation';
import { useUpdatePostVotesMutation } from '../../hooks/mutations/useUpdatePostVotesMutation';

interface VoteIconProps extends IconProps {
  icon: IconType;
  voteValue: -1 | 1;
  itemId: string;
  currentVoteValue: -1 | 1 | null;
  mode: 'comment' | 'post';
  postId: string;
  postSlugs: string;
}

const VoteIcon = (props: VoteIconProps) => {
  const { icon, voteValue, itemId, currentVoteValue, mode, postId, postSlugs, ...rest } = props;
  const resultantVoteValue = voteValue === currentVoteValue ? 0 : voteValue;
  const slugsAndVoteValue = { postSlugs, voteValue: resultantVoteValue };
  const updatePostVotesMutation = useUpdatePostVotesMutation({
    postId,
    ...slugsAndVoteValue,
  });
  const updateCommentVotesMutation = useUpdateCommentVotesMutation({
    commentId: itemId,
    ...slugsAndVoteValue,
  });

  const isPost = mode === 'post';

  const handleClick = async () => {
    try {
      isPost ? updatePostVotesMutation.mutate() : updateCommentVotesMutation.mutate();
    } catch (err) {
      console.error('Err updating votes:', err);
    }
  };

  const hoverFill = voteValue === 1 ? 'sec.800' : 'prim.600';
  const hoverBg = voteValue === 1 ? 'sec.100' : 'prim.50';

  return (
    <Icon
      as={icon}
      h={isPost ? 8 : 6}
      w={isPost ? 8 : 6}
      p={1}
      transition='0.15s'
      _hover={{ bg: hoverBg, fill: hoverFill }}
      cursor='pointer'
      borderRadius={4}
      _active={{ transform: 'scale(0.8)' }}
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
    <HStack spacing={-1}>{props.children}</HStack>
  );

interface VotesProps {
  item: PostType | CommentType;
  mode: 'post' | 'comment';
  postSlugs: string;
  postId: string;
}

const Votes = (props: VotesProps) => {
  const { item, mode, postSlugs, postId } = props;
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
        postId={postId}
        postSlugs={postSlugs}
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
        postId={postId}
        postSlugs={postSlugs}
      />
    </Container>
  );
};

export default Votes;
