import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SrError, SrErrorType } from '../../../common/utils/errors';
import { DatabaseService } from '../../database/database.service';
import { DbUser, GetUserDto, EditDbUserDto, UserColumn } from '../../database/database.types';
import { sendRecEmail_test, generateReoveryEmailLink } from '../../utils/sendRecEmail_test';
import { ForgotPasswordRequest, PasswordResetRequest, RegisterRequest } from '../../../common/types';

export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async registerUser(request: RegisterRequest): Promise<DbUser> {
    await this.checkUserIdentifiers(request);

    const hashedPassword = await bcrypt.hash(request.password, 10);

    return await this.databaseService.createUser({ ...request, password: hashedPassword });
  }

  async handleForgotPassword(request: ForgotPasswordRequest): Promise<string> {
    const [[idType, id]] = Object.entries(request);
    const resetPwToken = uuidv4();
    const updatedUser = await this.updateUser(id, { resetPwToken });

    await sendRecEmail_test(updatedUser.email, generateReoveryEmailLink(resetPwToken));

    return updatedUser.email;
  }

  async getUser(identifier: GetUserDto): Promise<DbUser> {
    const dbUser = await this.databaseService.getUser(identifier);

    if (!dbUser) {
      throw new SrError({ type: SrErrorType.InvalidUsername, fields: ['username'] });
    }

    return dbUser;
  }

  async getUserValues(usernameOrId: string, values: UserColumn | UserColumn[]): Promise<Partial<DbUser>> {
    return await this.databaseService.getUserValues(usernameOrId, values);
  }

  async checkUserIdentifiers(request: Partial<RegisterRequest>) {
    const alreadyExistingIdentifiers = await this.databaseService.checkUserIdentifiers(request);

    if (alreadyExistingIdentifiers) {
      throw new SrError({
        type: SrErrorType.UserIdentifierAlreadyExists,
        fields: alreadyExistingIdentifiers,
      });
    }
  }

  async updateUser(userId: string, request: EditDbUserDto): Promise<DbUser> {
    const { username, email, password, resetPwToken } = request;

    const dbUser = await this.databaseService.getUser({ id: userId });
    if (!dbUser) {
      throw new SrError({ type: SrErrorType.AccountNotFound });
    }

    await this.checkUserIdentifiers(request);

    return this.databaseService.updateUser(userId, {
      username: username ?? dbUser.username,
      email: email ?? dbUser.email,
      password: password ?? dbUser.password,
      resetPwToken: resetPwToken ?? dbUser.resetPwToken,
    });
  }

  async checkUserResetPasswordTokenValidity(token: string): Promise<void> {
    const dbToken = await this.databaseService.checkUserResetPasswordToken(token);

    if (!dbToken) {
      throw new SrError({ type: SrErrorType.InvalidToken });
    }
  }

  async resetPassword(request: PasswordResetRequest): Promise<DbUser> {
    const { newPassword, token } = request;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const dbUser = await this.databaseService.getUser({ resetPwToken: token });
    const updatedUser = this.updateUser(dbUser.id, { password: hashedPassword });
    await this.databaseService.deleteUserResetPasswordToken(token);
    return updatedUser;
  }
}
