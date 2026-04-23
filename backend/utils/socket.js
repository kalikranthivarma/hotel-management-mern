import { Server } from 'socket.io';

let io;
const roomLocks = new Map(); // Store room locks: { roomId: { socketId, expiresAt } }

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Send current locks to the new client (includes dates)
    const currentLocks = {};
    for (const [roomId, lock] of roomLocks.entries()) {
      if (lock.expiresAt > Date.now()) {
        currentLocks[roomId] = { checkIn: lock.checkIn, checkOut: lock.checkOut, expiresAt: lock.expiresAt };
      }
    }
    socket.emit('current_locks', currentLocks);

    // lock_room now receives { roomId, checkIn, checkOut }
    socket.on('lock_room', ({ roomId, checkIn, checkOut }) => {

      // Check for overlapping locks
      const existingLock = roomLocks.get(roomId);
      if (existingLock) {
        console.log(`[Socket] Found existing lock: Owner=${existingLock.socketId} Dates=${existingLock.checkIn} to ${existingLock.checkOut}`);
        
        if (existingLock.socketId !== socket.id) {
          const overlap = new Date(checkIn) < new Date(existingLock.checkOut) && 
                          new Date(checkOut) > new Date(existingLock.checkIn);
          

          if (overlap && existingLock.expiresAt > Date.now()) {
            socket.emit('error', 'Another guest is already selecting this room for these dates');
            return;
          }
        }
      }

      // Lock room with date info for 10 minutes
      const expiresAt = Date.now() + 10 * 60 * 1000;
      roomLocks.set(roomId, { socketId: socket.id, checkIn, checkOut, expiresAt });

      // Notify everyone about the lock (include owner so sender can ignore self-warning)
      io.emit('room_locked', { roomId, checkIn, checkOut, expiresAt, owner: socket.id });
    });




    // Handle room unlocking
    socket.on('unlock_room', (roomId) => {
      console.log(`[Socket] Unlock room: ${roomId} by ${socket.id}`);
      const lock = roomLocks.get(roomId);
      if (lock && lock.socketId === socket.id) {
        roomLocks.delete(roomId);
        io.emit('room_unlocked', roomId);
      }
    });

    socket.on('get_locks', () => {
      const currentLocks = {};
      for (const [roomId, lock] of roomLocks.entries()) {
        if (lock.expiresAt > Date.now()) {
          currentLocks[roomId] = { checkIn: lock.checkIn, checkOut: lock.checkOut, expiresAt: lock.expiresAt };
        }
      }
      socket.emit('current_locks', currentLocks);
    });

    socket.on('disconnect', () => {

      console.log(`[Socket] User disconnected: ${socket.id}`);
      // Remove any locks held by this socket
      for (const [roomId, lock] of roomLocks.entries()) {
        if (lock.socketId === socket.id) {
          roomLocks.delete(roomId);
          io.emit('room_unlocked', roomId);
        }
      }
    });
  });

  // Cleanup expired locks every minute
  setInterval(() => {
    const now = Date.now();
    for (const [roomId, lock] of roomLocks.entries()) {
      if (lock.expiresAt < now) {
        roomLocks.delete(roomId);
        io.emit('room_unlocked', roomId);
      }
    }
  }, 60000);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const getLocks = () => roomLocks;
