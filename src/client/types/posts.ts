import { PostType, CommentType } from '../../common/types/entities';

export type CreatePostFields = Pick<PostType, 'title' | 'body' | 'contentUrl'>;
export type CreateCommentFields = Pick<CommentType, 'body'>;
