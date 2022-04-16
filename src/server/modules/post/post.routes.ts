import { asyncWrap } from '../../utils/misc.utils';
import express from 'express';
import {
  UpdateCommentsVotesRequest,
  AddCommentToPostRequest,
  AddPostFavoriteRequest,
  UpdatePostVotesRequest,
  CreatePostRequest,
  RemovePostRequest,
  EditPostRequest,
  GetPostRequest,
} from '../../database/database.types';
import { postService } from '../../main';

const servePosts = asyncWrap(async (req, res) => {
  const posts = await postService.getFormedPosts(req.session.userID!);
  res.status(200).send(posts);
});

const servePost = asyncWrap<any, GetPostRequest>(async (req, res) => {
  const post = await postService.getFormedPost({
    userId: req.session.userID!,
    postSlugs: req.query.postSlugs,
  });
  res.status(200).send(post);
});

const createPost = asyncWrap<CreatePostRequest>(async (req, res) => {
  const newPostSlugs = await postService.createPost(req.body);
  res.status(200).send(newPostSlugs);
});

const addCommentToPost = asyncWrap<AddCommentToPostRequest>(async (req, res) => {
  await postService.addCommentToPost(req.body);
  res.status(200).send();
});

const addFavorite = asyncWrap<AddPostFavoriteRequest>(async (req, res) => {
  const updatedUserFavoriteStatus = await postService.addPostFavorite(req.body.postId, req.session.userID!);
  res.status(200).send({ updatedUserFavoriteStatus });
});

const editPost = asyncWrap<EditPostRequest>(async (req, res) => {
  await postService.editPost(req.body);
  res.status(200).send();
});

const updatePostVotes = asyncWrap<UpdatePostVotesRequest>(async (req, res) => {
  const updatedPost = await postService.updatePostVotes(req.body, req.session.userID!);
  res.status(200).send(updatedPost);
});

const updateCommentVotes = asyncWrap<UpdateCommentsVotesRequest>(async (req, res) => {
  await postService.updateCommentVotes(req.body, req.session.userID!);
  res.status(200).send();
});

const removePost = asyncWrap<RemovePostRequest>(async (req, res) => {
  await postService.removePost(req.body.postId, req.session.userID!);
  res.status(200).send();
});

const router = express.Router();

router.get('/', servePosts);
router.get('/post', servePost);
router.post('/', createPost);
router.post('/comments', addCommentToPost);
router.post('/favorites', addFavorite);
router.patch('/post', editPost);
router.patch('/votes', updatePostVotes);
router.patch('/comments/votes', updateCommentVotes);
router.delete('/', removePost);

export { router as postsRouter };
