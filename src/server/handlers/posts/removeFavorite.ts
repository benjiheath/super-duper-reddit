import { RequestHandler } from 'express';

export const removeFavorite: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { postId } = req.body;

    // res.status(200).send(clientReadyPost);
  } catch (err) {
    res.status(200).send(err);
  }
};
