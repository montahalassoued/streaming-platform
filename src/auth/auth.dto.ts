export class LoginDto {
  email!: string;
  password!: string;
}

export class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
  name?: string;
}
