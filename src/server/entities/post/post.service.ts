import { getTimeAgo } from '../../utils/misc.utils';
import { QueryResult } from 'pg';
import { createPostSlugs } from '../../../common/utils';
import { PostType, CommentType } from '../../../common/types';
import { SrError, SrErrorType } from '../../../common/utils/errors';
import { DatabaseService, databaseService } from '../../database/database.service';
import {
  DbPost,
  DbComment,
  GetPostDto,
  EditPostRequest,
  CreatePostRequest,
  UpdatePostVotesRequest,
  AddCommentToPostRequest,
  UpdateCommentsVotesRequest,
} from '../../database/database.types';

export class PostService {
  constructor(private databaseService: DatabaseService) {}

  getPosts(userId: string): Promise<DbPost[]> {
    return this.databaseService.getPosts(userId);
  }

  getPost(dto: GetPostDto): Promise<DbPost> {
    return this.databaseService.getPost(dto);
  }

  getAllComments(userId: string): Promise<DbComment[]> {
    return this.databaseService.getComments(userId);
  }

  getCommentsForPost(userId: string, postId: string): Promise<DbComment[]> {
    return this.databaseService.getComments(userId, postId);
  }

  async createPost(request: CreatePostRequest): Promise<string> {
    const { id, title } = await this.databaseService.createPost(request);
    const urlSlugs = createPostSlugs(id, title);

    await this.databaseService.updatePostSlugs(id, urlSlugs);

    return urlSlugs;
  }

  async editPost(request: EditPostRequest): Promise<void> {
    await this.databaseService.editPost(request);
  }

  async getFormedPost(dto: GetPostDto): Promise<PostType> {
    const dbPost = await this.getPost(dto);
    if (!dbPost) {
      throw new SrError({ type: SrErrorType.ResourceDoesNotExist });
    }
    const dbComments = await this.getCommentsForPost(dto.userId, dbPost.id);
    const nestedComments = this.nestComments(dbComments);

    return {
      ...dbPost,
      comments: nestedComments,
      createdAtRelative: getTimeAgo(dbPost.createdAt),
      points: Number(dbPost.points),
    };
  }

  async getFormedPosts(userId: string): Promise<PostType[]> {
    const dbPosts = await this.getPosts(userId);
    const dbComments = await this.getAllComments(userId);

    const nestedComments = this.nestComments(dbComments);

    const formedPosts = dbPosts.map((post) => ({
      ...post,
      comments: nestedComments.filter((c) => c.id === post.id),
      createdAtRelative: getTimeAgo(post.createdAt),
      points: Number(post.points),
      body: post.currentStatus === 'normal' ? post.body : `This post has been removed by the user`,
    }));

    return formedPosts;
  }

  addCommentToPost(request: AddCommentToPostRequest): Promise<QueryResult> {
    return this.databaseService.addCommentToPost(request);
  }

  async updatePostVotes(request: UpdatePostVotesRequest, userId: string): Promise<PostType> {
    await this.databaseService.updatePostVotes({ ...request, userId });
    const updatedPost = await this.getFormedPost({ userId, postId: request.postId });
    return updatedPost;
  }

  updateCommentVotes(request: UpdateCommentsVotesRequest, userId: string): Promise<QueryResult> {
    return this.databaseService.updateCommentVotes({ ...request, userId });
  }

  async addPostFavorite(postId: string, userId: string): Promise<boolean> {
    const { userFavoriteStatus } = await this.databaseService.togglePostFavorite(postId, userId);
    return Boolean(Number(userFavoriteStatus));
  }

  async removePost(postId: string, userId: string): Promise<void> {
    const postToBeRemoved = await this.getPost({ userId, postId });

    if (!postToBeRemoved) {
      throw new SrError({ type: SrErrorType.NotAllowed });
    }

    await this.databaseService.removePost(postId);
  }

  private nestComments(comments: DbComment[]): CommentType[] {
    const nestComments = (commentList: DbComment[], isRecursiveCall?: boolean): CommentType[] => {
      const nestedComments = commentList
        .map((comment) => {
          if (comment.parentCommentId && !isRecursiveCall) {
            return null;
          }

          const children = comments.filter(
            (filteredComment) => filteredComment.parentCommentId === comment.id
          );
          const childrenNested = nestComments(children, true);
          const commentWithChildren = {
            ...comment,
            children: childrenNested,
            createdAtRelative: getTimeAgo(comment.createdAt),
            points: Number(comment.points),
            body:
              comment.currentStatus === 'normal' ? comment.body : `This comment has been removed by the user`,
          };
          return commentWithChildren;
        })
        .filter((c) => c !== null);

      return nestedComments as CommentType[];
    };

    return nestComments(comments);
  }
}

export const postService = new PostService(databaseService);
