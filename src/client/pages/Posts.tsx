import { Flex, HStack, Icon, IconProps, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { PostType } from '../../common/types/entities';
import SrSpinner from '../components/generic/SrSpinner';
import { NavBar } from '../components/homepage';
import { NewPost } from '../components/posts';
import Post from '../components/posts/Post';
import { usePostsContext } from '../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { PostProps } from '../types/posts';
import { axiosPATCH } from '../utils/axiosMethods';
import { getTimeAgo } from '../utils/misc';

interface VoteIconProps extends IconProps {
  icon: IconType;
  voteValue: -1 | 1;
  postId: string;
  currentVoteValue: -1 | 1 | null;
}

const VoteIcon = (props: VoteIconProps) => {
  const { icon, voteValue, postId, currentVoteValue, ...rest } = props;
  const { updatePost, posts } = usePostsContext();
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
    } catch (err) {
      console.log('CAUGHT IN ONCLICK', err);
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
  points: number | null;
  postId: string;
  post: PostType;
}

const PostVotes = (props: PostVotesProps) => {
  const { points, postId, post } = props;

  const pointsColor = points && points >= 1 ? 'sec.900' : 'prim.800';

  const upFill = post.userVoteStatus === 1 ? 'sec.900' : 'gray.200';
  const downFill = post.userVoteStatus === -1 ? 'prim.900' : 'gray.200';

  return (
    <VStack spacing={0}>
      <VoteIcon
        icon={FaAngleUp}
        voteValue={1}
        postId={postId}
        fill={upFill}
        currentVoteValue={post.userVoteStatus}
      />
      <Text color={!points ? 'gray.100' : pointsColor}>{points?.toString()}</Text>
      <VoteIcon
        icon={FaAngleDown}
        voteValue={-1}
        postId={postId}
        fill={downFill}
        currentVoteValue={post.userVoteStatus}
      />
    </VStack>
  );
};

interface PostedByProps {
  date: string;
  creatorUsername: string;
}

export const PostedBy = (props: PostedByProps) => {
  const { date, creatorUsername } = props;

  const timeAgo = getTimeAgo(date);
  // TODO - do this on server so it doesnt update in UI whenever a user votes

  return (
    <Flex color='gray.400'>
      <Text mr={2}>submitted {timeAgo} by * </Text>
      <Text color='prim.800' display='inline-block' fontWeight='700'>
        {creatorUsername}
      </Text>
    </Flex>
  );
};

const PostCardDetails = (props: PostProps) => {
  const { post } = props;

  const contentUrl = post.contentUrl ? (
    <ChakraLink
      href={`//${post.contentUrl}`}
      target='_blank'
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{}}
    >
      {post.title}
    </ChakraLink>
  ) : (
    post.title
  );

  return (
    <VStack alignItems='start' spacing={1}>
      <Text fontWeight='bold' fontSize={20}>
        {contentUrl}
      </Text>
      <PostedBy date={post.createdAt} creatorUsername={post.creatorUsername} />
      <Text>{post.comments.length} comments</Text>
    </VStack>
  );
};

const PostCard = (props: PostProps) => {
  const { post } = props;

  return (
    <Link to={`/posts/${post.urlSlugs}`}>
      <HStack
        spacing={6}
        width='800px'
        boxShadow='0px 0px 3px 1px #bebebe28'
        p='12px 30px'
        borderRadius={8}
        cursor='pointer'
        _hover={{
          boxShadow: '0px 0px 1px 1px #ececec28',
          bg: '#fefefe',
        }}
        bg='white'
        transition='0.15s'
      >
        <PostVotes postId={post.id} points={post.points} post={post} />
        {/* <Box>img</Box> */}
        <PostCardDetails post={post} />
      </HStack>
    </Link>
  );
};

const Posts = () => {
  const match = useRouteMatch();
  const { posts, postsLoading, getAndSetPosts } = usePostsContext();

  React.useEffect(() => {
    getAndSetPosts();
  }, []);

  if (postsLoading) {
    return (
      <>
        <NavBar />
        <SrSpinner />;
      </>
    );
  }

  return (
    <Flex flexDir='column'>
      <NavBar />
      <Switch>
        <Route exact path={`${match.path}/create`}>
          <NewPost />
        </Route>
        <Route exact path='/posts/:postSlugs'>
          <Post />
        </Route>
        <Route path={`${match.path}/`}>
          <VStack spacing={4}>
            {posts
              ? posts
                  .filter((post) => post.currentStatus !== 'removed')
                  .map((post) => <PostCard post={post} />)
              : null}
          </VStack>
        </Route>
      </Switch>
    </Flex>
  );
};

export default Posts;
