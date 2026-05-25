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

export interface RequestWithCookies {
  cookies?: {
    access_token?: string;
  };
}

export interface RequestWithUser {
  user: ValidatedUser;
}
