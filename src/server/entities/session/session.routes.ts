import express, { RequestHandler } from 'express';
import { dbUsers } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';
import bcrypt from 'bcrypt';

const sendSessionStatus: RequestHandler = async (req, res, _) => {
  try {
    req.session.userID
      ? res.status(200).send({ auth: true, userId: req.session.userID })
      : res.status(200).send({ auth: false, userId: null });
  } catch (err) {
    console.error(err);
  }
};

const login: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { username, password } = req.body;

    const { id: userId, password: hashedPassword } = await dbUsers
      .findValues(['id', 'password'])
      .where('username')
      .equals(username);

    const match = await bcrypt.compare(password, hashedPassword!);
    if (match) {
      req.session.userID = userId;
      req.session.username = username;
      res.status(200).send({
        status: 'success',
        auth: true,
        userId,
      });
    } else {
      res.status(200).send({
        status: 'fail',
        message: 'Invalid password',
        errors: [
          {
            field: 'password',
            message: 'Invalid password',
          },
        ],
      });
    }
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
    }
  }
};

const logout: RequestHandler = async (req, res, _): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).send({ status: 'ok', message: 'Logged out successfully' });
  });
};

const router = express.Router();

router.get('/', sendSessionStatus);
router.post('/', login);
router.delete('/', logout);

export { router as sessionRouter };
