import _ from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import { CreatePostFields } from '../types/posts';
import { PostType } from './../../common/types/entities';
import { useLocalStorage } from './useLocalStorage';
import { useSuccessToast } from './useSrToast';

export type KeyPrefix = 'editingPost' | 'creatingPost';

interface SavedFields extends CreatePostFields {
  postId?: string;
}

const getLocalStorageKey = (prefix: string, postId?: string) => `${prefix}-${postId}`;

export const useSavedChanges = (keyPrefix: KeyPrefix, post?: PostType) => {
  const formMethods = useForm();
  const successToast = useSuccessToast();
  const localStoragePost = useLocalStorage<SavedFields>(getLocalStorageKey(keyPrefix, post?.id));
  const [isDirty, setIsDirty] = React.useState(false); // temp workaround for reset btn (currently can't rely on formState's isDirty)

  React.useEffect(() => {
    const currentPostData = { title: post?.title, contentUrl: post?.contentUrl, body: post?.body };

    const subscription = formMethods.watch((value) => {
      const changesHaveBeenMade =
        keyPrefix === 'editingPost'
          ? !_.isEqual(value, currentPostData)
          : !Object.values(value).every((v) => v === '');

      if (changesHaveBeenMade) {
        localStoragePost.setItem({ ...(value as CreatePostFields), postId: post?.id });
      }

      setIsDirty(changesHaveBeenMade);
    });

    return () => subscription.unsubscribe();
  }, [formMethods.watch]);

  React.useEffect(() => {
    const savedFormData = localStoragePost.getItem();

    const title = savedFormData?.title ?? post?.title;
    const contentUrl = savedFormData?.contentUrl ?? post?.contentUrl;
    const body = savedFormData?.body ?? post?.body;

    formMethods.reset({ title, contentUrl, body });

    if (savedFormData) {
      successToast('Loaded unsaved changes', { variant: 'pink' });
    }
  }, [post]);

  const clearSavedChanges = () => {
    localStoragePost.removeItem();
  };

  const handleReset = React.useCallback(() => {
    setIsDirty(false);
    clearSavedChanges();
    formMethods.reset({ title: post?.title, contentUrl: post?.contentUrl, body: post?.body });
  }, [post]);

  return { isDirty, clearSavedChanges, handleReset, formMethods };
};
