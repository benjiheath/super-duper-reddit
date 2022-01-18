import { HStack, Icon, IconProps, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { CommentType, PostType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { axiosPATCH } from '../../utils/axiosMethods';

interface VoteIconProps extends IconProps {
  icon: IconType;
  voteValue: -1 | 1;
  itemId: string;
  currentVoteValue: -1 | 1 | null;
  mode: 'comment' | 'post';
}

const VoteIcon = (props: VoteIconProps) => {
  const { icon, voteValue, itemId, currentVoteValue, mode, ...rest } = props;
  const { updatePost, postInView, setPostInView } = usePostsContext();
  const { userId } = useGlobalUserContext();

  const itemIdKey = mode === 'post' ? 'postId' : 'commentId';

  const payload = {
    userId,
    [itemIdKey]: itemId,
    voteValue: voteValue === currentVoteValue ? 0 : voteValue,
  };

  const handleClick = async () => {
    try {
      if (mode === 'post') {
        const updatedPost = await axiosPATCH<PostType>('posts/votes', { data: payload });
        updatePost(updatedPost);
        if (postInView?.id === updatedPost.id) {
          setPostInView(updatedPost);
        }
      } else if (mode === 'comment') {
        const updatedComment = await axiosPATCH<CommentType>('posts/comments/votes', { data: payload });
        const updatedComments = postInView!.comments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
        const updatedPost: PostType = {
          ...postInView!,
          comments: updatedComments,
        };
        setPostInView(updatedPost);
      }
    } catch (err) {
      console.log('PostVotes fetch err:', err);
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

  interface ContainerProps {
    children: React.ReactNode;
  }

  const Container = (props: ContainerProps) => {
    const { children } = props;

    if (mode === 'post') {
      return <VStack spacing={0}>{children}</VStack>;
    }

    return <HStack spacing={1}>{children}</HStack>;
  };

  return (
    <Container>
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