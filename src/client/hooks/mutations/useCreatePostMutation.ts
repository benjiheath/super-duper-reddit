import { useMutation } from 'react-query';
import { axiosPOST } from '../../utils/axiosMethods';

interface CreatePostMutationPayload {
  userId: string;
  username: string;
  title: string;
  body: string | null;
  contentUrl: string | null;
}

const createPostMutation = async (payload: CreatePostMutationPayload) =>
  await axiosPOST<string>('posts', { data: payload });

export const useCreatePostMutation = () =>
  useMutation((payload: CreatePostMutationPayload) => createPostMutation(payload));
