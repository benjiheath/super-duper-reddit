import { useMutation } from '@tanstack/react-query';
import { EditPostRequest, PostType } from '../../../common/types';
import { axiosPATCH } from '../../utils/axiosMethods';

const editPostMutation = async (payload: EditPostRequest) =>
  await axiosPATCH<PostType>('posts', { data: payload, params: payload.postSlugs });

export const useEditPostMutation = () => useMutation((payload: EditPostRequest) => editPostMutation(payload));
