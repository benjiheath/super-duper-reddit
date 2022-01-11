import React from 'react';
import { useForm } from 'react-hook-form';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router-dom';
import { CommentType, PostType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { PostedBy } from '../../pages/Posts';
import { CreateCommentFields, PostProps } from '../../types/posts';
import { axiosDELETE, axiosPOST } from '../../utils/axiosMethods';
import { checkIfUrlIsImg } from '../../utils/misc';
import PostVotes from './PostVotes';
import { AlertPopup, FormTextArea, SrSpinner, PageBox, ButtonSubmit } from '../generic';
import {
  Box,
  Divider,
  Heading,
  HeadingProps,
  HStack,
  Icon,
  IconProps,
  Image,
  Spacer,
  Text,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { IconType } from 'react-icons/lib';

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
        <span>{comments.length} comments</span>
        {post.userFavoriteStatus ? iconLiked : iconNotLiked}
        <Spacer />
        {iconRemove}
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
      <PostVotes post={post} />
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

const CommentBox = (props: PostProps) => {
  const { post } = props;
  const { id: postID } = post;
  const { username, userId, setResponseError } = useGlobalUserContext();
  const { setPostInView } = usePostsContext();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data: CreateCommentFields): Promise<void> => {
    try {
      const newCommentData = {
        ...data,
        post_id: postID,
        creator_user_id: userId,
        creator_username: username,
      };

      const { post } = await axiosPOST('posts/comments', { data: newCommentData });

      if (!post) {
        return;
        // TODO - handle later
      }

      setPostInView(post);
      reset();
    } catch (err) {
      setResponseError(err);
    }
  };

  return (
    <Box w='100%'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          <FormTextArea
            register={register}
            minH={20}
            placeholder='Enter a comment...'
            errors={errors}
            required
          />
          <ButtonSubmit text='Save' isDisabled={!isValid} isLoading={isSubmitting} />
        </VStack>
      </form>
    </Box>
  );
};

interface CommentProps {
  comments: CommentType[];
}

const Comments = (props: CommentProps) => {
  const { comments } = props;

  if (comments.length === 0) {
    return <Text>No comments to display.</Text>;
  }

  return (
    <>
      {comments.map((comment) => (
        <span>{comment.body}</span>
      ))}
    </>
  );
};

const Post = () => {
  const { postSlugs } = useParams() as { postSlugs: string };
  const { postsLoading, postInView, getPost, setPostInView } = usePostsContext();

  React.useEffect(() => {
    if (!postInView) {
      getPost(postSlugs);
    }

    return () => {
      setPostInView(null);
    };
  }, []);

  if (postsLoading || !postInView) {
    return <SrSpinner />;
  }

  return (
    <PageBox boxShadow='0px 0px 3px 1px #ececec'>
      <VStack width='100%' spacing={4}>
        <PostMain post={postInView} />
        <Divider />
        <CommentBox post={postInView} />
        <Comments comments={postInView.comments} />
      </VStack>
    </PageBox>
  );
};

export default Post;
