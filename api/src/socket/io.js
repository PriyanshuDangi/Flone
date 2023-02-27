let participants = {};

const getParticipants = (roomId, key) => {
    let roomUsers = {};
    for (var val of Object.keys(participants)) {
        if (participants[val].roomId === roomId && [val] != key) roomUsers = { ...roomUsers, [val]: participants[val] };
    }
    return roomUsers;
};

const ioListener = (io) => {
    io.on('connection', (socket) => {
        socket.on('join_room', (data) => {
            try {
                const key = socket.user_key;
                data = { ...data, key };
                socket.join(data.roomId);

                // adding additional data to participant for eg name
                participants[key] = { ...participants[key], ...data };
                const roomUsers = getParticipants(data.roomId, data.key);
                socket.emit('connected', roomUsers);
                io.to(data.roomId).emit('user_joined', { data, participants: getParticipants(data.roomId) });
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('disconnect_room', (data) => {
            try {
                const key = socket.user_key;
                socket.leave(data.roomId);
                delete participants[key];
                console.log(data);
                socket.broadcast.to(data.roomId).emit('user_left', { data, participants: getParticipants(roomId) });
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('send_audio', (data) => {
            try {
                data = { ...data, key: socket.user_key };
                socket.broadcast.to(data.roomId).emit('recv_audio', data);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('send_message', (data) => {
            try {
                socket.broadcast.to(data.room).emit('receive_message', data);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('new_user', (data) => {
            try {
                participants[data.key] = data;
                socket.user_key = data.key;
                socket.broadcast.to(data.roomId).emit('new_user', data);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('move', (data) => {
            try {
                // console.log(data);
                participants[data.key] = { ...participants[data.key], ...data };
                socket.broadcast.to(participants[data.key].roomId).emit('moved', data);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('disconnect_user', (data) => {
            // console.log('disconnect_user', data);
            const { roomId } = participants[data.key];
            socket.leave(roomId);
            delete participants[data.key];
            socket.broadcast.to(roomId).emit('user_left', { data, participants: getParticipants(roomId) });
        });

        socket.on('disconnect', () => {
            try {
                if (socket.user_key) {
                    const { roomId } = participants[socket.user_key];
                    socket.leave(roomId);
                    const data = participants[socket.user_key];
                    delete participants[socket.user_key];
                    socket.broadcast.to(roomId).emit('user_left', { data, participants: getParticipants(roomId) });
                }
            } catch (err) {
                console.log(err);
            }
        });
    });
};

module.exports = { ioListener };
