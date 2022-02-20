import { QueryResult } from 'pg';
import { CommentType, PostType } from '../../common/types';
import { pool } from '../db';
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

const getPostVoteForUser = async (userId: string, postId: string) => {
  const [postVote] = await dbPostsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${postId}'`,
  });
  return postVote;
};

const getCommentVoteForUser = async (userId: string, commentId: string) => {
  const [commentVote] = await dbCommentsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND comment_id = '${commentId}'`,
  });
  return commentVote;
};

const getVoteCountForPost = async (postId: string) =>
  await dbPostsVotes.getSum('vote_status').where('post_id').equals(postId);

const getVoteCountForComment = async (commentId: string) =>
  await dbCommentsVotes.getSum('vote_status').where('comment_id').equals(commentId);

const getUserFavoriteStatus = async (userId: string, postId: string) => {
  const [userFavoriteStatus] = await dbPostsFavorites.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${postId}'`,
  });
  return userFavoriteStatus;
};

const getTotalCommentCountForPost = async (postId: string) => {
  const { rows } = await pool.query(`SELECT COUNT(post_id) FROM comments WHERE post_id = '${postId}'`);
  const totalCommentCount = rows[0].count;
  return totalCommentCount;
};

/**
 * Inserting total points (voteCount), user's vote status (userVoteStatus), and relative updatedAt (createdAtRelative)
 */
export const makeCommentClientReady = async (comment: CommentType, userId: string): Promise<CommentType> => {
  const voteCount = await getVoteCountForComment(comment.id);
  const commentVote = await getCommentVoteForUser(userId, comment.id);
  const createdAtRelative = getTimeAgo(comment.createdAt);

  return {
    ...comment,
    points: voteCount,
    userVoteStatus: commentVote?.voteStatus ?? null,
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
  const postVote = await getPostVoteForUser(userId, post.id);
  const userHasVoted = postVote && postVote.postId === post.id;
  const userFavoriteStatus = await getUserFavoriteStatus(userId, post.id);
  const voteCount = await getVoteCountForPost(post.id);
  const createdAtRelative = getTimeAgo(post.createdAt);
  const commentCount = await getTotalCommentCountForPost(post.id);

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
    commentCount,
    points: voteCount,
    userVoteStatus: userHasVoted ? postVote.voteStatus : null,
    userFavoriteStatus: userFavoriteStatus ? true : false,
    createdAtRelative,
  };
};
