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
  console.log(`[socket.io] New connection: socket.id=${socket.id}, userId=${userId}`);

  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`[socket.io] Joined room user:${userId}`);
  }

  socket.on('sendDirectMessage', payload => {
    const { recipientId, senderId, messageContent } = payload;
    console.log(`[sendDirectMessage] ${senderId} → ${recipientId}: ${messageContent}`);

    if (recipientId) {
      io.to(`user:${recipientId}`).emit('newDirectMessage', payload);
    }
  });

  socket.on('sendGroupMessage', payload => {
    const { groupChatId } = payload;
    console.log(`[sendGroupMessage] Group ${groupChatId}: ${payload.messageContent}`);
    if (groupChatId) {
      io.to(`group:${groupChatId}`).emit('newGroupMessage', payload);
    }
  });

  socket.on('joinGroup', ({ groupChatId }) => {
    console.log(`[joinGroup] socket.id=${socket.id} joining group:${groupChatId}`);
    if (groupChatId) {
      socket.join(`group:${groupChatId}`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Socket server running on port ${PORT}`);
});
