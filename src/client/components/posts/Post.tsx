import {
  Box,
  Divider,
  Heading,
  HeadingProps,
  HStack,
  Icon,
  IconButton,
  Image,
  keyframes,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaEdit, FaEllipsisH, FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router-dom';
import { CommentCard } from '.';
import { CommentType, PostType } from '../../../common/types/entities';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { removePostMutation } from '../../fetching/mutations';
import { useAddFavoriteMutation } from '../../hooks/mutations';
import { usePostQuery } from '../../hooks/queries';
import { useSuccessToast } from '../../hooks/useFormToast';
import { PostProps } from '../../types/posts';
import { checkIfUrlIsImg } from '../../utils/misc';
import { AlertPopup, PageBox, SrSpinner } from '../generic';
import CommentBox from './CommentBox';
import { PostedBy } from './Posts';
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

const PostActionsMenu = (props: PostProps) => {
  const { post } = props;
  const { userId } = useAuthContext();
  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const history = useHistory();
  const successToast = useSuccessToast();
  const addFavoriteMutation = useAddFavoriteMutation({
    postSlugs: post.urlSlugs,
    postId: post.id,
  });
  const [animateLikeBtn, setAnimateLikeBtn] = React.useState(false);

  const handleRemove = React.useCallback(async () => {
    await removePostMutation(post.id);
    successToast('Post successfully removed');
    setAlertIsOpen(false);
    history.push({ pathname: '/posts' });
  }, [post.id]);

  const handleFavorite = React.useCallback(async () => {
    addFavoriteMutation.mutate();
    setAnimateLikeBtn(!post.userFavoriteStatus);
  }, [post.userFavoriteStatus]);

  const animation = keyframes`
    from {transform: scale(1.75); opacity: 0}
    to {transform: scale(1); opacity: 1}
  `;

  const likeAnimation = `${animation}  0.4s ease-in`;

  const iconNotLiked = (
    <Icon
      as={FaRegHeart}
      fill='gray.300'
      _hover={{ fill: 'prim.800' }}
      transition='0.2s'
      onClick={handleFavorite}
      cursor='pointer'
    />
  );
  const iconLiked = (
    <Icon
      as={FaHeart}
      fill='prim.800'
      onClick={handleFavorite}
      cursor='pointer'
      animation={animateLikeBtn ? likeAnimation : undefined}
    />
  );

  return (
    <>
      <HStack spacing={4} mt='14px !important' w='100%'>
        <Text>{post.commentCount} comments</Text>
        {post.userFavoriteStatus ? iconLiked : iconNotLiked}
        <Spacer />
        {post.creatorUserId === userId && post.currentStatus === 'normal' ? (
          <Menu autoSelect={false}>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<Icon as={FaEllipsisH} fill='prim.700' />}
              variant='ghost'
              h={8}
              _hover={{ bg: 'prim.25' }}
              _active={{ bg: 'prim.25' }}
            />
            <MenuList minWidth='120px' borderColor='prim.50' p={0}>
              <MenuItem
                variant='primary'
                _hover={{ bg: 'prim.50', color: 'prim.900', transition: '0.15s' }}
                icon={<FaEdit />}
                onClick={() => {
                  history.push({ pathname: `/posts/edit/${post.urlSlugs}` });
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                variant='primary'
                _hover={{ bg: '#fff4f4', color: 'red', transition: '0.15s' }}
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
  const { body, title, contentUrl } = post;

  const image = checkIfUrlIsImg(post.contentUrl);

  return (
    <HStack justifyContent='start' w='100%' spacing={6}>
      <Votes item={post} mode='post' postSlugs={post.urlSlugs} postId={post.id} />
      <VStack alignItems='start' width='100%' spacing={2}>
        <PostTitle title={title} contentUrl={contentUrl} />
        <PostedBy createdAtRelative={post.createdAtRelative} creatorUsername={post.creatorUsername} />
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
  postSlugs: string;
}

const Comments = (props: CommentsProps) => {
  const { comments, postSlugs } = props;

  if (comments.length === 0) {
    return <Text>No comments to display.</Text>;
  }

  return (
    <VStack alignItems='start' w='100%' spacing={10}>
      {comments.map((comment) => (
        <CommentCard comment={comment} key={comment.id} postSlugs={postSlugs} />
      ))}
    </VStack>
  );
};

const Post = () => {
  const { postSlugs } = useParams() as { postSlugs: string };
  const { setResponseError } = useAuthContext();
  const { data: post, isLoading, error } = usePostQuery({ postSlugs });

  React.useEffect(() => {
    if (!post) return;

    document.title = post.title;

    return () => {
      document.title = 'Super Reddit';
    };
  }, [post]);

  if (error) {
    setResponseError(error);
    return null;
  }

  if (isLoading || !post) {
    return <SrSpinner />;
  }

  return (
    <PageBox boxShadow='0px 0px 3px 1px #ececec'>
      <VStack width='100%' spacing={4}>
        <PostMain post={post} />
        <Divider />
        <CommentBox postId={post.id} postSlugs={postSlugs} />
        <Comments comments={post.comments} postSlugs={post.urlSlugs} />
      </VStack>
    </PageBox>
  );
};

export default Post;
