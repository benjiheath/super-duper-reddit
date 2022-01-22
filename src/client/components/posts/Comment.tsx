import { Box, HStack, Icon, StackProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaReply } from 'react-icons/fa';
import { CommentType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { getTimeAgo } from '../../utils/misc';
import CommentBox from './CommentBox';
import Votes from './Votes';

interface CommentHeadingProps {
  username: string;
  createdAt: string;
  userPicture?: string;
}

const CommentHeading = (props: CommentHeadingProps) => {
  const { username, createdAt } = props;

  const timeAgo = getTimeAgo(createdAt);

  return (
    <HStack>
      <Box bg='prim.400' borderRadius={50} h='30px' w='30px' />
      <Text fontWeight='600'>{username} ·</Text>
      <Text>{timeAgo}</Text>
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
}

const CommentActions = (props: CommentActionsProps) => {
  const { comment, handleReplyClick } = props;

  return (
    <HStack spacing={4}>
      <Votes item={comment} mode='comment' />
      <CommentReplyBtn onClick={handleReplyClick} />
    </HStack>
  );
};

export interface NestedComment extends CommentType {
  children: NestedComment[];
}

interface CommentProps extends StackProps {
  comment: NestedComment;
}

const Comment = (props: CommentProps) => {
  const { comment, ...rest } = props;
  const { createdAt, creatorUsername, body } = comment;
  const [replying, setReplying] = React.useState(false);

  const handleReplyClick = () => setReplying(true);
  const handleReplyFinish = () => setReplying(false);

  return (
    <VStack alignItems='start' spacing={0} w='100%' {...rest}>
      <CommentHeading username={creatorUsername} createdAt={createdAt} />
      <CommentBody body={body} />
      <CommentActions comment={comment} handleReplyClick={handleReplyClick} />
      {replying ? (
        <CommentBox postId={comment.postId} stopReplying={handleReplyFinish} parentCommentId={comment.id} />
      ) : null}
    </VStack>
  );
};

interface CommentCardProps {
  comment: NestedComment;
  isNested?: boolean;
}

const CommentCard = (props: CommentCardProps) => {
  const { comment, isNested } = props;

  return (
    <VStack pl={isNested ? 6 : 0} w='100%'>
      <Comment comment={comment} />
      {comment.children.map((childComment) => (
        <CommentCard key={comment.id} comment={childComment} isNested />
      ))}
    </VStack>
  );
};

export default CommentCard;
