import React, { useEffect, useState } from 'react';
import socket from '../../../utils/socket/socket.js';
import Player from '../player/Player.jsx';

const Players = () => {
    const [users, setUsers] = useState({});

    useEffect(() => {
        socket.on('moved', (data) => {
            setUsers((state) => {
                const usersCopy = { ...state };
                usersCopy[data.key] = data;
                return usersCopy;
            });
        });

        socket.on('new_user', (data) => {
            setUsers((state) => {
                const usersCopy = { ...state };
                usersCopy[data.key] = data;
                return usersCopy;
            });
        });

        socket.on('connected', (data) => {
            setUsers(data);
        });

        socket.on('user_left', ({ data }) => {
            // console.log('user_left', data);
            setUsers((state) => {
                const usersCopy = { ...state };
                delete usersCopy[data.key];
                return usersCopy;
            });
        });
    }, []);

    return Object.values(users).map((user, index) => {
        return <Player key={index} {...user} />;
    });
};

export default Players;
