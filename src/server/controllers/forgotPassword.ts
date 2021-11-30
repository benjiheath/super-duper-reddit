import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { DbTables, UserColumn } from '../../common/types/dbTypes';
import { FieldError } from '../utils/errors';
import { sendRecEmail_test } from '../utils/sendRecEmail_test';
import { dbQuery } from '../utils/dbQueries';

export const forgotPasswordHandler: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const [idType] = Object.keys(req.body) as UserColumn[];
    const [id]: string[] = Object.values(req.body);
    const token = uuidv4();
    const userQuery = dbQuery(DbTables.users);

    const idMatch = await userQuery.findValue(idType, idType, id);

    if (!idMatch) {
      res.status(200).send({ status: 'fail', error: { field: 'id', message: 'Account not found' } });
      return;
    }

    const token = uuidv4();

    await pool.query(`UPDATE users SET reset_pw_token = $2 WHERE ${idType} = $1`, [id, token]);

    const targetEmail =
      idType === 'email' ? id : await userQuery.findValue('email', `${idType as UserColumn}`, id);
    const link = `<a href='http://localhost:3001/reset-password/${token}' target="_blank">Reset password</a>`;
    await sendRecEmail_test(targetEmail!, link);

    res.status(200).send({ status: 'ok', message: 'Email sent!', sentTo: targetEmail });
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
      console.log('errdsadas343333or:', error.info);
    }
  }
};
