export class CreateUserDto {
  username!: string;
  email!: string;
  passwordHash!: string;
  name?: string;
}
