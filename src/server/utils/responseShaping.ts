import { CommentType, PostType } from '../../common/types';
import { dbCommentsVotes, dbPostsFavorites, dbPostsVotes } from './dbQueries';
import { asyncMap, getTimeAgo } from './misc';

export const handlePostRemovedStatus = <T extends CommentType | PostType>(postsOrComments: T[]): T[] => {
  if (postsOrComments.length === 0) {
    return postsOrComments;
  }

  const cleanedPostsOrComments = postsOrComments.map((postOrComment) => {
    const contentType = 'title' in postOrComment ? 'post' : 'comment';

    if (postOrComment.currentStatus === 'removed') {
      return { ...postOrComment, body: `User has removed this ${contentType}` };
    } else {
      return postOrComment;
    }
  });

  return cleanedPostsOrComments;
};

export const appendCommentsToPost = (post: PostType, comments: CommentType[]) => {
  const postComments = comments.filter((comment) => comment.postId === post.id);
  return {
    ...post,
    comments: postComments,
  };
};

/**
 * Inserting total points (voteCount), user's vote status (userVoteStatus), and relative updatedAt (createdAtRelative)
 */
export const makeCommentClientReady = async (comment: CommentType, userId: string): Promise<CommentType> => {
  const voteCount = await dbCommentsVotes.getSum('vote_status').where('comment_id').equals(comment.id);
  const [commentVote] = await dbCommentsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND comment_id = '${comment.id}'`,
  });
  const createdAtRelative = getTimeAgo(comment.createdAt);

  return {
    ...comment,
    points: voteCount,
    userVoteStatus: commentVote ? commentVote.voteStatus : null,
    createdAtRelative,
  };
};

/**
 * Inserting total points (voteCount), userVoteStatus, userFavoriteStatus and createdAtRelative. Also fetching the post's comments and nesting them
 */
export const makePostClientReady = async (
  post: PostType,
  comments: CommentType[],
  userId: string
): Promise<PostType> => {
  const [postVote] = await dbPostsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });
  const [userFavoriteStatus] = await dbPostsFavorites.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });
  const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);
  const userHasVoted = postVote && postVote.postId === post.id;
  const createdAtRelative = getTimeAgo(post.createdAt);

  const postCommentsRaw = comments.filter((comment) => comment.postId === post.id);
  const postComments = await asyncMap(postCommentsRaw, (postComment) =>
    makeCommentClientReady(postComment, userId)
  );

  const nestComments = (commentList: CommentType[], isRecursiveCall?: boolean): CommentType[] => {
    const nestedComments = commentList
      .map((comment) => {
        if (comment.parentCommentId && !isRecursiveCall) {
          return null;
        }

        const children = postComments.filter(
          (filteredComment) => filteredComment.parentCommentId === comment.id
        );
        const childrenNested = nestComments(children, true);
        const commentWithChildren = { ...comment, children: childrenNested };
        return commentWithChildren;
      })
      .filter((c) => c !== null);

    return nestedComments as CommentType[];
  };

  const nestedComments = nestComments(postComments);

  return {
    ...post,
    comments: nestedComments,
    points: voteCount,
    userVoteStatus: userHasVoted ? postVote.voteStatus : null,
    userFavoriteStatus: userFavoriteStatus ? true : false,
    createdAtRelative,
  };
};
