import {
  Box,
  Divider,
  Heading,
  HeadingProps,
  HStack,
  Icon,
  IconButton,
  IconProps,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaEdit, FaEllipsisH, FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { useHistory, useParams } from 'react-router-dom';
import { CommentType, PostType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { useGetPostQuery } from '../../hooks/queries';
import { PostedBy } from '../../pages/Posts';
import { PostProps } from '../../types/posts';
import { axiosDELETE, axiosPOST } from '../../utils/axiosMethods';
import { checkIfUrlIsImg } from '../../utils/misc';
import { AlertPopup, PageBox, SrSpinner } from '../generic';
import CommentCard, { NestedComment } from './Comment';
import CommentBox from './CommentBox';
import Votes from './Votes';

type PostTitleProps = Pick<PostType, 'title' | 'contentUrl'>;

const PostTitle = (props: PostTitleProps) => {
  const { title, contentUrl } = props;

  const linkUrl = contentUrl ?? window.location.href;
  const headingStyles: HeadingProps = contentUrl
    ? { mb: 2, _groupHover: { color: 'prim.800' }, transition: '0.4s' }
    : {};

  return (
    <a href={linkUrl} target='_blank' role='group'>
      <Heading as='h3' fontSize={26} {...headingStyles}>
        {title}
      </Heading>
      {contentUrl ? (
        <Box
          h={1}
          bg='prim.100'
          w='20%'
          mb={2}
          borderRadius={2}
          _groupHover={{ width: '25%', bg: 'prim.800', ml: 1 }}
          transition='0.4s'
        />
      ) : null}
    </a>
  );
};

interface PostActionsIconProps extends IconProps {
  icon: IconType;
}

const PostActionsIcon = (props: PostActionsIconProps) => {
  const { icon, ...rest } = props;
  return <Icon as={icon} {...rest} cursor='pointer' />;
};

const PostActionsMenu = (props: PostProps) => {
  const { post } = props;
  const { comments } = post;
  const { userId } = useGlobalUserContext();
  const { setPostInView, postInView } = usePostsContext();
  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const history = useHistory();
  const toast = useToast();

  const handleRemove = async () => {
    await axiosDELETE('posts', { data: { postId: post.id } });
    setAlertIsOpen(false);
    history.push({ pathname: '/posts' });
    toast({ title: 'Post successfully removed', status: 'success' });
  };

  const handleFavorite = async () => {
    const { updatedUserFavoriteStatus } = await axiosPOST('posts/favorites', { data: { postId: post.id } });
    setPostInView({ ...postInView!, userFavoriteStatus: updatedUserFavoriteStatus! });
  };

  const iconNotLiked = <Icon as={FaRegHeart} fill='prim.800' onClick={handleFavorite} cursor='pointer' />;
  const iconLiked = <Icon as={FaHeart} fill='prim.800' onClick={handleFavorite} cursor='pointer' />;

  const iconRemove =
    post.creatorUserId === userId && post.currentStatus === 'normal' ? (
      <Tooltip label='Remove post' bg='prim.50' color='red'>
        <span>
          <Icon
            as={FaTrash}
            fill='gray.500'
            onClick={() => {
              setAlertIsOpen(true);
            }}
            cursor='pointer'
          />
        </span>
      </Tooltip>
    ) : null;

  return (
    <>
      <HStack spacing={4} mt='14px !important' w='100%'>
        <Text>{comments.length} comments</Text>
        {post.userFavoriteStatus ? iconLiked : iconNotLiked}
        <Spacer />
        {post.creatorUserId === userId && post.currentStatus === 'normal' ? (
          <Menu>
            <MenuButton as={IconButton} aria-label='Options' icon={<FaEllipsisH />} variant='ghost' h={8} />
            <MenuList minWidth='120px'>
              <MenuItem
                icon={<FaEdit />}
                onClick={() => {
                  history.push({ pathname: `/posts/edit/${post.urlSlugs}` });
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                icon={<FaTrash />}
                onClick={() => {
                  setAlertIsOpen(true);
                }}
              >
                Remove
              </MenuItem>
            </MenuList>
          </Menu>
        ) : null}
      </HStack>
      <AlertPopup
        title='Remove Post'
        onClick={handleRemove}
        isOpen={alertIsOpen}
        setIsOpen={setAlertIsOpen}
      />
    </>
  );
};

const PostMain = (props: PostProps) => {
  const { post } = props;
  const { body, title, createdAt, contentUrl } = post;

  const image = checkIfUrlIsImg(post.contentUrl);

  return (
    <HStack justifyContent='start' w='100%' spacing={6}>
      <Votes item={post} mode='post' />
      <VStack alignItems='start' width='100%' spacing={2}>
        <PostTitle title={title} contentUrl={contentUrl} />
        <PostedBy date={createdAt} creatorUsername={post.creatorUsername} />
        {image && post.contentUrl && post.currentStatus === 'normal' ? (
          <Image
            height='300px'
            objectFit='cover'
            src={post.contentUrl}
            alt='post image'
            borderRadius={8}
            my='10px !important'
          />
        ) : null}
        {body ? (
          <Text
            outline='1px solid'
            bg='prim.50'
            outlineColor='prim.200'
            p='10px 16px'
            w='100%'
            borderRadius={6}
          >
            {body}
          </Text>
        ) : null}
        <PostActionsMenu post={post} />
      </VStack>
    </HStack>
  );
};

interface CommentsProps {
  comments: CommentType[];
}

const Comments = (props: CommentsProps) => {
  const { comments } = props;

  if (comments.length === 0) {
    return <Text>No comments to display.</Text>;
  }

  const nestComments = (commentList: CommentType[], isRecursiveCall?: boolean): NestedComment[] => {
    const nestedComments = commentList.map((comment) => {
      if (comment.parentCommentId && !isRecursiveCall) {
        return null;
      }

      const children = comments.filter((filteredComment) => filteredComment.parentCommentId === comment.id);
      const childrenNested = nestComments(children, true);
      const commentWithChildren = { ...comment, children: childrenNested };

      return commentWithChildren;
    });

    const nullsRemoved = nestedComments.filter((c) => c !== null);

    return nullsRemoved as NestedComment[];
  };

  const nestedComments = nestComments(comments);

  return (
    <VStack alignItems='start' w='100%' spacing={10}>
      {nestedComments.map((nestedComment) => (
        <CommentCard comment={nestedComment} key={nestedComment.id} />
      ))}
    </VStack>
  );
};

const Post = () => {
  const { postSlugs } = useParams() as { postSlugs: string };
  const { data, isLoading, isError } = useGetPostQuery(postSlugs);

  if (isLoading || !data) {
    return <SrSpinner />;
  }

  if (isError) {
    return <span>Error retrieving this post</span>;
  }

  return (
    <PageBox boxShadow='0px 0px 3px 1px #ececec'>
      <VStack width='100%' spacing={4}>
        <PostMain post={data} />
        <Divider />
        <CommentBox postId={data.id} />
        <Comments comments={data.comments} />
      </VStack>
    </PageBox>
  );
};

export default Post;
