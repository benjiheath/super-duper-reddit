import { createPostSlugs } from '../../common/utils';
import {
  PostsColumn,
  CommentsColumn,
  UserColumn,
  DbPost,
  DbComment,
  PostWithComments,
} from './../../common/types/dbTypes';

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

export const handlePostRemovedStatus = <T extends DbComment | DbPost>(postsOrComments: T[]): T[] => {
  if (postsOrComments.length === 0) {
    return postsOrComments;
  }

  const cleanedPostsOrComments = postsOrComments.map((postOrComment) => {
    const contentType = 'title' in postOrComment ? 'post' : 'comment';

    if (postOrComment.current_status === 'removed') {
      return { ...postOrComment, body: `User has removed this ${contentType}` };
    } else {
      return postOrComment;
    }
  });

  return cleanedPostsOrComments;
};

export const appendCommentsAndSlugsToPost = (post: DbPost, comments: DbComment[]) => {
  const urlSlugs = createPostSlugs(post.id, post.title);
  const postComments = comments.filter((comment) => comment.post_id === post.id);
  return {
    ...post,
    comments: postComments,
    urlSlugs,
  };
};
