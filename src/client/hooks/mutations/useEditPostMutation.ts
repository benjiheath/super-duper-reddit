import { useMutation } from 'react-query';
import { PostType } from '../../../common/types';
import { axiosPATCH } from '../../utils/axiosMethods';

interface EditPostPayload {
  title: string | null;
  body: string | null;
  contentUrl: string | null;
  postSlugs: string;
}

const editPostMutation = async (payload: EditPostPayload) =>
  await axiosPATCH<PostType>('posts/post', {
    data: payload,
  });

export const useEditPostMutation = () => useMutation((payload: EditPostPayload) => editPostMutation(payload));
