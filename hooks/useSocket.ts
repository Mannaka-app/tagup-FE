// useSocket.ts
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocketInstance, disconnectSocket } from '@/utils/socketSingleton';
import { useAuthStore } from '@/store/useAuthStore';

export const useSocket = () => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user?.id) {
      const socketInstance = getSocketInstance(String(user.id));
      setSocket(socketInstance);
      if (!socketInstance.connected) {
        socketInstance.connect();
      }
    }
  }, [user?.id]);

  const connect = () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    disconnectSocket();
  };

  const emit = (event: string, ...args: any[]) => {
    socket?.emit(event, ...args);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socket?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socket?.off(event, callback);
  };

  return { socket, connect, disconnect, emit, on, off };
};
