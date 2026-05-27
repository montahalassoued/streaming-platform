export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  isStreamer: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  followersCount?: number;
  followingCount?: number;
  createdAt: string;
}

export interface Streamer {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  panelHtml?: string;
  chatSlowMode?: number;
  streamKey?: string;
}

export interface Stream {
  id: string;
  streamerId: string;
  categoryId?: string;
  title: string;
  rtmpUrl: string;
  hlsUrl: string;
  isLive: boolean;
  startedAt?: string;
  endedAt?: string;
  viewerCount?: number;
  streamer?: Streamer;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
}

export interface Vod {
  id: string;
  streamId?: string;
  title?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  isPublic: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string | null;
  content: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface ChatUser {
  id: string | null;
  username: string | null;
}

export interface Donation {
  id: string;
  streamId: string;
  userId: string;
  amountCents: number;
  currency: string;
  message?: string;
  status: string;
  providerPaymentId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  streamerId: string;
  expiresAt: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  userId: string;
  streamerId: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
