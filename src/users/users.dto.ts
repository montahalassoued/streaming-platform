export class CreateUserDto {
  username!: string;
  email!: string;
  passwordHash!: string;
  name?: string;
}

export class UpdateUserDto {
  username?: string;
  email?: string;
  passwordHash?: string;
  name?: string;
  isAdmin?: boolean;
}
