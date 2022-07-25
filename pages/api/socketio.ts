import { Server } from 'Socket.IO';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    let online = 0;
    io.on('connection', socket => {
      online++;
      console.log(`Socket ${socket.id} connected.`);
      console.log(`Online: ${online}`);
      io.emit('visitor enters', online);

      socket.on('disconnect', () => {
        online--;
        console.log(`Socket ${socket.id} disconnected.`);
        console.log(`Online: ${online}`);
        io.emit('visitor exits', online);
      });
    });
  }
  res.end();
};

export default SocketHandler;
