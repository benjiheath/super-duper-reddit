export interface UpdatePostVotesVariables {
  postId: string;
  voteValue: number;
  postSlugs: string;
}

export interface UpdateCommentVotesVariables {
  postSlugs: string;
  commentId: string;
  voteValue: number;
}
