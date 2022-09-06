import { SrError, SrErrorType } from '../../../common/utils/errors';
import { DatabaseService } from '../../database/database.service';
import { LoginRequest } from '../../../common/types';
import { userService } from '../../main';
import { UserService } from '../user/user.service';
import { AnyRequest } from './../../types/utils';
import { DbUser } from '../../database/database.types';
import bcrypt from 'bcrypt';

export class SessionService {
  constructor(private databaseService: DatabaseService, private userService: UserService) {}

  async authenticateUser(req: AnyRequest, userId: string): Promise<void> {
    const { username } = await userService.getUserValues(userId, 'username');

    if (!username) {
      throw new SrError({ type: SrErrorType.AccountNotFound });
    }

    req.session.userId = userId;
    req.session.username = username;
  }

  async login(req: AnyRequest): Promise<DbUser> {
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
