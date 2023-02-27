const landRouter = require('./land/routes');
const ipfsRouter = require('./ipfs/routes');

const routes = (app) => {
    app.use('/lands', landRouter);
    app.use('/ipfs', ipfsRouter);
};

module.exports = routes;
