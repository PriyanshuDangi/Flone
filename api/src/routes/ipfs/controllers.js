const fs = require('fs');
const path = require('path');
const axios = require('axios');

const saveIPFS = async (req, res) => {
    try {
        let {token_id, json} = req.body;
        let dir = `./storage/lands/${token_id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFile(`${dir}/ipfs.json`, JSON.stringify(json), 'utf8', function (err) {
            if (err) console.log(err);
        });
        console.log('saved');
        res.json('ok');
    }catch(err){
        console.log(err);
        res.json(err);
    }
}

module.exports = { saveIPFS };
