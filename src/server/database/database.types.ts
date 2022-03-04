export interface CreateDbUserDto {
  username: string;
  password: string;
  email: string;
}

export interface EditDbUserDto {
  username?: string;
  password?: string;
  email?: string;
  reset_pw_token?: string;
}
