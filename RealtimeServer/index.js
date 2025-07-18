const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  const { userId } = socket.handshake.query;
  if (userId) {
    socket.join(`user:${userId}`);
  }

  socket.on('sendDirectMessage', payload => {
    const { recipientId } = payload;
    if (recipientId) {
      io.to(`user:${recipientId}`).emit('newDirectMessage', payload);
    }
  });

  socket.on('sendGroupMessage', payload => {
    const { groupChatId } = payload;
    if (groupChatId) {
      io.to(`group:${groupChatId}`).emit('newGroupMessage', payload);
    }
  });

  socket.on('joinGroup', ({ groupChatId }) => {
    if (groupChatId) {
      socket.join(`group:${groupChatId}`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on ${PORT}`);
});