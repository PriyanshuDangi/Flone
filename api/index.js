// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const routes = require('./src/routes');
const { Server } = require('socket.io');
const { ioListener } = require('./src/socket/io');

const app = express();

const corsOption = {
    origin: '*',
    optionSuccessStatus: 200,
};

const httpServer = http.createServer(app);

let ioserver;ioserver = httpServer;

const io = new Server(ioserver, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

ioListener(io);

app.use(cors(corsOption));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterList: 5000 }));


routes(app);
app.use(express.static('client/build'));

app.use('/storage', express.static(path.join(__dirname, 'storage')));

app.use('/', (req, res) => {
    res.status(200).send('Welcome!');
});

const port = process.env.PORT || 8080;

const httpPort = process.env.HTTP_PORT || 8181;

httpServer.listen(httpPort, () => {
    console.log('http server is running at ', httpPort);
});
