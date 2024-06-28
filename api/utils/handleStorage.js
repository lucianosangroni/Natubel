const multer = require("multer");
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../storage`);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(16, (err, buf) => {
            if (err) return cb(err);
    
            const ext = path.extname(file.originalname);
            const randomName = buf.toString('hex');
            const filename = `${randomName}-${Date.now()}${ext}`;
            cb(null, filename);
        });
    }
});

const upload = multer({ storage });

module.exports = { upload };