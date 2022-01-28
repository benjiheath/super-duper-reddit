import _ from 'lodash';
import { CommentType, NestedComment, PostType } from '../../common/types/entities';
import { CommentsColumn, DbComment, DbPost, PostsColumn, UserColumn } from '../types/dbTypes';
import { dbCommentsVotes, dbPostsFavorites, dbPostsVotes } from './dbQueries';

export const createSQLWhereConditionsFromList = <T>(
  list: T[],
  valueA: PostsColumn | CommentsColumn | UserColumn,
  valueB: keyof T,
  operator: 'OR' | 'AND' = 'OR'
) => {
  const operatorWithSpace = `${operator} `;

  const conditions = list
    .map((item, idx) => `${idx !== 0 ? operatorWithSpace : ''}${valueA} = '${item[valueB]}'`)
    .join(' ');

  return conditions;
};

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

export const insertPoints = async (posts: PostType[]) => {
  const postsWithPoints = await Promise.all(
    posts.map(async (post) => {
      const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);

      return {
        ...post,
        points: voteCount,
      };
    })
  );

  return postsWithPoints;
};

export const insertPointsAndVoteStatus = async (posts: PostType[], userId: string): Promise<PostType[]> => {
  const postsWithPointsAndVoteStatus = await Promise.all(
    posts.map(async (post) => {
      const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);
      const [postVote] = await dbPostsVotes.selectAll({
        whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
      });

      if (postVote && postVote.postId === post.id) {
        return { ...post, points: voteCount, userVoteStatus: postVote.voteStatus };
      } else {
        return {
          ...post,
          points: voteCount,
          userVoteStatus: null,
        };
      }
    })
  );

  return postsWithPointsAndVoteStatus;
};

export const insertVoteInfoIntoComment = async (
  comment: CommentType,
  userId: string
): Promise<CommentType> => {
  const voteCount = await dbCommentsVotes.getSum('vote_status').where('comment_id').equals(comment.id);
  const [commentVote] = await dbCommentsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND comment_id = '${comment.id}'`,
  });

  return {
    ...comment,
    points: voteCount,
    userVoteStatus: commentVote ? commentVote.voteStatus : null,
  };
};

type InsertPointsAndComments = (post: PostType, comments: CommentType[], userId: string) => Promise<PostType>;

export const insertPointsAndComments: InsertPointsAndComments = async (post, comments, userId) => {
  const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);
  const [postVote] = await dbPostsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });
  const [userFavoriteStatus] = await dbPostsFavorites.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });

  const postCommentsRaw = comments.filter((comment) => comment.postId === post.id);
  const postComments = await asyncMap(postCommentsRaw, (postComment) =>
    insertVoteInfoIntoComment(postComment, userId)
  );

  const nestComments = (commentList: CommentType[], isRecursiveCall?: boolean): NestedComment[] => {
    const nestedComments = commentList.map((comment) => {
      if (comment.parentCommentId && !isRecursiveCall) {
        return null;
      }

      const children = postComments.filter(
        (filteredComment) => filteredComment.parentCommentId === comment.id
      );
      const childrenNested = nestComments(children, true);
      const commentWithChildren = { ...comment, children: childrenNested };
      return commentWithChildren;
    });

    const nullsRemoved = nestedComments.filter((c) => c !== null);
    return nullsRemoved as NestedComment[];
  };

  const nestedComments = nestComments(postComments);

  if (postVote && postVote.postId === post.id) {
    return { ...post, comments: nestedComments, points: voteCount, userVoteStatus: postVote.voteStatus };
  } else {
    return {
      ...post,
      comments: nestedComments,
      points: voteCount,
      userVoteStatus: null,
      userFavoriteStatus: userFavoriteStatus ? true : false,
    };
  }
};

export const asyncMap = async <T, U>(list: T[], callback: (item: T) => Promise<T>) => {
  const result = await Promise.all(list.map(callback));

  return result;
};

export const sanitizeKeys = <T extends DbPost | DbComment>(postOrComment: T): T => {
  const camelCased = _.mapKeys(postOrComment, (value, key) => _.camelCase(key));
  return camelCased as unknown as T;
};
