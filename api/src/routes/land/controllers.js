const fs = require('fs');
const path = require('path');
const axios = require('axios');

const saveImage = async (req, res) => {
    // console.log(req.body);
    try {
        let { filename, token_id } = req.body;
        var base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
        let dir = `./storage/lands/${token_id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFile(`${dir}/${filename}.png`, base64Data, 'base64', function (err) {
            if (err) console.log(err);
        });
        res.json('ok');
    } catch (err) {
        console.log(err);
        res.json(err);
    }
};

const saveMetaData = async (req, res) => {
    try {
        let dir = `./storage/lands/${req.body.token_id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFile(`${dir}/metaData.json`, JSON.stringify(req.body.metaData), 'utf8', function (err) {
            if (err) console.log(err);
        });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
};

module.exports = { saveImage };
