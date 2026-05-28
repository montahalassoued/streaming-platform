export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  isAdmin?: boolean;
}

export interface ValidatedUser {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface RequestWithUser {
  user: ValidatedUser;
}
