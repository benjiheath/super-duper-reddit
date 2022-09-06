import { useMutation } from '@tanstack/react-query';
import { CreatePostRequest } from '../../../common/types';
import { axiosPOST } from '../../utils/axiosMethods';

const createPostMutation = async (payload: CreatePostRequest) =>
  await axiosPOST<string>('posts', { data: payload });

export const useCreatePostMutation = () =>
  useMutation((payload: CreatePostRequest) => createPostMutation(payload));
