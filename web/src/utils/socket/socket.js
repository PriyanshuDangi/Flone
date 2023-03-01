import io from 'socket.io-client';

console.log('socket url', process.env.REACT_APP_BACKEND_URL);

export default io.connect(process.env.REACT_APP_BACKEND_URL);
