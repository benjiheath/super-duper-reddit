import { Box, HStack, Icon, StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaReply } from 'react-icons/fa';
import { CommentType, NestedComment } from '../../../common/types/entities';
import CommentBox from './CommentBox';
import Votes from './Votes';

interface CommentHeadingProps {
  username: string;
  createdAtRelative: string;
  userPicture?: string;
}

const CommentHeading = (props: CommentHeadingProps) => {
  const { username, createdAtRelative } = props;

  return (
    <HStack>
      <Box bg='prim.400' borderRadius={50} h='30px' w='30px' />
      <Text fontWeight='600'>{username} ·</Text>
      <Text>{createdAtRelative}</Text>
    </HStack>
  );
};

interface CommentBodyProps {
  body: string;
}

const CommentBody = (props: CommentBodyProps) => {
  const { body } = props;

  return <Text pl={2}>{body}</Text>;
};

interface CommentReplyBtnProps {
  onClick: () => void;
}

const CommentReplyBtn = (props: CommentReplyBtnProps) => {
  const { onClick } = props;
  return (
    <HStack
      cursor='pointer'
      _hover={{ bg: 'prim.50' }}
      p='4px 8px'
      borderRadius={4}
      role='group'
      onClick={onClick}
    >
      <Icon as={FaReply} fill='prim.400' _groupHover={{ fill: 'prim.800' }} />
      <Text color='gray.400' _groupHover={{ color: 'prim.800' }}>
        reply
      </Text>
    </HStack>
  );
};

interface CommentActionsProps {
  comment: CommentType;
  handleReplyClick: () => void;
  postSlugs: string;
}

const CommentActions = (props: CommentActionsProps) => {
  const { comment, handleReplyClick, postSlugs } = props;

  return (
    <HStack spacing={4}>
      <Votes item={comment} mode='comment' postId={comment.postId} postSlugs={postSlugs} />
      <CommentReplyBtn onClick={handleReplyClick} />
    </HStack>
  );
};

interface CommentProps extends StackProps {
  comment: NestedComment;
  postSlugs: string;
}

const Comment = (props: CommentProps) => {
  const { comment, postSlugs, ...rest } = props;
  const { createdAt, creatorUsername, body } = comment;
  const [replying, setReplying] = React.useState(false);

  const handleReplyClick = () => setReplying(true);
  const handleReplyFinish = () => setReplying(false);

  return (
    <VStack alignItems='start' spacing={0} w='100%' {...rest}>
      <CommentHeading username={creatorUsername} createdAtRelative={comment.createdAtRelative} />
      <CommentBody body={body} />
      <CommentActions comment={comment} handleReplyClick={handleReplyClick} postSlugs={postSlugs} />
      {replying ? (
        <CommentBox
          postId={comment.postId}
          stopReplying={handleReplyFinish}
          parentCommentId={comment.id}
          postSlugs={postSlugs}
        />
      ) : null}
    </VStack>
  );
};

interface CommentCardProps {
  comment: NestedComment;
  isNested?: boolean;
  postSlugs?: string;
}

const CommentCard = (props: CommentCardProps) => {
  const { comment, isNested, postSlugs } = props;

  return (
    <VStack pl={isNested ? 6 : 0} w='100%'>
      <Comment comment={comment} postSlugs={postSlugs!} />
      {comment.children.map((childComment) => (
        <CommentCard comment={childComment} key={childComment.id} postSlugs={postSlugs} isNested />
      ))}
    </VStack>
  );
};

export default CommentCard;
