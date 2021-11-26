import { RequestHandler } from 'express';
import { pool } from '../db';

export const test: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    res.status(200).send('dataaaa');
  } catch (err) {
    console.log(err);
  }
};
