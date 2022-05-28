import { useMutation } from 'react-query';
import { axiosDELETE } from '../../utils/axiosMethods';

const removePostMutation = async (postId: string) => {
  await axiosDELETE('posts', { data: { postId } });
};

export const useRemovePostMutation = () => useMutation((payload: string) => removePostMutation(payload));
