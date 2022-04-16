import bcrypt from 'bcrypt';
import { Request } from 'express';
import { RequestWithBody } from '../../types/utils';
import { DbUser, LoginRequest } from '../../database/database.types';
import { SrError, SrErrorType } from '../../../common/utils/errors';
import { userService } from '../../main';
import { DatabaseService } from '../../database/database.service';
import { UserService } from '../user/user.service';

export class SessionService {
  constructor(private databaseService: DatabaseService, private userService: UserService) {}

  async authenticateUser(req: Request | RequestWithBody<unknown>, userId: string): Promise<void> {
    const { username } = await userService.getUserValues(userId, 'username');

    if (!username) {
      throw new SrError({ type: SrErrorType.AccountNotFound });
    }

    req.session.userID = userId;
    req.session.username = username;
  }

  async login(req: Request): Promise<DbUser> {
    const { password, username } = req.body as LoginRequest;

    const dbUser = await this.userService.getUser({ username });
    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      throw new SrError({ type: SrErrorType.InvalidPassword, fields: ['password'] });
    }

    await this.authenticateUser(req, dbUser.id);
    return dbUser;
  }
}
