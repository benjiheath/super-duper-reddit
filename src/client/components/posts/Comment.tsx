import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { CommentType } from '../../../common/types/entities';
import { getTimeAgo } from '../../utils/misc';
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

  return <Text>{body}</Text>;
};

interface CommentActionsProps {
  comment: CommentType;
}

const CommentActions = (props: CommentActionsProps) => {
  const { comment } = props;

  return (
    <HStack>
      <Votes item={comment} mode='comment' />
    </HStack>
  );
};

interface CommentProps {
  comment: CommentType;
}

const Comment = (props: CommentProps) => {
  const { comment } = props;
  const { createdAt, creatorUsername, body } = comment;

  return (
    <VStack alignItems='start' spacing={0}>
      <CommentHeading username={creatorUsername} createdAt={createdAt} />
      <CommentBody body={body} />
      <CommentActions comment={comment} />
    </VStack>
  );
};

export default Comment;
