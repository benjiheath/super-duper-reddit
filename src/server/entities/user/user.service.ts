import { DbUser, UpdateUserRequest, UserColumn } from './../../types/dbTypes';
import { CreateDbUserDto } from '../../database/database.types';
import { databaseService, DatabaseService } from './../../database/database.service';

export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async createUser(request: CreateDbUserDto): Promise<DbUser> {
    const { username, password, email } = request;
    return await this.databaseService.createUser({ username, password, email });
  }

  async getUser(usernameOrId: string): Promise<DbUser> {
    return await this.databaseService.getUser(usernameOrId);
  }

  async getUserValue(usernameOrId: string, value: UserColumn): Promise<Partial<DbUser>> {
    return await this.databaseService.getUserValue(usernameOrId, value);
  }

  async updateUser(userId: string, request: UpdateUserRequest): Promise<DbUser> {
    const { username, email, password, resetPwToken } = request;

    const dbUser = await this.databaseService.getUser(userId);

    if (!dbUser) {
      //throw err
    }

    return this.databaseService.updateUser(userId, {
      username: username ?? dbUser.username,
      email: email ?? dbUser.email,
      password: password ?? dbUser.password,
      reset_pw_token: resetPwToken ?? dbUser.reset_pw_token,
    });
  }
}

export const userService = new UserService(databaseService);
