import { IconProps, Icon, VStack, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { PostType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { axiosPATCH } from '../../utils/axiosMethods';

interface VoteIconProps extends IconProps {
  icon: IconType;
  voteValue: -1 | 1;
  postId: string;
  currentVoteValue: -1 | 1 | null;
}

const VoteIcon = (props: VoteIconProps) => {
  const { icon, voteValue, postId, currentVoteValue, ...rest } = props;
  const { updatePost, postInView, setPostInView } = usePostsContext();
  const { userId } = useGlobalUserContext();

  const payload = {
    userId: userId,
    postId,
    voteValue: voteValue === currentVoteValue ? 0 : voteValue,
  };

  const handleClick = async () => {
    try {
      const updatedPost = await axiosPATCH<PostType>('posts/votes', { data: payload });
      updatePost(updatedPost);
      if (postInView?.id === updatedPost.id) {
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

interface PostVotesProps {
  post: PostType;
}

const PostVotes = (props: PostVotesProps) => {
  const { post } = props;
  const { points, id } = post;

  const pointsColor = points && points >= 1 ? 'sec.800' : 'prim.800';

  const upFill = post.userVoteStatus === 1 ? 'sec.800' : 'gray.200';
  const downFill = post.userVoteStatus === -1 ? 'prim.900' : 'gray.200';

  return (
    <VStack spacing={0}>
      <VoteIcon
        icon={FaAngleUp}
        voteValue={1}
        postId={id}
        fill={upFill}
        currentVoteValue={post.userVoteStatus}
      />
      <Text color={!points ? 'gray.100' : pointsColor}>{points}</Text>
      <VoteIcon
        icon={FaAngleDown}
        voteValue={-1}
        postId={id}
        fill={downFill}
        currentVoteValue={post.userVoteStatus}
      />
    </VStack>
  );
};

export default PostVotes;
