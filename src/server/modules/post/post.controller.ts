import express from 'express';
import {
  AddCommentRequest,
  AddPostFavoriteRequest,
  AddPostFavoriteResponse,
  CreatePostRequest,
  EditPostRequest,
  GetPostRequest,
  RemovePostRequest,
  UpdateCommentsVotesRequest,
  UpdatePostVotesRequest,
} from '../../../common/types';
import { postService } from '../../main';
import { Handler } from '../../types/utils';
import { PostType } from './../../../common/types/entities';
import { getWrappedHandlers } from './../../utils/misc.utils';

type Handlers = {
  servePosts: Handler.NoArgs<PostType[]>;
  servePost: Handler.WithParams<GetPostRequest, PostType>;
  createPost: Handler.WithBody<CreatePostRequest, string>;
  addCommentToPost: Handler.WithBody<AddCommentRequest>;
  addFavorite: Handler.WithBody<AddPostFavoriteRequest, AddPostFavoriteResponse>;
  editPost: Handler.WithBody<EditPostRequest>;
  updatePostVotes: Handler.WithBody<UpdatePostVotesRequest, PostType>;
  updateCommentVotes: Handler.WithBody<UpdateCommentsVotesRequest>;
  removePost: Handler.WithBody<RemovePostRequest>;
};

const handlers: Handlers = {
  servePosts: async (req, res) => {
    const posts = await postService.getFormedPosts(req.session.userId);
    res.status(200).send(posts);
  },

  servePost: async (req, res) => {
    const post = await postService.getFormedPost({
      userId: req.session.userId,
      postSlugs: req.params.slugs,
    });

    res.status(200).send(post);
  },

  createPost: async (req, res) => {
    const newPostSlugs = await postService.createPost(req.body, req.session);
    res.status(200).send(newPostSlugs);
  },

  addCommentToPost: async (req, res) => {
    await postService.addCommentToPost(req.body, req.session);
    res.status(200).send();
  },

  addFavorite: async (req, res) => {
    const updatedUserFavoriteStatus = await postService.addPostFavorite(req.body.postId, req.session.userId);
    res.status(200).send({ updatedUserFavoriteStatus });
  },

  editPost: async (req, res) => {
    await postService.editPost(req.body, req.session);
    res.status(200).send();
  },

  updatePostVotes: async (req, res) => {
    const updatedPost = await postService.updatePostVotes(req.body, req.session.userId);
    res.status(200).send(updatedPost);
  },

  updateCommentVotes: async (req, res) => {
    await postService.updateCommentVotes(req.body, req.session.userId);
    res.status(200).send();
  },

  removePost: async (req, res) => {
    await postService.removePost(req.body.postId, req.session.userId);
    res.status(200).send();
  },
};

const wrappedHandlers = getWrappedHandlers(handlers);

const postsRouter = express.Router();

postsRouter.get('/', wrappedHandlers.servePosts);
postsRouter.get('/:slugs', wrappedHandlers.servePost);
postsRouter.post('/', wrappedHandlers.createPost);
postsRouter.post('/comments', wrappedHandlers.addCommentToPost);
postsRouter.post('/favorites', wrappedHandlers.addFavorite);
postsRouter.patch('/:id', wrappedHandlers.editPost);
postsRouter.patch('/votes', wrappedHandlers.updatePostVotes);
postsRouter.patch('/comments/votes', wrappedHandlers.updateCommentVotes);
postsRouter.delete('/', wrappedHandlers.removePost);

export { postsRouter };
