import { AddCommentPayload } from '../fetching/mutations';

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
  //   payload: AddCommentPayload;
}

export interface UpdateUserFavoriteStatusMutationVariables {
  postId: string;
  postSlugs: string;
}
