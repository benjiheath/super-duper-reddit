import { CreatePostMutationPayload } from '../fetchers/mutations';

export interface RegisterLoginMutationVariables {
  username: string;
  password: string;
  email?: string;
}

export interface EditPostMutationVariables {
  postSlugs: string;
}
export interface UpdatePostVotesMutationVariables {
  postSlugs: string;
  postId: string;
  voteValue: number;
}

export interface UpdateCommentVotesMutationVariables {
  postSlugs: string;
  commentId: string;
  voteValue: number;
}

export interface AddCommentMutationVariables {
  postSlugs: string;
}

export interface UpdateUserFavoriteStatusMutationVariables {
  postId: string;
  postSlugs: string;
}

export interface CreatePostMutationVariables {
  payload: CreatePostMutationPayload;
}
