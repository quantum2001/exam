import {Server} from 'socket.io';

export const examSocketController = (io: Server) => {
  const examNamespace = io.of('/exam');
};
