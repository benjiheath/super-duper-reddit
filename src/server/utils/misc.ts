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

export const appendCommentsAndSlugsToPost = (post: PostType, comments: CommentType[]) => {
  const urlSlugs = createPostSlugs(post.id, post.title);
  const postComments = comments.filter((comment) => comment.postId === post.id);
  return {
    ...post,
    comments: postComments,
    urlSlugs,
  };
};

export const sanitizeKeys = <T extends DbPost | DbComment>(postOrComment: T): T => {
  const camelCased = _.mapKeys(postOrComment, (value, key) => _.camelCase(key));
  return camelCased as unknown as T;
};
