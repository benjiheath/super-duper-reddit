import { DbUser } from './../../types/dbTypes';
import { CreateDbUserDto } from '../../database/database.types';
import { databaseService, DatabaseService } from './../../database/database.service';

export class UserService {
  constructor(private databaseService: DatabaseService) {}

  createUser(request: CreateDbUserDto): Promise<DbUser> {
    const { username, password, email } = request;
    return this.databaseService.createUser({ username, password, email });
  }

  getUser(username: string): Promise<DbUser> {
    return this.databaseService.getUser(username);
  }
}

export const userService = new UserService(databaseService);
