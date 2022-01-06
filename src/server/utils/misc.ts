import _ from 'lodash';
import { CommentType, PostType } from '../../common/types/entities';
import { createPostSlugs } from '../../common/utils';
import {
  PostsColumn,
  CommentsColumn,
  UserColumn,
  DbPost,
  DbComment,
  PostWithComments,
} from '../types/dbTypes';
import { dbPostsVotes } from './dbQueries';

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

type InsertPointsAndComments = (post: PostType, comments: CommentType[], userId: string) => Promise<PostType>;

export const insertPointsAndComments: InsertPointsAndComments = async (post, comments, userId) => {
  const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);
  const [postVote] = await dbPostsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });
  const postComments = comments.filter((comment) => comment.postId === post.id);

  if (postVote && postVote.postId === post.id) {
    return { ...post, comments: postComments, points: voteCount, userVoteStatus: postVote.voteStatus };
  } else {
    return {
      ...post,
      comments: postComments,
      points: voteCount,
      userVoteStatus: null,
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
