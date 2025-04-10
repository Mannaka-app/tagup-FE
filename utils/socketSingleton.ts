// socketSingleton.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://api.yeol.store/chat';
let socket: Socket | null = null;

export const getSocketInstance = (userId: string): Socket => {
  // 기존 소켓 인스턴스가 없으면 생성
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 1,
      reconnectionDelay: 1000,
      query: { userId },
    });

    // 이벤트 리스너 등록
    socket.on('connect', () => {
      console.log('웹소켓 연결 성공');
    });
    socket.on('disconnect', () => {
      console.log('웹소켓 연결 해제');
    });
    socket.on('connect_error', (error) => {
      console.error('웹소켓 연결 에러:', error);
    });
  } else {
    // userId가 변경될 경우 소켓의 query 업데이트 (필요하다면)
    socket.io.opts.query = { userId };
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
