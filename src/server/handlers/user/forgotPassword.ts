import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { UserColumn } from '../../types/dbTypes';
import { dbUsers } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';
import { sendRecEmail_test } from '../../utils/sendRecEmail_test';

export const forgotPasswordHandler: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const [idType] = Object.keys(req.body) as UserColumn[];
    const [id]: string[] = Object.values(req.body);
    const token = uuidv4();

    await dbUsers.findValue(idType).where(idType).equals(id);

    await dbUsers.updateField('reset_pw_token', token).whereColumnMatchesValue(idType, id);

    const targetEmail =
      idType === 'email'
        ? id
        : await dbUsers
            .findValue('email')
            .where(`${idType as UserColumn}`)
            .equals(id);

    const link = `<a href='${config.urls.client.dev}/reset-password/${token}' target="_blank">Reset password</a>`;
    await sendRecEmail_test(targetEmail as string, link);

    res.status(200).send({ status: 'ok', message: 'Email sent!', sentTo: targetEmail });
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
      console.info('Error with recovery-email ID submission:', error.info);
    }
  }
};
