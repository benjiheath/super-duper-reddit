import { Avatar, Box, Collapse, Flex, HStack, Icon, StackProps, Text, useDisclosure } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { IconType } from 'react-icons';
import { FaChevronDown, FaChevronUp, FaReply } from 'react-icons/fa';
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
      <Text fontWeight='600'>{username} ·</Text>
      <Text fontSize={12} color='gray.500' pt={0.5}>
        {createdAtRelative}
      </Text>
    </HStack>
  );
};

interface CommentReplyBtnProps {
  onClick: () => void;
}

const CommentReplyBtn = (props: CommentReplyBtnProps) => {
  return (
    <HStack
      cursor='pointer'
      _hover={{ bg: 'prim.50' }}
      p='4px 8px'
      borderRadius={4}
      role='group'
      onClick={props.onClick}
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
  const { comment, postSlugs } = props;
  const [replying, setReplying] = React.useState(false);
  const disclosure = useDisclosure({ defaultIsOpen: true });

  const handleReplyClick = () => setReplying(!replying);
  const handleReplyFinish = () => setReplying(false);

  const renderCollapseIcon = (icon: IconType) => <Icon as={icon} ml={3} w={2} h={2} fill='prim.200' />;

  return (
    <Box>
      <Flex alignItems='start' mt={4} mb={-10}>
        <Box>
          <Avatar name={comment.creatorUsername} w={8} h={8} bg='prim.500' />
        </Box>
        <Box ml={4}>
          <CommentHeading username={comment.creatorUsername} createdAtRelative={comment.createdAtRelative} />
          <Text color='secondary' data-pw='userEmail'>
            {comment.body}
          </Text>
          <CommentActions comment={comment} handleReplyClick={handleReplyClick} postSlugs={postSlugs} />
        </Box>
      </Flex>
      {!_.isEmpty(comment.children) && (
        <Text cursor='pointer' onClick={() => disclosure.onToggle()}>
          {renderCollapseIcon(disclosure.isOpen ? FaChevronUp : FaChevronDown)}
        </Text>
      )}
      <Collapse in={disclosure.isOpen}>
        <Box
          ml={4}
          pl={4}
          borderLeftWidth={comment.children.length ? '1px' : 0}
          borderLeftColor='prim.100'
          pt={8}
        >
          <Collapse in={replying}>
            <CommentBox
              postId={comment.postId}
              stopReplying={handleCancelReply}
              parentCommentId={comment.id}
              postSlugs={postSlugs}
              width={300}
              mt={-2}
            />
          </Collapse>
          {_.map(comment.children, (childComment) => (
            <Comment comment={childComment} postSlugs={postSlugs} key={childComment.id} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default Comment;
