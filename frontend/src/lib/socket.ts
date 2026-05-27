import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./api";

let socket: Socket | null = null;

export function getSocket(accessToken: string): Socket {
  if (socket?.connected) return socket;
  socket = io(`${BASE_URL}/chat`, {
    auth: { token: accessToken },
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
